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

const createPaymentRecord = async (
  invoiceId: string,
  amount: number,
  paymentType: string,
  isDownPayment: boolean = false
) => {
  const { error } = await supabase.from("payments").insert({
    invoice_id: invoiceId,
    amount,
    payment_type: paymentType,
    payment_date: new Date().toISOString(),
    is_down_payment: isDownPayment,
  });

  if (error) {
    console.error("Error creating payment record:", error);
    throw new Error("Failed to create payment record");
  }
};

const createOrUpdateCustomer = async (customerData: {
  name: string;
  phone?: string | null;
  email?: string | null;
  birth_date?: string | null;
  address?: string | null;
}) => {
  // Only proceed if we have a phone number
  if (!customerData.phone) {
    console.log("No phone number provided, skipping customer creation/update");
    return;
  }

  try {
    // Check if customer exists
    const { data: existingCustomer, error: searchError } = await supabase
      .from("customers")
      .select("*")
      .eq("phone", customerData.phone)
      .maybeSingle();

    if (searchError) {
      console.error("Error searching for customer:", searchError);
      toast.error("Failed to check existing customer");
      return;
    }

    if (existingCustomer) {
      console.log("Customer exists, updating information...");
      // Update existing customer only if new data is provided
      const updateData: any = {};
      
      if (customerData.name && customerData.name !== existingCustomer.name) {
        updateData.name = customerData.name;
      }
      if (customerData.email && customerData.email !== existingCustomer.email) {
        updateData.email = customerData.email;
      }
      if (customerData.birth_date && customerData.birth_date !== existingCustomer.birth_date) {
        updateData.birth_date = customerData.birth_date;
      }
      if (customerData.address && customerData.address !== existingCustomer.address) {
        updateData.address = customerData.address;
      }

      // Only update if there are changes
      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString();
        
        const { error: updateError } = await supabase
          .from("customers")
          .update(updateData)
          .eq("phone", customerData.phone);

        if (updateError) {
          console.error("Error updating customer:", updateError);
          toast.error("Failed to update customer information");
        } else {
          toast.success("Customer information updated");
        }
      } else {
        console.log("No new information to update");
      }
    } else {
      console.log("Creating new customer...");
      // Create new customer
      const { error: insertError } = await supabase.from("customers").insert({
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        birth_date: customerData.birth_date,
        address: customerData.address,
        membership_type: "Classic",
        is_active: true,
        join_date: new Date().toISOString(),
      });

      if (insertError) {
        console.error("Error creating customer:", insertError);
        toast.error("Failed to create customer record");
      } else {
        toast.success("New customer record created");
      }
    }
  } catch (error) {
    console.error("Error in createOrUpdateCustomer:", error);
    toast.error("Failed to process customer information");
  }
};

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

const updateLensStock = async (
  productId: string,
  quantity: number,
  invoiceId: string,
) => {
  try {
    console.log(`Checking lens stock for product ${productId}...`);

    // First get the product details to check if it's a lens product
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("*, lens_stock:lens_stock_id(*)")
      .eq("id", productId)
      .maybeSingle();

    if (productError) {
      console.error("Error checking product:", productError);
      return false;
    }

    if (
      !product ||
      product.category !== "Stock Lens" ||
      !product.lens_stock_id
    ) {
      console.log(`Product ${productId} is not a stock lens item`);
      return false;
    }

    // Get current lens stock
    const { data: lensStock, error: lensStockError } = await supabase
      .from("lens_stock")
      .select("quantity")
      .eq("id", product.lens_stock_id)
      .single();

    if (lensStockError) {
      console.error("Error checking lens stock:", lensStockError);
      return false;
    }

    // Calculate and update new quantity
    const currentQuantity = lensStock.quantity || 0;
    const newQuantity = Math.max(0, currentQuantity - quantity);

    console.log(
      `Updating lens stock ${product.lens_stock_id} from ${currentQuantity} to ${newQuantity}`,
    );

    // Update the lens stock quantity
    const { error: updateError } = await supabase
      .from("lens_stock")
      .update({
        quantity: newQuantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.lens_stock_id);

    if (updateError) {
      console.error("Error updating lens stock:", updateError);
      toast.error(`Failed to update lens stock quantity`);
      return false;
    }

    // Create a stock movement record
    const { error: movementError } = await supabase
      .from("lens_stock_movements")
      .insert({
        lens_stock_id: product.lens_stock_id,
        movement_type: "sale",
        quantity: -quantity,
        created_by: session?.user?.id,
        created_at: new Date().toISOString(),
        invoice_id: invoiceId,
        notes: `Stock reduced by ${quantity} due to sale in invoice ${invoiceId}`,
      });

    if (movementError) {
      console.error("Error creating stock movement record:", movementError);
    }

    console.log(
      `Successfully updated lens stock and created movement record`,
    );
    return true;
  } catch (error) {
    console.error("Error in updateLensStock:", error);
    return false;
  }
};

export const useInvoiceSubmission = (onSuccess?: () => void) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const submitInvoice = async (values: FormData, totals: Totals) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to create an invoice");
      return false;
    }

    try {
      // Create or update customer record first
      await createOrUpdateCustomer({
        name: values.customer_name,
        phone: values.customer_phone,
        email: values.customer_email,
        birth_date: values.customer_birth_date,
        address: values.customer_address,
      });

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
        }))
      );

      if (itemsError) {
        console.error("Invoice items creation error:", itemsError);
        toast.error("Failed to create invoice items: " + itemsError.message);
        return false;
      }

      // Create payment record based on payment status
      if (totals.downPayment > 0) {
        if (totals.downPayment === totals.grandTotal) {
          // If paying full amount, record as final payment
          await createPaymentRecord(
            invoice.id,
            totals.downPayment,
            values.payment_type,
            false // Not a down payment
          );
        } else {
          // If partial payment, record as down payment
          await createPaymentRecord(
            invoice.id,
            totals.downPayment,
            values.payment_type,
            true // Is a down payment
          );
        }
      }

      // Update product stock quantities
      for (const item of values.items) {
        console.log(
          `Processing item ${item.product_id} with quantity ${item.quantity}`
        );

        // First try to update lens stock
        const isLensStock = await updateLensStock(
          item.product_id,
          item.quantity,
          invoice.id
        );

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
      queryClient.invalidateQueries({ queryKey: ["customers"] });

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
