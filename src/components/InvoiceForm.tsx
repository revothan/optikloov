import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InvoiceItemForm } from "./InvoiceItemForm";
import { formatPrice } from "@/lib/utils";

const schema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  sale_date: z.string().min(1, "Sale date is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  customer_phone: z.string().optional(),
  customer_address: z.string().optional(),
  payment_type: z.string().min(1, "Payment type is required"),
  down_payment: z.string().optional(),
  acknowledged_by: z.string().optional(),
  received_by: z.string().optional(),
  items: z.array(
    z.object({
      product_id: z.string().min(1, "Product is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
      price: z.number().min(0, "Price cannot be negative"),
      discount: z.number().min(0, "Discount cannot be negative"),
      left_eye: z.object({
        sph: z.number().nullable(),
        cyl: z.number().nullable(),
        axis: z.number().nullable(),
        add_power: z.number().nullable(),
        pd: z.number().nullable(),
      }).nullable(),
      right_eye: z.object({
        sph: z.number().nullable(),
        cyl: z.number().nullable(),
        axis: z.number().nullable(),
        add_power: z.number().nullable(),
        pd: z.number().nullable(),
      }).nullable(),
    })
  ).min(1, "At least one item is required"),
});

type FormData = z.infer<typeof schema>;

interface InvoiceFormProps {
  onSuccess?: () => void;
}

export function InvoiceForm({ onSuccess }: InvoiceFormProps) {
  const session = useSession();
  const queryClient = useQueryClient();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      invoice_number: "",
      sale_date: new Date().toISOString().split("T")[0],
      customer_name: "",
      customer_phone: "",
      customer_address: "",
      payment_type: "",
      down_payment: "0",
      acknowledged_by: "",
      received_by: "",
      items: [],
    },
  });

  const { fields, append, remove, swap, move, insert, prepend } = useFieldArray({
    name: "items",
    control: form.control,
  });

  const calculateTotals = () => {
    const items = form.watch("items") || [];
    const totalAmount = items.reduce((sum, item) => {
      return sum + (item.quantity * item.price);
    }, 0);
    
    const discountAmount = items.reduce((sum, item) => {
      return sum + (item.discount || 0);
    }, 0);

    const grandTotal = totalAmount - discountAmount;
    const downPayment = parseFloat(form.watch("down_payment") || "0");
    const remainingBalance = grandTotal - downPayment;

    return {
      totalAmount,
      discountAmount,
      grandTotal,
      downPayment,
      remainingBalance,
    };
  };

  const totals = calculateTotals();

  const onSubmit = async (values: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    try {
      // First create the invoice
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert({
          invoice_number: values.invoice_number,
          sale_date: values.sale_date,
          customer_name: values.customer_name,
          customer_phone: values.customer_phone,
          customer_address: values.customer_address,
          payment_type: values.payment_type,
          down_payment: parseFloat(values.down_payment || "0"),
          acknowledged_by: values.acknowledged_by,
          received_by: values.received_by,
          user_id: session.user.id,
          total_amount: totals.totalAmount,
          discount_amount: totals.discountAmount,
          grand_total: totals.grandTotal,
          paid_amount: totals.downPayment,
          remaining_balance: totals.remainingBalance,
        })
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Then create all invoice items
      const { error: itemsError } = await supabase.from("invoice_items").insert(
        values.items.flatMap((item) => {
          const baseItem = {
            invoice_id: invoice.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            discount: item.discount || 0,
            total: (item.quantity * item.price) - (item.discount || 0),
          };

          return [
            {
              ...baseItem,
              eye_side: 'left',
              sph: item.left_eye?.sph || null,
              cyl: item.left_eye?.cyl || null,
              axis: item.left_eye?.axis || null,
              add_power: item.left_eye?.add_power || null,
              pd: item.left_eye?.pd || null,
            },
            {
              ...baseItem,
              eye_side: 'right',
              sph: item.right_eye?.sph || null,
              cyl: item.right_eye?.cyl || null,
              axis: item.right_eye?.axis || null,
              add_power: item.right_eye?.add_power || null,
              pd: item.right_eye?.pd || null,
            }
          ];
        })
      );

      if (itemsError) throw itemsError;

      toast.success("Invoice created successfully");
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating invoice:", error);
      toast.error("Failed to create invoice");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Invoice</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sale_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pelanggan</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="customer_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alamat</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jenis Pembayaran</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <InvoiceItemForm
          form={form}
          itemFields={{
            fields,
            append,
            remove,
            swap,
            move,
            insert,
            prepend,
          }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="down_payment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Uang Muka (DP)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5">Rp</span>
                      <Input
                        type="number"
                        className="pl-12"
                        placeholder="0"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="acknowledged_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diketahui Oleh</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="received_by"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diterima Oleh</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-2 text-right">
            <div className="text-sm text-muted-foreground">
              Total: {formatPrice(totals.totalAmount)}
            </div>
            <div className="text-sm text-muted-foreground">
              Discount: {formatPrice(totals.discountAmount)}
            </div>
            <div className="text-lg font-semibold">
              Grand Total: {formatPrice(totals.grandTotal)}
            </div>
            <div className="text-sm text-muted-foreground">
              Down Payment: {formatPrice(totals.downPayment)}
            </div>
            <div className="text-sm font-medium">
              Remaining: {formatPrice(totals.remainingBalance)}
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Creating...</span>
            </div>
          ) : (
            "Create Invoice"
          )}
        </Button>
      </form>
    </Form>
  );
}
