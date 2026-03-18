'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-admin'
import { CATEGORIAS } from '@/lib/noticias'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function parseFormData(fd: FormData) {
  const titulo        = (fd.get('titulo')        as string ?? '').trim()
  const slug          = (fd.get('slug')          as string ?? '').trim()
  const resumen       = (fd.get('resumen')       as string ?? '').trim() || null
  const contenido     = (fd.get('contenido')     as string ?? '').trim() || null
  const categoria     = (fd.get('categoria')     as string ?? 'General')
  const imagen_url    = (fd.get('imagen_url')    as string ?? '').trim() || null
  const fuente_nombre = (fd.get('fuente_nombre') as string ?? '').trim() || null
  const fuente_url    = (fd.get('fuente_url')    as string ?? '').trim() || null
  const destacada     = fd.get('destacada')   === 'true'
  const ultima_hora   = fd.get('ultima_hora') === 'true'
  const ordenRaw      = (fd.get('orden_portada') as string ?? '').trim()
  const orden_portada = ordenRaw ? parseInt(ordenRaw, 10) : null
  const estado        = fd.get('estado') as 'borrador' | 'publicada'

  if (!titulo)   throw new Error('El título es obligatorio.')
  if (!slug)     throw new Error('El slug es obligatorio.')
  if (!CATEGORIAS.includes(categoria as never))
    throw new Error('Categoría inválida.')
  if (!['borrador', 'publicada'].includes(estado))
    throw new Error('Estado inválido.')

  return { titulo, slug, resumen, contenido, categoria, imagen_url,
           fuente_nombre, fuente_url, destacada, ultima_hora, orden_portada, estado }
}

function revalidateAll(slug?: string) {
  revalidatePath('/', 'page')
  revalidatePath('/admin/noticias', 'page')
  revalidatePath('/ultima-hora', 'page')
  revalidatePath('/seccion', 'layout')
  if (slug) revalidatePath(`/noticias/${slug}`, 'page')
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function createNoticiaAction(formData: FormData) {
  const data = parseFormData(formData)
  const sb = createAdminClient()

  const { error } = await sb.from('noticias').insert(data)
  if (error) throw new Error(error.message)

  revalidateAll(data.slug)
  redirect('/admin/noticias')
}

export async function updateNoticiaAction(id: string, formData: FormData) {
  const data = parseFormData(formData)
  const sb = createAdminClient()

  const { error } = await sb.from('noticias').update(data).eq('id', id)
  if (error) throw new Error(error.message)

  revalidateAll(data.slug)
  redirect('/admin/noticias')
}

export async function deleteNoticiaAction(id: string) {
  const sb = createAdminClient()

  const { data } = await sb
    .from('noticias')
    .select('slug')
    .eq('id', id)
    .single()

  const { error } = await sb.from('noticias').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidateAll(data?.slug)
  redirect('/admin/noticias')
}

export async function toggleEstadoAction(formData: FormData) {
  const id     = formData.get('id')     as string
  const estado = formData.get('estado') as 'borrador' | 'publicada'

  if (!['borrador', 'publicada'].includes(estado)) throw new Error('Estado inválido.')

  const sb = createAdminClient()
  const { data, error } = await sb
    .from('noticias')
    .update({ estado })
    .eq('id', id)
    .select('slug')
    .single()

  if (error) throw new Error(error.message)
  revalidateAll(data?.slug)
}
