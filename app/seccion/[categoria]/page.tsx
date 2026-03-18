import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getNoticiasByCategoria, SLUG_CAT, CAT_SLUG } from '@/lib/noticias'
import type { Noticia } from '@/lib/noticias'
import SiteHeader from '@/components/SiteHeader'

export const revalidate = 60

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ─── Section descriptions ─────────────────────────────────────────────────────

const SECTION_META: Record<string, { title: string; desc: string }> = {
  'Apagones':  { title: 'Apagones',              desc: 'Colapso energético, Unión Eléctrica, apagones, déficit y situación del SEN.' },
  'Represión': { title: 'Represión',             desc: 'Detenciones, operativos, violencia policial, vigilancia y Seguridad del Estado.' },
  'Economía':  { title: 'Economía',              desc: 'Inflación, dólar, escasez, salarios, remesas y colapso económico.' },
  'Protesta':  { title: 'Protesta',              desc: 'Cacerolazos, manifestaciones, marchas, disturbios y estallidos sociales.' },
  'Régimen':   { title: 'Régimen',               desc: 'Movimientos internos del poder, declaraciones, cúpula y control político.' },
  'Oposición': { title: 'Oposición',             desc: 'Disidencia, presos políticos, movimientos cívicos, activistas y pronunciamientos opositores.' },
  'Opinión':   { title: 'Opinión',               desc: 'Análisis, columnas de opinión y perspectivas sobre la realidad cubana.' },
  'Denuncias': { title: 'Denuncias ciudadanas',  desc: 'Testimonios, abusos, escasez, crisis sanitaria y denuncias de la población.' },
  'Transición':{ title: 'Transición',            desc: 'Escenarios de cambio, fracturas internas, lectura política y salidas de poder.' },
  'General':   { title: 'General',               desc: 'Información general sobre Cuba.' },
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>
}): Promise<Metadata> {
  const { categoria } = await params
  const cat = SLUG_CAT[categoria]
  if (!cat) return { title: 'Sección no encontrada — Guajiro Digital' }
  const meta = SECTION_META[cat] ?? { title: cat, desc: '' }
  return {
    title: `${meta.title} — Guajiro Digital`,
    description: meta.desc,
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function SeccionPage({
  params,
}: {
  params: Promise<{ categoria: string }>
}) {
  const { categoria } = await params
  const cat = SLUG_CAT[categoria]
  if (!cat) notFound()

  const meta = SECTION_META[cat] ?? { title: cat, desc: '' }

  let noticias: Noticia[] = []
  let fetchError = false
  try {
    noticias = await getNoticiasByCategoria(cat)
  } catch {
    fetchError = true
  }

  const [lead, ...rest] = noticias

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <SiteHeader activeSection={cat} />

      <main className="mx-auto" style={{ maxWidth: 1140, padding: '3rem 2rem 5rem' }}>

        {/* Section header */}
        <div style={{ borderTop: '2.5px solid #151515', borderBottom: '1px solid #E0D9CC', paddingTop: '0.4rem', paddingBottom: '0.4rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <h1 className="font-sans font-semibold text-ink" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {meta.title}
          </h1>
          <span className="font-sans" style={{ fontSize: '0.6875rem', color: '#767676' }}>
            {noticias.length} artículo{noticias.length !== 1 ? 's' : ''}
          </span>
        </div>
        {meta.desc && (
          <p className="font-sans" style={{ fontSize: '0.8125rem', color: '#767676', marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {meta.desc}
          </p>
        )}

        {/* Error */}
        {fetchError && (
          <p className="font-sans" style={{ color: '#6B1F1F', fontSize: '0.9rem', padding: '2rem 0' }}>
            No se pudo cargar esta sección. Inténtalo de nuevo.
          </p>
        )}

        {/* Empty */}
        {!fetchError && noticias.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p className="font-serif" style={{ fontSize: '1.25rem', color: '#C8BFB0', fontStyle: 'italic' }}>
              Todavía no hay artículos en esta sección.
            </p>
          </div>
        )}

        {/* Lead story */}
        {lead && (
          <div style={{ marginBottom: '3rem' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr]" style={{ gap: '0 3.5rem' }}>
              <div className="lg:border-r lg:border-line lg:pr-14 border-b border-line pb-8 mb-8 lg:mb-0">
                {lead.ultima_hora && (
                  <span className="font-sans font-semibold" style={{ fontSize: '0.5875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.5rem' }}>
                    ⚡ Última hora
                  </span>
                )}
                <Link href={`/noticias/${lead.slug}`} className="block group">
                  <h2
                    className="card-hl font-normal mt-1 mb-4"
                    style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}
                  >
                    {lead.titulo}
                  </h2>
                </Link>
                {lead.resumen && (
                  <p className="lead-dek mb-5" style={{ maxWidth: '38rem' }}>{lead.resumen}</p>
                )}
                <div className="meta-row flex items-center gap-3" style={{ borderTop: '1px solid #E0D9CC', paddingTop: '0.875rem' }}>
                  <span className="font-medium" style={{ color: '#151515' }}>{lead.fuente_nombre ?? 'Guajiro Digital'}</span>
                  <span style={{ color: '#C8BFB0' }}>·</span>
                  <time dateTime={lead.created_at} style={{ color: '#767676' }}>{fmtDateShort(lead.created_at)}</time>
                  <span style={{ color: '#C8BFB0' }}>·</span>
                  <Link href={`/noticias/${lead.slug}`} style={{ color: '#6B1F1F', fontWeight: 500, textDecoration: 'none' }}>
                    Leer →
                  </Link>
                </div>
              </div>
              {/* Top 2 secondary */}
              {rest.slice(0, 2).length > 0 && (
                <div className="flex flex-col" style={{ gap: 0 }}>
                  {rest.slice(0, 2).map((n, i) => (
                    <Link key={n.slug} href={`/noticias/${n.slug}`} className="block group" style={{ borderTop: i === 0 ? 'none' : '1px solid #E0D9CC', paddingTop: i === 0 ? 0 : '1.25rem', paddingBottom: '1.25rem' }}>
                      <article>
                        {n.ultima_hora && (
                          <span className="font-sans" style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.25rem' }}>
                            ⚡ Última hora
                          </span>
                        )}
                        <h3 className="card-hl font-normal" style={{ fontSize: '1.0625rem', lineHeight: 1.32, letterSpacing: '-0.005em', marginBottom: '0.625rem' }}>
                          {n.titulo}
                        </h3>
                        <div className="meta-row">{fmtDateShort(n.created_at)}</div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Remaining articles — grid */}
        {rest.slice(2).length > 0 && (
          <div>
            <div style={{ borderTop: '1px solid #E0D9CC', marginBottom: '2rem' }} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: '2rem 2.5rem' }}>
              {rest.slice(2).map((n) => (
                <Link key={n.slug} href={`/noticias/${n.slug}`} className="block group">
                  <article style={{ borderTop: '1px solid #E0D9CC', paddingTop: '1rem' }}>
                    {n.ultima_hora && (
                      <span className="font-sans" style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.25rem' }}>
                        ⚡ Última hora
                      </span>
                    )}
                    <h3 className="card-hl font-normal" style={{ fontSize: '1rem', lineHeight: 1.35, letterSpacing: '-0.005em', marginBottom: '0.5rem' }}>
                      {n.titulo}
                    </h3>
                    {n.resumen && (
                      <p className="font-sans line-clamp-2" style={{ fontSize: '0.875rem', color: '#4B4B4B', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                        {n.resumen}
                      </p>
                    )}
                    <div className="meta-row">{fmtDateShort(n.created_at)}</div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer mini */}
      <footer style={{ background: '#111111' }}>
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" className="footer-link font-sans">
            ← Portada
          </Link>
          <span className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Guajiro Digital
          </span>
        </div>
      </footer>
    </div>
  )
}
