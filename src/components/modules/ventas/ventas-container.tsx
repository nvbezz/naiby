"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TotalesMetodoPago } from "./totales-metodo-pago"
import { VentasTable } from "./ventas-table"
import type { VentaConDetalle } from "@/types"

interface VentasContainerProps {
  ventas: VentaConDetalle[]
  fecha: string
  negocioId: string
}

function formatFechaDisplay(fechaStr: string) {
  const [year, month, day] = fechaStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function offsetFecha(fechaStr: string, dias: number) {
  const [year, month, day] = fechaStr.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() + dias)
  return date.toISOString().split("T")[0]
}

function hoyISO() {
  return new Date().toISOString().split("T")[0]
}

export function VentasContainer({ ventas, fecha, negocioId: _negocioId }: VentasContainerProps) {
  const router = useRouter()
  const hoy = hoyISO()
  const esFuturo = fecha > hoy

  const totalDia = useMemo(
    () => ventas.reduce((sum, v) => sum + v.total, 0),
    [ventas]
  )

  function navegar(dias: number) {
    const nuevaFecha = offsetFecha(fecha, dias)
    if (nuevaFecha > hoy) return
    router.push(`/ventas?fecha=${nuevaFecha}`)
  }

  function irHoy() {
    router.push(`/ventas?fecha=${hoy}`)
  }

  return (
    <div className="space-y-4">
      {/* Navegación de fecha */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navegar(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navegar(1)}
            disabled={fecha >= hoy}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm font-medium capitalize text-foreground">
            {formatFechaDisplay(fecha)}
          </p>
          {ventas.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {ventas.length} venta{ventas.length !== 1 ? "s" : ""} · Total: {
                new Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalDia)
              }
            </p>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={irHoy}
          disabled={fecha === hoy}
          className="h-8 text-xs"
        >
          Hoy
        </Button>
      </div>

      {/* Totales por método de pago */}
      <TotalesMetodoPago ventas={ventas} />

      {/* Tabla de ventas */}
      <VentasTable ventas={ventas} />
    </div>
  )
}
