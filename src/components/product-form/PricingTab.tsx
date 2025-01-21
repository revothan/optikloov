import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { FormFields } from "./FormFields";
import { TabContent } from "./TabContent";

interface PricingTabProps {
  form: UseFormReturn<any>;
}

export function PricingTab({ form }: PricingTabProps) {
  return (
    <div className="space-y-6">
      <TabContent>
        <FormFields
          form={form}
          name="store_price"
          label="Store Price"
          type="number"
          placeholder="0"
        />
        <FormFields
          form={form}
          name="online_price"
          label="Online Price"
          type="number"
          placeholder="0"
        />
      </TabContent>

      <TabContent>
        <FormFields
          form={form}
          name="buy_price"
          label="Buy Price"
          type="number"
          placeholder="0"
        />
        <FormFields
          form={form}
          name="market_price"
          label="Market Price"
          type="number"
          placeholder="0"
        />
      </TabContent>

      <TabContent>
        <FormFields
          form={form}
          name="sell_price"
          label="Sell Price"
          type="number"
          placeholder="0"
        />
        <FormFields
          form={form}
          name="pos_sell_price"
          label="POS Sell Price"
          type="number"
          placeholder="0"
        />
      </TabContent>

      <FormField
        control={form.control}
        name="pos_sell_price_dynamic"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Dynamic POS Price</FormLabel>
              <FormMessage />
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

      <FormFields
        form={form}
        name="comission"
        label="Commission"
        type="number"
        placeholder="0"
      />
    </div>
  );
}