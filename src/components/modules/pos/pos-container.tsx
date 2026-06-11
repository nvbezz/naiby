"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ProductCard } from "./product-card"
import { CartSidebar } from "./cart-sidebar"
import type { CartItem, MetodoPago } from "@/types"

interface Producto {
  id: string
  nombre: string
  sku: string | null
  stock: number
  stock_minimo: number
  precio_venta: number
}

interface Cliente {
  id: string
  nombre: string
}

interface PosContainerProps {
  productos: Producto[]
  clientes: Cliente[]
  negocioId: string
}

type CheckoutStatus = "idle" | "loading" | "success" | "error"

export function PosContainer({ productos, clientes, negocioId }: PosContainerProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [query, setQuery] = useState("")
  const [checkoutStatus, setCheckoutStatus] = useState<CheckoutStatus>("idle")
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return productos
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        (p.sku?.toLowerCase().includes(q) ?? false)
    )
  }, [productos, query])

  function handleAddProduct(producto: Producto) {
    setCart((prev) => {
      const existing = prev.find((i) => i.producto_id === producto.id)
      if (existing) {
        if (existing.cantidad >= producto.stock) return prev
        return prev.map((i) =>
          i.producto_id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
        )
      }
      return [
        ...prev,
        {
          producto_id: producto.id,
          nombre: producto.nombre,
          precio_unitario: producto.precio_venta,
          cantidad: 1,
          stock_disponible: producto.stock,
        },
      ]
    })
  }

  function handleUpdateQty(productoId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.producto_id === productoId ? { ...i, cantidad: i.cantidad + delta } : i
        )
        .filter((i) => i.cantidad > 0)
    )
  }

  function handleRemove(productoId: string) {
    setCart((prev) => prev.filter((i) => i.producto_id !== productoId))
  }

  async function handleCheckout(metodoPago: MetodoPago, clienteId: string | null) {
    setCheckoutStatus("loading")
    setCheckoutError(null)

    const supabase = createClient()
    const items = cart.map((item) => ({
      producto_id: item.producto_id,
      cantidad: item.cantidad,
      precio_unitario: item.precio_unitario,
    }))

    const { error } = await supabase.rpc("registrar_venta", {
      p_negocio_id: negocioId,
      p_cliente_id: clienteId ?? "",
      p_items: items,
      p_metodo_pago: metodoPago,
    })

    if (error) {
      setCheckoutStatus("error")
      setCheckoutError("Error al registrar la venta. Verifica el stock disponible.")
    } else {
      setCart([])
      setCheckoutStatus("success")
    }
  }

  function handleNuevaVenta() {
    setCheckoutStatus("idle")
    setCheckoutError(null)
    setQuery("")
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden rounded-lg border border-border bg-card">
      {/* Grilla de productos */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="border-b px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {productosFiltrados.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
              <p className="text-sm">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {productosFiltrados.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  onAdd={handleAddProduct}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Carrito lateral — oculto en mobile, visible en md+ */}
      <div className="hidden md:flex w-72 shrink-0 flex-col border-l">
        <CartSidebar
          cart={cart}
          negocioId={negocioId}
          clientes={clientes}
          isCheckoutLoading={checkoutStatus === "loading"}
          checkoutError={checkoutError}
          checkoutSuccess={checkoutStatus === "success"}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          onNuevaVenta={handleNuevaVenta}
          onClienteCreado={() => {}}
        />
      </div>

      {/* Barra sticky mobile */}
      <MobileCartBar
        cart={cart}
        negocioId={negocioId}
        clientes={clientes}
        isCheckoutLoading={checkoutStatus === "loading"}
        checkoutError={checkoutError}
        checkoutSuccess={checkoutStatus === "success"}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckout={handleCheckout}
        onNuevaVenta={handleNuevaVenta}
      />
    </div>
  )
}

function MobileCartBar({
  cart,
  negocioId,
  clientes,
  isCheckoutLoading,
  checkoutError,
  checkoutSuccess,
  onUpdateQty,
  onRemove,
  onCheckout,
  onNuevaVenta,
}: Omit<React.ComponentProps<typeof CartSidebar>, "onClienteCreado"> & {
  cart: CartItem[]
}) {
  const [expanded, setExpanded] = useState(false)
  const total = cart.reduce((sum, i) => sum + i.precio_unitario * i.cantidad, 0)
  const totalItems = cart.reduce((sum, i) => sum + i.cantidad, 0)

  if (cart.length === 0 && !checkoutSuccess) return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-20 md:hidden">
      {expanded ? (
        <div className="h-[70vh] bg-card border-t border-border shadow-xl flex flex-col">
          <button
            onClick={() => setExpanded(false)}
            className="py-2 text-xs text-center text-muted-foreground border-b w-full hover:bg-muted/30"
          >
            Cerrar carrito
          </button>
          <div className="flex-1 overflow-hidden">
            <CartSidebar
              cart={cart}
              negocioId={negocioId}
              clientes={clientes}
              isCheckoutLoading={isCheckoutLoading}
              checkoutError={checkoutError}
              checkoutSuccess={checkoutSuccess}
              onUpdateQty={onUpdateQty}
              onRemove={onRemove}
              onCheckout={onCheckout}
              onNuevaVenta={() => { setExpanded(false); onNuevaVenta() }}
              onClienteCreado={() => {}}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="w-full bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between text-sm font-medium shadow-lg"
        >
          <span>{totalItems} producto{totalItems !== 1 ? "s" : ""} en carrito</span>
          <span className="font-bold">{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(total)}</span>
        </button>
      )}
    </div>
  )
}
