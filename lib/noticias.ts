import { createAnonClient } from './supabase'
import { createAdminClient } from './supabase-admin'

// ─── Types ────────────────────────────────────────────────────────────────────

export type EstadoNoticia = 'borrador' | 'publicada'

export interface Noticia {
  id: string
  created_at: string
  updated_at: string
  titulo: string
  slug: string
  resumen: string | null
  contenido: string | null
  categoria: string
  imagen_url: string | null
  fuente_nombre: string | null
  fuente_url: string | null
  estado: EstadoNoticia
  destacada: boolean
  orden_portada: number | null
  ultima_hora: boolean
}

export const CATEGORIAS = [
  'Apagones',
  'Represión',
  'Economía',
  'Protesta',
  'Régimen',
  'Oposición',
  'Denuncias',
  'Transición',
  'General',
] as const

export type Categoria = (typeof CATEGORIAS)[number]

// ─── URL slug ↔ DB categoria mapping ─────────────────────────────────────────

export const CAT_SLUG: Record<string, string> = {
  'Apagones':  'apagones',
  'Represión': 'represion',
  'Economía':  'economia',
  'Protesta':  'protesta',
  'Régimen':   'regimen',
  'Oposición': 'oposicion',
  'Denuncias': 'denuncias',
  'Transición':'transicion',
  'General':   'general',
}

export const SLUG_CAT: Record<string, string> = Object.fromEntries(
  Object.entries(CAT_SLUG).map(([cat, slug]) => [slug, cat])
)

// ─── Public reads (anon key, RLS: solo publicadas) ────────────────────────────

export async function getPublishedNoticias(): Promise<Noticia[]> {
  const sb = createAnonClient()
  const { data, error } = await sb
    .from('noticias')
    .select('*')
    .eq('estado', 'publicada')
    .order('destacada', { ascending: false })
    .order('orden_portada', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Noticia[]
}

export async function getPublishedNoticiaBySlug(slug: string): Promise<Noticia | null> {
  const sb = createAnonClient()
  const { data, error } = await sb
    .from('noticias')
    .select('*')
    .eq('slug', slug)
    .eq('estado', 'publicada')
    .single()

  if (error) return null
  return data as Noticia
}

export async function getNoticiasByCategoria(
  categoria: string,
  limit = 30
): Promise<Noticia[]> {
  const sb = createAnonClient()
  const { data, error } = await sb
    .from('noticias')
    .select('*')
    .eq('estado', 'publicada')
    .eq('categoria', categoria)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as Noticia[]
}

export async function getUltimaHoraNoticias(limit = 16): Promise<Noticia[]> {
  const sb = createAnonClient()
  const { data, error } = await sb
    .from('noticias')
    .select('*')
    .eq('estado', 'publicada')
    .eq('ultima_hora', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw new Error(error.message)
  return (data ?? []) as Noticia[]
}

export async function getRelatedNoticias(
  categoria: string,
  excludeSlug: string,
  limit = 3
): Promise<Noticia[]> {
  const sb = createAnonClient()
  const { data } = await sb
    .from('noticias')
    .select('id, titulo, slug, resumen, categoria, created_at, fuente_nombre, ultima_hora')
    .eq('estado', 'publicada')
    .eq('categoria', categoria)
    .neq('slug', excludeSlug)
    .order('created_at', { ascending: false })
    .limit(limit)

  return (data ?? []) as Noticia[]
}

// ─── Admin reads (service_role, bypasses RLS) ─────────────────────────────────

export async function adminGetAllNoticias(): Promise<Noticia[]> {
  const sb = createAdminClient()
  const { data, error } = await sb
    .from('noticias')
    .select('id, titulo, slug, categoria, estado, destacada, orden_portada, ultima_hora, updated_at, created_at')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Noticia[]
}

export async function adminGetNoticiaById(id: string): Promise<Noticia | null> {
  const sb = createAdminClient()
  const { data, error } = await sb
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return data as Noticia
}
