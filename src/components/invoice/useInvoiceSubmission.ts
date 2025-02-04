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

  const updateProductStock = async (items: FormData["items"]) => {
    for (const item of items) {
      if (!item.product_id) continue;

      try {
        // Get current stock
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("stock_qty, track_inventory")
          .eq("id", item.product_id)
          .single();

        if (fetchError) {
          console.error(
            `Error fetching product ${item.product_id}:`,
            fetchError,
          );
          continue;
        }

        // Only update if product tracks inventory and has stock
        if (product?.track_inventory) {
          const currentStock = product.stock_qty || 0;
          const newStock = Math.max(0, currentStock - item.quantity);

          const { error: updateError } = await supabase
            .from("products")
            .update({
              stock_qty: newStock,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.product_id);

          if (updateError) {
            console.error(
              `Error updating product ${item.product_id} stock:`,
              updateError,
            );
          }
        }
      } catch (error) {
        console.error(
          `Error updating stock for product ${item.product_id}:`,
          error,
        );
      }
    }
  };

  // Rest of the existing code...
  const createOrUpdateCustomer = async (customerData: {
    name: string;
    phone: string;
    email?: string;
    birth_date?: string;
    address?: string;
  }) => {
    try {
      const { data: existingCustomer, error: checkError } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", customerData.phone)
        .single();

      if (checkError && checkError.code !== "PGRST116") {
        throw checkError;
      }

      if (existingCustomer) {
        const { error: updateError } = await supabase
          .from("customers")
          .update({
            name: customerData.name,
            email: customerData.email || null,
            birth_date: customerData.birth_date || null,
            address: customerData.address || null,
            updated_at: new Date().toISOString(),
          })
          .eq("phone", customerData.phone);

        if (updateError) throw updateError;
      } else {
        const { error: createError } = await supabase.from("customers").insert({
          name: customerData.name,
          phone: customerData.phone,
          email: customerData.email || null,
          birth_date: customerData.birth_date || null,
          address: customerData.address || null,
        });

        if (createError) throw createError;
      }
    } catch (error) {
      console.error("Error in createOrUpdateCustomer:", error);
      throw error;
    }
  };

  const updateLensStock = async (
    items: FormData["items"],
    invoiceId: string,
  ) => {
    const lensStockItems = items.filter((item) => item.lens_stock_id);

    if (lensStockItems.length === 0) {
      return;
    }

    for (const item of lensStockItems) {
      try {
        const { data: currentStock, error: fetchError } = await supabase
          .from("lens_stock")
          .select("quantity")
          .eq("id", item.lens_stock_id)
          .single();

        if (fetchError) throw fetchError;
        if (!currentStock) {
          throw new Error(`Stock not found for ID: ${item.lens_stock_id}`);
        }

        const newQuantity = currentStock.quantity - item.quantity;
        const { error: updateError } = await supabase
          .from("lens_stock")
          .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
          })
          .eq("id", item.lens_stock_id);

        if (updateError) throw updateError;

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
      if (values.customer_phone && values.customer_name) {
        await createOrUpdateCustomer({
          name: values.customer_name,
          phone: values.customer_phone,
          email: values.customer_email,
          birth_date: values.customer_birth_date,
          address: values.customer_address,
        });
      }

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

      if (invoiceError) throw invoiceError;

      // Update product stock quantities
      await updateProductStock(values.items);

      // Update lens stock
      await updateLensStock(values.items, invoice.id);

      const invoiceItemsToInsert = values.items.map((item) => ({
        invoice_id: invoice.id,
        product_id: item.product_id,
        lens_stock_id: item.lens_stock_id || null,
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

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(invoiceItemsToInsert);

      if (itemsError) throw itemsError;

      if (totals.downPayment > 0) {
        const { error: paymentError } = await supabase.from("payments").insert({
          invoice_id: invoice.id,
          amount: totals.downPayment,
          payment_type: values.payment_type,
          payment_date: new Date().toISOString(),
          is_down_payment: totals.downPayment < totals.grandTotal,
        });

        if (paymentError) throw paymentError;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["invoices"] }),
        queryClient.invalidateQueries({ queryKey: ["latest-invoice-number"] }),
        queryClient.invalidateQueries({ queryKey: ["customers"] }),
        queryClient.invalidateQueries({ queryKey: ["lens-stock"] }),
        queryClient.invalidateQueries({ queryKey: ["products"] }),
      ]);

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
