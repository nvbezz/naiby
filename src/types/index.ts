export type * from './database'
import type { Database } from './database'

export type ProductoRow = Database['public']['Tables']['productos']['Row']
export type ClienteRow = Database['public']['Tables']['clientes']['Row']
export type FiadoRow = Database['public']['Tables']['fiados']['Row']

export interface CartItem {
  producto_id: string
  nombre: string
  precio_unitario: number
  cantidad: number
  stock_disponible: number
}

export type MetodoPago = 'efectivo' | 'transferencia' | 'debito' | 'credito' | 'fiado'

export interface VentaItem {
  cantidad: number
  precio_unitario: number
  productos: { nombre: string } | null
}

export interface VentaConDetalle {
  id: string
  total: number
  metodo_pago: MetodoPago
  created_at: string
  clientes: { nombre: string } | null
  venta_items: VentaItem[]
}
