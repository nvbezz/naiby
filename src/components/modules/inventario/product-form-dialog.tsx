"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import type { ProductoRow } from "@/types"

const productoSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  sku: z.string().optional(),
  categoria: z.string().optional(),
  stock: z.coerce.number().int().min(0, "Mínimo 0"),
  stock_minimo: z.coerce.number().int().min(0, "Mínimo 0"),
  precio_venta: z.coerce.number().min(0.01, "Debe ser mayor a 0"),
  precio_costo: z.coerce.number().min(0).optional(),
})

type ProductoFormValues = z.infer<typeof productoSchema>

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  negocioId: string
  producto?: ProductoRow
  onSuccess: () => void
}

export function ProductFormDialog({
  open,
  onOpenChange,
  negocioId,
  producto,
  onSuccess,
}: ProductFormDialogProps) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const esEdicion = !!producto

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema) as Resolver<ProductoFormValues>,
    defaultValues: {
      nombre: "",
      sku: "",
      categoria: "",
      stock: 0,
      stock_minimo: 5,
      precio_venta: 0,
      precio_costo: 0,
    },
  })

  useEffect(() => {
    if (open) {
      form.reset(
        producto
          ? {
              nombre: producto.nombre,
              sku: producto.sku ?? "",
              categoria: producto.categoria ?? "",
              stock: producto.stock,
              stock_minimo: producto.stock_minimo,
              precio_venta: producto.precio_venta,
              precio_costo: producto.precio_costo,
            }
          : {
              nombre: "",
              sku: "",
              categoria: "",
              stock: 0,
              stock_minimo: 5,
              precio_venta: 0,
              precio_costo: 0,
            }
      )
      setError(null)
    }
  }, [open, producto, form])

  async function onSubmit(values: ProductoFormValues) {
    setError(null)
    const supabase = createClient()

    const payload = {
      nombre: values.nombre,
      sku: values.sku || null,
      categoria: values.categoria || null,
      stock: values.stock,
      stock_minimo: values.stock_minimo,
      precio_venta: values.precio_venta,
      precio_costo: values.precio_costo ?? 0,
    }

    const { error } = esEdicion
      ? await supabase.from("productos").update(payload).eq("id", producto!.id)
      : await supabase.from("productos").insert({ ...payload, negocio_id: negocioId })

    if (error) {
      setError("No se pudo guardar el producto. Intenta de nuevo.")
      return
    }

    onOpenChange(false)
    onSuccess()
    router.refresh()
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{esEdicion ? "Editar producto" : "Nuevo producto"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Arroz 1kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU / Código</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 7702111" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Granos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock actual *</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="stock_minimo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock mínimo</FormLabel>
                    <FormControl>
                      <Input inputMode="numeric" placeholder="5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="precio_venta"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio venta *</FormLabel>
                    <FormControl>
                      <Input inputMode="decimal" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="precio_costo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio costo</FormLabel>
                    <FormControl>
                      <Input inputMode="decimal" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && <p className="text-sm font-medium text-destructive">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {esEdicion ? "Guardar cambios" : "Crear producto"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
