import * as z from "zod";

const CATEGORIES = ["Frame", "Lensa", "Soft Lens", "Sunglasses", "Others"] as const;

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
  branch: z.string().default("Gading Serpong"), // Add branch field to schema
});

type FormData = z.infer<typeof baseSchema>;

export { baseSchema };