import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Package, DollarSign, Box, Info } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BasicInfoTab } from "./product-form/BasicInfoTab";
import { PricingTab } from "./product-form/PricingTab";
import { InventoryTab } from "./product-form/InventoryTab";
import { createSchema, editSchema } from "./product-form/schema";
import * as z from "zod";

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: Tables<"products">;
  onSuccess?: () => void;
}

export function ProductForm({
  mode = "create",
  product,
  onSuccess,
}: ProductFormProps) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use different schema based on mode
  const schema = mode === "create" ? createSchema : editSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
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

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a base product data object with only the fields that have values
      const productData: Record<string, any> = {
        user_id: session.user.id,
      };

      // Helper function to add field if it has a value
      const addIfValue = (key: string, value: any) => {
        if (value !== undefined && value !== null && value !== "") {
          productData[key] = value;
        }
      };

      // Add string fields
      addIfValue("name", values.name);
      addIfValue("alternative_name", values.alternative_name);
      addIfValue("description", values.description);
      addIfValue("category", values.category);
      addIfValue("brand", values.brand);
      addIfValue("sku", values.sku);
      addIfValue("barcode", values.barcode);
      addIfValue("uom", values.uom);
      addIfValue("variant_label", values.variant_label);
      addIfValue("variant_names", values.variant_names);
      addIfValue("alternative_variant_names", values.alternative_variant_names);
      addIfValue("collections", values.collections);
      addIfValue("condition_id", values.condition_id);
      addIfValue("notes", values.notes);
      addIfValue("image_url", values.image_url);

      // Add numeric fields with conversion
      addIfValue(
        "store_price",
        values.store_price ? parseFloat(values.store_price) : null,
      );
      addIfValue(
        "online_price",
        values.online_price ? parseFloat(values.online_price) : null,
      );
      addIfValue(
        "buy_price",
        values.buy_price ? parseFloat(values.buy_price) : null,
      );
      addIfValue(
        "market_price",
        values.market_price ? parseFloat(values.market_price) : null,
      );
      addIfValue(
        "sell_price",
        values.sell_price ? parseFloat(values.sell_price) : null,
      );
      addIfValue(
        "pos_sell_price",
        values.pos_sell_price ? parseFloat(values.pos_sell_price) : null,
      );
      addIfValue(
        "comission",
        values.comission ? parseFloat(values.comission) : null,
      );
      addIfValue(
        "stock_qty",
        values.stock_qty ? parseInt(values.stock_qty) : null,
      );
      addIfValue(
        "hold_qty",
        values.hold_qty ? parseInt(values.hold_qty) : null,
      );
      addIfValue(
        "low_stock_alert",
        values.low_stock_alert ? parseInt(values.low_stock_alert) : null,
      );
      addIfValue(
        "qty_fast_moving",
        values.qty_fast_moving ? parseInt(values.qty_fast_moving) : null,
      );
      addIfValue(
        "weight_kg",
        values.weight_kg ? parseFloat(values.weight_kg) : null,
      );
      addIfValue(
        "loyalty_points",
        values.loyalty_points ? parseInt(values.loyalty_points) : null,
      );
      addIfValue(
        "classification_id",
        values.classification_id ? parseInt(values.classification_id) : null,
      );

      // Add boolean fields
      addIfValue("pos_sell_price_dynamic", values.pos_sell_price_dynamic);
      addIfValue("track_inventory", values.track_inventory);
      addIfValue("published", values.published);
      addIfValue("pos_hidden", values.pos_hidden);
      addIfValue("tax_free_item", values.tax_free_item);
      addIfValue("has_variants", values.has_variants);

      // Add photo fields
      for (let i = 1; i <= 10; i++) {
        const photoKey = `photo_${i}` as keyof typeof values;
        addIfValue(photoKey, values[photoKey]);
      }

      if (mode === "edit" && product?.id) {
        console.log("Updating product with data:", productData);

        // Ensure image_url is included in the update
        const updateData = {
          ...productData,
          image_url: values.image_url || null,
          updated_at: new Date().toISOString(),
        };

        console.log("Final update data:", updateData);

        // First, update the product
        const { error: updateError } = await supabase
          .from("products")
          .update(updateData)
          .eq("id", product.id);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }

        // Then, fetch the updated product to verify changes
        const { data: updatedProduct, error: fetchError } = await supabase
          .from("products")
          .select("*")
          .eq("id", product.id)
          .single();

        if (fetchError) {
          console.error("Fetch error:", fetchError);
          throw fetchError;
        }

        console.log("Updated product:", updatedProduct);
        toast.success("Produk berhasil diperbarui");
      } else {
        const { error } = await supabase.from("products").insert([productData]);

        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }

      // Refresh the products list in the UI
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        mode === "edit"
          ? "Gagal memperbarui produk"
          : "Gagal menambahkan produk",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ScrollArea className="h-[600px] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="gap-2">
                <Package className="w-4 h-4" />
                <span>Informasi Dasar</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Harga</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2">
                <Box className="w-4 h-4" />
                <span>Inventori</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="gap-2">
                <Info className="w-4 h-4" />
                <span>Info Tambahan</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-6">
              <TabsContent value="basic">
                <BasicInfoTab form={form} product={product} />
              </TabsContent>

              <TabsContent value="pricing">
                <PricingTab form={form} />
              </TabsContent>

              <TabsContent value="inventory">
                <InventoryTab form={form} />
              </TabsContent>

              <TabsContent value="additional">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="weight_kg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Berat (kg)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.1"
                              placeholder="0.0"
                              {...field}
                            />
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
                            <Input
                              placeholder="Masukkan ID Kondisi"
                              {...field}
                            />
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
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </ScrollArea>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{mode === "edit" ? "Menyimpan..." : "Menambahkan..."}</span>
            </div>
          ) : mode === "edit" ? (
            "Simpan Perubahan"
          ) : (
            "Tambah Produk"
          )}
        </Button>
      </form>
    </Form>
  );
}
