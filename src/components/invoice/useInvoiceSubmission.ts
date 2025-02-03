import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FormData } from "./invoiceFormSchema";

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

  const updateLensStock = async (items: FormData["items"]) => {
    console.log("Updating lens stock for items:", items);

    const lensStockUpdates = items.filter(
      (item) => item.lens_stock_id, // Only update for lens stock items
    );

    console.log("Lens stock updates:", lensStockUpdates);

    if (lensStockUpdates.length === 0) return;

    for (const item of lensStockUpdates) {
      try {
        console.log("Processing lens stock item:", item);

        // Fetch current stock
        const { data: currentStock, error: fetchError } = await supabase
          .from("lens_stock")
          .select("*")
          .eq("id", item.lens_stock_id)
          .single();

        if (fetchError) {
          console.error("Error fetching current stock:", fetchError);
          throw fetchError;
        }

        console.log("Current stock:", currentStock);

        // Calculate new quantity
        const newQuantity = currentStock.quantity - item.quantity;
        console.log(
          `Reducing stock from ${currentStock.quantity} by ${item.quantity} to ${newQuantity}`,
        );

        // Update lens stock
        const { data, error: updateError } = await supabase
          .from("lens_stock")
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.lens_stock_id)
          .select(); // Add select to verify the update

        if (updateError) {
          console.error("Error updating stock:", updateError);
          throw updateError;
        }

        console.log("Updated stock record:", data);
      } catch (error) {
        console.error(`Detailed error updating lens stock for item:`, error);
        toast.error(`Failed to update stock for lens item`);
      }
    }
  };
  const submitInvoice = async (values: FormData, totals: Totals) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create an invoice");
      return false;
    }

    try {
      // Create invoice
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
          status: totals.remainingBalance === 0 ? "paid" : "partial",
          last_payment_date: new Date().toISOString(),
          notes: values.notes || null,
          branch: values.branch,
        })
        .select()
        .single();

      if (invoiceError) {
        console.error("Invoice creation error:", invoiceError);
        throw invoiceError;
      }

      // Prepare invoice items for insertion
      const invoiceItemsToInsert = values.items.map((item) => {
        const baseItem = {
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.quantity * item.price - (item.discount || 0),
          pv: item.pv,
          v_frame: item.v_frame,
          f_size: item.f_size,
          prism: item.prism,
          dbl: typeof item.dbl === "number" ? item.dbl : null,
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
        };

        // Only add lens_stock_id if it exists (avoid schema error)
        if (item.lens_stock_id) {
          return {
            ...baseItem,
            lens_stock_id: item.lens_stock_id,
          };
        }

        return baseItem;
      });

      // Insert invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsToInsert);

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        throw itemsError;
      }

      // Update lens stock for lens items
      await updateLensStock(
        invoiceItemsToInsert.map((item, index) => ({
          ...values.items[index],
          invoice_id: invoice.id,
          lens_stock_id: item.lens_stock_id,
        })),
      );

      // Handle payments
      if (totals.downPayment > 0) {
        const { error: paymentError } = await supabase.from("payments").insert({
          invoice_id: invoice.id,
          amount: totals.downPayment,
          payment_type: values.payment_type,
          payment_date: new Date().toISOString(),
          is_down_payment: totals.downPayment < totals.grandTotal,
        });

        if (paymentError) {
          console.error("Payment creation error:", paymentError);
          throw paymentError;
        }
      }

      // Update queries
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["lens-stock"] });

      toast.success("Invoice created successfully");

      if (onSuccess) {
        onSuccess();
      }

      return true;
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
      return false;
    }
  };

  return { submitInvoice };
};

