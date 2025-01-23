import * as z from "zod";

const createSchema = z.object({
  // Required fields for new products
  name: z.string().min(1, "Nama produk harus diisi"),
  store_price: z.string().min(1, "Harga jual di toko harus diisi"),
  category: z.string().min(1, "Kategori harus diisi"),

  // Optional fields
  alternative_name: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  uom: z.string().optional(),
  online_price: z.string().optional(),
  buy_price: z.string().optional(),
  market_price: z.string().optional(),
  sell_price: z.string().optional(),
  pos_sell_price: z.string().optional(),
  pos_sell_price_dynamic: z.boolean().optional(),
  comission: z.string().optional(),
  track_inventory: z.boolean().default(false),
  stock_qty: z.string().optional(),
  hold_qty: z.string().optional(),
  low_stock_alert: z.string().optional(),
  qty_fast_moving: z.string().optional(),
  weight_kg: z.string().optional(),
  loyalty_points: z.string().optional(),
  published: z.boolean().optional(),
  pos_hidden: z.boolean().optional(),
  tax_free_item: z.boolean().optional(),
  has_variants: z.boolean().optional(),
  variant_label: z.string().optional(),
  variant_names: z.string().optional(),
  alternative_variant_names: z.string().optional(),
  collections: z.string().optional(),
  condition_id: z.string().optional(),
  classification_id: z.string().optional(),
  notes: z.string().optional(),
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

const editSchema = z.object({
  // All fields are optional for editing
  name: z.string().optional(),
  store_price: z.string().optional(),
  category: z.string().min(1, "Kategori harus diisi"),
  alternative_name: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  uom: z.string().optional(),
  online_price: z.string().optional(),
  buy_price: z.string().optional(),
  market_price: z.string().optional(),
  sell_price: z.string().optional(),
  pos_sell_price: z.string().optional(),
  pos_sell_price_dynamic: z.boolean().optional(),
  comission: z.string().optional(),
  track_inventory: z.boolean().default(false),
  stock_qty: z.string().optional(),
  hold_qty: z.string().optional(),
  low_stock_alert: z.string().optional(),
  qty_fast_moving: z.string().optional(),
  weight_kg: z.string().optional(),
  loyalty_points: z.string().optional(),
  published: z.boolean().optional(),
  pos_hidden: z.boolean().optional(),
  tax_free_item: z.boolean().optional(),
  has_variants: z.boolean().optional(),
  variant_label: z.string().optional(),
  variant_names: z.string().optional(),
  alternative_variant_names: z.string().optional(),
  collections: z.string().optional(),
  condition_id: z.string().optional(),
  classification_id: z.string().optional(),
  notes: z.string().optional(),
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

export { createSchema, editSchema };