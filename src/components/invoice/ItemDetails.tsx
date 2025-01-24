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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface ItemDetailsProps {
  form: UseFormReturn<any>;
  index: number;
  calculateItemTotal: (index: number) => number;
}

export function ItemDetails({ form, index, calculateItemTotal }: ItemDetailsProps) {
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [discountValue, setDiscountValue] = useState<string>('');

  // Calculate the actual discount amount based on type and value
  const calculateDiscount = (value: string, type: 'fixed' | 'percentage') => {
    const numericValue = parseFloat(value) || 0;
    if (type === 'fixed') {
      return numericValue;
    } else {
      const price = form.watch(`items.${index}.price`) || 0;
      const quantity = form.watch(`items.${index}.quantity`) || 0;
      return (price * quantity * numericValue) / 100;
    }
  };

  // Update form discount when discount type or value changes
  useEffect(() => {
    const calculatedDiscount = calculateDiscount(discountValue, discountType);
    form.setValue(`items.${index}.discount`, calculatedDiscount);
  }, [discountValue, discountType, form, index]);

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
                  const value = parseInt(e.target.value) || 1;
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
                    const value = parseFloat(e.target.value) || 0;
                    field.onChange(value);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel>Discount</FormLabel>
        <div className="flex gap-2">
          <Select
            value={discountType}
            onValueChange={(value: 'fixed' | 'percentage') => setDiscountType(value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Rupiah</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            {discountType === 'fixed' && (
              <span className="absolute left-3 top-2.5">Rp</span>
            )}
            <Input
              type="number"
              className={discountType === 'fixed' ? 'pl-12' : 'pr-8'}
              value={discountValue}
              onChange={(e) => {
                // Remove leading zeros and update the value
                const value = e.target.value.replace(/^0+/, '');
                setDiscountValue(value);
              }}
            />
            {discountType === 'percentage' && (
              <span className="absolute right-3 top-2.5">%</span>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-full text-right text-sm text-muted-foreground">
        Total: {formatPrice(calculateItemTotal(index))}
      </div>
    </div>
  );
}