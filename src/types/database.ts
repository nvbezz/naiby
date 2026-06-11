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
      clientes: {
        Row: {
          created_at: string
          id: string
          negocio_id: string
          nombre: string
          saldo_deuda: number
          telefono: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          negocio_id: string
          nombre: string
          saldo_deuda?: number
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          negocio_id?: string
          nombre?: string
          saldo_deuda?: number
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      fiados: {
        Row: {
          cliente_id: string
          created_at: string
          id: string
          monto: number
          negocio_id: string
          pagado: boolean
          updated_at: string
        }
        Insert: {
          cliente_id: string
          created_at?: string
          id?: string
          monto: number
          negocio_id: string
          pagado?: boolean
          updated_at?: string
        }
        Update: {
          cliente_id?: string
          created_at?: string
          id?: string
          monto?: number
          negocio_id?: string
          pagado?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fiados_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fiados_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos: {
        Row: {
          categoria: string | null
          created_at: string
          descripcion: string
          id: string
          monto: number
          negocio_id: string
          updated_at: string
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          descripcion: string
          id?: string
          monto: number
          negocio_id: string
          updated_at?: string
        }
        Update: {
          categoria?: string | null
          created_at?: string
          descripcion?: string
          id?: string
          monto?: number
          negocio_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gastos_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      negocios: {
        Row: {
          created_at: string
          id: string
          moneda: string
          nombre: string
          owner_id: string
          pais: string
          tipo_negocio: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          moneda?: string
          nombre: string
          owner_id: string
          pais?: string
          tipo_negocio: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          moneda?: string
          nombre?: string
          owner_id?: string
          pais?: string
          tipo_negocio?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "negocios_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          activo: boolean
          categoria: string | null
          created_at: string
          id: string
          negocio_id: string
          nombre: string
          precio_costo: number
          precio_venta: number
          sku: string | null
          stock: number
          stock_minimo: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          negocio_id: string
          nombre: string
          precio_costo?: number
          precio_venta: number
          sku?: string | null
          stock?: number
          stock_minimo?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string | null
          created_at?: string
          id?: string
          negocio_id?: string
          nombre?: string
          precio_costo?: number
          precio_venta?: number
          sku?: string | null
          stock?: number
          stock_minimo?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          nombre: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          nombre?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          nombre?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      venta_items: {
        Row: {
          cantidad: number
          created_at: string
          id: string
          precio_unitario: number
          producto_id: string
          venta_id: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          id?: string
          precio_unitario: number
          producto_id: string
          venta_id: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          id?: string
          precio_unitario?: number
          producto_id?: string
          venta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "venta_items_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venta_items_venta_id_fkey"
            columns: ["venta_id"]
            isOneToOne: false
            referencedRelation: "ventas"
            referencedColumns: ["id"]
          },
        ]
      }
      ventas: {
        Row: {
          cliente_id: string | null
          created_at: string
          id: string
          metodo_pago: string
          negocio_id: string
          total: number
          updated_at: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          metodo_pago?: string
          negocio_id: string
          total: number
          updated_at?: string
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          metodo_pago?: string
          negocio_id?: string
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ventas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ventas_negocio_id_fkey"
            columns: ["negocio_id"]
            isOneToOne: false
            referencedRelation: "negocios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: { p_negocio_id: string }
        Returns: {
          ingresos_hoy: number
          productos_stock_bajo: number
          ticket_promedio: number
          ventas_hoy: number
        }[]
      }
      get_ventas_semana: {
        Args: { p_negocio_id: string }
        Returns: {
          cantidad: number
          dia: string
          total: number
        }[]
      }
      pagar_fiado: {
        Args: { p_fiado_id: string; p_negocio_id: string }
        Returns: undefined
      }
      registrar_fiado_manual: {
        Args: { p_cliente_id: string; p_monto: number; p_negocio_id: string }
        Returns: string
      }
      registrar_venta: {
        Args: {
          p_cliente_id: string
          p_items: Json
          p_metodo_pago: string
          p_negocio_id: string
        }
        Returns: string
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
