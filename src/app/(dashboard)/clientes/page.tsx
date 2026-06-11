import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClientesContainer } from "@/components/modules/clientes/clientes-container"

export default async function ClientesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("owner_id", user.id)
    .single()

  if (!negocio) redirect("/onboarding")

  const { data: clientesData } = await supabase
    .from("clientes")
    .select("*")
    .eq("negocio_id", negocio.id)
    .order("saldo_deuda", { ascending: false })
    .order("nombre", { ascending: true })

  const clientes = clientesData ?? []
  const conDeuda = clientes.filter((c) => c.saldo_deuda > 0).length

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">
          {clientes.length === 0
            ? "Sin clientes registrados"
            : `${clientes.length} cliente${clientes.length !== 1 ? "s" : ""}${conDeuda > 0 ? ` · ${conDeuda} con deuda pendiente` : ""}`}
        </p>
      </div>
      <ClientesContainer clientes={clientes} negocioId={negocio.id} />
    </div>
  )
}
