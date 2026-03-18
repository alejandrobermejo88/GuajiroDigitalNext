import Link from 'next/link'
import type { Metadata } from 'next'
import { getUltimaHoraNoticias } from '@/lib/noticias'
import type { Noticia } from '@/lib/noticias'
import SiteHeader from '@/components/SiteHeader'

export const revalidate = 30

export const metadata: Metadata = {
  title: 'Última hora — Guajiro Digital',
  description: 'Las últimas noticias en desarrollo sobre Cuba. Actualización continua.',
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function UltimaHoraPage() {
  let noticias: Noticia[] = []
  let fetchError = false

  try {
    noticias = await getUltimaHoraNoticias(30)
  } catch {
    fetchError = true
  }

  const now = new Date().toISOString()

  // Group by date
  type Group = { date: string; items: Noticia[] }
  const groups: Group[] = []
  for (const n of noticias) {
    const d = new Date(n.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    const existing = groups.find(g => g.date === d)
    if (existing) {
      existing.items.push(n)
    } else {
      groups.push({ date: d, items: [n] })
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <SiteHeader activeSection="Última hora" />

      <main className="mx-auto" style={{ maxWidth: 860, padding: '3rem 2rem 5rem' }}>

        {/* Section header */}
        <div style={{ borderTop: '2.5px solid #151515', borderBottom: '1px solid #E0D9CC', paddingTop: '0.4rem', paddingBottom: '0.4rem', marginBottom: '2rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="flex items-center" style={{ gap: '0.625rem' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B1F1F' }} />
            <span className="font-sans font-semibold text-ink" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Última hora
            </span>
          </div>
          <time className="font-sans tabular-nums" style={{ fontSize: '0.6875rem', color: '#767676' }} dateTime={now}>
            {fmtDateTime(now)}
          </time>
        </div>

        {/* Error */}
        {fetchError && (
          <p className="font-sans" style={{ color: '#6B1F1F', fontSize: '0.9rem', padding: '2rem 0' }}>
            No se pudo cargar la sección. Inténtalo de nuevo.
          </p>
        )}

        {/* Empty */}
        {!fetchError && noticias.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p className="font-serif" style={{ fontSize: '1.25rem', color: '#C8BFB0', fontStyle: 'italic' }}>
              No hay noticias de última hora en este momento.
            </p>
            <Link href="/" className="font-sans" style={{ display: 'inline-block', marginTop: '1.25rem', fontSize: '0.875rem', color: '#6B1F1F', textDecoration: 'none' }}>
              ← Volver a portada
            </Link>
          </div>
        )}

        {/* Timeline */}
        {groups.map((group) => (
          <div key={group.date} style={{ marginBottom: '2.5rem' }}>
            {/* Date separator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span className="font-sans font-semibold" style={{ fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#767676', whiteSpace: 'nowrap' }}>
                {group.date}
              </span>
              <div style={{ flex: 1, height: 1, background: '#E0D9CC' }} />
            </div>

            {/* Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {group.items.map((n, i) => (
                <article
                  key={n.slug}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '3.5rem 1fr',
                    gap: '0 1.5rem',
                    borderTop: i === 0 ? 'none' : '1px solid #E0D9CC',
                    paddingTop: i === 0 ? 0 : '1.25rem',
                    paddingBottom: '1.25rem',
                    alignItems: 'start',
                  }}
                >
                  {/* Time */}
                  <time
                    dateTime={n.created_at}
                    className="font-sans tabular-nums"
                    style={{ fontSize: '0.75rem', color: '#C8BFB0', paddingTop: '0.2rem', textAlign: 'right', lineHeight: 1.4 }}
                  >
                    {fmtTime(n.created_at)}
                  </time>

                  {/* Content */}
                  <div>
                    <div className="flex items-center" style={{ gap: '0.625rem', marginBottom: '0.375rem' }}>
                      <span className="cat-label">{n.categoria}</span>
                      {n.fuente_nombre && (
                        <>
                          <span style={{ color: '#C8BFB0', fontSize: '0.625rem' }}>·</span>
                          <span className="font-sans" style={{ fontSize: '0.6875rem', color: '#767676' }}>
                            {n.fuente_nombre}
                          </span>
                        </>
                      )}
                    </div>
                    <Link href={`/noticias/${n.slug}`} className="block group">
                      <h2
                        className="card-hl font-normal"
                        style={{ fontSize: '1.125rem', lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: n.resumen ? '0.5rem' : 0 }}
                      >
                        {n.titulo}
                      </h2>
                    </Link>
                    {n.resumen && (
                      <p className="font-sans line-clamp-2" style={{ fontSize: '0.9rem', color: '#4B4B4B', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                        {n.resumen}
                      </p>
                    )}
                    <Link href={`/noticias/${n.slug}`} className="font-sans" style={{ fontSize: '0.8125rem', color: '#6B1F1F', textDecoration: 'none', fontWeight: 500 }}>
                      Leer →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

      </main>

      {/* Footer mini */}
      <footer style={{ background: '#111111' }}>
        <div className="mx-auto" style={{ maxWidth: 860, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="footer-link font-sans">← Portada</Link>
          <span className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Guajiro Digital
          </span>
        </div>
      </footer>
    </div>
  )
}
