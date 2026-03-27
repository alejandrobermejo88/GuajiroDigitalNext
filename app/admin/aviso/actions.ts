'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-admin'
import { TIPOS_AVISO, type TipoAviso } from '@/lib/aviso'

// ─── Action ───────────────────────────────────────────────────────────────────

export async function updateAvisoAction(formData: FormData) {
  const active = formData.get('active') === 'true'
  const texto  = (formData.get('texto')  as string ?? '').trim()
  const tipo   = (formData.get('tipo')   as string ?? 'informativo') as TipoAviso

  if (active && !texto) {
    throw new Error('El texto del aviso es obligatorio cuando el aviso está activo.')
  }

  if (!TIPOS_AVISO.includes(tipo)) {
    throw new Error('Tipo de aviso inválido.')
  }

  const sb = createAdminClient()
  const { error } = await sb
    .from('aviso_editorial')
    .upsert(
      {
        id:         'singleton',
        active,
        texto,
        tipo,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  if (error) throw new Error(error.message)

  // Revalida todas las rutas públicas que incluyen el banner
  revalidatePath('/', 'layout')

  redirect('/admin/aviso?ok=1')
}
