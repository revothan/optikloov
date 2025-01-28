import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FormData } from "./invoiceFormSchema";

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

  const updateProductStock = async (productId: string, quantity: number) => {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("track_inventory, stock_qty")
      .eq("id", productId)
      .single();

    if (productError) {
      console.error("Error fetching product:", productError);
      return;
    }

    if (product?.track_inventory && product.stock_qty !== null) {
      const newStock = Math.max(0, (product.stock_qty || 0) - quantity);
      
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_qty: newStock })
        .eq("id", productId);

      if (updateError) {
        console.error("Error updating product stock:", updateError);
        toast.error(`Failed to update stock for product ID ${productId}`);
      }
    }
  };

  const submitInvoice = async (values: FormData, totals: Totals) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create an invoice");
      return false;
    }

    try {
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
        return false;
      }

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
          left_eye_mpd: item.left_eye?.mpd || null,
          right_eye_sph: item.right_eye?.sph || null,
          right_eye_cyl: item.right_eye?.cyl || null,
          right_eye_axis: item.right_eye?.axis || null,
          right_eye_add_power: item.right_eye?.add_power || null,
          right_eye_mpd: item.right_eye?.mpd || null,
        }))
      );

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        toast.error("Failed to create invoice items: " + itemsError.message);
        return false;
      }

      // Update product stock quantities
      for (const item of values.items) {
        await updateProductStock(item.product_id, item.quantity);
      }

      console.log("Invoice items created successfully");
      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      
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