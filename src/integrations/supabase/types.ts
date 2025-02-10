export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          address: string | null
          birth_date: string | null
          city: string | null
          code: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          deposit: number | null
          email: string | null
          expired_date: string | null
          gender: string | null
          id: number
          is_active: boolean | null
          join_date: string | null
          loyalty_points: number | null
          membership_type: string | null
          name: string
          phone: string | null
          postal_code: string | null
          state: string | null
          subdistrict: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deposit?: number | null
          email?: string | null
          expired_date?: string | null
          gender?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          loyalty_points?: number | null
          membership_type?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          subdistrict?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          city?: string | null
          code?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deposit?: number | null
          email?: string | null
          expired_date?: string | null
          gender?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          loyalty_points?: number | null
          membership_type?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          subdistrict?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          branch: string | null
          created_at: string
          dbl: number | null
          discount: number
          f_size: string | null
          id: string
          invoice_id: string
          left_eye_add_power: number | null
          left_eye_axis: number | null
          left_eye_cyl: number | null
          left_eye_mpd: number | null
          left_eye_sph: number | null
          lens_stock_id: string | null
          price: number
          prism: number | null
          product_id: string
          pv: number | null
          quantity: number
          right_eye_add_power: number | null
          right_eye_axis: number | null
          right_eye_cyl: number | null
          right_eye_mpd: number | null
          right_eye_sph: number | null
          total: number
          updated_at: string
          v_frame: string | null
        }
        Insert: {
          branch?: string | null
          created_at?: string
          dbl?: number | null
          discount?: number
          f_size?: string | null
          id?: string
          invoice_id: string
          left_eye_add_power?: number | null
          left_eye_axis?: number | null
          left_eye_cyl?: number | null
          left_eye_mpd?: number | null
          left_eye_sph?: number | null
          lens_stock_id?: string | null
          price: number
          prism?: number | null
          product_id: string
          pv?: number | null
          quantity: number
          right_eye_add_power?: number | null
          right_eye_axis?: number | null
          right_eye_cyl?: number | null
          right_eye_mpd?: number | null
          right_eye_sph?: number | null
          total: number
          updated_at?: string
          v_frame?: string | null
        }
        Update: {
          branch?: string | null
          created_at?: string
          dbl?: number | null
          discount?: number
          f_size?: string | null
          id?: string
          invoice_id?: string
          left_eye_add_power?: number | null
          left_eye_axis?: number | null
          left_eye_cyl?: number | null
          left_eye_mpd?: number | null
          left_eye_sph?: number | null
          lens_stock_id?: string | null
          price?: number
          prism?: number | null
          product_id?: string
          pv?: number | null
          quantity?: number
          right_eye_add_power?: number | null
          right_eye_axis?: number | null
          right_eye_cyl?: number | null
          right_eye_mpd?: number | null
          right_eye_sph?: number | null
          total?: number
          updated_at?: string
          v_frame?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_lens_stock_id_fkey"
            columns: ["lens_stock_id"]
            isOneToOne: false
            referencedRelation: "lens_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          acknowledged_by: string | null
          branch: string
          branch_prefix: string | null
          created_at: string
          customer_address: string | null
          customer_birth_date: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount_amount: number
          down_payment: number | null
          grand_total: number
          id: string
          invoice_number: string
          last_payment_date: string | null
          notes: string | null
          paid_amount: number | null
          payment_type: string | null
          received_by: string | null
          remaining_balance: number | null
          sale_date: string
          status: string | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          acknowledged_by?: string | null
          branch?: string
          branch_prefix?: string | null
          created_at?: string
          customer_address?: string | null
          customer_birth_date?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          discount_amount?: number
          down_payment?: number | null
          grand_total?: number
          id?: string
          invoice_number: string
          last_payment_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_type?: string | null
          received_by?: string | null
          remaining_balance?: number | null
          sale_date: string
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          acknowledged_by?: string | null
          branch?: string
          branch_prefix?: string | null
          created_at?: string
          customer_address?: string | null
          customer_birth_date?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount_amount?: number
          down_payment?: number | null
          grand_total?: number
          id?: string
          invoice_number?: string
          last_payment_date?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_type?: string | null
          received_by?: string | null
          remaining_balance?: number | null
          sale_date?: string
          status?: string | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lens_stock: {
        Row: {
          created_at: string
          cyl: number
          id: string
          lens_type_id: string | null
          minimum_stock: number
          quantity: number
          reorder_point: number
          sph: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          cyl: number
          id?: string
          lens_type_id?: string | null
          minimum_stock?: number
          quantity?: number
          reorder_point?: number
          sph: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          cyl?: number
          id?: string
          lens_type_id?: string | null
          minimum_stock?: number
          quantity?: number
          reorder_point?: number
          sph?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lens_stock_lens_type_id_fkey"
            columns: ["lens_type_id"]
            isOneToOne: false
            referencedRelation: "lens_types"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_stock_movements: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          invoice_id: string | null
          lens_stock_id: string | null
          movement_type: string
          notes: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          lens_stock_id?: string | null
          movement_type: string
          notes?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          lens_stock_id?: string | null
          movement_type?: string
          notes?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "lens_stock_movements_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lens_stock_movements_lens_stock_id_fkey"
            columns: ["lens_stock_id"]
            isOneToOne: false
            referencedRelation: "lens_stock"
            referencedColumns: ["id"]
          },
        ]
      }
      lens_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          index: number
          material: string
          name: string
          price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          index: number
          material: string
          name: string
          price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          index?: number
          material?: string
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_types: {
        Row: {
          created_at: string
          id: string
          is_custom: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_custom?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_custom?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          branch: string | null
          id: string
          invoice_id: string | null
          is_down_payment: boolean | null
          payment_date: string | null
          payment_type: string
        }
        Insert: {
          amount: number
          branch?: string | null
          id?: string
          invoice_id?: string | null
          is_down_payment?: boolean | null
          payment_date?: string | null
          payment_type: string
        }
        Update: {
          amount?: number
          branch?: string | null
          id?: string
          invoice_id?: string | null
          is_down_payment?: boolean | null
          payment_date?: string | null
          payment_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          name: string
          price: number | null
          product_id: string | null
          stock: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          price?: number | null
          product_id?: string | null
          stock?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          price?: number | null
          product_id?: string | null
          stock?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          branch: string | null
          brand: string | null
          buy_price: number | null
          category: string
          classification_id: number | null
          collections: string | null
          comission: number | null
          condition_id: string | null
          created_at: string
          description: string | null
          has_variants: boolean | null
          hold_qty: number | null
          id: string
          image_url: string | null
          lens_cyl: number | null
          lens_sph: number | null
          lens_stock_id: string | null
          lens_type_id: string | null
          low_stock_alert: number | null
          loyalty_points: number | null
          market_price: number | null
          name: string
          notes: string | null
          online_price: number | null
          photo_1: string | null
          photo_10: string | null
          photo_2: string | null
          photo_3: string | null
          photo_4: string | null
          photo_5: string | null
          photo_6: string | null
          photo_7: string | null
          photo_8: string | null
          photo_9: string | null
          pos_hidden: boolean | null
          pos_sell_price: number | null
          pos_sell_price_dynamic: boolean | null
          published: boolean | null
          qty_fast_moving: number | null
          sell_price: number | null
          sku: string | null
          stock_qty: number | null
          store_price: number | null
          tax_free_item: boolean | null
          track_inventory: boolean | null
          uom: string | null
          updated_at: string
          user_id: string
          variant_label: string | null
          variant_names: string | null
          weight_kg: number | null
        }
        Insert: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          lens_cyl?: number | null
          lens_sph?: number | null
          lens_stock_id?: string | null
          lens_type_id?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Update: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          lens_cyl?: number | null
          lens_sph?: number | null
          lens_stock_id?: string | null
          lens_type_id?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name?: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id?: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_lens_stock_id_fkey"
            columns: ["lens_stock_id"]
            isOneToOne: false
            referencedRelation: "lens_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_lens_type_id_fkey"
            columns: ["lens_type_id"]
            isOneToOne: false
            referencedRelation: "lens_types"
            referencedColumns: ["id"]
          },
        ]
      }
      products_duplicate: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          branch: string | null
          brand: string | null
          buy_price: number | null
          category: string
          classification_id: number | null
          collections: string | null
          comission: number | null
          condition_id: string | null
          created_at: string
          description: string | null
          has_variants: boolean | null
          hold_qty: number | null
          id: string
          image_url: string | null
          low_stock_alert: number | null
          loyalty_points: number | null
          market_price: number | null
          name: string
          notes: string | null
          online_price: number | null
          photo_1: string | null
          photo_10: string | null
          photo_2: string | null
          photo_3: string | null
          photo_4: string | null
          photo_5: string | null
          photo_6: string | null
          photo_7: string | null
          photo_8: string | null
          photo_9: string | null
          pos_hidden: boolean | null
          pos_sell_price: number | null
          pos_sell_price_dynamic: boolean | null
          published: boolean | null
          qty_fast_moving: number | null
          sell_price: number | null
          sku: string | null
          stock_qty: number | null
          store_price: number | null
          tax_free_item: boolean | null
          track_inventory: boolean | null
          uom: string | null
          updated_at: string
          user_id: string
          variant_label: string | null
          variant_names: string | null
          weight_kg: number | null
        }
        Insert: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Update: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name?: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id?: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      products_import: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          branch: string | null
          brand: string | null
          buy_price: string | null
          category: string | null
          classification_id: number | null
          collections: string | null
          comission: string | null
          condition_id: string | null
          created_at: string | null
          description: string | null
          has_variants: boolean | null
          hold_qty: string | null
          image_url: string | null
          low_stock_alert: string | null
          loyalty_points: string | null
          market_price: number | null
          name: string | null
          notes: string | null
          online_price: number | null
          photo_1: string | null
          photo_10: string | null
          photo_2: string | null
          photo_3: string | null
          photo_4: string | null
          photo_5: string | null
          photo_6: string | null
          photo_7: string | null
          photo_8: string | null
          photo_9: string | null
          pos_hidden: string | null
          pos_sell_price: number | null
          pos_sell_price_dynamic: string | null
          published: string | null
          qty_fast_moving: string | null
          sell_price: number | null
          sku: string | null
          stock_qty: string | null
          store_price: number | null
          tax_free_item: string | null
          track_inventory: boolean | null
          uom: string | null
          user_id: string | null
          variant_label: string | null
          variant_names: string | null
          weight_kg: number | null
        }
        Insert: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: string | null
          category?: string | null
          classification_id?: number | null
          collections?: string | null
          comission?: string | null
          condition_id?: string | null
          created_at?: string | null
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: string | null
          image_url?: string | null
          low_stock_alert?: string | null
          loyalty_points?: string | null
          market_price?: number | null
          name?: string | null
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: string | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: string | null
          published?: string | null
          qty_fast_moving?: string | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: string | null
          store_price?: number | null
          tax_free_item?: string | null
          track_inventory?: boolean | null
          uom?: string | null
          user_id?: string | null
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Update: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: string | null
          category?: string | null
          classification_id?: number | null
          collections?: string | null
          comission?: string | null
          condition_id?: string | null
          created_at?: string | null
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: string | null
          image_url?: string | null
          low_stock_alert?: string | null
          loyalty_points?: string | null
          market_price?: number | null
          name?: string | null
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: string | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: string | null
          published?: string | null
          qty_fast_moving?: string | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: string | null
          store_price?: number | null
          tax_free_item?: string | null
          track_inventory?: boolean | null
          uom?: string | null
          user_id?: string | null
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      productss_duplicate: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          branch: string | null
          brand: string | null
          buy_price: number | null
          category: string
          classification_id: number | null
          collections: string | null
          comission: number | null
          condition_id: string | null
          created_at: string
          description: string | null
          has_variants: boolean | null
          hold_qty: number | null
          id: string
          image_url: string | null
          low_stock_alert: number | null
          loyalty_points: number | null
          market_price: number | null
          name: string
          notes: string | null
          online_price: number | null
          photo_1: string | null
          photo_10: string | null
          photo_2: string | null
          photo_3: string | null
          photo_4: string | null
          photo_5: string | null
          photo_6: string | null
          photo_7: string | null
          photo_8: string | null
          photo_9: string | null
          pos_hidden: boolean | null
          pos_sell_price: number | null
          pos_sell_price_dynamic: boolean | null
          published: boolean | null
          qty_fast_moving: number | null
          sell_price: number | null
          sku: string | null
          stock_qty: number | null
          store_price: number | null
          tax_free_item: boolean | null
          track_inventory: boolean | null
          uom: string | null
          updated_at: string
          user_id: string
          variant_label: string | null
          variant_names: string | null
          weight_kg: number | null
        }
        Insert: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Update: {
          alternative_name?: string | null
          alternative_variant_names?: string | null
          barcode?: string | null
          branch?: string | null
          brand?: string | null
          buy_price?: number | null
          category?: string
          classification_id?: number | null
          collections?: string | null
          comission?: number | null
          condition_id?: string | null
          created_at?: string
          description?: string | null
          has_variants?: boolean | null
          hold_qty?: number | null
          id?: string
          image_url?: string | null
          low_stock_alert?: number | null
          loyalty_points?: number | null
          market_price?: number | null
          name?: string
          notes?: string | null
          online_price?: number | null
          photo_1?: string | null
          photo_10?: string | null
          photo_2?: string | null
          photo_3?: string | null
          photo_4?: string | null
          photo_5?: string | null
          photo_6?: string | null
          photo_7?: string | null
          photo_8?: string | null
          photo_9?: string | null
          pos_hidden?: boolean | null
          pos_sell_price?: number | null
          pos_sell_price_dynamic?: boolean | null
          published?: boolean | null
          qty_fast_moving?: number | null
          sell_price?: number | null
          sku?: string | null
          stock_qty?: number | null
          store_price?: number | null
          tax_free_item?: boolean | null
          track_inventory?: boolean | null
          uom?: string | null
          updated_at?: string
          user_id?: string
          variant_label?: string | null
          variant_names?: string | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          branch?: string | null
          created_at?: string
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
          branch?: string | null
          created_at?: string
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      job_orders_view: {
        Row: {
          branch: string | null
          branch_prefix: string | null
          customer_name: string | null
          customer_phone: string | null
          discount: number | null
          invoice_id: string | null
          invoice_number: string | null
          item_id: string | null
          left_eye_cyl: number | null
          left_eye_mpd: number | null
          left_eye_sph: number | null
          notes: string | null
          price: number | null
          product_id: string | null
          quantity: number | null
          right_eye_cyl: number | null
          right_eye_mpd: number | null
          right_eye_sph: number | null
          sale_date: string | null
          total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "user_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_products: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          branch: string | null
          brand: string | null
          buy_price: number | null
          category: string | null
          classification_id: number | null
          collections: string | null
          comission: number | null
          condition_id: string | null
          created_at: string | null
          description: string | null
          has_variants: boolean | null
          hold_qty: number | null
          id: string | null
          image_url: string | null
          lens_cyl: number | null
          lens_sph: number | null
          lens_stock_id: string | null
          lens_type_id: string | null
          low_stock_alert: number | null
          loyalty_points: number | null
          market_price: number | null
          name: string | null
          notes: string | null
          online_price: number | null
          photo_1: string | null
          photo_10: string | null
          photo_2: string | null
          photo_3: string | null
          photo_4: string | null
          photo_5: string | null
          photo_6: string | null
          photo_7: string | null
          photo_8: string | null
          photo_9: string | null
          pos_hidden: boolean | null
          pos_sell_price: number | null
          pos_sell_price_dynamic: boolean | null
          published: boolean | null
          qty_fast_moving: number | null
          sell_price: number | null
          sku: string | null
          stock_qty: number | null
          store_price: number | null
          tax_free_item: boolean | null
          track_inventory: boolean | null
          uom: string | null
          updated_at: string | null
          user_id: string | null
          variant_label: string | null
          variant_names: string | null
          weight_kg: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_lens_stock_id_fkey"
            columns: ["lens_stock_id"]
            isOneToOne: false
            referencedRelation: "lens_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_lens_type_id_fkey"
            columns: ["lens_type_id"]
            isOneToOne: false
            referencedRelation: "lens_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_invoice_access: {
        Args: {
          invoice_id: string
        }
        Returns: boolean
      }
      check_user_branch_access: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      remove_duplicate_products: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_product_image: {
        Args: {
          p_product_id: string
          p_image_url: string
        }
        Returns: undefined
      }
      update_product_stock:
        | {
            Args: {
              p_product_id: string
              p_branch: string
              p_new_stock: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_product_id: string
              p_branch: string
              p_new_stock: number
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
