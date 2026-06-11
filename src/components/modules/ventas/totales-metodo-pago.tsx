"use client"

import { cn, formatCOP } from "@/lib/utils"
import type { VentaConDetalle, MetodoPago } from "@/types"

interface TotalesMetodoPagoProps {
  ventas: VentaConDetalle[]
}

const metodoPagoLabel: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  credito: "Crédito",
  fiado: "Fiado",
}

const metodoPagoClasses: Record<MetodoPago, string> = {
  efectivo: "bg-primary/10 text-primary border-primary/20",
  transferencia: "bg-blue-50 text-blue-700 border-blue-200",
  debito: "bg-slate-100 text-slate-700 border-slate-200",
  credito: "bg-violet-50 text-violet-700 border-violet-200",
  fiado: "bg-orange-50 text-orange-700 border-orange-200",
}

export function TotalesMetodoPago({ ventas }: TotalesMetodoPagoProps) {
  const totales = ventas.reduce<Partial<Record<MetodoPago, number>>>((acc, v) => {
    acc[v.metodo_pago] = (acc[v.metodo_pago] ?? 0) + v.total
    return acc
  }, {})

  const entradas = Object.entries(totales) as [MetodoPago, number][]

  if (entradas.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {entradas.map(([metodo, total]) => (
        <div
          key={metodo}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium",
            metodoPagoClasses[metodo]
          )}
        >
          <span>{metodoPagoLabel[metodo]}</span>
          <span className="font-semibold tabular-nums">{formatCOP(total)}</span>
        </div>
      ))}
    </div>
  )
}
