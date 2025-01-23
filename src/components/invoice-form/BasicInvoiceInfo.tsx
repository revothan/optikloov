import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface BasicInvoiceInfoProps {
  form: UseFormReturn<any>;
}

export function BasicInvoiceInfo({ form }: BasicInvoiceInfoProps) {
  // Fetch payment types from the database
  const { data: paymentTypes } = useQuery({
    queryKey: ["payment-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_types")
        .select("*");
      
      if (error) throw error;

      // Define the desired order
      const order = ["QRIS", "Debit", "Credit Card", "Cash"];
      
      // Sort the data based on the order array
      return data.sort((a, b) => {
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Invoice</FormLabel>
            <FormControl>
              <Input {...field} readOnly className="bg-gray-100" />
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis pembayaran" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {paymentTypes?.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}