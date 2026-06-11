export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          nombre: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          nombre?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          nombre?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      negocios: {
        Row: {
          id: string
          owner_id: string
          nombre: string
          pais: string
          moneda: string
          tipo_negocio: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          nombre: string
          pais?: string
          moneda?: string
          tipo_negocio: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string
          pais?: string
          moneda?: string
          tipo_negocio?: string
          updated_at?: string
        }
        Relationships: []
      }
      productos: {
        Row: {
          id: string
          negocio_id: string
          nombre: string
          sku: string | null
          categoria: string | null
          stock: number
          stock_minimo: number
          precio_venta: number
          precio_costo: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          negocio_id: string
          nombre: string
          sku?: string | null
          categoria?: string | null
          stock?: number
          stock_minimo?: number
          precio_venta: number
          precio_costo?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string
          sku?: string | null
          categoria?: string | null
          stock?: number
          stock_minimo?: number
          precio_venta?: number
          precio_costo?: number
          activo?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ventas: {
        Row: {
          id: string
          negocio_id: string
          cliente_id: string | null
          metodo_pago: string
          total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          negocio_id: string
          cliente_id?: string | null
          metodo_pago: string
          total: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          metodo_pago?: string
          total?: number
          updated_at?: string
        }
        Relationships: []
      }
      venta_items: {
        Row: {
          id: string
          venta_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          created_at: string
        }
        Insert: {
          id?: string
          venta_id: string
          producto_id: string
          cantidad: number
          precio_unitario: number
          created_at?: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      clientes: {
        Row: {
          id: string
          negocio_id: string
          nombre: string
          telefono: string | null
          saldo_deuda: number
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          negocio_id: string
          nombre: string
          telefono?: string | null
          saldo_deuda?: number
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          nombre?: string
          telefono?: string | null
          saldo_deuda?: number
          activo?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      fiados: {
        Row: {
          id: string
          cliente_id: string
          negocio_id: string
          monto: number
          pagado: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          cliente_id: string
          negocio_id: string
          monto: number
          pagado?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          monto?: number
          pagado?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      gastos: {
        Row: {
          id: string
          negocio_id: string
          descripcion: string
          categoria: string | null
          monto: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          negocio_id: string
          descripcion: string
          categoria?: string | null
          monto: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          descripcion?: string
          categoria?: string | null
          monto?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      registrar_venta: {
        Args: {
          p_negocio_id: string
          p_cliente_id: string | null
          p_items: Json
          p_metodo_pago: string
        }
        Returns: string
      }
      get_dashboard_stats: {
        Args: { p_negocio_id: string }
        Returns: {
          ventas_hoy: number
          ingresos_hoy: number
          ticket_promedio: number
          productos_stock_bajo: number
        }[]
      }
      get_ventas_semana: {
        Args: { p_negocio_id: string }
        Returns: { dia: string; total: number; cantidad: number }[]
      }
    }
  }
}
