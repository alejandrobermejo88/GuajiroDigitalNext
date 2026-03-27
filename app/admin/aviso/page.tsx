import AdminTopBar from '@/components/AdminTopBar'
import { getAvisoEditorial, TIPOS_AVISO } from '@/lib/aviso'
import { updateAvisoAction } from './actions'

export const dynamic = 'force-dynamic'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  const d = new Date(iso)
  if (d.getFullYear() < 2000) return 'Sin actualizaciones previas'
  return d.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const TIPO_LABEL: Record<string, string> = {
  informativo:   'Informativo',
  mantenimiento: 'Mantenimiento',
  importante:    'Importante',
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminAvisoPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>
}) {
  const sp    = await searchParams
  const saved = sp.ok === '1'
  const aviso = await getAvisoEditorial()

  const inputSx: React.CSSProperties = {
    width:       '100%',
    fontFamily:  'Inter, system-ui, sans-serif',
    fontSize:    '0.9375rem',
    padding:     '0.625rem 0.875rem',
    border:      '1px solid #E0D9CC',
    background:  '#FEFCF8',
    color:       '#151515',
    outline:     'none',
  }

  const labelSx: React.CSSProperties = {
    display:       'block',
    fontFamily:    'Inter, system-ui, sans-serif',
    fontSize:      '0.6875rem',
    fontWeight:    600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color:         '#767676',
    marginBottom:  '0.375rem',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="aviso" />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* ── Page header ── */}
        <div
          style={{
            borderTop:      '2.5px solid #151515',
            borderBottom:   '1px solid #E0D9CC',
            paddingTop:     '0.4rem',
            paddingBottom:  '0.4rem',
            marginBottom:   '2rem',
            display:        'flex',
            alignItems:     'baseline',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontFamily:    'Newsreader, Georgia, serif',
              fontSize:      '1.625rem',
              fontWeight:    400,
              color:         '#151515',
              letterSpacing: '-0.015em',
            }}
          >
            Aviso editorial
          </h1>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize:   '0.75rem',
              color:      '#767676',
            }}
          >
            Aviso institucional visible en el sitio público
          </span>
        </div>

        {/* ── Success message ── */}
        {saved && (
          <div
            style={{
              background:   '#EDF9F0',
              border:       '1px solid #1F6B3A',
              padding:      '0.875rem 1.25rem',
              marginBottom: '2rem',
              display:      'flex',
              alignItems:   'center',
              gap:          '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize:   '0.875rem',
                color:      '#1F6B3A',
              }}
            >
              {aviso.active
                ? 'Aviso activado. Ya es visible en el sitio público.'
                : 'Aviso desactivado. No se muestra en el sitio.'}
            </span>
          </div>
        )}

        <div
          style={{
            display:             'grid',
            gridTemplateColumns: '1fr 340px',
            gap:                 '2rem',
            alignItems:          'start',
          }}
        >

          {/* ── Form ── */}
          <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '2rem' }}>
            <form action={updateAvisoAction}>

              {/* Activar / desactivar */}
              <div style={{ marginBottom: '1.75rem' }}>
                <label
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        '0.625rem',
                    cursor:     'pointer',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    name="active"
                    value="true"
                    defaultChecked={aviso.active}
                    style={{ accentColor: '#6B1F1F', width: 15, height: 15, cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize:   '0.9375rem',
                      fontWeight: 500,
                      color:      '#151515',
                    }}
                  >
                    Aviso activo — visible en el sitio público
                  </span>
                </label>
              </div>

              {/* Tipo */}
              <div style={{ marginBottom: '1.75rem' }}>
                <span style={labelSx}>Tipo de aviso</span>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  {TIPOS_AVISO.map((t) => (
                    <label
                      key={t}
                      style={{
                        display:    'flex',
                        alignItems: 'center',
                        gap:        '0.375rem',
                        cursor:     'pointer',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize:   '0.875rem',
                        color:      '#383838',
                        userSelect: 'none',
                      }}
                    >
                      <input
                        type="radio"
                        name="tipo"
                        value={t}
                        defaultChecked={aviso.tipo === t}
                        style={{ accentColor: '#6B1F1F', width: 13, height: 13, cursor: 'pointer' }}
                      />
                      {TIPO_LABEL[t]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Texto del aviso */}
              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="aviso-texto" style={labelSx}>
                  Texto del aviso
                </label>
                <textarea
                  id="aviso-texto"
                  name="texto"
                  rows={5}
                  defaultValue={aviso.texto}
                  placeholder="Escriba el aviso tal como desea que aparezca en el sitio. Ejemplo: El diario se encuentra en proceso de actualización editorial. Disculpen las molestias."
                  style={{
                    ...inputSx,
                    fontFamily:  'Newsreader, Georgia, serif',
                    fontStyle:   'italic',
                    fontSize:    '1rem',
                    lineHeight:  1.7,
                    resize:      'vertical',
                    minHeight:   '110px',
                  }}
                />
                <p
                  style={{
                    marginTop:  '0.375rem',
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize:   '0.75rem',
                    color:      '#C8BFB0',
                    lineHeight: 1.5,
                  }}
                >
                  El texto se mostrará en el sitio exactamente como lo escriba.
                  Use un tono institucional y claro.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={{
                  fontFamily:    'Inter, system-ui, sans-serif',
                  fontSize:      '0.8125rem',
                  fontWeight:    600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color:         '#FEFCF8',
                  background:    '#151515',
                  border:        '1px solid #151515',
                  padding:       '0.625rem 1.5rem',
                  cursor:        'pointer',
                }}
              >
                Guardar aviso
              </button>

            </form>
          </div>

          {/* ── Estado actual ── */}
          <div>
            <div
              style={{
                background:   '#FEFCF8',
                border:       '1px solid #E0D9CC',
                padding:      '1.25rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  fontFamily:    'Inter, system-ui, sans-serif',
                  fontSize:      '0.625rem',
                  fontWeight:    600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         '#767676',
                  marginBottom:  '1rem',
                }}
              >
                Estado actual
              </div>

              {/* Estado badge */}
              <div style={{ marginBottom: '0.875rem' }}>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', color: '#767676', marginBottom: '0.25rem' }}>
                  Visibilidad
                </div>
                <span
                  style={{
                    display:       'inline-block',
                    fontFamily:    'Inter, system-ui, sans-serif',
                    fontSize:      '0.625rem',
                    fontWeight:    700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    padding:       '2px 9px',
                    background:    aviso.active ? '#EDF9F0' : '#F3F0EA',
                    color:         aviso.active ? '#1F6B3A' : '#767676',
                  }}
                >
                  {aviso.active ? 'Activo' : 'Desactivado'}
                </span>
              </div>

              {/* Tipo */}
              <div style={{ marginBottom: '0.875rem' }}>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', color: '#767676', marginBottom: '0.25rem' }}>
                  Tipo
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize:   '0.8125rem',
                    color:      '#383838',
                  }}
                >
                  {TIPO_LABEL[aviso.tipo] ?? '—'}
                </span>
              </div>

              {/* Actualizado */}
              <div>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', color: '#767676', marginBottom: '0.25rem' }}>
                  Última actualización
                </div>
                <span
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize:   '0.75rem',
                    color:      '#767676',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {fmtDate(aviso.updated_at)}
                </span>
              </div>
            </div>

            {/* Nota informativa */}
            <div
              style={{
                padding:    '1rem 1.25rem',
                background: '#F0EDE6',
                border:     '1px solid #E0D9CC',
                borderLeft: '3px solid #C8BFB0',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize:   '0.8125rem',
                  color:      '#767676',
                  lineHeight: 1.6,
                }}
              >
                Cuando el aviso está activo, aparece como una franja
                editorial sobria debajo de la navegación principal,
                visible en todas las páginas del sitio.
              </p>
            </div>
          </div>

        </div>

        {/* Footer note */}
        <p
          style={{
            marginTop:  '1.5rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize:   '0.75rem',
            color:      '#C8BFB0',
            textAlign:  'right',
          }}
        >
          Los cambios se guardan en Supabase y se reflejan en el sitio inmediatamente.
        </p>

      </div>
    </div>
  )
}
