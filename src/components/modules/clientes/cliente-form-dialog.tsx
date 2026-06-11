"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { ClienteRow } from "@/types"

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  telefono: z.string().optional(),
})

type ClienteFormValues = z.infer<typeof schema>

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  negocioId: string
  cliente?: ClienteRow
  onSuccess?: () => void
}

export function ClienteFormDialog({
  open,
  onOpenChange,
  negocioId,
  cliente,
  onSuccess,
}: ClienteFormDialogProps) {
  const router = useRouter()
  const supabase = createClient()
  const [error, setError] = useState<string | null>(null)
  const esEdicion = !!cliente

  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", telefono: "" },
  })

  useEffect(() => {
    if (open) {
      form.reset({
        nombre: cliente?.nombre ?? "",
        telefono: cliente?.telefono ?? "",
      })
      setError(null)
    }
  }, [open, cliente])

  async function onSubmit(values: ClienteFormValues) {
    setError(null)
    const payload = {
      nombre: values.nombre,
      telefono: values.telefono || null,
    }

    const { error: supabaseError } = esEdicion
      ? await supabase.from("clientes").update(payload).eq("id", cliente!.id)
      : await supabase.from("clientes").insert({ ...payload, negocio_id: negocioId })

    if (supabaseError) {
      setError(supabaseError.message)
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
          <DialogTitle>{esEdicion ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono (opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej: 300 123 4567"
                      inputMode="tel"
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
                {form.formState.isSubmitting
                  ? "Guardando..."
                  : esEdicion
                  ? "Guardar cambios"
                  : "Crear cliente"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
