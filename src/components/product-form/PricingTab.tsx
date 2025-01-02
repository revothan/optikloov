import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface PricingTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function PricingTab({ form }: PricingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="store_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Jual di Toko</FormLabel>
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
          name="online_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Online</FormLabel>
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
          name="buy_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Beli</FormLabel>
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
          name="market_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Pasar</FormLabel>
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
      </div>

      <FormField
        control={form.control}
        name="pos_sell_price_dynamic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Harga Jual POS Dinamis
              </FormLabel>
              <FormDescription>
                Aktifkan untuk mengizinkan perubahan harga di POS
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}