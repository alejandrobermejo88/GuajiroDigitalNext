import Link from 'next/link'
import { getPublishedNoticias, type Noticia } from '@/lib/noticias'
import SiteHeader from '@/components/SiteHeader'

export const revalidate = 60

function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

interface Props {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const { q } = await searchParams
  return {
    title: q ? `Resultados para "${q}" — Guajiro Digital` : 'Buscar — Guajiro Digital',
  }
}

export default async function BuscarPage({ searchParams }: Props) {
  const { q } = await searchParams
  const query = (q ?? '').trim().toLowerCase()

  let results: Noticia[] = []
  if (query.length >= 2) {
    const all = await getPublishedNoticias()
    results = all.filter(n =>
      n.titulo.toLowerCase().includes(query) ||
      (n.resumen ?? '').toLowerCase().includes(query) ||
      (n.contenido ?? '').toLowerCase().includes(query)
    )
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto" style={{ maxWidth: 860, padding: '3rem 2rem 5rem' }}>

        {/* Heading */}
        <div style={{ borderBottom: '2.5px solid #151515', paddingBottom: '0.75rem', marginBottom: '2.5rem' }}>
          <h1 className="font-serif font-normal text-ink" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', lineHeight: 1.12, letterSpacing: '-0.02em' }}>
            {query ? <>Resultados para <em>&ldquo;{q}&rdquo;</em></> : 'Buscar en el diario'}
          </h1>
          {query && (
            <p className="font-sans" style={{ fontSize: '0.8125rem', color: '#767676', marginTop: '0.5rem' }}>
              {results.length === 0
                ? 'No se encontraron artículos con ese término.'
                : `${results.length} artículo${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}.`}
            </p>
          )}
        </div>

        {!query && (
          <p className="font-sans" style={{ fontSize: '0.9375rem', color: '#767676', lineHeight: 1.6 }}>
            Introduce un término en la barra de búsqueda para encontrar artículos.
          </p>
        )}

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {results.map((n, i) => (
            <Link
              key={n.slug}
              href={`/noticias/${n.slug}`}
              className="block group"
              style={{
                borderTop: i === 0 ? 'none' : '1px solid #E0D9CC',
                paddingTop: i === 0 ? 0 : '1.5rem',
                paddingBottom: '1.5rem',
                textDecoration: 'none',
              }}
            >
              <article>
                <span className="cat-label" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>{n.categoria}</span>
                <h2 className="card-hl font-normal" style={{ fontSize: '1.1875rem', lineHeight: 1.3, letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                  {n.titulo}
                </h2>
                {n.resumen && (
                  <p className="font-sans line-clamp-2" style={{ fontSize: '0.875rem', color: '#4B4B4B', lineHeight: 1.6, marginBottom: '0.5rem' }}>
                    {n.resumen}
                  </p>
                )}
                <p className="font-sans" style={{ fontSize: '0.75rem', color: '#9E9689' }}>
                  {n.fuente_nombre ?? 'Guajiro Digital'} · {fmtDateShort(n.created_at)}
                </p>
              </article>
            </Link>
          ))}
        </div>

      </main>
    </>
  )
}
