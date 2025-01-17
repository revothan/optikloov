import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSession } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Package, DollarSign, Box, Info } from "lucide-react";
import * as z from "zod";

// UI Components
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/components/ui/alert";

// Custom Components
import { BasicInfoTab } from "./product-form/BasicInfoTab";
import { PricingTab } from "./product-form/PricingTab";
import { InventoryTab } from "./product-form/InventoryTab";

// Types and Utils
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

// Types
type ProductType = Tables<"products">;

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: ProductType;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

// Constants
const STORAGE_BUCKET = "products";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Base Schema
const baseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  alternative_name: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  uom: z.string().optional(),
  image_url: z.string().nullable().optional(),
  store_price: z.string().optional(),
  online_price: z.string().optional(),
  buy_price: z.string().optional(),
  market_price: z.string().optional(),
  sell_price: z.string().optional(),
  pos_sell_price: z.string().optional(),
  pos_sell_price_dynamic: z.boolean().default(false),
  comission: z.string().optional(),
  track_inventory: z.boolean().default(false),
  stock_qty: z.string().optional(),
  hold_qty: z.string().optional(),
  low_stock_alert: z.string().optional(),
  qty_fast_moving: z.string().optional(),
  weight_kg: z.string().optional(),
  loyalty_points: z.string().optional(),
  published: z.boolean().default(false),
  pos_hidden: z.boolean().default(false),
  tax_free_item: z.boolean().default(false),
  has_variants: z.boolean().default(false),
  variant_label: z.string().optional(),
  variant_names: z.string().optional(),
  alternative_variant_names: z.string().optional(),
  collections: z.string().optional(),
  condition_id: z.string().optional(),
  classification_id: z.string().optional(),
  notes: z.string().optional(),
  photo_1: z.string().nullable().optional(),
  photo_2: z.string().nullable().optional(),
  photo_3: z.string().nullable().optional(),
});

type FormData = z.infer<typeof baseSchema>;

export function ProductForm({
  mode = "create",
  product,
  onSuccess,
  onError,
}: ProductFormProps) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      name: product?.name || "",
      alternative_name: product?.alternative_name || "",
      description: product?.description || "",
      category: product?.category || "",
      brand: product?.brand || "",
      sku: product?.sku || "",
      barcode: product?.barcode || "",
      uom: product?.uom || "",
      image_url: product?.image_url || "",
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
      photo_1: product?.photo_1 || "",
      photo_2: product?.photo_2 || "",
      photo_3: product?.photo_3 || "",
    },
  });

  const handleImageUpload = async (file: File): Promise<string> => {
    const fileName = `${session?.user?.id}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (values: FormData) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const productData: Partial<ProductType> = {
        ...values,
        store_price: values.store_price ? parseFloat(values.store_price) : null,
        online_price: values.online_price ? parseFloat(values.online_price) : null,
        buy_price: values.buy_price ? parseFloat(values.buy_price) : null,
        market_price: values.market_price ? parseFloat(values.market_price) : null,
        sell_price: values.sell_price ? parseFloat(values.sell_price) : null,
        pos_sell_price: values.pos_sell_price ? parseFloat(values.pos_sell_price) : null,
        comission: values.comission ? parseFloat(values.comission) : null,
        stock_qty: values.stock_qty ? parseInt(values.stock_qty) : null,
        hold_qty: values.hold_qty ? parseInt(values.hold_qty) : null,
        low_stock_alert: values.low_stock_alert ? parseInt(values.low_stock_alert) : null,
        qty_fast_moving: values.qty_fast_moving ? parseInt(values.qty_fast_moving) : null,
        weight_kg: values.weight_kg ? parseFloat(values.weight_kg) : null,
        loyalty_points: values.loyalty_points ? parseInt(values.loyalty_points) : null,
        classification_id: values.classification_id ? parseInt(values.classification_id) : null,
        photo_1: values.photo_1 || null,
        photo_2: values.photo_2 || null,
        photo_3: values.photo_3 || null,
      };

      if (mode === "edit" && product?.id) {
        console.log("Updating product with data:", productData);
        const { error: updateError } = await supabase
          .from("products")
          .update({
            ...productData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (updateError) {
          console.error("Update error:", updateError);
          throw updateError;
        }
        toast.success("Product updated successfully");
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert({
            ...productData,
            name: values.name,
            user_id: session.user.id
          });

        if (insertError) throw insertError;
        toast.success("Product added successfully");
      }

      queryClient.invalidateQueries({ queryKey: ["products"] });
      onSuccess?.();
    } catch (err) {
      console.error("Form submission error:", err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      toast.error(mode === "edit" ? "Failed to update product" : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {error && (
          <Alert variant="destructive">
            <p>{error}</p>
          </Alert>
        )}

        <ScrollArea className="h-[600px] pr-4">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6">
              <TabsTrigger value="basic" className="gap-2">
                <Package className="w-4 h-4" />
                <span>Basic Info</span>
              </TabsTrigger>
              <TabsTrigger value="pricing" className="gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Pricing</span>
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2">
                <Box className="w-4 h-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger value="additional" className="gap-2">
                <Info className="w-4 h-4" />
                <span>Additional Info</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 space-y-6">
              <TabsContent value="basic">
                <BasicInfoTab form={form} />
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
                          <FormLabel>Weight (kg)</FormLabel>
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
                          <FormLabel>Loyalty Points</FormLabel>
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes"
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
              <span>{mode === "edit" ? "Saving..." : "Adding..."}</span>
            </div>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Add Product"
          )}
        </Button>
      </form>
    </Form>
  );
}
