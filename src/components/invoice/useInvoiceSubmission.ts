import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { eyeSchema, schema } from "./invoiceFormSchema";

type FormData = z.infer<typeof schema>;

interface Totals {
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  downPayment: number;
  remainingBalance: number;
}

export const useInvoiceSubmission = (onSuccess?: () => void) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const submitInvoice = async (values: FormData, totals: Totals) => {
    console.log("Form submission started with values:", values);
    console.log("Current session:", session);
    
    if (!session?.user?.id) {
      console.error("No user session found");
      toast.error("You must be logged in to create an invoice");
      return false;
    }

    try {
      console.log("Creating invoice with data:", {
        ...values,
        user_id: session.user.id,
        totals,
      });

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
          user_id: session.user.id,
          total_amount: totals.totalAmount,
          discount_amount: totals.discountAmount,
          grand_total: totals.grandTotal,
          paid_amount: totals.downPayment,
          remaining_balance: totals.remainingBalance,
        })
        .select()
        .single();

      if (invoiceError) {
        console.error("Invoice creation error:", invoiceError);
        toast.error("Failed to create invoice: " + invoiceError.message);
        return false;
      }

      if (!invoice) {
        console.error("No invoice data returned");
        toast.error("Failed to create invoice: No data returned");
        return false;
      }

      console.log("Invoice created successfully:", invoice);

      console.log("Creating invoice items...");
      const { error: itemsError } = await supabase.from("invoice_items").insert(
        values.items.map((item) => ({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.quantity * item.price - (item.discount || 0),
          mpd_right: item.mpd_right,
          mpd_left: item.mpd_left,
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

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        toast.error("Failed to create invoice items: " + itemsError.message);
        return false;
      }

      console.log("Invoice items created successfully");
      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] });
      
      if (onSuccess) {
        onSuccess();
      }
      return true;
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice: " + (error as Error).message);
      return false;
    }
  };

  return { submitInvoice };
};