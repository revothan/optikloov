
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

interface Totals {
  totalAmount: number;
  discountAmount: number;
  grandTotal: number;
  downPayment: number;
  remainingBalance: number;
}

interface CustomerData {
  name: string;
  phone?: string;
  email?: string;
  birth_date?: string;
  address?: string;
}

export interface InvoiceData {
  invoice_number: string;
  sale_date: string;
  customer_name: string;
  customer_email?: string;
  customer_birth_date?: string;
  customer_phone?: string;
  customer_address?: string;
  payment_type: string;
  down_payment: string;
  acknowledged_by?: string;
  received_by?: string;
  notes?: string;
  branch: string;
  branch_prefix: string;
  items: Array<{
    product_id: string;
    quantity: number;
    price: number;
    discount?: number;
    lens_stock_id?: string | null;
    lens_type_id?: string | null;
    left_eye?: {
      sph?: number | null;
      cyl?: number | null;
      axis?: number | null;
      add_power?: number | null;
      mpd?: number | null;
    } | null;
    right_eye?: {
      sph?: number | null;
      cyl?: number | null;
      axis?: number | null;
      add_power?: number | null;
      mpd?: number | null;
    } | null;
  }>;
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
        const { data: updatedCustomer, error: updateError } = await supabase
          .from("customers")
          .update(customerData)
          .eq("id", existingCustomer.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updatedCustomer;
      } else {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert([customerData])
          .select()
          .single();

        if (createError) throw createError;
        return newCustomer;
      }
    } catch (error) {
      console.error("Error creating/updating customer:", error);
      throw error;
    }
  };

  const submitInvoice = async (invoiceData: InvoiceData, totals: Totals) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Create or update customer
      const customerData: CustomerData = {
        name: invoiceData.customer_name,
        phone: invoiceData.customer_phone,
        email: invoiceData.customer_email,
        birth_date: invoiceData.customer_birth_date,
        address: invoiceData.customer_address,
      };

      const customer = await createOrUpdateCustomer(customerData);

      // Insert invoice
      const { data: newInvoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          user_id: user.id,
          invoice_number: invoiceData.invoice_number,
          sale_date: invoiceData.sale_date,
          customer_name: invoiceData.customer_name,
          customer_phone: invoiceData.customer_phone,
          customer_email: invoiceData.customer_email,
          customer_birth_date: invoiceData.customer_birth_date,
          customer_address: invoiceData.customer_address,
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
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Insert invoice items
      for (const item of invoiceData.items) {
        const { error: invoiceItemError } = await supabase
          .from("invoice_items")
          .insert({
            invoice_id: newInvoice.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            total: item.quantity * item.price - (item.discount || 0),
            lens_stock_id: item.lens_stock_id,
            lens_type_id: item.lens_type_id,
            left_eye_sph: item.left_eye?.sph,
            left_eye_cyl: item.left_eye?.cyl,
            left_eye_axis: item.left_eye?.axis,
            left_eye_add_power: item.left_eye?.add_power,
            left_eye_mpd: item.left_eye?.mpd,
            right_eye_sph: item.right_eye?.sph,
            right_eye_cyl: item.right_eye?.cyl,
            right_eye_axis: item.right_eye?.axis,
            right_eye_add_power: item.right_eye?.add_power,
            right_eye_mpd: item.right_eye?.mpd,
          });

        if (invoiceItemError) throw invoiceItemError;
      }

      await queryClient.invalidateQueries({ queryKey: ["invoices"] });
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
