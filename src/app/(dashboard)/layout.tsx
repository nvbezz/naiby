import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardShell } from '@/components/layout/dashboard-shell'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: negocio } = await supabase
    .from('negocios')
    .select('nombre')
    .eq('owner_id', user.id)
    .single()

  return (
    <DashboardShell negocioNombre={negocio?.nombre}>
      {children}
    </DashboardShell>
  )
}
