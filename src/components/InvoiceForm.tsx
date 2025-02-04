import { useState, useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { BasicInvoiceInfo } from "./invoice-form/BasicInvoiceInfo";
import { PaymentSignature } from "./invoice-form/PaymentSignature";
import { schema } from "./invoice/invoiceFormSchema";
import { useInvoiceSubmission } from "./invoice/useInvoiceSubmission";
import type { z } from "zod";

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

type ItemFormData = {
  lens_stock_id?: string;
  product_id?: string;
  dbl?: number;
  discount?: number;
  f_size?: string;
  price?: number;
  prism?: number;
  pv?: number;
  quantity?: number;
  v_frame?: string;
  category?: string;  // Added this line to fix the TypeScript error
  right_eye?: {
    cyl?: number;
    sph?: number;
    mpd?: number;
    axis?: number;
    add_power?: number;
  };
  left_eye?: {
    cyl?: number;
    sph?: number;
    mpd?: number;
    axis?: number;
    add_power?: number;
  };
};

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const { data: latestInvoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["latest-invoice-number"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("invoice_number")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data?.invoice_number || "0124";
    },
  });

  const generateNextInvoiceNumber = (currentNumber: string) => {
    const numericPart = parseInt(currentNumber, 10);
    const nextNumber = numericPart + 1;
    return nextNumber.toString().padStart(4, "0");
  };

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
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
      branch: "Gading Serpong",
      items: [],
    },
  });

  useEffect(() => {
    if (latestInvoice && !isLoadingInvoice) {
      const nextNumber = generateNextInvoiceNumber(latestInvoice);
      form.setValue("invoice_number", nextNumber);
    }
  }, [latestInvoice, isLoadingInvoice, form]);

  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray(
    {
      name: "items",
      control: form.control,
    },
  );

  const calculateTotals = () => {
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
  };

  const totals = calculateTotals();
  const { submitInvoice } = useInvoiceSubmission(onSuccess);

  const handleSubmit = async (values: FormData) => {
    console.log("=== Invoice Submission Debug ===");
    console.log(
      "Items being submitted:",
      values.items.map((item) => ({
        product_id: item.product_id,
        lens_stock_id: item.lens_stock_id,
        quantity: item.quantity,
        category: item.category,
      })),
    );

    try {
      setSubmitting(true);
      const result = await submitInvoice(values, totals);
      console.log("submitInvoice result:", result);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setSubmitting(false);
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        onKeyDown={handleKeyDown}
      >
        <BasicInvoiceInfo form={form} />

        <InvoiceItemForm
          form={form}
          itemFields={{
            fields,
            append,
            remove,
            swap,
            move,
            insert,
            prepend,
          }}
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
