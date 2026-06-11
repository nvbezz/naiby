"use client"

import { Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn, formatCOP } from "@/lib/utils"

interface Producto {
  id: string
  nombre: string
  sku: string | null
  stock: number
  stock_minimo: number
  precio_venta: number
}

interface ProductCardProps {
  producto: Producto
  onAdd: (producto: Producto) => void
}

export function ProductCard({ producto, onAdd }: ProductCardProps) {
  const sinStock = producto.stock === 0
  const stockBajo = !sinStock && producto.stock <= producto.stock_minimo

  return (
    <button
      onClick={() => !sinStock && onAdd(producto)}
      disabled={sinStock}
      className={cn(
        "w-full rounded-lg border border-border bg-card p-3 text-left transition-colors",
        sinStock
          ? "cursor-not-allowed opacity-50"
          : "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
      )}
    >
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-md bg-muted">
        <Package className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="line-clamp-2 text-sm font-medium text-foreground leading-tight">
        {producto.nombre}
      </p>
      {producto.sku && (
        <p className="mt-0.5 font-mono text-xs text-muted-foreground">{producto.sku}</p>
      )}
      <p className="mt-2 text-sm font-bold text-primary">{formatCOP(producto.precio_venta)}</p>
      <div className="mt-1.5">
        {sinStock ? (
          <Badge variant="destructive" className="text-xs">Sin stock</Badge>
        ) : stockBajo ? (
          <Badge variant="outline" className="border-orange-300 text-orange-600 text-xs">
            Stock bajo: {producto.stock}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Stock: {producto.stock}</span>
        )}
      </div>
    </button>
  )
}
