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

  const updateProductStock = async (productId: string, quantity: number) => {
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("track_inventory, stock_qty")
      .eq("id", productId)
      .maybeSingle();

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

  const updateLensStock = async (productId: string, quantity: number) => {
    try {
      console.log(`Checking if ${productId} is a lens stock item...`);
      
      // First get the product details to check if it's a lens product
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .maybeSingle();

      if (productError) {
        console.error("Error checking product:", productError);
        return false;
      }

      if (!product || product.category !== 'Lensa') {
        console.log(`Product ${productId} is not a lens product`);
        return false;
      }

      // Find matching lens stock by product name which contains SPH and CYL values
      const productNameParts = product.name.match(/SPH:([-+]?\d+\.\d+)\s*\|\s*CYL:([-+]?\d+\.\d+)/);
      if (!productNameParts) {
        console.log(`Could not extract SPH/CYL from product name: ${product.name}`);
        return false;
      }

      const sph = parseFloat(productNameParts[1]);
      const cyl = parseFloat(productNameParts[2]);

      // Get lens stock with matching SPH and CYL
      const { data: lensStock, error: lensStockError } = await supabase
        .from("lens_stock")
        .select("*, lens_type:lens_type_id (*)")
        .eq("sph", sph)
        .eq("cyl", cyl)
        .maybeSingle();

      if (lensStockError) {
        console.error("Error checking lens stock:", lensStockError);
        return false;
      }

      if (!lensStock) {
        console.log(`No lens stock found for SPH:${sph} CYL:${cyl}`);
        return false;
      }

      console.log(`Found lens stock:`, lensStock);
      
      // Calculate new quantity
      const currentQuantity = lensStock.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity - quantity);
      
      console.log(`Current quantity: ${currentQuantity}, New quantity will be: ${newQuantity}`);
      
      // Update the lens stock quantity
      const { error: updateError } = await supabase
        .from("lens_stock")
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", lensStock.id);

      if (updateError) {
        console.error("Error updating lens stock:", updateError);
        toast.error(`Failed to update lens stock quantity`);
        return false;
      }

      console.log(`Successfully updated lens stock quantity`);
      
      // Create a stock movement record
      const { error: movementError } = await supabase
        .from("lens_stock_movements")
        .insert({
          lens_stock_id: lensStock.id,
          movement_type: 'sale',
          quantity: -quantity,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
          notes: `Stock reduced by ${quantity} due to sale`
        });

      if (movementError) {
        console.error("Error creating stock movement record:", movementError);
      }

      return true;
    } catch (error) {
      console.error("Error in updateLensStock:", error);
      return false;
    }
  };

  const createPaymentRecord = async (
    invoiceId: string,
    amount: number,
    paymentType: string,
    isDownPayment: boolean,
  ) => {
    const { error: paymentError } = await supabase.from("payments").insert({
      invoice_id: invoiceId,
      amount: amount,
      payment_type: paymentType,
      payment_date: new Date().toISOString(),
      is_down_payment: isDownPayment,
    });

    if (paymentError) {
      throw new Error(
        `Failed to create payment record: ${paymentError.message}`,
      );
    }
  };

  const submitInvoice = async (values: FormData, totals: Totals) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create an invoice");
      return false;
    }

    try {
      // Create the invoice
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
        })
        .select()
        .single();

      if (invoiceError) {
        console.error("Invoice creation error:", invoiceError);
        toast.error("Failed to create invoice: " + invoiceError.message);
        return false;
      }

      // Create invoice items
      const { error: itemsError } = await supabase.from("invoice_items").insert(
        values.items.map((item) => ({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.quantity * item.price - (item.discount || 0),
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
        })),
      );

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        toast.error("Failed to create invoice items: " + itemsError.message);
        return false;
      }

      // Create payment record for down payment if exists
      if (totals.downPayment > 0) {
        await createPaymentRecord(
          invoice.id,
          totals.downPayment,
          values.payment_type,
          true,
        );
      }

      // Update product stock quantities
      for (const item of values.items) {
        console.log(`Processing item ${item.product_id} with quantity ${item.quantity}`);
        
        // First try to update lens stock
        const isLensStock = await updateLensStock(item.product_id, item.quantity);
        
        // If it's not a lens stock item, try to update regular product stock
        if (!isLensStock) {
          await updateProductStock(item.product_id, item.quantity);
        }
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales-report"] });
      queryClient.invalidateQueries({ queryKey: ["lens-stock"] });

      console.log("Invoice created successfully");
      toast.success("Invoice created successfully");

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