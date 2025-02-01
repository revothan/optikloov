import * as z from "zod";

export const eyeSchema = z.object({
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
  customer_email: z.string().email().optional().nullable(),
  customer_birth_date: z.string().nullable(),
  customer_phone: z.string().optional(),
  customer_address: z.string().optional(),
  payment_type: z.string().min(1, "Payment type is required"),
  down_payment: z.string().optional(),
  acknowledged_by: z.string().optional(),
  received_by: z.string().optional(),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0, "Price cannot be negative"),
        discount: z.number().min(0, "Discount cannot be negative").optional(),
        sh: z.number().nullable(),
        v_frame: z.string().nullable(),
        f_size: z.string().nullable(),
        prism: z.number().nullable(),
        left_eye: eyeSchema.nullable(),
        right_eye: eyeSchema.nullable(),
      })
    )
    .min(1, "At least one item is required"),
});

export type FormData = z.infer<typeof schema>;