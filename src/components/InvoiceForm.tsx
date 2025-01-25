import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { BasicInvoiceInfo } from "./invoice-form/BasicInvoiceInfo";
import { PaymentSignature } from "./invoice-form/PaymentSignature";
import { schema } from "./invoice/invoiceFormSchema";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import type { z } from "zod";

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const session = useSession();

  // Query to get the latest invoice number
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

  // Generate the next invoice number
  const generateNextInvoiceNumber = (currentNumber: string) => {
    const numericPart = parseInt(currentNumber, 10);
    const nextNumber = numericPart + 1;
    return nextNumber.toString().padStart(4, "0");
  };

  // Initialize the form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoice_number: isLoadingInvoice ? "0125" : latestInvoice ? generateNextInvoiceNumber(latestInvoice) : "0125",
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
      items: [],
    },
  });

  // Update invoice number when latestInvoice changes
  useEffect(() => {
    if (!isLoadingInvoice && latestInvoice) {
      form.setValue("invoice_number", generateNextInvoiceNumber(latestInvoice));
    }
  }, [latestInvoice, isLoadingInvoice, form]);

  // Set up field array for dynamic item handling
  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Calculate totals for the invoice
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

  const onSubmit = async (values: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create an invoice");
      return;
    }

    console.log("Form submission started with values:", values);
    try {
      // Insert the invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: values.invoice_number,
          sale_date: values.sale_date,
          customer_name: values.customer_name,
          customer_email: values.customer_email,
          customer_birth_date: values.customer_birth_date,
          customer_phone: values.customer_phone,
          customer_address: values.customer_address,
          payment_type: values.payment_type,
          down_payment: parseFloat(values.down_payment || "0"),
          acknowledged_by: values.acknowledged_by,
          received_by: values.received_by,
          total_amount: totals.totalAmount,
          discount_amount: totals.discountAmount,
          grand_total: totals.grandTotal,
          paid_amount: totals.downPayment,
          remaining_balance: totals.remainingBalance,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (invoiceError) {
        console.error("Invoice creation error:", invoiceError);
        toast.error("Failed to create invoice: " + invoiceError.message);
        return;
      }

      console.log("Invoice created successfully:", invoice);

      // Insert invoice items with MPD values
      const { error: itemsError } = await supabase.from("invoice_items").insert(
        values.items.map((item) => ({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: (item.quantity * item.price) - (item.discount || 0),
          sh: item.sh,
          v_frame: item.v_frame,
          f_size: item.f_size,
          prism: item.prism,
          left_eye_sph: item.left_eye?.sph || null,
          left_eye_cyl: item.left_eye?.cyl || null,
          left_eye_axis: item.left_eye?.axis || null,
          left_eye_add_power: item.left_eye?.add_power || null,
          left_eye_mpd: item.left_eye?.mpd || null,  // Add MPD values
          right_eye_sph: item.right_eye?.sph || null,
          right_eye_cyl: item.right_eye?.cyl || null,
          right_eye_axis: item.right_eye?.axis || null,
          right_eye_add_power: item.right_eye?.add_power || null,
          right_eye_mpd: item.right_eye?.mpd || null,  // Add MPD values
        }))
      );

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        toast.error("Failed to create invoice items: " + itemsError.message);
        return;
      }

      console.log("Invoice items created successfully");
      toast.success("Invoice created successfully");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice: " + (error as Error).message);
    }
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