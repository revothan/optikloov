import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductImageUpload } from "@/components/ProductImageUpload";
import { Tables } from "@/integrations/supabase/types";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  product?: Tables<"products">;
}

export function BasicInfoTab({ form, product }: BasicInfoTabProps) {
  return (
    <div className="space-y-4">
      <ProductImageUpload
        onImageUrlChange={(url) => {
          console.log("Image URL received in BasicInfoTab:", url);
          form.setValue("image_url", url);
          // Verify the value was set
          console.log("Form values after setting image_url:", form.getValues());
        }}
        defaultImageUrl={product?.image_url}
      />

      {/* Rest of your form fields */}
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem className="hidden">
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Produk</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan Nama Produk" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Rest of your existing fields */}
    </div>
  );
}

