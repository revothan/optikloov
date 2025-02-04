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

  const updateLensStock = async (
    items: FormData["items"],
    invoiceId: string,
  ) => {
    console.log("Starting lens stock update...");

    // Filter items that have lens_stock_id
    const lensStockItems = items.filter((item) => item.lens_stock_id);
    console.log(
      `Found ${lensStockItems.length} lens stock items`,
      lensStockItems,
    );

    if (lensStockItems.length === 0) {
      console.log("No lens stock items to update");
      return;
    }

    for (const item of lensStockItems) {
      try {
        // Get current stock
        const { data: currentStock, error: fetchError } = await supabase
          .from("lens_stock")
          .select("quantity")
          .eq("id", item.lens_stock_id)
          .single();

        if (fetchError) throw fetchError;
        if (!currentStock) {
          throw new Error(`Stock not found for ID: ${item.lens_stock_id}`);
        }

        console.log(
          `Current stock for lens ${item.lens_stock_id}: ${currentStock.quantity}`,
        );

        if (currentStock.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock (${currentStock.quantity}) for requested quantity (${item.quantity})`,
          );
        }

        // Update stock quantity
        const newQuantity = currentStock.quantity - item.quantity;
        const { error: updateError } = await supabase
          .from("lens_stock")
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.lens_stock_id);

        if (updateError) throw updateError;

        // Record stock movement
        const { error: movementError } = await supabase
          .from("lens_stock_movements")
          .insert({
            lens_stock_id: item.lens_stock_id,
            movement_type: "sale",
            quantity: -item.quantity,
            invoice_id: invoiceId,
            notes: `Sale through invoice ${invoiceId}`,
          });

        if (movementError) throw movementError;

        console.log(
          `Successfully updated stock for lens ${item.lens_stock_id} to ${newQuantity}`,
        );
      } catch (error) {
        console.error(
          `Error updating stock for lens ${item.lens_stock_id}:`,
          error,
        );
        throw error;
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

      // Update lens stock BEFORE creating invoice items
      await updateLensStock(values.items, invoice.id);

      // Prepare invoice items
      const invoiceItemsToInsert = values.items.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        lens_stock_id: item.lens_stock_id || null, // Ensure lens_stock_id is included
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
      }));

      // Insert invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsToInsert);

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        throw itemsError;
      }

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

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      await queryClient.invalidateQueries({
        queryKey: ["latest-invoice-number"],
      });
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.invalidateQueries({ queryKey: ["lens-stock"] }); // Add this to refresh lens stock data

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

