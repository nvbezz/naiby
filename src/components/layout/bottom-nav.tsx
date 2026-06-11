"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, ShoppingCart, Package, Receipt, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/pos", label: "Venta", icon: ShoppingCart },
  { href: "/inventario", label: "Inventario", icon: Package },
  { href: "/ventas", label: "Ventas", icon: Receipt },
  { href: "/clientes", label: "Clientes", icon: Users },
]

interface BottomNavProps {
  className?: string
}

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 h-16 border-t bg-card",
        className
      )}
    >
      <div className="flex h-full items-stretch">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5 shrink-0", isActive && "stroke-[2.25]")} />
              <span className={cn("leading-none", isActive && "font-medium")}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
