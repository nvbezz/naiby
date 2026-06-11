"use client"

import { Package, Pencil, ToggleLeft, ToggleRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatCOP } from "@/lib/utils"
import type { ProductoRow } from "@/types"

interface ProductTableProps {
  productos: ProductoRow[]
  onEditar: (producto: ProductoRow) => void
  onToggleActivo: (producto: ProductoRow) => void
  onAgregar: () => void
}

function StockBadge({ stock, stockMinimo }: { stock: number; stockMinimo: number }) {
  if (stock === 0) return <Badge variant="destructive">Sin stock</Badge>
  if (stock <= stockMinimo) return (
    <Badge variant="outline" className="border-orange-300 text-orange-600">
      Bajo: {stock}
    </Badge>
  )
  return <span className="text-sm text-foreground">{stock}</span>
}

function calcularMargen(precioVenta: number, precioCosto: number): string {
  if (precioVenta <= 0 || precioCosto <= 0) return "—"
  return `${(((precioVenta - precioCosto) / precioVenta) * 100).toFixed(1)}%`
}

export function ProductTable({ productos, onEditar, onToggleActivo, onAgregar }: ProductTableProps) {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
        <Package className="h-10 w-10 opacity-30" />
        <p className="text-sm">No hay productos que coincidan</p>
        <Button variant="outline" size="sm" onClick={onAgregar}>
          Agregar primero
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">SKU</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Precio venta</TableHead>
            <TableHead className="hidden lg:table-cell">Precio costo</TableHead>
            <TableHead className="hidden lg:table-cell">Margen</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p) => (
            <TableRow key={p.id} className={!p.activo ? "opacity-50" : undefined}>
              <TableCell className="font-medium max-w-[160px] truncate">{p.nombre}</TableCell>
              <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">
                {p.sku ?? "—"}
              </TableCell>
              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {p.categoria ?? "—"}
              </TableCell>
              <TableCell>
                <StockBadge stock={p.stock} stockMinimo={p.stock_minimo} />
              </TableCell>
              <TableCell className="font-medium">{formatCOP(p.precio_venta)}</TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {p.precio_costo > 0 ? formatCOP(p.precio_costo) : "—"}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-muted-foreground">
                {calcularMargen(p.precio_venta, p.precio_costo)}
              </TableCell>
              <TableCell>
                {p.activo
                  ? <Badge variant="outline" className="border-green-300 text-green-700">Activo</Badge>
                  : <Badge variant="outline" className="text-muted-foreground">Inactivo</Badge>
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEditar(p)}
                    title="Editar"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => onToggleActivo(p)}
                    title={p.activo ? "Desactivar" : "Reactivar"}
                  >
                    {p.activo
                      ? <ToggleRight className="h-4 w-4 text-primary" />
                      : <ToggleLeft className="h-4 w-4" />
                    }
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
