"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { ClienteRow } from "@/types"

const schema = z.object({
  cliente_id: z.string().min(1, "Selecciona un cliente"),
  monto: z.coerce
    .number()
    .positive("El monto debe ser mayor a 0"),
})

type FiadoFormValues = z.infer<typeof schema>

interface FiadoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  negocioId: string
  clientes: ClienteRow[]
  clientePreseleccionado?: string
  onSuccess?: () => void
}

export function FiadoFormDialog({
  open,
  onOpenChange,
  negocioId,
  clientes,
  clientePreseleccionado,
  onSuccess,
}: FiadoFormDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FiadoFormValues>({
    resolver: zodResolver(schema) as Resolver<FiadoFormValues>,
    defaultValues: { cliente_id: "", monto: 0 },
  })

  useEffect(() => {
    if (open) {
      form.reset({ cliente_id: clientePreseleccionado ?? "", monto: 0 })
      setError(null)
    }
  }, [open, clientePreseleccionado])

  async function onSubmit(values: FiadoFormValues) {
    setError(null)
    const { error: rpcError } = await supabase.rpc("registrar_fiado_manual", {
      p_negocio_id: negocioId,
      p_cliente_id: values.cliente_id,
      p_monto: values.monto,
    })

    if (rpcError) {
      setError(rpcError.message)
      return
    }

    router.refresh()
    onOpenChange(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar fiado</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cliente_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="monto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Registrando..." : "Registrar fiado"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
