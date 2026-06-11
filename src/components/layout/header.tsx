"use client"

import { useRouter } from "next/navigation"
import { LogOut, Monitor, Smartphone, LayoutTemplate } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import type { ViewMode } from "@/hooks/use-view-mode"

const VIEW_MODE_ICON: Record<ViewMode, React.ElementType> = {
  auto: LayoutTemplate,
  desktop: Monitor,
  mobile: Smartphone,
}

const VIEW_MODE_LABEL: Record<ViewMode, string> = {
  auto: "Vista automática",
  desktop: "Vista escritorio",
  mobile: "Vista móvil",
}

interface HeaderProps {
  negocioNombre?: string
  viewMode?: ViewMode
  onToggleView?: () => void
}

export function Header({ negocioNombre, viewMode = "auto", onToggleView }: HeaderProps) {
  const router = useRouter()
  const ToggleIcon = VIEW_MODE_ICON[viewMode]

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-card px-4 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">
        {negocioNombre ?? "Naiby"}
      </span>
      <div className="flex items-center gap-1">
        {onToggleView && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={onToggleView}
            title={VIEW_MODE_LABEL[viewMode]}
          >
            <ToggleIcon className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}
