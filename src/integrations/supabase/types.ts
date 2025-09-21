export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      pattern_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          pattern_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          pattern_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          pattern_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_comments_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      pattern_votes: {
        Row: {
          created_at: string
          id: string
          pattern_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          pattern_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          pattern_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "pattern_votes_pattern_id_fkey"
            columns: ["pattern_id"]
            isOneToOne: false
            referencedRelation: "patterns"
            referencedColumns: ["id"]
          },
        ]
      }
      patterns: {
        Row: {
          admin_notes: string | null
          category: Database["public"]["Enums"]["subscription_category"]
          company_name: string | null
          created_at: string
          description: string
          downvotes: number | null
          id: string
          impact_score: number | null
          pattern_type: Database["public"]["Enums"]["pattern_type"]
          screenshot_url: string | null
          status: string | null
          title: string
          updated_at: string
          upvotes: number | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: Database["public"]["Enums"]["subscription_category"]
          company_name?: string | null
          created_at?: string
          description: string
          downvotes?: number | null
          id?: string
          impact_score?: number | null
          pattern_type: Database["public"]["Enums"]["pattern_type"]
          screenshot_url?: string | null
          status?: string | null
          title: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["subscription_category"]
          company_name?: string | null
          created_at?: string
          description?: string
          downvotes?: number | null
          id?: string
          impact_score?: number | null
          pattern_type?: Database["public"]["Enums"]["pattern_type"]
          screenshot_url?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_verified: boolean | null
          updated_at: string
          user_id: string
          username: string | null
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          user_id: string
          username?: string | null
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_verified?: boolean | null
          updated_at?: string
          user_id?: string
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          cancellation_date: string | null
          cancellation_difficulty: number | null
          company_name: string
          created_at: string
          id: string
          monthly_cost: number | null
          notes: string | null
          renewal_date: string | null
          service_name: string
          start_date: string
          status: Database["public"]["Enums"]["subscription_status"]
          subscription_type: Database["public"]["Enums"]["subscription_category"]
          updated_at: string
          user_id: string
        }
        Insert: {
          cancellation_date?: string | null
          cancellation_difficulty?: number | null
          company_name: string
          created_at?: string
          id?: string
          monthly_cost?: number | null
          notes?: string | null
          renewal_date?: string | null
          service_name: string
          start_date: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_type: Database["public"]["Enums"]["subscription_category"]
          updated_at?: string
          user_id: string
        }
        Update: {
          cancellation_date?: string | null
          cancellation_difficulty?: number | null
          company_name?: string
          created_at?: string
          id?: string
          monthly_cost?: number | null
          notes?: string | null
          renewal_date?: string | null
          service_name?: string
          start_date?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          subscription_type?: Database["public"]["Enums"]["subscription_category"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      protection_alerts: {
        Row: {
          alert_message: string
          created_at: string
          id: string
          is_active: boolean | null
          pattern_detected: Database["public"]["Enums"]["pattern_type"]
          protection_action: string | null
          severity: number | null
          user_id: string
          website_url: string
        }
        Insert: {
          alert_message: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          pattern_detected: Database["public"]["Enums"]["pattern_type"]
          protection_action?: string | null
          severity?: number | null
          user_id: string
          website_url: string
        }
        Update: {
          alert_message?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          pattern_detected?: Database["public"]["Enums"]["pattern_type"]
          protection_action?: string | null
          severity?: number | null
          user_id?: string
          website_url?: string
        }
        Relationships: []
      }
      cancellation_guides: {
        Row: {
          category: Database["public"]["Enums"]["subscription_category"]
          chat_support_url: string | null
          company_name: string
          created_at: string
          difficulty_level: number | null
          direct_cancellation_url: string | null
          email: string | null
          estimated_time: string | null
          id: string
          legal_rights: string | null
          phone_number: string | null
          service_name: string
          steps: Json
          tips: string[] | null
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["subscription_category"]
          chat_support_url?: string | null
          company_name: string
          created_at?: string
          difficulty_level?: number | null
          direct_cancellation_url?: string | null
          email?: string | null
          estimated_time?: string | null
          id?: string
          legal_rights?: string | null
          phone_number?: string | null
          service_name: string
          steps: Json
          tips?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["subscription_category"]
          chat_support_url?: string | null
          company_name?: string
          created_at?: string
          difficulty_level?: number | null
          direct_cancellation_url?: string | null
          email?: string | null
          estimated_time?: string | null
          id?: string
          legal_rights?: string | null
          phone_number?: string | null
          service_name?: string
          steps?: Json
          tips?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      user_protection_settings: {
        Row: {
          auto_cancel_detection: boolean | null
          browser_extension_enabled: boolean | null
          created_at: string
          email_alerts: boolean | null
          id: string
          real_time_protection: boolean | null
          report_automatically: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_cancel_detection?: boolean | null
          browser_extension_enabled?: boolean | null
          created_at?: string
          email_alerts?: boolean | null
          id?: string
          real_time_protection?: boolean | null
          report_automatically?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_cancel_detection?: boolean | null
          browser_extension_enabled?: boolean | null
          created_at?: string
          email_alerts?: boolean | null
          id?: string
          real_time_protection?: boolean | null
          report_automatically?: boolean | null
          updated_at?: string
          user_id?: string
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
      pattern_type: "dark_pattern" | "ethical_alternative" | "cancellation_trap" | "hidden_cost" | "misleading_language" | "forced_renewal"
      subscription_category:
        | "saas"
        | "streaming"
        | "news"
        | "fitness"
        | "education"
        | "ecommerce"
        | "fintech"
        | "gaming"
        | "other"
      protection_status: "active" | "warning" | "blocked" | "safe"
      subscription_status: "active" | "cancelled" | "disputed" | "refunded"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      pattern_type: ["dark_pattern", "ethical_alternative", "cancellation_trap", "hidden_cost", "misleading_language", "forced_renewal"],
      subscription_category: [
        "saas",
        "streaming",
        "news",
        "fitness",
        "education",
        "ecommerce",
        "fintech",
        "gaming",
        "other",
      ],
      protection_status: ["active", "warning", "blocked", "safe"],
      subscription_status: ["active", "cancelled", "disputed", "refunded"],
    },
  },
} as const
