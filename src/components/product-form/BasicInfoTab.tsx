import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
        onImageUrlChange={(url) => form.setValue("image_url", url)} 
        defaultImageUrl={product?.image_url}
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

      <FormField
        control={form.control}
        name="alternative_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nama Produk Alternatif</FormLabel>
            <FormControl>
              <Input placeholder="Masukkan Nama Produk Alternatif" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Deskripsi</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Masukkan deskripsi produk"
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Kategori" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Merek</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Merek" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Barcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}