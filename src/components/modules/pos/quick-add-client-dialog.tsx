"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const schema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  telefono: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface QuickAddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  negocioId: string
  onCreated: (cliente: { id: string; nombre: string }) => void
}

export function QuickAddClientDialog({
  open,
  onOpenChange,
  negocioId,
  onCreated,
}: QuickAddClientDialogProps) {
  const [error, setError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", telefono: "" },
  })

  async function onSubmit(values: FormValues) {
    setError(null)
    const supabase = createClient()

    const { data, error } = await supabase
      .from("clientes")
      .insert({
        negocio_id: negocioId,
        nombre: values.nombre,
        telefono: values.telefono || null,
      })
      .select("id, nombre")
      .single()

    if (error || !data) {
      setError("No se pudo crear el cliente. Intenta de nuevo.")
      return
    }

    form.reset()
    onCreated(data)
    onOpenChange(false)
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Nuevo cliente</DialogTitle>
          <DialogDescription>Solo nombre y teléfono. Puedes completar el resto después.</DialogDescription>
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
                    <Input placeholder="Ej: Juan Pérez" {...field} />
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
                    <Input placeholder="Ej: 3001234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Crear cliente
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
