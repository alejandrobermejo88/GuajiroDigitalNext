import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'
import EstadoSelector from '@/components/EstadoSelector'
import AdminTopBar from '@/components/AdminTopBar'

export const dynamic = 'force-dynamic'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Denuncia {
  id: string
  created_at: string
  nombre: string | null
  provincia: string | null
  tipo: string | null
  mensaje: string
  estado: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const ESTADO_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  nueva:     { color: '#6B1F1F', bg: '#F9EDED', label: 'Nueva'     },
  revisada:  { color: '#1F4A6B', bg: '#EDF2F9', label: 'Revisada'  },
  publicada: { color: '#1F6B3A', bg: '#EDF9F0', label: 'Publicada' },
  archivada: { color: '#767676', bg: '#F3F0EA', label: 'Archivada' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminDenunciasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>
}) {
  const sp = await searchParams

  let denuncias: Denuncia[] = []
  let fetchError = ''

  try {
    const supabase = createAdminClient()
    let query = supabase
      .from('denuncias')
      .select('*')
      .order('created_at', { ascending: false })

    if (sp.estado && sp.estado !== 'todas') {
      query = query.eq('estado', sp.estado)
    }

    const { data, error } = await query

    if (error) {
      fetchError = error.message
    } else {
      denuncias = data ?? []

      // Filtro de búsqueda local (mensaje o nombre)
      if (sp.q) {
        const term = sp.q.toLowerCase()
        denuncias = denuncias.filter(
          (d) =>
            d.mensaje.toLowerCase().includes(term) ||
            d.nombre?.toLowerCase().includes(term) ||
            d.provincia?.toLowerCase().includes(term) ||
            d.tipo?.toLowerCase().includes(term)
        )
      }
    }
  } catch (e: unknown) {
    fetchError =
      e instanceof Error ? e.message : 'No se pudo conectar con Supabase.'
  }

  const counts = {
    total:     denuncias.length,
    nueva:     denuncias.filter((d) => d.estado === 'nueva').length,
    revisada:  denuncias.filter((d) => d.estado === 'revisada').length,
    publicada: denuncias.filter((d) => d.estado === 'publicada').length,
    archivada: denuncias.filter((d) => d.estado === 'archivada').length,
  }

  const activeFilter = sp.estado ?? 'todas'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="denuncias" />

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Page header */}
        <div
          style={{
            borderTop: '2.5px solid #151515',
            borderBottom: '1px solid #E0D9CC',
            paddingTop: '0.4rem',
            paddingBottom: '0.4rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: '1.625rem',
              fontWeight: 400,
              color: '#151515',
              letterSpacing: '-0.015em',
            }}
          >
            Denuncias recibidas
          </h1>
          <span
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.75rem',
              color: '#767676',
            }}
          >
            {counts.total} resultado{counts.total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ── Stats row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {(
            [
              { key: 'nueva',     label: 'Nuevas'     },
              { key: 'revisada',  label: 'Revisadas'  },
              { key: 'publicada', label: 'Publicadas' },
              { key: 'archivada', label: 'Archivadas' },
            ] as const
          ).map(({ key, label }) => {
            const st = ESTADO_STYLE[key]
            return (
              <div
                key={key}
                style={{
                  background: '#FEFCF8',
                  border: '1px solid #E0D9CC',
                  padding: '1rem 1.25rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: '0.625rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: st.color,
                    marginBottom: '0.375rem',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: 'Newsreader, Georgia, serif',
                    fontSize: '2rem',
                    fontWeight: 400,
                    color: '#151515',
                    lineHeight: 1,
                  }}
                >
                  {counts[key]}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
          }}
        >
          {['todas', 'nueva', 'revisada', 'publicada', 'archivada'].map((f) => {
            const isActive = activeFilter === f
            return (
              <Link
                key={f}
                href={`/admin/denuncias${f === 'todas' ? '' : `?estado=${f}`}`}
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
                  transition: 'all 0.15s',
                }}
              >
                {f}
              </Link>
            )
          })}
        </div>

        {/* ── Error ── */}
        {fetchError && (
          <div
            style={{
              background: '#F9EDED',
              border: '1px solid #6B1F1F',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              color: '#6B1F1F',
            }}
          >
            <strong>Error al conectar con Supabase:</strong> {fetchError}
            <br />
            <span style={{ color: '#383838', fontSize: '0.8125rem' }}>
              Comprueba que{' '}
              <code>NEXT_PUBLIC_SUPABASE_URL</code>,{' '}
              <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> y{' '}
              <code>SUPABASE_SERVICE_ROLE_KEY</code> están configuradas en{' '}
              <code>.env.local</code>.
            </span>
          </div>
        )}

        {/* ── Table ── */}
        {!fetchError && (
          <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC' }}>
            {denuncias.length === 0 ? (
              <div
                style={{
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  fontFamily: 'Newsreader, Georgia, serif',
                  fontSize: '1.25rem',
                  color: '#C8BFB0',
                  fontStyle: 'italic',
                }}
              >
                No hay denuncias{activeFilter !== 'todas' ? ` con estado "${activeFilter}"` : ''}.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: '1.5px solid #E0D9CC',
                        background: '#F0EDE6',
                      }}
                    >
                      {['Fecha', 'Nombre', 'Provincia', 'Tipo', 'Mensaje', 'Estado'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: '0.75rem 1rem',
                              textAlign: 'left',
                              fontSize: '0.625rem',
                              fontWeight: 600,
                              letterSpacing: '0.12em',
                              textTransform: 'uppercase',
                              color: '#767676',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {denuncias.map((d, i) => {
                      const st = ESTADO_STYLE[d.estado] ?? ESTADO_STYLE.nueva
                      return (
                        <tr
                          key={d.id}
                          style={{
                            borderBottom: '1px solid #E0D9CC',
                            background: i % 2 === 0 ? '#FEFCF8' : '#FAF8F4',
                            verticalAlign: 'top',
                          }}
                        >
                          {/* Fecha */}
                          <td
                            style={{
                              padding: '0.875rem 1rem',
                              fontSize: '0.8125rem',
                              color: '#767676',
                              whiteSpace: 'nowrap',
                              fontVariantNumeric: 'tabular-nums',
                            }}
                          >
                            {fmtDate(d.created_at)}
                          </td>

                          {/* Nombre */}
                          <td
                            style={{
                              padding: '0.875rem 1rem',
                              fontSize: '0.875rem',
                              color: d.nombre ? '#151515' : '#C8BFB0',
                              fontStyle: d.nombre ? 'normal' : 'italic',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {d.nombre || 'Anónimo'}
                          </td>

                          {/* Provincia */}
                          <td
                            style={{
                              padding: '0.875rem 1rem',
                              fontSize: '0.875rem',
                              color: d.provincia ? '#383838' : '#C8BFB0',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {d.provincia || '—'}
                          </td>

                          {/* Tipo */}
                          <td
                            style={{
                              padding: '0.875rem 1rem',
                              fontSize: '0.8125rem',
                              color: '#383838',
                              maxWidth: 180,
                            }}
                          >
                            {d.tipo || '—'}
                          </td>

                          {/* Mensaje */}
                          <td
                            style={{
                              padding: '0.875rem 1rem',
                              fontSize: '0.9375rem',
                              color: '#151515',
                              lineHeight: 1.55,
                              maxWidth: 420,
                              fontFamily: 'Newsreader, Georgia, serif',
                            }}
                          >
                            <details style={{ cursor: 'pointer' }}>
                              <summary
                                style={{
                                  listStyle: 'none',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                }}
                              >
                                {d.mensaje}
                              </summary>
                              <div
                                style={{
                                  marginTop: '0.5rem',
                                  padding: '0.75rem',
                                  background: '#F0EDE6',
                                  fontSize: '0.9375rem',
                                  lineHeight: 1.65,
                                  color: '#151515',
                                }}
                              >
                                {d.mensaje}
                              </div>
                            </details>
                          </td>

                          {/* Estado */}
                          <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                            <EstadoSelector id={d.id} estado={d.estado} />
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

        {/* Footer note */}
        <p
          style={{
            marginTop: '1.5rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.75rem',
            color: '#C8BFB0',
            textAlign: 'right',
          }}
        >
          Los cambios de estado se guardan automáticamente en Supabase.
        </p>
      </div>
    </div>
  )
}
