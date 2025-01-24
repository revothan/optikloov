import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { BasicInvoiceInfo } from "./invoice-form/BasicInvoiceInfo";
import { PaymentSignature } from "./invoice-form/PaymentSignature";

// Define the schema for eye prescription
const eyeSchema = z.object({
  sph: z.number().nullable(),
  cyl: z.number().nullable(),
  axis: z.number().nullable(),
  add_power: z.number().nullable(),
});

// Define the complete form schema
const schema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  sale_date: z.string().min(1, "Sale date is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().optional(),
  customer_address: z.string().optional(),
  payment_type: z.string().min(1, "Payment type is required"),
  down_payment: z.string().optional(),
  acknowledged_by: z.string().optional(),
  received_by: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative"),
        discount: z.number().min(0, "Discount cannot be negative"),
        pd: z.number().nullable(),
        sh: z.number().nullable(),
        prism: z.number().nullable(),
        v_frame: z.string().nullable(),
        f_size: z.string().nullable(),
        left_eye: eyeSchema.nullable(),
        right_eye: eyeSchema.nullable(),
      }),
    )
    .min(1, "At least one item is required"),
});

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  // Query to get the latest invoice number
  const { data: latestInvoice } = useQuery({
    queryKey: ["latest-invoice-number"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("invoice_number")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0]?.invoice_number || "0124"; // Start from 0124 if no invoices exist
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
      invoice_number: latestInvoice ? generateNextInvoiceNumber(latestInvoice) : "0125",
      sale_date: new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      payment_type: "",
      down_payment: "0",
      acknowledged_by: "",
      received_by: "",
      items: [],
    },
  });

  // Set up field array for dynamic item handling
  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray({
    name: "items",
    control: form.control,
  });

  // Calculate totals for the invoice
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

  // Handle form submission
  const onSubmit = async (values: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // Create the invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: values.invoice_number,
          sale_date: values.sale_date,
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          customer_address: values.customer_address,
          payment_type: values.payment_type,
          down_payment: parseFloat(values.down_payment || "0"),
          acknowledged_by: values.acknowledged_by,
          received_by: values.received_by,
          user_id: session.user.id,
          total_amount: totals.totalAmount,
          discount_amount: totals.discountAmount,
          grand_total: totals.grandTotal,
          paid_amount: totals.downPayment,
          remaining_balance: totals.remainingBalance,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Create invoice items with updated prescription fields
      const { error: itemsError } = await supabase.from("invoice_items").insert(
        values.items.map((item) => ({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.quantity * item.price - (item.discount || 0),
          pd: item.pd,
          sh: item.sh,
          prism: item.prism,
          v_frame: item.v_frame,
          f_size: item.f_size,
          left_eye_sph: item.left_eye?.sph || null,
          left_eye_cyl: item.left_eye?.cyl || null,
          left_eye_axis: item.left_eye?.axis || null,
          left_eye_add_power: item.left_eye?.add_power || null,
          right_eye_sph: item.right_eye?.sph || null,
          right_eye_cyl: item.right_eye?.cyl || null,
          right_eye_axis: item.right_eye?.axis || null,
          right_eye_add_power: item.right_eye?.add_power || null,
        }))
      );

      if (itemsError) throw itemsError;

      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
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

        <Button type="submit" className="w-full">
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
