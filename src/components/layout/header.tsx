"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  negocioNombre?: string
}

export function Header({ negocioNombre }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-card px-6 py-3 flex items-center justify-between">
      <span className="text-sm font-semibold text-foreground">
        {negocioNombre ?? "Naiby"}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        className="text-muted-foreground hover:text-foreground"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Cerrar sesión
      </Button>
    </header>
  )
}
