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

export const useCustomerHandling = () => {
  const session = useSession();

  const createOrUpdateCustomer = useCallback(
    async (customerData: {
      name: string;
      phone: string;
      email?: string;
      birth_date?: string;
      address?: string;
    }) => {
      if (!session?.user?.id) {
        throw new Error("Authentication required");
      }

      try {
        if (!customerData.phone) {
          console.log("No phone number provided, skipping customer creation");
          return null;
        }

        // Normalize phone number by removing non-numeric characters
        const normalizedPhone = customerData.phone.replace(/\D/g, "");

        // First check if customer exists
        const { data: existingCustomer, error: checkError } = await supabase
          .from("customers")
          .select()
          .eq("phone", normalizedPhone)
          .maybeSingle();

        if (checkError) {
          console.error("Error checking customer:", checkError);
          throw checkError;
        }

        let customerId;

        if (existingCustomer) {
          console.log("Updating existing customer:", existingCustomer.id);
          const { data: updatedCustomer, error: updateError } = await supabase
            .from("customers")
            .update({
              name: customerData.name,
              email: customerData.email || null,
              birth_date: customerData.birth_date || null,
              address: customerData.address || null,
              updated_at: new Date().toISOString(),
              updated_by: session.user.id,
            })
            .eq("id", existingCustomer.id)
            .select()
            .single();

          if (updateError) throw updateError;
          customerId = existingCustomer.id;
          console.log("Customer updated successfully");
        } else {
          console.log("Creating new customer");
          const { data: newCustomer, error: createError } = await supabase
            .from("customers")
            .insert({
              name: customerData.name,
              phone: normalizedPhone,
              email: customerData.email || null,
              birth_date: customerData.birth_date || null,
              address: customerData.address || null,
              created_by: session.user.id,
              updated_by: session.user.id,
            })
            .select()
            .single();

          if (createError) {
            console.error("Error creating customer:", createError);
            throw createError;
          }

          customerId = newCustomer.id;
          console.log("Customer created successfully");
        }

        return customerId;
      } catch (error) {
        console.error("Error in createOrUpdateCustomer:", error);
        // Instead of throwing, return null and let the caller handle the error
        return null;
      }
    },
    [session],
  );

  return {
    createOrUpdateCustomer,
  };
};

type Branch = "Gading Serpong" | "Kelapa Dua";
type BranchPrefix = "GS" | "KD";

const VALID_BRANCHES = ["Gading Serpong", "Kelapa Dua"] as const;
const BRANCH_PREFIXES: Record<Branch, BranchPrefix> = {
  "Gading Serpong": "GS",
  "Kelapa Dua": "KD",
};

const normalizeBranch = (
  branch: string,
): { name: Branch; prefix: BranchPrefix } => {
  const normalizedBranch = branch.trim();

  // Direct match for full names
  if (normalizedBranch === "Gading Serpong") {
    return { name: "Gading Serpong", prefix: "GS" };
  }
  if (normalizedBranch === "Kelapa Dua") {
    return { name: "Kelapa Dua", prefix: "KD" };
  }

  // Match branch codes
  if (
    normalizedBranch === "GS" ||
    normalizedBranch.toLowerCase() === "gadingserpongbranch"
  ) {
    return { name: "Gading Serpong", prefix: "GS" };
  }
  if (
    normalizedBranch === "KD" ||
    normalizedBranch.toLowerCase() === "kelapaduabranch"
  ) {
    return { name: "Kelapa Dua", prefix: "KD" };
  }

  // Default to Gading Serpong
  console.warn(`Unrecognized branch "${branch}", defaulting to Gading Serpong`);
  return { name: "Gading Serpong", prefix: "GS" };
};
export const useInvoiceSubmission = (onSuccess?: () => void) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const createOrUpdateCustomer = useCallback(
    async (customerData: {
      name: string;
      phone: string;
      email?: string;
      birth_date?: string;
      address?: string;
    }) => {
      try {
        if (!customerData.phone) {
          console.log("No phone number provided, skipping customer creation");
          return;
        }

        // First check if customer exists
        const { data: existingCustomer, error: checkError } = await supabase
          .from("customers")
          .select("*")
          .eq("phone", customerData.phone)
          .single();

        if (checkError && checkError.code !== "PGRST116") {
          console.error("Error checking customer:", checkError);
          throw checkError;
        }

        if (existingCustomer) {
          console.log("Updating existing customer:", existingCustomer.id);
          const { error: updateError } = await supabase
            .from("customers")
            .update({
              name: customerData.name,
              email: customerData.email || null,
              birth_date: customerData.birth_date || null,
              address: customerData.address || null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existingCustomer.id);

          if (updateError) throw updateError;
        } else {
          console.log("Creating new customer");
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

        console.log("Customer operation successful");
      } catch (error) {
        console.error("Error in createOrUpdateCustomer:", error);
        throw error;
      }
    },
    [],
  );

  const updateLensStock = useCallback(
    async (items: FormData["items"], invoiceId: string, branch: string) => {
      const lensStockItems = items.filter((item) => item.lens_stock_id);
      if (lensStockItems.length === 0) return;

      for (const item of lensStockItems) {
        try {
          // Get current stock
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

          // Update stock quantity
          const newQuantity = currentStock.quantity - item.quantity;
          const { error: updateError } = await supabase
            .from("lens_stock")
            .update({
              quantity: newQuantity,
              updated_at: new Date().toISOString(),
            })
            .eq("id", item.lens_stock_id);

          if (updateError) {
            throw new Error(
              `Error updating lens stock: ${updateError.message}`,
            );
          }

          // Create movement record without branch field
          const { error: movementError } = await supabase
            .from("lens_stock_movements")
            .insert({
              lens_stock_id: item.lens_stock_id,
              movement_type: "sale",
              quantity: -item.quantity,
              invoice_id: invoiceId,
              notes: `Sale through invoice ${invoiceId}`,
            });

          if (movementError) {
            throw new Error(
              `Error recording stock movement: ${movementError.message}`,
            );
          }
        } catch (error) {
          // Roll back stock update if movement record fails
          if (
            error instanceof Error &&
            error.message.includes("stock movement")
          ) {
            const { error: rollbackError } = await supabase
              .from("lens_stock")
              .update({
                quantity: currentStock.quantity,
                updated_at: new Date().toISOString(),
              })
              .eq("id", item.lens_stock_id);

            if (rollbackError) {
              console.error("Error rolling back stock update:", rollbackError);
            }
          }
          throw error;
        }
      }
    },
    [],
  );

  const submitInvoice = useCallback(
    async (values: FormData, totals: Totals) => {
      if (!session?.user?.id) {
        toast.error("Please login again to continue");
        return false;
      }

      try {
        const branchInfo = normalizeBranch(values.branch);
        console.log("Input branch value:", values.branch);
        console.log("Normalized branch info:", branchInfo);

        // Validate branch info
        if (!VALID_BRANCHES.includes(branchInfo.name)) {
          throw new Error(`Invalid branch name: ${branchInfo.name}`);
        }
        if (BRANCH_PREFIXES[branchInfo.name] !== branchInfo.prefix) {
          throw new Error(
            `Branch prefix mismatch: ${branchInfo.name} -> ${branchInfo.prefix}`,
          );
        } // Create/update customer first
        await createOrUpdateCustomer({
          name: values.customer_name,
          phone: values.customer_phone || "",
          email: values.customer_email,
          birth_date: values.customer_birth_date,
          address: values.customer_address,
        });

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
            branch: branchInfo.name,
            branch_prefix: branchInfo.prefix,
          })
          .select()
          .single();

        if (invoiceError) throw invoiceError;

        // Create invoice items after stock updates
        const invoiceItemsToInsert = values.items.map((item) => ({
          invoice_id: invoice.id,
          product_id: item.product_id,
          lens_stock_id: item.lens_stock_id || null,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0,
          total: item.quantity * item.price - (item.discount || 0),
          branch: branchInfo.name,
        }));

        const { error: itemsError } = await supabase
          .from("invoice_items")
          .insert(invoiceItemsToInsert);

        if (itemsError) throw itemsError;

        // Update lens stock if needed
        if (invoice) {
          await updateLensStock(values.items, invoice.id, values.branch);
        }

        // Handle payment record
        if (totals.downPayment > 0) {
          const { error: paymentError } = await supabase
            .from("payments")
            .insert({
              invoice_id: invoice.id,
              amount: totals.downPayment,
              payment_type: values.payment_type,
              payment_date: new Date().toISOString(),
              is_down_payment: totals.downPayment < totals.grandTotal,
              branch: branchInfo.name,
            });

          if (paymentError) throw paymentError;
        }

        await queryClient.invalidateQueries({ queryKey: ["invoices"] });
        await queryClient.invalidateQueries({ queryKey: ["customers"] });
        await queryClient.invalidateQueries({ queryKey: ["lens-stock"] });
        await queryClient.invalidateQueries({ queryKey: ["products"] });

        toast.success("Invoice created successfully");
        onSuccess?.();
        return true;
      } catch (error) {
        console.error("Error creating invoice:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create invoice",
        );
        return false;
      }
    },
    [
      session?.user?.id,
      createOrUpdateCustomer,
      updateLensStock,
      queryClient,
      onSuccess,
    ],
  );

  return {
    createOrUpdateCustomer,
    updateLensStock,
    submitInvoice,
  };
};
