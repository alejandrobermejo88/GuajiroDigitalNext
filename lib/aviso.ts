import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClient } from './supabase-admin'

// ─── Types ────────────────────────────────────────────────────────────────────

export const TIPOS_AVISO = ['informativo', 'mantenimiento', 'importante'] as const
export type TipoAviso = (typeof TIPOS_AVISO)[number]

export interface AvisoEditorial {
  id:         string
  active:     boolean
  texto:      string
  tipo:       TipoAviso
  updated_at: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SINGLETON_ID = 'singleton'

const DEFAULT_AVISO: AvisoEditorial = {
  id:         SINGLETON_ID,
  active:     false,
  texto:      '',
  tipo:       'informativo',
  updated_at: new Date(0).toISOString(),
}

// ─── Data access ─────────────────────────────────────────────────────────────

/**
 * Lee el aviso editorial desde Supabase.
 * Siempre devuelve un objeto válido (nunca lanza).
 * noStore() garantiza que el dato nunca quede cacheado:
 * cada render obtiene el valor actual de la base de datos.
 */
export async function getAvisoEditorial(): Promise<AvisoEditorial> {
  noStore()
  try {
    const sb = createAdminClient()
    const { data, error } = await sb
      .from('aviso_editorial')
      .select('*')
      .eq('id', SINGLETON_ID)
      .single()

    if (error || !data) return DEFAULT_AVISO
    return data as AvisoEditorial
  } catch {
    return DEFAULT_AVISO
  }
}
