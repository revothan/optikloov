import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  onSuccess?: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const session = useSession();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      alternative_name: "",
      category: "",
      store_price: "",
      online_price_same: true,
      online_price: "",
      track_inventory: false,
      initial_stock: "",
      image_url: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session?.user?.id) {
      toast.error("Anda harus login terlebih dahulu");
      return;
    }

    try {
      const { data, error } = await supabase.from("products").insert([
        {
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
        },
      ]);

      if (error) throw error;

      toast.success("Produk berhasil ditambahkan");
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan produk");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProductImageUpload 
          onImageUrlChange={(url) => form.setValue("image_url", url)} 
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

        <Button type="submit" className="w-full">Tambah Produk</Button>
      </form>
    </Form>
  );
}
