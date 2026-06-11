"use client"

import { Users, Pencil, CreditCard } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn, formatCOP } from "@/lib/utils"
import type { ClienteRow } from "@/types"

interface ClientesTableProps {
  clientes: ClienteRow[]
  onEditar: (cliente: ClienteRow) => void
  onVerDeudas: (cliente: ClienteRow) => void
  onNuevo: () => void
}

export function ClientesTable({ clientes, onEditar, onVerDeudas, onNuevo }: ClientesTableProps) {
  if (clientes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Users className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="font-medium text-muted-foreground">No hay clientes registrados</p>
        <p className="mt-1 text-sm text-muted-foreground/60">
          Agrega un cliente para empezar a registrar fiados
        </p>
        <Button variant="outline" size="sm" className="mt-4" onClick={onNuevo}>
          Agregar primero
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
            <TableHead className="w-36 text-right">Saldo deuda</TableHead>
            <TableHead className="w-28" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.nombre}</TableCell>
              <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                {cliente.telefono ?? "—"}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                <span
                  className={cn(
                    "font-medium",
                    cliente.saldo_deuda > 0 ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  {formatCOP(cliente.saldo_deuda)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Ver deudas"
                    onClick={() => onVerDeudas(cliente)}
                  >
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Editar"
                    onClick={() => onEditar(cliente)}
                  >
                    <Pencil className="h-4 w-4" />
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
