import Link from "next/link"
import { ShoppingCart, Package, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const ACTIONS = [
  {
    href: "/pos",
    label: "Nueva venta",
    description: "Registrar una venta",
    icon: ShoppingCart,
  },
  {
    href: "/inventario",
    label: "Agregar producto",
    description: "Actualizar inventario",
    icon: Package,
  },
  {
    href: "/clientes",
    label: "Ver deudas",
    description: "Gestionar fiados",
    icon: Users,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-muted-foreground mb-3">Accesos rápidos</p>
        <div className="space-y-2">
          {ACTIONS.map(({ href, label, description, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-muted/50 hover:border-primary/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
