import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { BasicInvoiceInfo } from "./invoice-form/BasicInvoiceInfo";
import { PaymentSignature } from "./invoice-form/PaymentSignature";
import { schema } from "./invoice/invoiceFormSchema";
import { useInvoiceSubmission } from "./invoice/useInvoiceSubmission";
import type { z } from "zod";
import { useEffect } from 'react';

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const { data: latestInvoice, isLoading: isLoadingInvoice } = useQuery({
    queryKey: ["latest-invoice-number"],
    queryFn: async () => {
      console.log("Fetching latest invoice number...");
      const { data, error } = await supabase
        .from("invoices")
        .select("invoice_number")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching latest invoice:", error);
        throw error;
      }
      console.log("Latest invoice data:", data);
      return data?.[0]?.invoice_number || "0124";
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
      invoice_number: isLoadingInvoice ? "0125" : latestInvoice ? generateNextInvoiceNumber(latestInvoice) : "0125",
      sale_date: new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_email: "",
      customer_birth_date: null,
      customer_phone: "",
      customer_address: "",
      payment_type: "",
      down_payment: "0",
      acknowledged_by: "",
      received_by: "",
      items: [],
    },
  });

  useEffect(() => {
    if (!isLoadingInvoice && latestInvoice) {
      form.setValue("invoice_number", generateNextInvoiceNumber(latestInvoice));
    }
  }, [latestInvoice, isLoadingInvoice, form]);

  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const calculateTotals = () => {
    const items = form.watch("items") || [];
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
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

  const onSubmit = async (values: FormData) => {
    // Ensure dates are properly formatted or null
    const formattedValues = {
      ...values,
      customer_birth_date: values.customer_birth_date || null,
      sale_date: values.sale_date || new Date().toISOString().split("T")[0],
    };

    await submitInvoice(formattedValues, totals);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <PaymentSignature form={form} totals={totals} />

        <Button 
          type="submit" 
          className="w-full"
          disabled={form.formState.isSubmitting || fields.length === 0}
        >
          {form.formState.isSubmitting ? (
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