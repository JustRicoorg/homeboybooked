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
      availability: {
        Row: {
          available: boolean
          created_at: string
          date: string
          endtime: string
          id: number
          is_special_day: boolean
          slot_interval: number
          special_day_name: string | null
          starttime: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          date: string
          endtime: string
          id?: number
          is_special_day?: boolean
          slot_interval?: number
          special_day_name?: string | null
          starttime: string
        }
        Update: {
          available?: boolean
          created_at?: string
          date?: string
          endtime?: string
          id?: number
          is_special_day?: boolean
          slot_interval?: number
          special_day_name?: string | null
          starttime?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string
          service: string
          status: string
        }
        Insert: {
          booking_date: string
          booking_time: string
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone: string
          service: string
          status?: string
        }
        Update: {
          booking_date?: string
          booking_time?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string
          service?: string
          status?: string
        }
        Relationships: []
      }
      gallery: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
        }
        Relationships: []
      }
      "homeboy Booking client": {
        Row: {
          created_at: string | null
          date: string | null
          email: string
          id: number
          name: string
          notes: string | null
          phone: string
          service: string
          time: string
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          email: string
          id?: number
          name: string
          notes?: string | null
          phone: string
          service: string
          time: string
        }
        Update: {
          created_at?: string | null
          date?: string | null
          email?: string
          id?: number
          name?: string
          notes?: string | null
          phone?: string
          service?: string
          time?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          description: string
          id: number
          image_url: string
          name: string
          price: number
        }
        Insert: {
          category: string
          description: string
          id?: number
          image_url?: string
          name: string
          price: number
        }
        Update: {
          category?: string
          description?: string
          id?: number
          image_url?: string
          name?: string
          price?: number
        }
        Relationships: []
      }
      recurring_availability: {
        Row: {
          available: boolean
          created_at: string
          day_of_week: number
          end_time: string
          id: number
          start_time: string
        }
        Insert: {
          available?: boolean
          created_at?: string
          day_of_week: number
          end_time: string
          id?: number
          start_time: string
        }
        Update: {
          available?: boolean
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: number
          start_time?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          description: string
          id: number
          name: string
          price: number
        }
        Insert: {
          description: string
          id?: number
          name: string
          price: number
        }
        Update: {
          description?: string
          id?: number
          name?: string
          price?: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
