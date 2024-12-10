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
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  name: z.string().min(1, "Nama produk harus diisi"),
  alternative_name: z.string().optional(),
  category: z.string().optional(),
  store_price: z.string().min(1, "Harga jual di toko harus diisi"),
  online_price_same: z.boolean().default(true),
  track_inventory: z.boolean().default(false),
  has_variants: z.boolean().default(false),
});

export function ProductForm() {
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
      track_inventory: false,
      has_variants: false,
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
          online_price: values.online_price_same ? parseFloat(values.store_price) : null,
          track_inventory: values.track_inventory,
          has_variants: values.has_variants,
          user_id: session.user.id,
        },
      ]);

      if (error) throw error;

      toast.success("Produk berhasil ditambahkan");
      navigate("/admin");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal menambahkan produk");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="online_price_same"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Harga jual online sama dengan harga jual toko
                </FormLabel>
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
          name="track_inventory"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Lacak Inventori
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Jika anda mengaktifkan lacak inventori, sistem akan mengecek ketersediaan stok barang sebelum menjual ke pembeli
                </p>
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
          name="has_variants"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  Variant
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Aktifkan jika produk memiliki varian misalnya variasi, warna atau ukuran
                </p>
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

        <Button type="submit" className="w-full">Tambah Produk</Button>
      </form>
    </Form>
  );
}