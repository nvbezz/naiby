"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { BottomNav } from "./bottom-nav"
import { useViewMode } from "@/hooks/use-view-mode"
import { cn } from "@/lib/utils"

interface DashboardShellProps {
  negocioNombre?: string
  children: React.ReactNode
}

export function DashboardShell({ negocioNombre, children }: DashboardShellProps) {
  const { mode, toggleMode } = useViewMode()

  const sidebarClass =
    mode === "desktop" ? "flex" : mode === "mobile" ? "hidden" : "hidden md:flex"

  const bottomNavClass =
    mode === "mobile" ? "flex" : mode === "desktop" ? "hidden" : "flex md:hidden"

  const mainPadding =
    mode === "desktop" ? "p-4 md:p-6" : mode === "mobile" ? "p-4 pb-20" : "p-4 pb-20 md:p-6 md:pb-6"

  return (
    <div className="flex h-screen">
      <Sidebar className={sidebarClass} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          negocioNombre={negocioNombre}
          viewMode={mode}
          onToggleView={toggleMode}
        />
        <main className={cn("flex-1 overflow-y-auto", mainPadding)}>
          {children}
        </main>
      </div>
      <BottomNav className={bottomNavClass} />
    </div>
  )
}
