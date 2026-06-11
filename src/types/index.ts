export type * from './database'
import type { Database } from './database'

export type ProductoRow = Database['public']['Tables']['productos']['Row']

export interface CartItem {
  producto_id: string
  nombre: string
  precio_unitario: number
  cantidad: number
  stock_disponible: number
}

export type MetodoPago = 'efectivo' | 'transferencia' | 'debito' | 'credito' | 'fiado'
