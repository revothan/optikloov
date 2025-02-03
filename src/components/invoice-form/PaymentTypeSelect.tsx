import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface PaymentTypeSelectProps {
  form: UseFormReturn<any>;
}

export function PaymentTypeSelect({ form }: PaymentTypeSelectProps) {
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
  );
}