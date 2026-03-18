import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublishedNoticiaBySlug, getRelatedNoticias } from '@/lib/noticias'

export const dynamic = 'force-dynamic'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  })
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getPublishedNoticiaBySlug(slug)
  if (!noticia) return { title: 'Artículo no encontrado — Guajiro Digital' }
  return {
    title: `${noticia.titulo} — Guajiro Digital`,
    description: noticia.resumen ?? undefined,
    openGraph: {
      title: noticia.titulo,
      description: noticia.resumen ?? undefined,
      type: 'article',
      publishedTime: noticia.created_at,
      ...(noticia.imagen_url ? { images: [{ url: noticia.imagen_url }] } : {}),
    },
  }
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const noticia = await getPublishedNoticiaBySlug(slug)
  if (!noticia) notFound()

  const related = await getRelatedNoticias(noticia.categoria, noticia.slug, 3)

  const paragraphs = noticia.contenido
    ? noticia.contenido
        .split(/\r?\n\r?\n+/)
        .map(p => p.trim())
        .filter(Boolean)
    : []

  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#1A1A1A' }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1140, padding: '0.5rem 2rem' }}>
          <Link href="/" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>
            ← Guajiro Digital
          </Link>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
            {noticia.categoria}
          </span>
        </div>
      </div>

      {/* Masthead mini */}
      <header className="bg-bg border-b border-line">
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '0.875rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ position: 'relative', width: 30, height: 30, borderRadius: '50%', overflow: 'hidden', border: '1px solid #C8BFB0', flexShrink: 0 }}>
              <Image src="/GuajiroDigital.jpeg" alt="Guajiro Digital" fill className="object-cover" style={{ filter: 'grayscale(12%)' }} sizes="30px" />
            </div>
            <span style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.25rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.02em' }}>
              Guajiro Digital
            </span>
          </Link>
          <Link href="/" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}>
            Portada
          </Link>
        </div>
      </header>

      <main>
        {/* Article header */}
        <div className="mx-auto" style={{ maxWidth: 680, padding: '3rem 1.5rem 2rem' }}>
          {/* Category + última hora badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B1F1F' }}>
              {noticia.categoria}
            </span>
            {noticia.ultima_hora && (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.5875rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FEFCF8', background: '#6B1F1F', padding: '0.15rem 0.5rem' }}>
                ⚡ Última hora
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#151515', margin: '0.75rem 0 1.25rem', textWrap: 'balance' }}>
            {noticia.titulo}
          </h1>

          {/* Resumen / dek */}
          {noticia.resumen && (
            <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontStyle: 'italic', fontSize: '1.125rem', lineHeight: 1.65, color: '#383838', marginBottom: '1.5rem', borderLeft: '2px solid #6B1F1F', paddingLeft: '1rem' }}>
              {noticia.resumen}
            </p>
          )}

          {/* Byline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', borderTop: '1px solid #E0D9CC', borderBottom: '1px solid #E0D9CC', padding: '0.75rem 0', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', fontWeight: 500, color: '#151515' }}>
                {noticia.fuente_nombre ?? 'Guajiro Digital'}
              </div>
              <time dateTime={noticia.created_at} style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textTransform: 'capitalize' }}>
                {fmtDate(noticia.created_at)}
              </time>
            </div>
            {noticia.fuente_url && (
              <a href={noticia.fuente_url} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#383838', textDecoration: 'none', border: '1px solid #E0D9CC', padding: '0.3rem 0.75rem', flexShrink: 0 }}>
                Artículo original ↗
              </a>
            )}
          </div>
        </div>

        {/* Hero image */}
        {noticia.imagen_url && (
          <div className="mx-auto" style={{ maxWidth: 860, padding: '0 1.5rem', marginBottom: '2rem' }}>
            <Image
              src={noticia.imagen_url}
              alt=""
              width={860}
              height={600}
              style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(10%)' }}
              sizes="(max-width: 768px) 100vw, 860px"
              priority
            />
          </div>
        )}

        {/* Body */}
        <div className="mx-auto" style={{ maxWidth: 680, padding: '0 1.5rem 4rem' }}>
          {paragraphs.length > 0 ? (
            <div className="prose-editorial">
              {paragraphs.map((p, i) => (
                <p key={i} style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.0625rem', lineHeight: 1.8, color: '#383838', marginBottom: '1.5rem' }}>
                  {p.split(/\r?\n/).map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.0625rem', lineHeight: 1.8, color: '#C8BFB0', fontStyle: 'italic' }}>
              Contenido completo no disponible. Visita el artículo original para leer la noticia completa.
            </p>
          )}

          {/* Source attribution */}
          {noticia.fuente_nombre && (
            <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E0D9CC' }}>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676' }}>
                Fuente original:{' '}
                {noticia.fuente_url ? (
                  <a href={noticia.fuente_url} target="_blank" rel="noopener noreferrer" style={{ color: '#6B1F1F', fontWeight: 500 }}>
                    {noticia.fuente_nombre} ↗
                  </a>
                ) : (
                  <span style={{ color: '#383838', fontWeight: 500 }}>{noticia.fuente_nombre}</span>
                )}
              </p>
            </div>
          )}

          {/* Share */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E0D9CC', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8BFB0' }}>Compartir</span>
            <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(noticia.titulo)}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}>
              X (Twitter)
            </a>
            <a href={`https://wa.me/?text=${encodeURIComponent(noticia.titulo)}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section style={{ background: '#F0EDE6', borderTop: '1px solid #E0D9CC', padding: '2.5rem 0' }}>
            <div className="mx-auto" style={{ maxWidth: 1140, padding: '0 2rem' }}>
              <div style={{ borderTop: '2.5px solid #151515', borderBottom: '1px solid #E0D9CC', paddingTop: '0.4rem', paddingBottom: '0.4rem', marginBottom: '1.5rem' }}>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#151515' }}>
                  Más sobre {noticia.categoria}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {related.map((r) => (
                  <Link key={r.slug} href={`/noticias/${r.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <article style={{ borderTop: '1px solid #E0D9CC', paddingTop: '1rem' }}>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6B1F1F' }}>{r.categoria}</span>
                      <h3 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.0625rem', fontWeight: 400, lineHeight: 1.3, color: '#151515', margin: '0.375rem 0 0.5rem', textWrap: 'balance' }}>
                        {r.titulo}
                      </h3>
                      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#767676' }}>{fmtDateShort(r.created_at)}</span>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer mini */}
      <footer style={{ background: '#111111' }}>
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
            ← Volver a Guajiro Digital
          </Link>
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
            © {new Date().getFullYear()} Guajiro Digital
          </span>
        </div>
      </footer>
    </>
  )
}
