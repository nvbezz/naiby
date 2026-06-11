"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TIPOS_NEGOCIO = [
  { value: "minimercado", label: "Minimercado / Tienda" },
  { value: "tienda_ropa", label: "Tienda de ropa" },
  { value: "cafe", label: "Café / Restaurante" },
  { value: "taller", label: "Taller / Servicio" },
  { value: "peluqueria", label: "Peluquería / Estética" },
  { value: "otro", label: "Otro" },
] as const

const PAISES = [
  { value: "CO", label: "Colombia", moneda: "COP" },
  { value: "MX", label: "México", moneda: "MXN" },
  { value: "AR", label: "Argentina", moneda: "ARS" },
  { value: "PE", label: "Perú", moneda: "PEN" },
  { value: "CL", label: "Chile", moneda: "CLP" },
  { value: "EC", label: "Ecuador", moneda: "USD" },
  { value: "VE", label: "Venezuela", moneda: "USD" },
  { value: "otro", label: "Otro", moneda: "USD" },
]

const onboardingSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  pais: z.string().min(1, "Selecciona un país"),
  tipo_negocio: z.string().min(1, "Selecciona un tipo de negocio"),
})

type OnboardingValues = z.infer<typeof onboardingSchema>

export function OnboardingForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: { nombre: "", pais: "", tipo_negocio: "" },
  })

  async function onSubmit(values: OnboardingValues) {
    setError(null)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    const paisData = PAISES.find((p) => p.value === values.pais)
    const moneda = paisData?.moneda ?? "USD"

    const { error } = await supabase.from("negocios").insert({
      owner_id: user.id,
      nombre: values.nombre,
      pais: values.pais,
      moneda,
      tipo_negocio: values.tipo_negocio,
    })

    if (error) {
      setError("Error al crear el negocio. Intenta de nuevo.")
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-2 text-2xl font-bold text-primary">Naiby</div>
        <CardTitle className="text-xl">Configura tu negocio</CardTitle>
        <CardDescription>Cuéntanos sobre tu negocio para empezar</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del negocio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Tienda Don Carlos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu país" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAISES.map((pais) => (
                        <SelectItem key={pais.value} value={pais.value}>
                          {pais.label}
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
              name="tipo_negocio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de negocio</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Qué tipo de negocio tienes?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIPOS_NEGOCIO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Comenzar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
