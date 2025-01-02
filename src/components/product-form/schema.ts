import * as z from "zod";

export const formSchema = z.object({
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