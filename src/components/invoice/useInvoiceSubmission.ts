import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeBranchName } from "@/lib/branch-utils";
import { Tables } from "@/integrations/supabase/types";

interface Totals {
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  downPayment: number;
  remainingBalance: number;
}

interface CustomerData {
  name: string;
  phone: string;
  email?: string;
  birth_date?: string;
  address?: string;
}

interface InvoiceData {
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_email: string;
  customer_birth_date: string;
  customer_phone: string;
  customer_address: string;
  payment_type: string;
  down_payment: string;
  acknowledged_by: string;
  received_by: string;
  notes: string;
  branch: string;
  branch_prefix: string;
  items: any[];
}

export function useInvoiceSubmission(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const [isCheckingStock, setIsCheckingStock] = useState(false);

  const createOrUpdateCustomer = async (customerData: CustomerData) => {
    try {
      const { data: existingCustomer, error: existingCustomerError } =
        await supabase
          .from("customers")
          .select("*")
          .eq("phone", customerData.phone)
          .single();

      if (existingCustomerError && existingCustomerError.code !== "404") {
        throw existingCustomerError;
      }

      if (existingCustomer) {
        // Update existing customer
        const { data: updatedCustomer, error: updateError } = await supabase
          .from("customers")
          .update({ ...customerData })
          .eq("id", existingCustomer.id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }
        return updatedCustomer;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert([{ ...customerData }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        return newCustomer;
      }
    } catch (error) {
      console.error("Error creating/updating customer:", error);
      throw error;
    }
  };

  const checkStockAvailability = async (items: any[]) => {
    setIsCheckingStock(true);
    try {
      for (const item of items) {
        if (!item.product_id) continue;

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("name, track_inventory, stock_qty")
          .eq("id", item.product_id)
          .single();

        if (productError) {
          console.error("Error fetching product:", productError);
          throw new Error(
            `Error fetching product ${item.product_id}: ${productError.message}`,
          );
        }

        if (product && product.track_inventory) {
          const currentStock = product.stock_qty || 0;
          if (item.quantity > currentStock) {
            throw new Error(
              `Insufficient stock for product ${product.name}. Available: ${currentStock}, Requested: ${item.quantity}`,
            );
          }
        }
      }
    } finally {
      setIsCheckingStock(false);
    }
  };

  const updateStockQuantities = async (items: any[]) => {
    try {
      for (const item of items) {
        if (!item.product_id) continue;

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("name, track_inventory, stock_qty")
          .eq("id", item.product_id)
          .single();

        if (productError) {
          console.error("Error fetching product:", productError);
          throw new Error(
            `Error fetching product ${item.product_id}: ${productError.message}`,
          );
        }

        if (product && product.track_inventory) {
          const currentStock = product.stock_qty || 0;
          const newStock = currentStock - item.quantity;

          const { error: updateError } = await supabase
            .from("products")
            .update({ stock_qty: newStock })
            .eq("id", item.product_id);

          if (updateError) {
            console.error("Error updating stock:", updateError);
            throw new Error(
              `Error updating stock for product ${product.name}: ${updateError.message}`,
            );
          }
        }
      }
    } catch (error) {
      console.error("Stock update failed:", error);
      throw error;
    }
  };

  const submitInvoice = async (invoiceData: InvoiceData, totals: Totals) => {
    try {
      // 1. Create or update customer
      const customerData: CustomerData = {
        name: invoiceData.customer_name,
        phone: invoiceData.customer_phone,
        email: invoiceData.customer_email,
        birth_date: invoiceData.customer_birth_date,
        address: invoiceData.customer_address,
      };

      const customer = await createOrUpdateCustomer(customerData);

      // 2. Check stock availability
      await checkStockAvailability(invoiceData.items);

      // 3. Insert invoice
      const { data: newInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([
          {
            invoice_number: invoiceData.invoice_number,
            sale_date: invoiceData.sale_date,
            customer_id: customer.id,
            payment_type: invoiceData.payment_type,
            down_payment: parseFloat(invoiceData.down_payment),
            acknowledged_by: invoiceData.acknowledged_by,
            received_by: invoiceData.received_by,
            notes: invoiceData.notes,
            total_amount: totals.totalAmount,
            discount_amount: totals.discountAmount,
            grand_total: totals.grandTotal,
            remaining_balance: totals.remainingBalance,
            branch: invoiceData.branch,
            branch_prefix: invoiceData.branch_prefix,
          },
        ])
        .select()
        .single();

      if (invoiceError) {
        throw invoiceError;
      }

      // 4. Insert invoice items
      for (const item of invoiceData.items) {
        if (!item.product_id) continue;

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("name, track_inventory, stock_qty")
          .eq("id", item.product_id)
          .single();

        if (productError) {
          console.error("Error fetching product:", productError);
          throw new Error(
            `Error fetching product ${item.product_id}: ${productError.message}`,
          );
        }

        const { error: invoiceItemError } = await supabase
          .from("invoice_items")
          .insert([
            {
              invoice_id: newInvoice.id,
              product_id: item.product_id,
              quantity: item.quantity,
              price: item.price,
              discount: item.discount,
              display_name: item.display_name || product.name,
              lens_stock_id: item.lens_stock_id || null,
              lens_type_id: item.lens_type_id || null,
            },
          ]);

        if (invoiceItemError) {
          throw invoiceItemError;
        }
      }

      // 5. Update stock quantities
      await updateStockQuantities(invoiceData.items);

      // Invalidate queries
      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });

      // 6. Handle success callback
      onSuccess?.();
      return true;
    } catch (error) {
      console.error("Invoice submission failed:", error);
      toast.error(String(error));
      return false;
    }
  };

  return { submitInvoice, createOrUpdateCustomer, isCheckingStock };
}
