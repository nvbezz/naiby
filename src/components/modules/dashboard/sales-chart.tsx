"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Receipt } from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface VentaSemana {
  dia: string
  total: number
  cantidad: number
}

interface SalesChartProps {
  data: VentaSemana[]
}

const chartConfig: ChartConfig = {
  total: {
    label: "Ingresos",
    color: "var(--primary)",
  },
}

function formatDia(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00")
  return date.toLocaleDateString("es-CO", { weekday: "short" })
}

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    notation: "compact",
  }).format(value)
}

export function SalesChart({ data }: SalesChartProps) {
  const chartData = data.map((item) => ({
    dia: formatDia(item.dia),
    total: Number(item.total),
  }))

  const isEmpty = data.length === 0 || data.every((d) => d.total === 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Ingresos últimos 7 días
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-48 flex-col items-center justify-center gap-2 text-muted-foreground">
            <Receipt className="h-8 w-8 opacity-30" />
            <p className="text-sm">Sin ventas esta semana</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis
                dataKey="dia"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={formatCOP}
                width={55}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="total"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
