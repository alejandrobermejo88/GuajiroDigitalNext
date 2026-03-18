'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase-admin'

export async function updateEstado(id: string, estado: string) {
  const VALID = ['nueva', 'revisada', 'publicada', 'archivada']
  if (!VALID.includes(estado)) throw new Error('Estado inválido')

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('denuncias')
    .update({ estado })
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/admin/denuncias')
}
