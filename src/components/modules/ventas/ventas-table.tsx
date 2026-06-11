"use client"

import { Receipt } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn, formatCOP } from "@/lib/utils"
import type { VentaConDetalle, MetodoPago } from "@/types"

interface VentasTableProps {
  ventas: VentaConDetalle[]
}

const metodoPagoBadge: Record<MetodoPago, string> = {
  efectivo: "bg-primary/10 text-primary border-primary/20",
  transferencia: "bg-blue-50 text-blue-700 border-blue-200",
  debito: "bg-slate-100 text-slate-700 border-slate-200",
  credito: "bg-violet-50 text-violet-700 border-violet-200",
  fiado: "bg-orange-50 text-orange-700 border-orange-200",
}

const metodoPagoLabel: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  credito: "Crédito",
  fiado: "Fiado",
}

function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

function resumenItems(items: VentaConDetalle["venta_items"]) {
  return items
    .map((i) => `${i.productos?.nombre ?? "Producto"} x${i.cantidad}`)
    .join(", ")
}

export function VentasTable({ ventas }: VentasTableProps) {
  if (ventas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Receipt className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">No hay ventas este día</p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Las ventas registradas aparecerán aquí
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Hora</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="hidden sm:table-cell">Items</TableHead>
            <TableHead className="w-32">Método</TableHead>
            <TableHead className="w-28 text-right">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell className="text-sm text-muted-foreground tabular-nums">
                {formatHora(venta.created_at)}
              </TableCell>
              <TableCell className="font-medium">
                {venta.clientes?.nombre ?? (
                  <span className="text-muted-foreground">Sin cliente</span>
                )}
              </TableCell>
              <TableCell className="hidden max-w-xs sm:table-cell">
                <span className="line-clamp-1 text-sm text-muted-foreground">
                  {resumenItems(venta.venta_items)}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    metodoPagoBadge[venta.metodo_pago]
                  )}
                >
                  {metodoPagoLabel[venta.metodo_pago]}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">
                {formatCOP(venta.total)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
