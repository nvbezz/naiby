"use client"

import { useEffect, useState } from "react"

export type ViewMode = "auto" | "desktop" | "mobile"

const STORAGE_KEY = "naiby-view-mode"
const MODES: ViewMode[] = ["auto", "desktop", "mobile"]

export function useViewMode() {
  const [mode, setModeState] = useState<ViewMode>("auto")

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ViewMode | null
    if (stored && MODES.includes(stored)) setModeState(stored)
  }, [])

  function setMode(next: ViewMode) {
    localStorage.setItem(STORAGE_KEY, next)
    setModeState(next)
  }

  function toggleMode() {
    const current = MODES.indexOf(mode)
    setMode(MODES[(current + 1) % MODES.length])
  }

  return { mode, setMode, toggleMode }
}
