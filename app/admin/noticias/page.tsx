import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase-admin'
import { toggleEstadoAction } from './actions'
import AdminTopBar from '@/components/AdminTopBar'
import type { Noticia } from '@/lib/noticias'

export const dynamic = 'force-dynamic'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

const ESTADO_STYLE: Record<string, { color: string; bg: string }> = {
  publicada: { color: '#1F6B3A', bg: '#EDF9F0' },
  borrador:  { color: '#767676', bg: '#F3F0EA' },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AdminNoticiasPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; q?: string }>
}) {
  const sp = await searchParams

  let noticias: Noticia[] = []
  let fetchError = ''

  try {
    const sb = createAdminClient()
    let query = sb
      .from('noticias')
      .select('id, titulo, slug, categoria, estado, destacada, orden_portada, ultima_hora, updated_at, created_at')
      .order('created_at', { ascending: false })

    if (sp.estado && sp.estado !== 'todas') {
      query = query.eq('estado', sp.estado)
    }
    if (sp.q) {
      query = query.ilike('titulo', `%${sp.q}%`)
    }

    const { data, error } = await query
    if (error) fetchError = error.message
    else noticias = (data ?? []) as Noticia[]
  } catch (e: unknown) {
    fetchError = e instanceof Error ? e.message : 'No se pudo conectar con Supabase.'
  }

  const total      = noticias.length
  const publicadas = noticias.filter(n => n.estado === 'publicada').length
  const borradores = noticias.filter(n => n.estado === 'borrador').length
  const activeFilter = sp.estado ?? 'todas'

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="noticias" />

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Page header */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          borderTop: '2.5px solid #151515',
          borderBottom: '1px solid #E0D9CC',
          paddingTop: '0.4rem',
          paddingBottom: '0.4rem',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.625rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.015em' }}>
            Noticias
          </h1>
          <Link
            href="/admin/noticias/nueva"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.875rem',
              fontWeight: 500,
              padding: '0.5rem 1.125rem',
              background: '#151515',
              color: '#F7F4EE',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            + Nueva noticia
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto) 1fr', gap: '1rem', marginBottom: '1.75rem', alignItems: 'start' }}>
          {[
            { label: 'Total',      value: total,      color: '#151515' },
            { label: 'Publicadas', value: publicadas,  color: '#1F6B3A' },
            { label: 'Borradores', value: borradores,  color: '#767676' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '0.875rem 1.25rem' }}>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.25rem' }}>
                {label}
              </div>
              <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.875rem', fontWeight: 400, color, lineHeight: 1 }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            {['todas', 'publicada', 'borrador'].map((f) => (
              <Link
                key={f}
                href={`/admin/noticias${f === 'todas' ? '' : `?estado=${f}`}`}
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: '0.8125rem',
                  fontWeight: activeFilter === f ? 600 : 400,
                  color: activeFilter === f ? '#151515' : '#767676',
                  background: activeFilter === f ? '#F0EDE6' : 'transparent',
                  border: `1px solid ${activeFilter === f ? '#C8BFB0' : '#E0D9CC'}`,
                  padding: '0.3rem 0.875rem',
                  textDecoration: 'none',
                  textTransform: 'capitalize',
                }}
              >
                {f}
              </Link>
            ))}
          </div>

          <form method="GET" action="/admin/noticias" style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: 380 }}>
            {sp.estado && <input type="hidden" name="estado" value={sp.estado} />}
            <input
              type="search"
              name="q"
              defaultValue={sp.q ?? ''}
              placeholder="Buscar por título…"
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
            <button
              type="submit"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.8125rem',
                padding: '0.375rem 0.875rem',
                background: '#F0EDE6',
                border: '1px solid #C8BFB0',
                color: '#383838',
                cursor: 'pointer',
              }}
            >
              Buscar
            </button>
          </form>
        </div>

        {/* Error */}
        {fetchError && (
          <div style={{ background: '#FDF5F5', border: '1px solid #6B1F1F', padding: '1rem 1.25rem', marginBottom: '1.5rem', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#6B1F1F' }}>
            <strong>Error Supabase:</strong> {fetchError}
            <br /><span style={{ color: '#383838', fontSize: '0.8125rem' }}>Comprueba las variables de entorno en .env.local</span>
          </div>
        )}

        {/* Table */}
        {!fetchError && (
          <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC' }}>
            {noticias.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.25rem', color: '#C8BFB0', fontStyle: 'italic' }}>
                {sp.q
                  ? `Sin resultados para "${sp.q}"`
                  : 'Todavía no hay noticias. Crea la primera.'}
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter, system-ui, sans-serif' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid #E0D9CC', background: '#F0EDE6' }}>
                      {['Título', 'Categoría', 'Estado', 'Dest.', 'U.H.', 'Orden', 'Actualizado', 'Acciones'].map((h) => (
                        <th key={h} style={{ padding: '0.625rem 1rem', textAlign: 'left', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#767676', whiteSpace: 'nowrap' }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {noticias.map((n, i) => {
                      const st = ESTADO_STYLE[n.estado] ?? ESTADO_STYLE.borrador
                      const nextEstado = n.estado === 'publicada' ? 'borrador' : 'publicada'
                      const nextLabel  = n.estado === 'publicada' ? 'Despublicar' : 'Publicar'
                      return (
                        <tr key={n.id} style={{ borderBottom: '1px solid #E0D9CC', background: i % 2 === 0 ? '#FEFCF8' : '#FAF8F4', verticalAlign: 'middle' }}>
                          {/* Título */}
                          <td style={{ padding: '0.75rem 1rem', maxWidth: 380 }}>
                            <div style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '0.9375rem', color: '#151515', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {n.titulo}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#C8BFB0', marginTop: 2, fontFamily: 'ui-monospace, monospace' }}>
                              /noticias/{n.slug}
                            </div>
                          </td>
                          {/* Categoría */}
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#383838', whiteSpace: 'nowrap' }}>
                            {n.categoria}
                          </td>
                          {/* Estado */}
                          <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: st.color, background: st.bg, padding: '0.2rem 0.5rem' }}>
                              {n.estado}
                            </span>
                          </td>
                          {/* Destacada */}
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.9375rem' }}>
                            {n.destacada ? '★' : '—'}
                          </td>
                          {/* Última hora */}
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.75rem' }}>
                            {n.ultima_hora
                              ? <span style={{ color: '#6B1F1F', fontWeight: 700, fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.04em' }}>⚡</span>
                              : <span style={{ color: '#C8BFB0' }}>—</span>}
                          </td>
                          {/* Orden */}
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.875rem', color: '#767676', fontVariantNumeric: 'tabular-nums' }}>
                            {n.orden_portada ?? '—'}
                          </td>
                          {/* Actualizado */}
                          <td style={{ padding: '0.75rem 1rem', fontSize: '0.8125rem', color: '#767676', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                            {fmtDate(n.updated_at)}
                          </td>
                          {/* Acciones */}
                          <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <Link
                                href={`/admin/noticias/${n.id}`}
                                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', fontWeight: 500, color: '#383838', textDecoration: 'none', padding: '0.3rem 0.75rem', border: '1px solid #E0D9CC', background: '#FEFCF8' }}
                              >
                                Editar
                              </Link>
                              <form action={toggleEstadoAction}>
                                <input type="hidden" name="id"     value={n.id} />
                                <input type="hidden" name="estado" value={nextEstado} />
                                <button
                                  type="submit"
                                  style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', fontWeight: 500, color: n.estado === 'publicada' ? '#767676' : '#1F6B3A', background: 'transparent', border: `1px solid ${n.estado === 'publicada' ? '#E0D9CC' : '#C5E5D0'}`, padding: '0.3rem 0.75rem', cursor: 'pointer' }}
                                >
                                  {nextLabel}
                                </button>
                              </form>
                            </div>
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

        <p style={{ marginTop: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#C8BFB0', textAlign: 'right' }}>
          {total} noticia{total !== 1 ? 's' : ''} en total
        </p>
      </div>
    </div>
  )
}
