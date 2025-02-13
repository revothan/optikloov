
import { useMemo, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getFullBranchName } from "@/lib/invoice-utils";
import type { FormData } from "./invoiceFormSchema";

interface Totals {
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  downPayment: number;
  remainingBalance: number;
}

interface StockUpdateError extends Error {
  productName?: string;
  currentStock?: number;
  requestedQuantity?: number;
}

export const useInvoiceSubmission = (onSuccess?: () => void) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const checkStockAvailability = useCallback(
    async (items: FormData["items"], branch: string) => {
      const stockErrors: StockUpdateError[] = [];
      const fullBranchName = getFullBranchName(branch);

      // Batch fetch all products
      const productIds = items
        .filter((item) => item.product_id)
        .map((item) => item.product_id);

      const { data: products, error: productsError } = await supabase
        .from("products")
        .select("id, name, stock_qty, track_inventory")
        .in("id", productIds)
        .eq("branch", fullBranchName);

      if (productsError) throw new Error(productsError.message);

      console.log("Found products:", products, "for branch:", fullBranchName);

      const productMap = new Map(products.map((p) => [p.id, p]));

      // Check product stock
      items.forEach((item) => {
        if (!item.product_id) return;
        const product = productMap.get(item.product_id);

        if (!product) {
          throw new Error(`Product ${item.product_id} not found in ${fullBranchName}`);
        }

        if (product.track_inventory && product.stock_qty < item.quantity) {
          const error = new Error("Insufficient stock") as StockUpdateError;
          error.productName = product.name;
          error.currentStock = product.stock_qty;
          error.requestedQuantity = item.quantity;
          stockErrors.push(error);
        }
      });

      // Check lens stock
      for (const item of items) {
        if (!item.lens_stock_id) continue;

        const { data: stock, error: fetchError } = await supabase
          .from("lens_stock")
          .select("quantity, lens_type:lens_types(name)")
          .eq("id", item.lens_stock_id)
          .single();

        if (fetchError) {
          throw new Error(`Error fetching lens stock: ${fetchError.message}`);
        }

        if ((stock?.quantity || 0) < item.quantity) {
          const error = new Error(
            "Insufficient lens stock",
          ) as StockUpdateError;
          error.productName = stock.lens_type.name;
          error.currentStock = stock.quantity;
          error.requestedQuantity = item.quantity;
          stockErrors.push(error);
        }
      }

      if (stockErrors.length > 0) {
        const errorMessage = stockErrors
          .map(
            (err) =>
              `${err.productName}: Have ${err.currentStock}, need ${err.requestedQuantity}`,
          )
          .join("\n");
        throw new Error(`Insufficient stock:\n${errorMessage}`);
      }
    },
    [],
  );

  const updateProductStock = useCallback(
    async (items: FormData["items"], branch: string) => {
      const fullBranchName = getFullBranchName(branch);
      console.log("Starting stock update for branch:", fullBranchName);

      for (const item of items) {
        if (!item.product_id) continue;

        // First fetch the current product with more fields for debugging
        const { data: product, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", item.product_id)
          .eq("branch", fullBranchName)
          .single();

        console.log("Full product data:", product);

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          throw new Error(`Error fetching product: ${fetchError.message}`);
        }

        if (product?.track_inventory) {
          const currentStock = product.stock_qty || 0;
          const newStock = Math.max(0, currentStock - item.quantity);

          console.log("Attempting stock update:", {
            currentStock,
            quantityToDeduct: item.quantity,
            newStock,
            productId: item.product_id,
            branch: fullBranchName,
            user_id: product.user_id,
          });

          const updateData = {
            stock_qty: newStock,
            updated_at: new Date().toISOString(),
            track_inventory: true,
          };

          console.log("Update payload:", updateData);

          const { data: updateResult, error: updateError } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", item.product_id)
            .eq("branch", fullBranchName)
            .select();

          console.log("Update response:", { updateResult, updateError });

          if (updateError) {
            console.error("Update error:", updateError);
            throw new Error(`Error updating stock: ${updateError.message}`);
          }

          // Check if update was actually applied
          if (!updateResult || updateResult.length === 0) {
            throw new Error(
              `Update failed - no rows affected. This might be a permissions issue.`,
            );
          }

          // Verify with a separate query
          const { data: verifiedProduct, error: verifyError } = await supabase
            .from("products")
            .select("*")
            .eq("id", item.product_id)
            .eq("branch", fullBranchName)
            .single();

          console.log("Verification response:", verifiedProduct);

          if (verifyError || !verifiedProduct) {
            throw new Error(
              `Failed to verify stock update: ${verifyError?.message || "Product not found"}`,
            );
          }

          if (verifiedProduct.stock_qty !== newStock) {
            console.error("Verification failed:", {
              expected: newStock,
              actual: verifiedProduct.stock_qty,
              updateResult,
              verifiedProduct,
            });
            throw new Error(
              `Stock update failed verification. Expected: ${newStock}, Got: ${verifiedProduct.stock_qty}`,
            );
          }

          console.log("Stock update successful:", {
            previousStock: currentStock,
            newStock: verifiedProduct.stock_qty,
          });
        } else {
          console.log("Product doesn't track inventory, skipping update");
        }
      }
      console.log("All stock updates completed");
    },
    [],
  );

  const updateLensStock = useCallback(
    async (items: FormData["items"], invoiceId: string, branch: string) => {
      const fullBranchName = getFullBranchName(branch);
      const lensStockItems = items.filter((item) => item.lens_stock_id);
      if (lensStockItems.length === 0) return;

      for (const item of lensStockItems) {
        const { data: currentStock, error: fetchError } = await supabase
          .from("lens_stock")
          .select("quantity")
          .eq("id", item.lens_stock_id)
          .single();

        if (fetchError) {
          throw new Error(`Error fetching lens stock: ${fetchError.message}`);
        }

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

        if (updateError) {
          throw new Error(`Error updating lens stock: ${updateError.message}`);
        }

        const { error: movementError } = await supabase
          .from("lens_stock_movements")
          .insert({
            lens_stock_id: item.lens_stock_id,
            movement_type: "sale",
            quantity: -item.quantity,
            invoice_id: invoiceId,
            notes: `Sale through invoice ${invoiceId} (${fullBranchName})`,
            branch: fullBranchName,
          });

        if (movementError) {
          throw new Error(
            `Error recording stock movement: ${movementError.message}`,
          );
        }
      }
    },
    [],
  );

  const createOrUpdateCustomer = useCallback(
    async (customerData: {
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
          const { error: createError } = await supabase
            .from("customers")
            .insert({
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
    },
    [],
  );

  const submitInvoice = useCallback(
    async (values: FormData, totals: Totals) => {
      try {
        const fullBranchName = getFullBranchName(values.branch);
        
        // First check stock availability
        await checkStockAvailability(values.items, fullBranchName);
        console.log("Stock availability check passed");

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
            branch: fullBranchName,
            branch_prefix: fullBranchName === "Gading Serpong" ? "GS" : "KD",
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;
        console.log("Invoice created:", invoice);

        // Update product stock
        console.log("Starting stock updates...");
        await updateProductStock(values.items, fullBranchName);
        console.log("Product stock updated");

        // Update lens stock if needed
        if (invoice) {
          await updateLensStock(values.items, invoice.id, fullBranchName);
          console.log("Lens stock updated");
        }

        // Create invoice items after stock updates
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
          branch: fullBranchName,
        }));

        console.log("Creating invoice items...");
        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItemsToInsert);

        if (itemsError) throw itemsError;
        console.log("Invoice items created");

        // Handle payment record
        if (totals.downPayment > 0) {
          console.log("Creating payment record...");
          const { error: paymentError } = await supabase
            .from("payments")
            .insert({
              invoice_id: invoice.id,
              amount: totals.downPayment,
              payment_type: values.payment_type,
              payment_date: new Date().toISOString(),
              is_down_payment: totals.downPayment < totals.grandTotal,
              branch: fullBranchName,
            });

          if (paymentError) throw paymentError;
          console.log("Payment record created");
        }

        // Invalidate queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["invoices"] }),
          queryClient.invalidateQueries({
            queryKey: ["latest-invoice-number"],
          }),
          queryClient.invalidateQueries({ queryKey: ["customers"] }),
          queryClient.invalidateQueries({ queryKey: ["lens-stock"] }),
          queryClient.invalidateQueries({ queryKey: ["products"] }),
        ]);

        toast.success("Invoice created successfully");
        onSuccess?.();
        return true;
      } catch (error) {
        console.error("Error creating invoice:", error);
        toast.error(error.message || "Failed to create invoice");
        return false;
      }
    },
    [session?.user?.id, queryClient, onSuccess],
  );

  // Use useMemo to create stable references for the callback functions
  const memoizedCallbacks = useMemo(
    () => ({
      checkStockAvailability,
      updateProductStock,
      updateLensStock,
      createOrUpdateCustomer,
      submitInvoice,
    }),
    [
      checkStockAvailability,
      updateProductStock,
      updateLensStock,
      createOrUpdateCustomer,
      submitInvoice,
    ],
  );

  return memoizedCallbacks;
};
