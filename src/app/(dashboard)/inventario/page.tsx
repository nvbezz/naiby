import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InventarioContainer } from "@/components/modules/inventario/inventario-container"

export default async function InventarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("owner_id", user.id)
    .single()

  if (!negocio) redirect("/onboarding")

  const { data: productos } = await supabase
    .from("productos")
    .select("*")
    .eq("negocio_id", negocio.id)
    .order("nombre")

  const lista = productos ?? []
  const activos = lista.filter((p) => p.activo).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Inventario</h1>
          <p className="text-sm text-muted-foreground">
            {activos} producto{activos !== 1 ? "s" : ""} activo{activos !== 1 ? "s" : ""}
            {lista.length > activos && ` · ${lista.length - activos} inactivo${lista.length - activos !== 1 ? "s" : ""}`}
          </p>
        </div>
      </div>
      <InventarioContainer productos={lista} negocioId={negocio.id} />
    </div>
  )
}
