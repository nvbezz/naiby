"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { formatCOP } from "@/lib/utils"
import type { CartItem, MetodoPago } from "@/types"

const METODO_PAGO_LABEL: Record<MetodoPago, string> = {
  efectivo: "Efectivo",
  transferencia: "Transferencia",
  debito: "Débito",
  credito: "Crédito",
  fiado: "Fiado",
}

interface CheckoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cart: CartItem[]
  total: number
  metodoPago: MetodoPago
  clienteNombre?: string
  isLoading: boolean
  onConfirm: () => void
}

export function CheckoutDialog({
  open,
  onOpenChange,
  cart,
  total,
  metodoPago,
  clienteNombre,
  isLoading,
  onConfirm,
}: CheckoutDialogProps) {
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirmar venta</DialogTitle>
          <DialogDescription>
            {totalItems} producto{totalItems !== 1 ? "s" : ""} · {METODO_PAGO_LABEL[metodoPago]}
            {metodoPago === "fiado" && clienteNombre && ` · ${clienteNombre}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          {cart.map((item) => (
            <div key={item.producto_id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {item.nombre} × {item.cantidad}
              </span>
              <span className="font-medium">
                {formatCOP(item.precio_unitario * item.cantidad)}
              </span>
            </div>
          ))}
          <div className="border-t pt-2 flex items-center justify-between font-bold">
            <span>Total</span>
            <span className="text-primary text-lg">{formatCOP(total)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
