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
import { Checkbox } from "@/components/ui/checkbox";
import { ProductImageUpload } from "@/components/ProductImageUpload";
import { Tables } from "@/integrations/supabase/types";

interface BasicInfoTabProps {
  form: UseFormReturn<any>;
  product?: Tables<"products">;
}

export function BasicInfoTab({ form, product }: BasicInfoTabProps) {
  const handleImageChange = (url: string) => {
    console.log("Image URL received:", url);
    form.setValue("image_url", url, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAdditionalImagesChange = (urls: { [key: string]: string }) => {
    Object.entries(urls).forEach(([key, value]) => {
      form.setValue(key, value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    });
  };

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="image_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Images</FormLabel>
            <FormControl>
              <ProductImageUpload
                onImageUrlChange={handleImageChange}
                onAdditionalImagesChange={handleAdditionalImagesChange}
                defaultImageUrl={field.value || product?.image_url}
                defaultAdditionalImages={{
                  photo_1: product?.photo_1 || null,
                  photo_2: product?.photo_2 || null,
                  photo_3: product?.photo_3 || null,
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Produk</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama produk" {...field} />
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
              <FormLabel>Nama Alternatif</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama alternatif" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <Input placeholder="Masukkan barcode" {...field} />
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
              <FormLabel>Brand</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan brand" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan kategori" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="uom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Satuan (UOM)</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan satuan" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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

      <div className="space-y-4">
        <FormField
          control={form.control}
          name="has_variants"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Memiliki Varian</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {form.watch("has_variants") && (
          <>
            <FormField
              control={form.control}
              name="variant_label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label Varian</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Ukuran, Warna, dll"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variant_names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Varian</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: S,M,L,XL atau Merah,Biru,Hijau"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="alternative_variant_names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Alternatif Varian</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nama alternatif untuk varian"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Dipublikasikan</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pos_hidden"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Sembunyikan di POS</FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
