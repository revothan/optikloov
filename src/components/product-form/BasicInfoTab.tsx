import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductImageUpload } from "../ProductImageUpload";
import { FormFields } from "./FormFields";
import { TabContent } from "./TabContent";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
}

const CATEGORIES = [
  "Frame",
  "Lensa",
  "Soft Lens",
  "Sunglasses",
  "Others",
] as const;

export function BasicInfoTab({ form }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <TabContent>
        <FormFields
          form={form}
          name="name"
          label="Product Name"
          placeholder="Enter product name"
        />
        <FormFields
          form={form}
          name="alternative_name"
          label="Alternative Name"
          placeholder="Alternative name (optional)"
        />
      </TabContent>

      <TabContent>
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormFields
          form={form}
          name="brand"
          label="Brand"
          placeholder="Product brand"
        />
      </TabContent>

      <FormFields
        form={form}
        name="description"
        label="Description"
        placeholder="Product description"
        isTextArea
      />

      <TabContent>
        <FormFields
          form={form}
          name="sku"
          label="SKU"
          placeholder="Stock Keeping Unit"
        />
        <FormFields
          form={form}
          name="barcode"
          label="Barcode"
          placeholder="Product barcode"
        />
      </TabContent>

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Published</FormLabel>
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
      </div>

      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Images</FormLabel>
            <FormControl>
              <ProductImageUpload
                onImageUrlChange={field.onChange}
                defaultImageUrl={field.value}
                onAdditionalImagesChange={(urls) => {
                  form.setValue("photo_1", urls.photo_1 || null);
                  form.setValue("photo_2", urls.photo_2 || null);
                  form.setValue("photo_3", urls.photo_3 || null);
                }}
                defaultAdditionalImages={{
                  photo_1: form.getValues("photo_1"),
                  photo_2: form.getValues("photo_2"),
                  photo_3: form.getValues("photo_3"),
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}