import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductPriceInventory } from "./ProductPriceInventory";
import { Tables } from "@/integrations/supabase/types";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  alternative_name: z.string().optional(),
  category: z.string().optional(),
  store_price: z.string().min(1, "Harga jual di toko harus diisi"),
  online_price_same: z.boolean().default(true),
  online_price: z.string().optional(),
  track_inventory: z.boolean().default(false),
  initial_stock: z.string().optional(),
  image_url: z.string().optional(),
});

interface ProductFormProps {
  mode?: "create" | "edit";
  product?: Tables<"products">;
  onSuccess?: () => void;
}

export function ProductForm({ mode = "create", product, onSuccess }: ProductFormProps) {
  const session = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product?.name || "",
      alternative_name: product?.alternative_name || "",
      category: product?.category || "",
      store_price: product?.store_price?.toString() || "",
      online_price_same: product?.online_price === null || product?.online_price === product?.store_price,
      online_price: product?.online_price?.toString() || "",
      track_inventory: product?.track_inventory || false,
      initial_stock: "",
      image_url: product?.image_url || "",
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
        category: values.category || null,
        store_price: parseFloat(values.store_price),
        online_price: values.online_price_same 
          ? parseFloat(values.store_price) 
          : values.online_price 
            ? parseFloat(values.online_price) 
            : null,
        track_inventory: values.track_inventory,
        image_url: values.image_url || null,
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

      // Invalidate and refetch products after successful submission
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori Produk</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan Kategori Produk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <ProductPriceInventory form={form} />

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