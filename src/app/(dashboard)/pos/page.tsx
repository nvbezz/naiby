import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PosContainer } from "@/components/modules/pos/pos-container"

export default async function PosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: negocio } = await supabase
    .from("negocios")
    .select("id, nombre")
    .eq("owner_id", user.id)
    .single()

  if (!negocio) redirect("/onboarding")

  const [productosRes, clientesRes] = await Promise.all([
    supabase
      .from("productos")
      .select("id, nombre, sku, stock, stock_minimo, precio_venta")
      .eq("negocio_id", negocio.id)
      .eq("activo", true)
      .order("nombre"),
    supabase
      .from("clientes")
      .select("id, nombre")
      .eq("negocio_id", negocio.id)
      .eq("activo", true)
      .order("nombre"),
  ])

  const productos = productosRes.data ?? []
  const clientes = clientesRes.data ?? []

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Punto de venta</h1>
        <p className="text-sm text-muted-foreground">
          {productos.length} producto{productos.length !== 1 ? "s" : ""} disponible{productos.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <PosContainer productos={productos} clientes={clientes} negocioId={negocio.id} />
      </div>
    </div>
  )
}
