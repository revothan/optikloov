import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";

export function PricingTab({ form }: { form: UseFormReturn<any> }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Price */}
        <FormField
          control={form.control}
          name="store_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Store Price</FormLabel>
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

        {/* Sell Price */}
        <FormField
          control={form.control}
          name="sell_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sell Price</FormLabel>
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

        {/* Buy Price */}
        <FormField
          control={form.control}
          name="buy_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Buy Price</FormLabel>
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

        {/* Online Price */}
        <FormField
          control={form.control}
          name="online_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Online Price</FormLabel>
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

        {/* Market Price */}
        <FormField
          control={form.control}
          name="market_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Market Price</FormLabel>
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

        {/* POS Sell Price */}
        <FormField
          control={form.control}
          name="pos_sell_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>POS Sell Price</FormLabel>
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

      {/* Dynamic POS Price Toggle */}
      <FormField
        control={form.control}
        name="pos_sell_price_dynamic"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Dynamic POS Pricing</FormLabel>
              <p className="text-sm text-muted-foreground">
                Enable dynamic pricing for POS transactions
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Commission */}
      <FormField
        control={form.control}
        name="comission"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Commission</FormLabel>
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
  );
}
