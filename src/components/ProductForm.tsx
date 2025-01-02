import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Package, DollarSign, BarChart, Box, ShoppingCart, Info, Image, Tag, Bookmark } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductImageUpload } from "./ProductImageUpload";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  // Basic Information
  name: z.string().min(1, "Nama produk harus diisi"),
  alternative_name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  uom: z.string().optional(),
  
  // Pricing
  store_price: z.string().min(1, "Harga jual di toko harus diisi"),
  online_price: z.string().optional(),
  buy_price: z.string().optional(),
  market_price: z.string().optional(),
  sell_price: z.string().optional(),
  pos_sell_price: z.string().optional(),
  pos_sell_price_dynamic: z.boolean().optional(),
  comission: z.string().optional(),
  
  // Inventory
  track_inventory: z.boolean().default(false),
  stock_qty: z.string().optional(),
  hold_qty: z.string().optional(),
  low_stock_alert: z.string().optional(),
  qty_fast_moving: z.string().optional(),
  
  // Product Details
  weight_kg: z.string().optional(),
  loyalty_points: z.string().optional(),
  published: z.boolean().optional(),
  pos_hidden: z.boolean().optional(),
  tax_free_item: z.boolean().optional(),
  has_variants: z.boolean().optional(),
  
  // Variants
  variant_label: z.string().optional(),
  variant_names: z.string().optional(),
  alternative_variant_names: z.string().optional(),
  
  // Additional Info
  collections: z.string().optional(),
  condition_id: z.string().optional(),
  classification_id: z.string().optional(),
  notes: z.string().optional(),
  
  // Images
  image_url: z.string().optional(),
  photo_1: z.string().optional(),
  photo_2: z.string().optional(),
  photo_3: z.string().optional(),
  photo_4: z.string().optional(),
  photo_5: z.string().optional(),
  photo_6: z.string().optional(),
  photo_7: z.string().optional(),
  photo_8: z.string().optional(),
  photo_9: z.string().optional(),
  photo_10: z.string().optional(),
});

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: Tables<"products">;
  onSuccess?: () => void;
}

export function ProductForm({ mode = "create", product, onSuccess }: ProductFormProps) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      alternative_name: product?.alternative_name || "",
      description: product?.description || "",
      category: product?.category || "",
      brand: product?.brand || "",
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      uom: product?.uom || "",
      store_price: product?.store_price?.toString() || "",
      online_price: product?.online_price?.toString() || "",
      buy_price: product?.buy_price?.toString() || "",
      market_price: product?.market_price?.toString() || "",
      sell_price: product?.sell_price?.toString() || "",
      pos_sell_price: product?.pos_sell_price?.toString() || "",
      pos_sell_price_dynamic: product?.pos_sell_price_dynamic || false,
      comission: product?.comission?.toString() || "",
      track_inventory: product?.track_inventory || false,
      stock_qty: product?.stock_qty?.toString() || "",
      hold_qty: product?.hold_qty?.toString() || "",
      low_stock_alert: product?.low_stock_alert?.toString() || "",
      qty_fast_moving: product?.qty_fast_moving?.toString() || "",
      weight_kg: product?.weight_kg?.toString() || "",
      loyalty_points: product?.loyalty_points?.toString() || "",
      published: product?.published || false,
      pos_hidden: product?.pos_hidden || false,
      tax_free_item: product?.tax_free_item || false,
      has_variants: product?.has_variants || false,
      variant_label: product?.variant_label || "",
      variant_names: product?.variant_names || "",
      alternative_variant_names: product?.alternative_variant_names || "",
      collections: product?.collections || "",
      condition_id: product?.condition_id || "",
      classification_id: product?.classification_id?.toString() || "",
      notes: product?.notes || "",
      image_url: product?.image_url || "",
      photo_1: product?.photo_1 || "",
      photo_2: product?.photo_2 || "",
      photo_3: product?.photo_3 || "",
      photo_4: product?.photo_4 || "",
      photo_5: product?.photo_5 || "",
      photo_6: product?.photo_6 || "",
      photo_7: product?.photo_7 || "",
      photo_8: product?.photo_8 || "",
      photo_9: product?.photo_9 || "",
      photo_10: product?.photo_10 || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        name: values.name,
        alternative_name: values.alternative_name || null,
        description: values.description || null,
        category: values.category || null,
        brand: values.brand || null,
        sku: values.sku || null,
        barcode: values.barcode || null,
        uom: values.uom || null,
        store_price: values.store_price ? parseFloat(values.store_price) : null,
        online_price: values.online_price ? parseFloat(values.online_price) : null,
        buy_price: values.buy_price ? parseFloat(values.buy_price) : null,
        market_price: values.market_price ? parseFloat(values.market_price) : null,
        sell_price: values.sell_price ? parseFloat(values.sell_price) : null,
        pos_sell_price: values.pos_sell_price ? parseFloat(values.pos_sell_price) : null,
        pos_sell_price_dynamic: values.pos_sell_price_dynamic || false,
        comission: values.comission ? parseFloat(values.comission) : null,
        track_inventory: values.track_inventory || false,
        stock_qty: values.stock_qty ? parseInt(values.stock_qty) : null,
        hold_qty: values.hold_qty ? parseInt(values.hold_qty) : null,
        low_stock_alert: values.low_stock_alert ? parseInt(values.low_stock_alert) : null,
        qty_fast_moving: values.qty_fast_moving ? parseInt(values.qty_fast_moving) : null,
        weight_kg: values.weight_kg ? parseFloat(values.weight_kg) : null,
        loyalty_points: values.loyalty_points ? parseInt(values.loyalty_points) : null,
        published: values.published || false,
        pos_hidden: values.pos_hidden || false,
        tax_free_item: values.tax_free_item || false,
        has_variants: values.has_variants || false,
        variant_label: values.variant_label || null,
        variant_names: values.variant_names || null,
        alternative_variant_names: values.alternative_variant_names || null,
        collections: values.collections || null,
        condition_id: values.condition_id || null,
        classification_id: values.classification_id ? parseInt(values.classification_id) : null,
        notes: values.notes || null,
        image_url: values.image_url || null,
        photo_1: values.photo_1 || null,
        photo_2: values.photo_2 || null,
        photo_3: values.photo_3 || null,
        photo_4: values.photo_4 || null,
        photo_5: values.photo_5 || null,
        photo_6: values.photo_6 || null,
        photo_7: values.photo_7 || null,
        photo_8: values.photo_8 || null,
        photo_9: values.photo_9 || null,
        photo_10: values.photo_10 || null,
        user_id: session.user.id,
      };

      if (mode === "edit" && product?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Produk berhasil diperbarui");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productData]);

        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(mode === "edit" ? "Gagal memperbarui produk" : "Gagal menambahkan produk");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ScrollArea className="h-[600px] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="basic">
                <Package className="w-4 h-4 mr-2" />
                Informasi Dasar
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <DollarSign className="w-4 h-4 mr-2" />
                Harga
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Box className="w-4 h-4 mr-2" />
                Inventori
              </TabsTrigger>
              <TabsTrigger value="additional">
                <Info className="w-4 h-4 mr-2" />
                Info Tambahan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="pricing" className="space-y-6">
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
                  name="online_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Online</FormLabel>
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
                  name="buy_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Beli</FormLabel>
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
                  name="market_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Pasar</FormLabel>
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
                  name="pos_sell_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Jual POS</FormLabel>
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
                  name="comission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Komisi</FormLabel>
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

              <FormField
                control={form.control}
                name="pos_sell_price_dynamic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Harga Jual POS Dinamis
                      </FormLabel>
                      <FormDescription>
                        Aktifkan untuk mengizinkan perubahan harga di POS
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
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="has_variants"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Memiliki Varian
                      </FormLabel>
                      <FormDescription>
                        Aktifkan jika produk memiliki beberapa varian
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

              {form.watch("has_variants") && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="variant_label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Label Varian</FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: Ukuran, Warna" {...field} />
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
                          <Input placeholder="Contoh: S, M, L atau Merah, Biru" {...field} />
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
                        <FormLabel>Nama Varian Alternatif</FormLabel>
                        <FormControl>
                          <Input placeholder="Nama varian alternatif" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="additional" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="weight_kg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berat (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="0.0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loyalty_points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poin Loyalitas</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classification_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Klasifikasi</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Kondisi</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan ID Kondisi" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Koleksi</FormLabel>
                    <FormControl>
                      <Input placeholder="Masukkan koleksi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catatan</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Masukkan catatan tambahan"
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
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Publikasikan
                        </FormLabel>
                        <FormDescription>
                          Produk akan ditampilkan di website
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

                <FormField
                  control={form.control}
                  name="pos_hidden"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Sembunyikan di POS
                        </FormLabel>
                        <FormDescription>
                          Produk tidak akan muncul di POS
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

                <FormField
                  control={form.control}
                  name="tax_free_item"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Bebas Pajak
                        </FormLabel>
                        <FormDescription>
                          Produk tidak dikenakan pajak
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
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{mode === "edit" ? "Menyimpan..." : "Menambahkan..."}</span>
            </div>
          ) : (
            mode === "edit" ? "Simpan Perubahan" : "Tambah Produk"
          )}
        </Button>
      </form>
    </Form>
  );
}
