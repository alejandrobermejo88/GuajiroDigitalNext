import { createClient } from '@supabase/supabase-js'

/**
 * Cliente de servicio (service_role key).
 * Bypasses Row Level Security → acceso total de lectura/escritura.
 * NUNCA exponer esta key al cliente/browser.
 * Usar solo en Server Components, Server Actions y API routes privadas.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}
