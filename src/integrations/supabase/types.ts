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
        ]
      }
      products: {
        Row: {
          alternative_name: string | null
          alternative_variant_names: string | null
          barcode: string | null
          brand: string | null
          buy_price: number | null
          category: string | null
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
          brand?: string | null
          buy_price?: number | null
          category?: string | null
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
          brand?: string | null
          buy_price?: number | null
          category?: string | null
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
          created_at: string
          email: string | null
          id: string
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          role?: string | null
          updated_at?: string
        }
        Update: {
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
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
