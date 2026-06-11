import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { WelcomeHeader } from "@/components/modules/dashboard/welcome-header"
import { StatsCards } from "@/components/modules/dashboard/stats-cards"
import { SalesChart } from "@/components/modules/dashboard/sales-chart"
import { QuickActions } from "@/components/modules/dashboard/quick-actions"
import { RecentSalesTable } from "@/components/modules/dashboard/recent-sales-table"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("owner_id", user.id)
    .single()

  if (!negocio) redirect("/onboarding")

  const hoy = new Date().toISOString().split("T")[0]

  const [statsRes, ventasSemanaRes, ventasHoyRes] = await Promise.all([
    supabase.rpc("get_dashboard_stats", { p_negocio_id: negocio.id }),
    supabase.rpc("get_ventas_semana", { p_negocio_id: negocio.id }),
    supabase
      .from("ventas")
      .select("id, total, metodo_pago, created_at, clientes(nombre)")
      .eq("negocio_id", negocio.id)
      .gte("created_at", hoy)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  const stats = statsRes.data?.[0] ?? {
    ventas_hoy: 0,
    ingresos_hoy: 0,
    ticket_promedio: 0,
    productos_stock_bajo: 0,
  }

  const ventasSemana = ventasSemanaRes.data ?? []
  const ventasHoy = (ventasHoyRes.data ?? []) as {
    id: string
    total: number
    metodo_pago: string
    created_at: string
    clientes: { nombre: string } | null
  }[]

  const nombreUsuario =
    (user.user_metadata?.nombre_completo as string | undefined) ?? "Usuario"

  return (
    <div className="space-y-6">
      <WelcomeHeader nombre={nombreUsuario} negocio={negocio.nombre} />
      <StatsCards stats={stats} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SalesChart data={ventasSemana} />
        <QuickActions />
      </div>
      <RecentSalesTable ventas={ventasHoy} />
    </div>
  )
}
