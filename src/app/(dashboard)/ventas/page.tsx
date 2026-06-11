import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { VentasContainer } from "@/components/modules/ventas/ventas-container"
import type { VentaConDetalle } from "@/types"

interface VentasPageProps {
  searchParams: Promise<{ fecha?: string }>
}

export default async function VentasPage({ searchParams }: VentasPageProps) {
  const { fecha: fechaParam } = await searchParams
  const fecha = fechaParam ?? new Date().toISOString().split("T")[0]

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("owner_id", user.id)
    .single()

  if (!negocio) redirect("/onboarding")

  const [year, month, day] = fecha.split("-").map(Number)
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0)).toISOString()
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString()

  const { data: ventasData } = await supabase
    .from("ventas")
    .select(`
      id,
      total,
      metodo_pago,
      created_at,
      clientes(nombre),
      venta_items(cantidad, precio_unitario, productos(nombre))
    `)
    .eq("negocio_id", negocio.id)
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("created_at", { ascending: false })

  const ventas = (ventasData ?? []) as unknown as VentaConDetalle[]
  const totalDia = ventas.reduce((sum, v) => sum + v.total, 0)
  const totalVentas = ventas.length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Ventas</h1>
        <p className="text-sm text-muted-foreground">
          {totalVentas === 0
            ? "Sin ventas en este período"
            : `${totalVentas} venta${totalVentas !== 1 ? "s" : ""} · ${new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(totalDia)}`}
        </p>
      </div>
      <VentasContainer
        ventas={ventas}
        fecha={fecha}
        negocioId={negocio.id}
      />
    </div>
  )
}
