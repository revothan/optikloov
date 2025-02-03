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
import { useEffect } from "react";
import { toast } from "sonner";

interface BasicInvoiceInfoProps {
  form: UseFormReturn<any>;
}

export function BasicInvoiceInfo({ form }: BasicInvoiceInfoProps) {
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

  // Function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Watch the phone number field for changes
  const phoneNumber = form.watch("customer_phone");

  // Query to fetch customer by phone number
  const { data: customerData } = useQuery({
    queryKey: ["customer", phoneNumber],
    queryFn: async () => {
      // Only search if phone number is at least 10 digits
      if (!phoneNumber || phoneNumber.length < 10) return null;
      
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("phone", phoneNumber)
        .maybeSingle();

      if (error) {
        console.error("Error fetching customer:", error);
        return null;
      }

      return data;
    },
    enabled: !!phoneNumber && phoneNumber.length >= 10,
  });

  // Auto-fill customer details when found
  useEffect(() => {
    if (customerData) {
      form.setValue("customer_name", customerData.name);
      form.setValue("customer_email", customerData.email || "");
      form.setValue("customer_birth_date", customerData.birth_date || "");
      form.setValue("customer_address", customerData.address || "");
      toast.success("Customer details found and filled automatically");
    }
  }, [customerData, form]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="branch"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cabang</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih cabang" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Gading Serpong">Gading Serpong</SelectItem>
                <SelectItem value="Kelapa Dua">Kelapa Dua</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
        name="customer_phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Telepon</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Minimal 10 digit"
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/[^\d]/g, '');
                  field.onChange(value);
                }}
              />
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
              <Input 
                {...field} 
                onChange={(e) => {
                  const capitalizedValue = capitalizeWords(e.target.value);
                  field.onChange(capitalizedValue);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Pelanggan</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="customer_birth_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tanggal Lahir</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
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
              <Input 
                {...field} 
                onChange={(e) => {
                  const capitalizedValue = capitalizeWords(e.target.value);
                  field.onChange(capitalizedValue);
                }}
              />
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