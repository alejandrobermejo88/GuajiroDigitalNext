import { getAvisoEditorial } from '@/lib/aviso'

// ─── Label por tipo de aviso ──────────────────────────────────────────────────

const TIPO_LABEL: Record<string, string> = {
  informativo:   'Aviso editorial',
  mantenimiento: 'Aviso de mantenimiento',
  importante:    'Comunicado editorial',
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Banner de aviso editorial institucional.
 * Server Component — se renderiza en el servidor, sin JS en el cliente.
 * Devuelve null si el aviso está desactivado o sin texto.
 */
export default async function AvisoEditorialBanner() {
  const aviso = await getAvisoEditorial()

  if (!aviso.active || !aviso.texto.trim()) return null

  const label = TIPO_LABEL[aviso.tipo] ?? 'Aviso editorial'

  return (
    <div
      className="aviso-editorial-banner"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div
        className="mx-auto flex items-baseline flex-wrap"
        style={{ maxWidth: 1140, padding: '0 2rem', gap: '0.625rem' }}
      >
        <span className="aviso-label">{label}</span>
        <span className="aviso-sep" aria-hidden="true">—</span>
        <span className="aviso-text">{aviso.texto}</span>
      </div>
    </div>
  )
}
