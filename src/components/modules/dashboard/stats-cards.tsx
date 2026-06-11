import { ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn, formatCOP } from "@/lib/utils"

interface DashboardStats {
  ventas_hoy: number
  ingresos_hoy: number
  ticket_promedio: number
  productos_stock_bajo: number
}

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Ventas hoy",
      value: stats.ventas_hoy.toString(),
      icon: ShoppingCart,
      description: "transacciones",
      alert: false,
    },
    {
      title: "Ingresos hoy",
      value: formatCOP(stats.ingresos_hoy),
      icon: DollarSign,
      description: "en ventas",
      alert: false,
    },
    {
      title: "Ticket promedio",
      value: formatCOP(stats.ticket_promedio),
      icon: TrendingUp,
      description: "por venta",
      alert: false,
    },
    {
      title: "Stock bajo",
      value: stats.productos_stock_bajo.toString(),
      icon: AlertTriangle,
      description: "productos",
      alert: stats.productos_stock_bajo > 0,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(({ title, value, icon: Icon, description, alert }) => (
        <Card key={title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon
              className={cn(
                "h-4 w-4",
                alert ? "text-destructive" : "text-muted-foreground"
              )}
            />
          </CardHeader>
          <CardContent>
            <p
              className={cn(
                "text-2xl font-bold",
                alert ? "text-destructive" : "text-foreground"
              )}
            >
              {value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
