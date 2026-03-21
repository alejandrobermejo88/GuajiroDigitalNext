'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-admin'

const VALID_ESTADOS = ['pendiente', 'en_gestion', 'resuelta', 'archivada'] as const

export async function updateMuleEstado(id: string, estado: string) {
  if (!(VALID_ESTADOS as readonly string[]).includes(estado))
    throw new Error('Estado inválido')

  const sb = createAdminClient()
  const { error } = await sb
    .from('urgencias_mule')
    .update({ estado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/mule')
  revalidatePath(`/admin/mule/${id}`)
}

export async function deleteMuleCaseAction(formData: FormData) {
  const id = formData.get('id') as string
  if (!id) throw new Error('ID no proporcionado.')

  const sb = createAdminClient()
  const { error } = await sb.from('urgencias_mule').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/mule')
  redirect('/admin/mule')
}
