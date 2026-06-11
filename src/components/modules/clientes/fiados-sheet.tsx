"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle2, Clock } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"
import { formatCOP } from "@/lib/utils"
import type { ClienteRow, FiadoRow } from "@/types"

interface FiadosSheetProps {
  cliente: ClienteRow | null
  negocioId: string
  onClose: () => void
}

export function FiadosSheet({ cliente, negocioId, onClose }: FiadosSheetProps) {
  const router = useRouter()
  const supabase = createClient()
  const [fiados, setFiados] = useState<FiadoRow[]>([])
  const [loading, setLoading] = useState(false)
  const [pagandoId, setPagandoId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!cliente) {
      setFiados([])
      return
    }
    cargarFiados()
  }, [cliente])

  async function cargarFiados() {
    if (!cliente) return
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await supabase
      .from("fiados")
      .select("*")
      .eq("cliente_id", cliente.id)
      .order("created_at", { ascending: false })

    if (fetchError) setError(fetchError.message)
    else setFiados(data ?? [])
    setLoading(false)
  }

  async function handlePagar(fiado: FiadoRow) {
    setPagandoId(fiado.id)
    setError(null)
    const { error: rpcError } = await supabase.rpc("pagar_fiado", {
      p_fiado_id: fiado.id,
      p_negocio_id: negocioId,
    })

    if (rpcError) {
      setError(rpcError.message)
      setPagandoId(null)
      return
    }

    router.refresh()
    await cargarFiados()
    setPagandoId(null)
  }

  const saldoPendiente = fiados
    .filter((f) => !f.pagado)
    .reduce((sum, f) => sum + f.monto, 0)

  return (
    <Sheet open={!!cliente} onOpenChange={(open: boolean) => { if (!open) onClose() }}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>{cliente?.nombre}</SheetTitle>
          <SheetDescription>
            {saldoPendiente > 0
              ? `Saldo pendiente: ${formatCOP(saldoPendiente)}`
              : "Sin deuda pendiente"}
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : fiados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="font-medium text-muted-foreground">Sin historial de fiados</p>
          </div>
        ) : (
          <div className="space-y-2">
            {error && (
              <p className="text-sm text-destructive mb-2">{error}</p>
            )}
            {fiados.map((fiado, i) => (
              <div key={fiado.id}>
                {i > 0 && <Separator className="my-2" />}
                <div className="flex items-center justify-between gap-3 py-1">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium tabular-nums">{formatCOP(fiado.monto)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(fiado.created_at).toLocaleDateString("es-CO", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {fiado.pagado ? (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20 text-xs"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Pagado
                      </Badge>
                    ) : (
                      <>
                        <Badge
                          variant="outline"
                          className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Pendiente
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          disabled={pagandoId === fiado.id}
                          onClick={() => handlePagar(fiado)}
                        >
                          {pagandoId === fiado.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Marcar pagado"
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
