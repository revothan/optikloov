import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./schema";

interface InventoryTabProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function InventoryTab({ form }: InventoryTabProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="track_inventory"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Lacak Inventori
              </FormLabel>
              <FormDescription>
                Aktifkan untuk melacak stok produk
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="stock_qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Stok</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hold_qty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Hold</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="low_stock_alert"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peringatan Stok Rendah</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="qty_fast_moving"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah Fast Moving</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}