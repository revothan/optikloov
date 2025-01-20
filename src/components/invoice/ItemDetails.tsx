import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { formatPrice } from "@/lib/utils";

interface ItemDetailsProps {
  form: UseFormReturn<any>;
  index: number;
  calculateItemTotal: (index: number) => number;
}

export function ItemDetails({ form, index, calculateItemTotal }: ItemDetailsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name={`items.${index}.quantity`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger("items");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`items.${index}.price`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-2.5">Rp</span>
                <Input
                  type="number"
                  className="pl-12"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("items");
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`items.${index}.discount`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-3 top-2.5">Rp</span>
                <Input
                  type="number"
                  className="pl-12"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger("items");
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="col-span-full text-right text-sm text-muted-foreground">
        Total: {formatPrice(calculateItemTotal(index))}
      </div>
    </div>
  );
}