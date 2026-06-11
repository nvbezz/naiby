"use client"

import { useMemo, useState } from "react"
import { Search, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ClientesTable } from "./clientes-table"
import { ClienteFormDialog } from "./cliente-form-dialog"
import { FiadoFormDialog } from "./fiado-form-dialog"
import { FiadosSheet } from "./fiados-sheet"
import type { ClienteRow } from "@/types"

interface ClientesContainerProps {
  clientes: ClienteRow[]
  negocioId: string
}

export function ClientesContainer({ clientes, negocioId }: ClientesContainerProps) {
  const [query, setQuery] = useState("")
  const [formClienteOpen, setFormClienteOpen] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<ClienteRow | null>(null)
  const [clienteDeudas, setClienteDeudas] = useState<ClienteRow | null>(null)
  const [fiadoFormOpen, setFiadoFormOpen] = useState(false)

  const clientesFiltrados = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return clientes
    return clientes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(q) ||
        (c.telefono ?? "").toLowerCase().includes(q)
    )
  }, [clientes, query])

  function handleNuevo() {
    setClienteEditando(null)
    setFormClienteOpen(true)
  }

  function handleEditar(cliente: ClienteRow) {
    setClienteEditando(cliente)
    setFormClienteOpen(true)
  }

  function handleVerDeudas(cliente: ClienteRow) {
    setClienteDeudas(cliente)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o teléfono..."
            className="pl-8"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setFiadoFormOpen(true)}>
          Registrar fiado
        </Button>
        <Button size="sm" onClick={handleNuevo}>
          <Plus className="mr-1.5 h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      <ClientesTable
        clientes={clientesFiltrados}
        onEditar={handleEditar}
        onVerDeudas={handleVerDeudas}
        onNuevo={handleNuevo}
      />

      <ClienteFormDialog
        open={formClienteOpen}
        onOpenChange={setFormClienteOpen}
        negocioId={negocioId}
        cliente={clienteEditando ?? undefined}
      />

      <FiadoFormDialog
        open={fiadoFormOpen}
        onOpenChange={setFiadoFormOpen}
        negocioId={negocioId}
        clientes={clientes}
      />

      <FiadosSheet
        cliente={clienteDeudas}
        negocioId={negocioId}
        onClose={() => setClienteDeudas(null)}
      />
    </div>
  )
}
