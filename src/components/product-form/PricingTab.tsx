import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface PricingTabProps {
  form: UseFormReturn<any>;
}

export function PricingTab({ form }: PricingTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          name="online_price_same"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Harga jual online sama dengan harga jual toko
                </FormLabel>
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

      {!form.watch("online_price_same") && (
        <FormField
          control={form.control}
          name="online_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Jual Online</FormLabel>
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
      )}

      <FormField
        control={form.control}
        name="track_inventory"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Lacak Inventori
              </FormLabel>
              <p className="text-sm text-muted-foreground">
                Jika anda mengaktifkan lacak inventori, sistem akan mengecek ketersediaan stok barang sebelum menjual ke pembeli
              </p>
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

      {form.watch("track_inventory") && (
        <FormField
          control={form.control}
          name="initial_stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stok Awal</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
