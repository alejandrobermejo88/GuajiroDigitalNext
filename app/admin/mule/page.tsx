import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'
import AdminTopBar from '@/components/AdminTopBar'
import MuleEstadoSelector from '@/components/MuleEstadoSelector'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UrgenciaMule {
  id: string
  created_at: string
  nombre: string | null
  telefono: string          // visible only in admin detail, not shown in list
  localidad: string | null
  tipo_urgencia: string
  descripcion: string
  persona_afectada: string | null
  necesidad_concreta: string | null
  estado: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ESTADO_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  pendiente:  { color: '#6B1F1F', bg: '#F9EDED', label: 'Pendiente'  },
  en_gestion: { color: '#1F4A6B', bg: '#EDF2F9', label: 'En gestión' },
  resuelta:   { color: '#1F6B3A', bg: '#EDF9F0', label: 'Resuelta'   },
  archivada:  { color: '#767676', bg: '#F3F0EA', label: 'Archivada'  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminMulePage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>
}) {
  const sp = await searchParams

  let casos: UrgenciaMule[] = []
  let fetchError = ''

  try {
    const sb = createAdminClient()
    let query = sb
      .from('urgencias_mule')
      .select('*')
      .order('created_at', { ascending: false })

    if (sp.estado && sp.estado !== 'todas') {
      query = query.eq('estado', sp.estado)
    }

    const { data, error } = await query
    if (error) {
      fetchError = error.message
    } else {
      casos = data ?? []
      if (sp.q) {
        const term = sp.q.toLowerCase()
        casos = casos.filter(c =>
          c.tipo_urgencia.toLowerCase().includes(term) ||
          c.descripcion.toLowerCase().includes(term) ||
          c.nombre?.toLowerCase().includes(term) ||
          c.localidad?.toLowerCase().includes(term) ||
          c.persona_afectada?.toLowerCase().includes(term) ||
          c.necesidad_concreta?.toLowerCase().includes(term)
        )
      }
    }
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : 'No se pudo conectar con Supabase.'
  }

  const counts = {
    total:      casos.length,
    pendiente:  casos.filter(c => c.estado === 'pendiente').length,
    en_gestion: casos.filter(c => c.estado === 'en_gestion').length,
    resuelta:   casos.filter(c => c.estado === 'resuelta').length,
    archivada:  casos.filter(c => c.estado === 'archivada').length,
  }

  const activeFilter = sp.estado ?? 'todas'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="mule" />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Page header */}
        <div style={{
          borderTop: '2.5px solid #151515',
          borderBottom: '1px solid #E0D9CC',
          paddingTop: '0.4rem',
          paddingBottom: '0.4rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}>
          <div>
            <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.625rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.015em' }}>
              Urgencias MULE
            </h1>
          </div>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#767676' }}>
            {counts.total} caso{counts.total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {([
            { key: 'pendiente',  label: 'Pendientes'  },
            { key: 'en_gestion', label: 'En gestión'  },
            { key: 'resuelta',   label: 'Resueltas'   },
            { key: 'archivada',  label: 'Archivadas'  },
          ] as const).map(({ key, label }) => {
            const st = ESTADO_STYLE[key]
            return (
              <div key={key} style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '1rem 1.25rem' }}>
                <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: st.color, marginBottom: '0.375rem' }}>
                  {label}
                </div>
                <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '2rem', fontWeight: 400, color: '#151515', lineHeight: 1 }}>
                  {counts[key]}
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['todas', 'pendiente', 'en_gestion', 'resuelta', 'archivada'].map((f) => {
            const isActive = activeFilter === f
            const label = f === 'en_gestion' ? 'en gestión' : f
            return (
              <Link
                key={f}
                href={`/admin/mule${f === 'todas' ? '' : `?estado=${f}`}`}
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 600 : 400,
                  letterSpacing: '0.05em',
                  textTransform: 'capitalize',
                  color: isActive ? '#151515' : '#767676',
                  background: isActive ? '#F0EDE6' : 'transparent',
                  border: `1px solid ${isActive ? '#C8BFB0' : '#E0D9CC'}`,
                  padding: '0.3rem 0.75rem',
                  textDecoration: 'none',
                }}
              >
                {label}
              </Link>
            )
          })}

          <form method="GET" action="/admin/mule" style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: 360, marginLeft: '0.5rem' }}>
            {sp.estado && <input type="hidden" name="estado" value={sp.estado} />}
            <input
              type="search"
              name="q"
              defaultValue={sp.q ?? ''}
              placeholder="Buscar por tipo, localidad, descripción…"
              style={{
                flex: 1,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
                padding: '0.375rem 0.75rem',
                border: '1px solid #E0D9CC',
                background: '#FEFCF8',
                color: '#151515',
                outline: 'none',
              }}
            />
            <button type="submit" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', padding: '0.375rem 0.875rem', background: '#F0EDE6', border: '1px solid #C8BFB0', color: '#383838', cursor: 'pointer' }}>
              Buscar
            </button>
          </form>
        </div>

        {/* Error */}
        {fetchError && (
          <div style={{ background: '#F9EDED', border: '1px solid #6B1F1F', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#6B1F1F' }}>
            <strong>Error Supabase:</strong> {fetchError}
          </div>
        )}

        {/* Table */}
        {!fetchError && (
          <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC' }}>
            {casos.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.25rem', color: '#C8BFB0', fontStyle: 'italic' }}>
                No hay casos{activeFilter !== 'todas' ? ` con estado "${activeFilter}"` : ''}.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #E0D9CC', background: '#F0EDE6' }}>
                      {['Fecha', 'Tipo de urgencia', 'Localidad', 'Persona afectada', 'Necesidad', 'Estado', 'Ver'].map(h => (
                        <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#767676', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {casos.map((c, i) => {
                      const st = ESTADO_STYLE[c.estado] ?? ESTADO_STYLE.pendiente
                      return (
                        <tr key={c.id} style={{ borderBottom: '1px solid #E0D9CC', background: i % 2 === 0 ? '#FEFCF8' : '#FAF8F4', verticalAlign: 'top' }}>

                          {/* Fecha */}
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.8125rem', color: '#767676', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                            {fmtDate(c.created_at)}
                          </td>

                          {/* Tipo */}
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#151515', whiteSpace: 'nowrap' }}>
                            {c.tipo_urgencia}
                          </td>

                          {/* Localidad */}
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: c.localidad ? '#383838' : '#C8BFB0', whiteSpace: 'nowrap' }}>
                            {c.localidad || '—'}
                          </td>

                          {/* Persona afectada */}
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: c.persona_afectada ? '#383838' : '#C8BFB0', maxWidth: 200 }}>
                            {c.persona_afectada || '—'}
                          </td>

                          {/* Necesidad concreta — truncada, expansible */}
                          <td style={{ padding: '0.875rem 1rem', fontSize: '0.875rem', color: '#151515', maxWidth: 260, fontFamily: 'Newsreader, Georgia, serif', lineHeight: 1.45 }}>
                            {c.necesidad_concreta ? (
                              <details style={{ cursor: 'pointer' }}>
                                <summary style={{ listStyle: 'none', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', cursor: 'pointer' }}>
                                  {c.necesidad_concreta}
                                </summary>
                                <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#F0EDE6', fontSize: '0.9375rem', lineHeight: 1.6, color: '#151515' }}>
                                  {c.necesidad_concreta}
                                </div>
                              </details>
                            ) : (
                              <span style={{ color: '#C8BFB0' }}>—</span>
                            )}
                          </td>

                          {/* Estado */}
                          <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                            <MuleEstadoSelector id={c.id} estado={c.estado} />
                          </td>

                          {/* Ver detalle — aquí sí se accede al teléfono */}
                          <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                            <Link
                              href={`/admin/mule/${c.id}`}
                              style={{
                                fontFamily: 'Inter, system-ui, sans-serif',
                                fontSize: '0.8125rem',
                                fontWeight: 500,
                                color: '#383838',
                                textDecoration: 'none',
                                padding: '0.3rem 0.75rem',
                                border: '1px solid #E0D9CC',
                                background: '#FEFCF8',
                              }}
                            >
                              Ver caso
                            </Link>
                          </td>

                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <p style={{ marginTop: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#C8BFB0', textAlign: 'right' }}>
          El teléfono de contacto solo es visible en la vista de detalle de cada caso.
        </p>
      </div>
    </div>
  )
}
