"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProductTable } from "./product-table"
import { ProductFormDialog } from "./product-form-dialog"
import type { ProductoRow } from "@/types"

interface InventarioContainerProps {
  productos: ProductoRow[]
  negocioId: string
}

const TODAS = "__todas__"

export function InventarioContainer({ productos, negocioId }: InventarioContainerProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState(TODAS)
  const [formOpen, setFormOpen] = useState(false)
  const [productoEditando, setProductoEditando] = useState<ProductoRow | undefined>()
  const [confirmToggle, setConfirmToggle] = useState<ProductoRow | null>(null)
  const [toggleLoading, setToggleLoading] = useState(false)

  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria).filter(Boolean))] as string[],
    [productos]
  )

  const productosFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim()
    return productos.filter((p) => {
      const coincideTexto =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        (p.sku?.toLowerCase().includes(q) ?? false)
      const coincideCategoria =
        filtroCategoria === TODAS || p.categoria === filtroCategoria
      return coincideTexto && coincideCategoria
    })
  }, [productos, query, filtroCategoria])

  function handleEditar(producto: ProductoRow) {
    setProductoEditando(producto)
    setFormOpen(true)
  }

  function handleNuevo() {
    setProductoEditando(undefined)
    setFormOpen(true)
  }

  async function handleConfirmToggle() {
    if (!confirmToggle) return
    setToggleLoading(true)
    const supabase = createClient()
    await supabase
      .from("productos")
      .update({ activo: !confirmToggle.activo })
      .eq("id", confirmToggle.id)
    setToggleLoading(false)
    setConfirmToggle(null)
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o código..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          {categorias.length > 0 && (
            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TODAS}>Todas</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <Button size="sm" onClick={handleNuevo} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo producto
        </Button>
      </div>

      {/* Tabla */}
      <div className="rounded-lg border border-border bg-card">
        <ProductTable
          productos={productosFiltrados}
          onEditar={handleEditar}
          onToggleActivo={setConfirmToggle}
          onAgregar={handleNuevo}
        />
      </div>

      {/* Dialog crear/editar */}
      <ProductFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setProductoEditando(undefined)
        }}
        negocioId={negocioId}
        producto={productoEditando}
        onSuccess={() => router.refresh()}
      />

      {/* Dialog confirmar desactivar/reactivar */}
      <Dialog open={!!confirmToggle} onOpenChange={(open) => !open && setConfirmToggle(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {confirmToggle?.activo ? "Desactivar producto" : "Reactivar producto"}
            </DialogTitle>
            <DialogDescription>
              {confirmToggle?.activo
                ? `"${confirmToggle?.nombre}" dejará de aparecer en el POS y no podrá venderse.`
                : `"${confirmToggle?.nombre}" volverá a estar disponible en el POS.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setConfirmToggle(null)} disabled={toggleLoading}>
              Cancelar
            </Button>
            <Button
              variant={confirmToggle?.activo ? "destructive" : "default"}
              onClick={handleConfirmToggle}
              disabled={toggleLoading}
            >
              {confirmToggle?.activo ? "Desactivar" : "Reactivar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
