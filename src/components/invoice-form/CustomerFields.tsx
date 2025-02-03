import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

interface CustomerFieldsProps {
  form: UseFormReturn<any>;
}

export function CustomerFields({ form }: CustomerFieldsProps) {
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
    <>
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
    </>
  );
}