import { Receipt } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Venta {
  id: string
  total: number
  metodo_pago: string
  created_at: string
  clientes: { nombre: string } | null
}

interface RecentSalesTableProps {
  ventas: Venta[]
}

const METODO_BADGE: Record<string, string> = {
  efectivo: "default",
  transferencia: "secondary",
  debito: "outline",
  credito: "outline",
  fiado: "destructive",
}

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatHora(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function RecentSalesTable({ ventas }: RecentSalesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Ventas de hoy
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ventas.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
            <Receipt className="h-8 w-8 opacity-30" />
            <p className="text-sm">Sin ventas hoy</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ventas.map((venta) => (
                <TableRow key={venta.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatHora(venta.created_at)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {venta.clientes?.nombre ?? "Consumidor final"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={(METODO_BADGE[venta.metodo_pago] ?? "secondary") as "default" | "secondary" | "outline" | "destructive"}>
                      {venta.metodo_pago}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCOP(venta.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
