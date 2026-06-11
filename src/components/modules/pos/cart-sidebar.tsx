"use client"

import { useState } from "react"
import { Minus, Plus, Trash2, UserPlus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CheckoutDialog } from "./checkout-dialog"
import { QuickAddClientDialog } from "./quick-add-client-dialog"
import { formatCOP } from "@/lib/utils"
import type { CartItem, MetodoPago } from "@/types"

interface Cliente {
  id: string
  nombre: string
}

interface CartSidebarProps {
  cart: CartItem[]
  negocioId: string
  clientes: Cliente[]
  isCheckoutLoading: boolean
  checkoutError: string | null
  checkoutSuccess: boolean
  onUpdateQty: (productoId: string, delta: number) => void
  onRemove: (productoId: string) => void
  onCheckout: (metodoPago: MetodoPago, clienteId: string | null) => void
  onNuevaVenta: () => void
  onClienteCreado: (cliente: Cliente) => void
}

const METODOS_PAGO: { value: MetodoPago; label: string }[] = [
  { value: "efectivo", label: "Efectivo" },
  { value: "transferencia", label: "Transferencia" },
  { value: "debito", label: "Débito" },
  { value: "credito", label: "Crédito" },
  { value: "fiado", label: "Fiado" },
]

export function CartSidebar({
  cart,
  negocioId,
  clientes: clientesIniciales,
  isCheckoutLoading,
  checkoutError,
  checkoutSuccess,
  onUpdateQty,
  onRemove,
  onCheckout,
  onNuevaVenta,
  onClienteCreado,
}: CartSidebarProps) {
  const [metodoPago, setMetodoPago] = useState<MetodoPago>("efectivo")
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addClientOpen, setAddClientOpen] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales)

  const total = cart.reduce((sum, item) => sum + item.precio_unitario * item.cantidad, 0)
  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0)
  const clienteNombre = clientes.find((c) => c.id === clienteId)?.nombre

  const puedeConfirmar =
    cart.length > 0 &&
    (metodoPago !== "fiado" || clienteId !== null)

  function handleClienteCreado(cliente: Cliente) {
    setClientes((prev) => [...prev, cliente])
    setClienteId(cliente.id)
    onClienteCreado(cliente)
  }

  if (checkoutSuccess) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <ShoppingCart className="h-7 w-7 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">¡Venta registrada!</p>
          <p className="text-sm text-muted-foreground mt-1">El stock fue actualizado automáticamente.</p>
        </div>
        <Button onClick={onNuevaVenta} className="w-full">Nueva venta</Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="px-4 py-3 border-b">
          <p className="text-sm font-semibold text-foreground">
            Carrito {totalItems > 0 && <span className="text-primary">({totalItems})</span>}
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center text-muted-foreground">
            <ShoppingCart className="h-8 w-8 opacity-30" />
            <p className="text-sm">Toca un producto para agregarlo</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4 py-2">
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.producto_id} className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.nombre}</p>
                      <p className="text-xs text-muted-foreground">{formatCOP(item.precio_unitario)}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => onUpdateQty(item.producto_id, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.cantidad}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={item.cantidad >= item.stock_disponible}
                        onClick={() => onUpdateQty(item.producto_id, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => onRemove(item.producto_id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t px-4 py-3 space-y-3">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Total</span>
                <span className="text-primary text-base">{formatCOP(total)}</span>
              </div>

              <Separator />

              <div className="space-y-2">
                <Select
                  value={metodoPago}
                  onValueChange={(v) => {
                    setMetodoPago(v as MetodoPago)
                    if (v !== "fiado") setClienteId(null)
                  }}
                >
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {METODOS_PAGO.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {metodoPago === "fiado" && (
                  <div className="flex gap-2">
                    <Select value={clienteId ?? ""} onValueChange={(v) => setClienteId(v || null)}>
                      <SelectTrigger className="h-9 text-sm flex-1">
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {clientes.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 shrink-0"
                      onClick={() => setAddClientOpen(true)}
                      title="Crear cliente rápido"
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {checkoutError && (
                <p className="text-xs font-medium text-destructive">{checkoutError}</p>
              )}

              <Button
                className="w-full"
                disabled={!puedeConfirmar || isCheckoutLoading}
                onClick={() => setDialogOpen(true)}
              >
                Confirmar venta
              </Button>
            </div>
          </>
        )}
      </div>

      <CheckoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        cart={cart}
        total={total}
        metodoPago={metodoPago}
        clienteNombre={clienteNombre}
        isLoading={isCheckoutLoading}
        onConfirm={() => {
          setDialogOpen(false)
          onCheckout(metodoPago, clienteId)
        }}
      />

      <QuickAddClientDialog
        open={addClientOpen}
        onOpenChange={setAddClientOpen}
        negocioId={negocioId}
        onCreated={handleClienteCreado}
      />
    </>
  )
}
