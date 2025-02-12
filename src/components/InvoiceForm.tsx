import { useState, useEffect, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { BasicInvoiceInfo } from "./invoice-form/BasicInvoiceInfo";
import { PaymentSignature } from "./invoice-form/PaymentSignature";
import { schema } from "./invoice/invoiceFormSchema";
import { useInvoiceSubmission } from "./invoice/useInvoiceSubmission";
import { normalizeBranchName } from "@/lib/branch-utils";
import { generateInvoiceNumber, getFullBranchName } from "@/lib/invoice-utils";
import type { z } from "zod";

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const session = useSession();
  const [submitting, setSubmitting] = useState(false);
  const { submitInvoice } = useInvoiceSubmission(onSuccess);

  const defaultValues = {
    invoice_number: "",
    sale_date: new Date().toISOString().split("T")[0],
    customer_name: "",
    customer_email: "",
    customer_birth_date: "",
    customer_phone: "",
    customer_address: "",
    payment_type: "",
    down_payment: "0",
    acknowledged_by: "",
    received_by: "",
    notes: "",
    branch: "",
    items: [],
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray(
    {
      control: form.control,
      name: "items",
    },
  );

  const calculateTotals = useCallback(() => {
    const items = form.watch("items") || [];
    const totalAmount = items.reduce((sum, item) => {
      return sum + item.quantity * item.price;
    }, 0);

    const discountAmount = items.reduce((sum, item) => {
      return sum + (item.discount || 0);
    }, 0);

    const grandTotal = totalAmount - discountAmount;
    const downPayment = parseFloat(form.watch("down_payment") || "0");
    const remainingBalance = grandTotal - downPayment;

    return {
      totalAmount,
      discountAmount,
      grandTotal,
      downPayment,
      remainingBalance,
    };
  }, [form]);

  const { data: userProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!session?.user?.id) {
        throw new Error("No active user session");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) {
        throw error;
      }

      const branchData = data?.branch || data?.role || "Default Branch";
      if (!branchData) {
        throw new Error("Cannot determine user's branch");
      }

      const fullBranchName = getFullBranchName(branchData);

      return {
        ...data,
        branch: fullBranchName,
      };
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });

  const { data: nextInvoiceNumber, isLoading: isLoadingInvoiceNumber } = useQuery({
    queryKey: ["nextInvoiceNumber", userProfile?.branch],
    queryFn: async () => {
      if (!userProfile?.branch) {
        throw new Error("Branch not available");
      }
      return generateInvoiceNumber(userProfile.branch, supabase);
    },
    enabled: !!userProfile?.branch,
    retry: 1,
  });

  useEffect(() => {
    if (userProfile?.branch) {
      const normalizedBranch = normalizeBranchName(userProfile.branch);
      form.setValue("branch", normalizedBranch);
    }
    if (nextInvoiceNumber) {
      form.setValue("invoice_number", nextInvoiceNumber);
    }
  }, [userProfile, nextInvoiceNumber, form]);

  const handleSubmit = async (values: FormData) => {
    if (!session?.user?.id || !userProfile?.branch) {
      toast.error("Please login again to continue");
      return;
    }

    setSubmitting(true);
    try {
      const invoiceData = {
        ...values,
        branch: userProfile.branch,
        branch_prefix: userProfile.branch === "Gading Serpong" ? "GS" : "KD",
      };

      const result = await submitInvoice(invoiceData, calculateTotals());
      if (result) {
        toast.success("Invoice created successfully");
        if (userProfile?.branch) {
          form.setValue("branch", userProfile.branch);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to create invoice");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoadingProfile || isLoadingInvoiceNumber) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!userProfile?.branch) {
    return (
      <div className="p-4 text-red-500">
        Error: User profile or branch not configured properly.
      </div>
    );
  }

  const totals = calculateTotals();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInvoiceInfo form={form} />

        <InvoiceItemForm
          form={form}
          itemFields={{ fields, append, remove, swap, move, insert, prepend }}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium">Notes</label>
          <Textarea
            {...form.register("notes")}
            placeholder="Add any additional notes here..."
            className="min-h-[100px]"
          />
        </div>

        <PaymentSignature form={form} totals={totals} />

        <Button
          type="submit"
          className="w-full"
          disabled={submitting || fields.length === 0}
        >
          {submitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            "Create Invoice"
          )}
        </Button>
      </form>
    </Form>
  );
}
