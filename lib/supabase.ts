import { createClient } from '@supabase/supabase-js'

/**
 * Cliente público (anon key).
 * Solo puede ejecutar las operaciones permitidas por RLS.
 * Seguro para usar en Server Components y API routes de inserción.
 */
export function createAnonClient() {
  const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      'Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return createClient(url, key)
}
