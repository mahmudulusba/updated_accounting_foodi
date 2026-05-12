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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          changed_at: string
          changed_by: string | null
          description: string | null
          id: string
          ip_address: string | null
          module: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_agent: string | null
        }
        Insert: {
          action: string
          changed_at?: string
          changed_by?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          module?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          changed_at?: string
          changed_by?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          module?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      gh_criteria: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      gh_service_criteria: {
        Row: {
          criteria_id: string
          id: string
          service_id: string
        }
        Insert: {
          criteria_id: string
          id?: string
          service_id: string
        }
        Update: {
          criteria_id?: string
          id?: string
          service_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gh_service_criteria_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "gh_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gh_service_criteria_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "gh_services"
            referencedColumns: ["id"]
          },
        ]
      }
      gh_services: {
        Row: {
          created_at: string
          description: string | null
          id: string
          service_code: string | null
          service_name: string
          status: string
          supplier_type: string
          unit_of_measurement: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          service_code?: string | null
          service_name: string
          status?: string
          supplier_type: string
          unit_of_measurement: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          service_code?: string | null
          service_name?: string
          status?: string
          supplier_type?: string
          unit_of_measurement?: string
          updated_at?: string
        }
        Relationships: []
      }
      gh_stations: {
        Row: {
          country: string
          created_at: string
          iata_code: string
          icao_code: string
          id: string
          name: string
          region: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          iata_code: string
          icao_code: string
          id?: string
          name: string
          region?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          iata_code?: string
          icao_code?: string
          id?: string
          name?: string
          region?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      gh_suppliers: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_name: string | null
          branch_name: string | null
          company_name: string
          contact_name: string | null
          country: string | null
          created_at: string
          designation: string | null
          email: string | null
          fax: string | null
          id: string
          phone: string | null
          remarks: string | null
          routing_number: string | null
          station_iata: string | null
          status: string
          supplier_type: string
          swift_code: string | null
          updated_at: string
          valid_from: string | null
          valid_till: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          company_name: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          phone?: string | null
          remarks?: string | null
          routing_number?: string | null
          station_iata?: string | null
          status?: string
          supplier_type?: string
          swift_code?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_till?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_name?: string | null
          branch_name?: string | null
          company_name?: string
          contact_name?: string | null
          country?: string | null
          created_at?: string
          designation?: string | null
          email?: string | null
          fax?: string | null
          id?: string
          phone?: string | null
          remarks?: string | null
          routing_number?: string | null
          station_iata?: string | null
          status?: string
          supplier_type?: string
          swift_code?: string | null
          updated_at?: string
          valid_from?: string | null
          valid_till?: string | null
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
    Enums: {},
  },
} as const
