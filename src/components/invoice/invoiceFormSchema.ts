
import * as z from "zod";

const eyeSchema = z.object({
  sph: z.number().nullable(),
  cyl: z.number().nullable(),
  axis: z.number().nullable(),
  add_power: z.number().nullable(),
  mpd: z.number().nullable(),
});

export const schema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  sale_date: z.string().min(1, "Sale date is required"),
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email().optional().or(z.literal("")),
  customer_birth_date: z.string().optional().nullable(),
  customer_phone: z.string().optional(),
  customer_address: z.string().optional(),
  payment_type: z.string().min(1, "Payment type is required"),
  down_payment: z.string().optional(),
  acknowledged_by: z.string().optional(),
  received_by: z.string().optional(),
  notes: z.string().optional(),
  branch: z.string().min(1, "Branch is required"),
  branch_prefix: z.string().min(1, "Branch prefix is required"),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product is required"),
        lens_stock_id: z.string().optional().nullable(),
        lens_type_id: z.string().optional().nullable(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative"),
        discount: z.number().min(0, "Discount cannot be negative").optional(),
        pv: z.number().nullable().optional(),
        v_frame: z.string().nullable().optional(),
        f_size: z.string().nullable().optional(),
        prism: z.number().nullable().optional(),
        dbl: z.number().nullable().optional(),
        left_eye: eyeSchema.nullable().optional(),
        right_eye: eyeSchema.nullable().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

export type FormData = z.infer<typeof schema>;
export type InvoiceFormValues = z.infer<typeof schema>;
