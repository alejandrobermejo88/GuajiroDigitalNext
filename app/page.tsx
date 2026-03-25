import Image from 'next/image'
import Link from 'next/link'
import { getPublishedNoticias } from '@/lib/noticias'
import { CAT_SLUG } from '@/lib/noticias'
import type { Noticia } from '@/lib/noticias'
import DenunciasForm from '@/components/DenunciasForm'
import SearchButton from '@/components/SearchButton'
import { NAV_ITEMS } from '@/lib/nav'

export const revalidate = 60

// ─── Date helpers ─────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
function fmtDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'short',
  })
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-ES', {
    hour: '2-digit', minute: '2-digit',
  })
}

// ─── Primitives ───────────────────────────────────────────────────────────────

function CatLabel({ label }: { label: string }) {
  return <span className="cat-label">{label}</span>
}

function MetaRow({ source, date }: { source: string; date: string }) {
  return (
    <div className="meta-row flex items-center gap-2 mt-3">
      <span className="font-medium" style={{ color: '#4B4B4B' }}>{source}</span>
      <span style={{ color: '#C8BFB0' }}>·</span>
      <time dateTime={date}>{fmtDateShort(date)}</time>
    </div>
  )
}

function SectionRule({ label, cat }: { label: string; cat?: string }) {
  const href = cat ? `/seccion/${CAT_SLUG[cat] ?? cat.toLowerCase()}` : undefined
  return (
    <div className="rule-section flex items-baseline justify-between">
      <span className="font-sans font-semibold text-ink" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </span>
      {href && (
        <Link href={href} className="font-sans" style={{ fontSize: '0.6875rem', color: '#767676', textDecoration: 'none', letterSpacing: '0.04em' }}>
          Ver todo →
        </Link>
      )}
    </div>
  )
}

// ─── Card variants ────────────────────────────────────────────────────────────

function CardMain({ n }: { n: Noticia }) {
  return (
    <Link href={`/noticias/${n.slug}`} className="block group">
      <article style={{ display: 'grid', gridTemplateColumns: n.imagen_url ? '1fr 88px' : '1fr', gap: '0 1.25rem', alignItems: 'start' }}>
        <div>
          {n.ultima_hora && (
            <span className="font-sans font-semibold" style={{ fontSize: '0.5875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.375rem' }}>
              ⚡ Última hora
            </span>
          )}
          <h3
            className="card-hl font-normal mb-3"
            style={{ fontSize: '1.4375rem', lineHeight: 1.22, letterSpacing: '-0.012em' }}
          >
            {n.titulo}
          </h3>
          {n.resumen && (
            <p className="font-sans leading-relaxed line-clamp-3" style={{ fontSize: '0.9rem', color: '#4B4B4B' }}>
              {n.resumen}
            </p>
          )}
          <MetaRow source={n.fuente_nombre ?? 'Guajiro Digital'} date={n.created_at} />
        </div>
        {n.imagen_url && (
          <div style={{ position: 'relative', width: 88, height: 72, overflow: 'hidden', background: '#F0EDE6', flexShrink: 0 }}>
            <Image src={n.imagen_url} alt="" fill className="object-cover" style={{ filter: 'grayscale(12%)' }} sizes="88px" />
          </div>
        )}
      </article>
    </Link>
  )
}

function CardSecondary({ n }: { n: Noticia }) {
  return (
    <Link href={`/noticias/${n.slug}`} className="block group">
      <article className="border-t border-line pt-4">
        {n.ultima_hora && (
          <span className="font-sans" style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.25rem' }}>
            ⚡ Últ. hora
          </span>
        )}
        <h4
          className="card-hl font-normal mb-2"
          style={{ fontSize: '0.9375rem', lineHeight: 1.35, letterSpacing: '-0.005em' }}
        >
          {n.titulo}
        </h4>
        <div className="meta-row">{fmtDateShort(n.created_at)}</div>
      </article>
    </Link>
  )
}

function CardFeatureWide({ n }: { n: Noticia }) {
  return (
    <Link href={`/noticias/${n.slug}`} className="block group">
      <article className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12 items-start">
        <div>
          {n.ultima_hora && (
            <span className="font-sans font-semibold" style={{ fontSize: '0.5875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B1F1F', display: 'block', marginBottom: '0.375rem' }}>
              ⚡ Última hora
            </span>
          )}
          <h3
            className="card-hl font-normal mt-1.5 mb-3"
            style={{ fontSize: '1.5625rem', lineHeight: 1.2, letterSpacing: '-0.015em' }}
          >
            {n.titulo}
          </h3>
          <MetaRow source={n.fuente_nombre ?? 'Guajiro Digital'} date={n.created_at} />
        </div>
        {n.resumen && (
          <p className="font-sans leading-relaxed line-clamp-4 mt-1 md:border-l md:border-line md:pl-8"
            style={{ fontSize: '0.9375rem', color: '#4B4B4B', lineHeight: 1.65 }}>
            {n.resumen}
          </p>
        )}
      </article>
    </Link>
  )
}

// ─── Section layouts ──────────────────────────────────────────────────────────

function SectionLayoutA({ main, rest }: { main: Noticia; rest: Noticia[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-8 md:gap-12">
      <CardMain n={main} />
      {rest.length > 0 && (
        <div className="flex flex-col gap-0 md:border-l md:border-line md:pl-10">
          {rest.map((n) => <CardSecondary key={n.slug} n={n} />)}
        </div>
      )}
    </div>
  )
}

function SectionLayoutB({ n }: { n: Noticia }) {
  return <CardFeatureWide n={n} />
}

// ─── Editorial section definitions ───────────────────────────────────────────

const EDITORIAL_SECTIONS = [
  { cat: 'Apagones',   label: 'Apagones',                 desc: 'Colapso energético, Unión Eléctrica y apagones' },
  { cat: 'Represión',  label: 'Represión',                desc: 'Detenciones, operativos, Seguridad del Estado' },
  { cat: 'Economía',   label: 'Economía',                 desc: 'Inflación, dólar, escasez, remesas, crisis' },
  { cat: 'Protesta',   label: 'Protesta',                 desc: 'Cacerolazos, manifestaciones, estallidos sociales' },
  { cat: 'Régimen',    label: 'Régimen',                  desc: 'Cúpula, control político, declaraciones oficiales' },
  { cat: 'Oposición',  label: 'Oposición',                desc: 'Disidencia, presos políticos, activistas' },
  { cat: 'Opinión',    label: 'Opinión',                  desc: 'Análisis, columnas y perspectivas sobre Cuba' },
  { cat: 'Transición', label: 'Transición',               desc: 'Escenarios de cambio, fracturas internas, lectura política' },
  { cat: 'Denuncias',  label: 'Denuncias ciudadanas',     desc: 'Testimonios, abusos, crisis sanitaria' },
] as const

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  let noticias: Noticia[] = []
  let fetchError = false

  try {
    noticias = await getPublishedNoticias()
  } catch (e) {
    console.error('Error cargando noticias:', e)
    fetchError = true
  }

  const lead     = noticias.find(n => n.destacada) ?? noticias[0]
  const leadSlug = lead?.slug

  const secondary = noticias
    .filter(n => n.slug !== leadSlug)
    .slice(0, 3)

  const sidebarSlugs = new Set([leadSlug, ...secondary.map(n => n.slug)])

  const ultimaHoraItems = noticias
    .filter(n => n.ultima_hora)
    .slice(0, 8)

  const bySection = (cat: string) =>
    noticias.filter(n => n.categoria === cat && !sidebarSlugs.has(n.slug)).slice(0, 4)

  const latestBreaking = ultimaHoraItems[0] ?? lead


  return (
    <>
      {/* ── Top bar ── */}
      <div style={{ background: '#1A1A1A' }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1140, padding: '0.5rem 2rem' }}>
          <span className="font-sans uppercase" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.4)' }}>
            Periodismo independiente sobre Cuba
          </span>
          <time className="font-sans tabular-nums" style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.28)' }} dateTime={new Date().toISOString()}>
            {new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric' })} · {new Date().toLocaleTimeString('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hour12: false })} (hora de Madrid)
          </time>
        </div>
      </div>

      {/* ── Masthead ── */}
      <header className="bg-bg">
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '3rem 2rem 0' }}>
          <p className="text-center font-sans" style={{ fontSize: '0.625rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#C8BFB0', marginBottom: '1.25rem' }}>
            Fundado en España · 18 de marzo de 2026
          </p>
          <div style={{ borderTop: '1px solid #E0D9CC', marginBottom: '1.75rem' }} />

          {/* Logo lockup */}
          <div className="flex items-center justify-center" style={{ gap: '1.25rem' }}>
            <div style={{ position: 'relative', width: 52, height: 52, borderRadius: '50%', overflow: 'hidden', border: '1px solid #C8BFB0', flexShrink: 0 }}>
              <Image src="/GuajiroDigital.jpeg" alt="Guajiro Digital" fill className="object-cover" style={{ filter: 'grayscale(12%)' }} sizes="52px" priority />
            </div>
            <h1 className="font-serif font-normal text-ink" style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.03em' }}>
              Guajiro Digital
            </h1>
          </div>

          <p className="text-center font-sans" style={{ fontSize: '0.8125rem', letterSpacing: '0.06em', color: '#767676', marginTop: '0.875rem', marginBottom: '1.75rem' }}>
            Chapeando con la derecha, porque la izquierda no funciona
          </p>

          <div style={{ borderTop: '2.5px solid #151515' }} />
          <div style={{ borderTop: '1px solid #E0D9CC', marginTop: 3 }} />
        </div>

        {/* Functional actions */}
        <div className="mx-auto flex items-center justify-end" style={{ maxWidth: 1140, padding: '0.625rem 2rem', gap: '1.5rem' }}>
          <Link href="/#denuncias" className="font-sans" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#383838', flexShrink: 0 }} />
            Enviar denuncia →
          </Link>
          <Link href="/mule#enviar-caso" className="font-sans" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#6B1F1F', flexShrink: 0 }} />
            MULE →
          </Link>
          <SearchButton />
        </div>

        {/* Breaking bar — latest última hora or lead */}
        {latestBreaking && (
          <div style={{ background: '#6B1F1F' }}>
            <div className="mx-auto flex items-center" style={{ maxWidth: 1140, padding: '0.6rem 2rem', gap: '1rem' }}>
              <span className="font-sans font-semibold flex-shrink-0" style={{ fontSize: '0.5875rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
                {ultimaHoraItems.length > 0 ? '⚡ Última hora' : 'Último momento'}
              </span>
              <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
              <Link href={`/noticias/${latestBreaking.slug}`} className="font-sans truncate" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', textDecoration: 'none' }}>
                {latestBreaking.titulo}
              </Link>
              {ultimaHoraItems.length > 0 && (
                <Link href="/ultima-hora" className="font-sans flex-shrink-0" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', marginLeft: 'auto' }}>
                  Ver todo →
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="bg-bg/95 sticky top-0 z-40" style={{ backdropFilter: 'blur(8px)', borderBottom: '1px solid #E0D9CC' }} aria-label="Secciones">
          <div className="mx-auto flex items-center" style={{ maxWidth: 1140, padding: '0 2rem' }}>
            <ul className="flex items-center overflow-x-auto scrollbar-none flex-1">
              {NAV_ITEMS.map(({ label, href }) => (
                <li key={label} style={{ flexShrink: 0 }}>
                  <Link
                    href={href}
                    className="nav-link"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* ── Main ── */}
      <main className="mx-auto" style={{ maxWidth: 1140, padding: '3.5rem 2rem 4rem' }}>

        {/* Empty state */}
        {noticias.length === 0 && (
          <div style={{ padding: '5rem 0', textAlign: 'center' }}>
            <p className="font-serif" style={{ fontSize: '1.375rem', color: '#C8BFB0', fontStyle: 'italic' }}>
              {fetchError
                ? 'No se pudo conectar con la base de datos.'
                : 'Próximamente: las últimas noticias de Cuba.'}
            </p>
            {fetchError && (
              <p className="font-sans" style={{ fontSize: '0.8125rem', color: '#C8BFB0', marginTop: '0.5rem' }}>
                Comprueba las variables de entorno de Supabase en .env.local
              </p>
            )}
          </div>
        )}

        {/* ── Lead story ── */}
        {lead && (
          <section id="portada" style={{ marginBottom: '4rem' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[5fr_2fr]" style={{ gap: '0 3.5rem' }}>
              {/* Lead */}
              <div className="lg:border-r lg:border-line lg:pr-14 border-b border-line pb-10 mb-10 lg:mb-0">
                <CatLabel label={lead.categoria} />
                {lead.ultima_hora && (
                  <span className="font-sans font-semibold" style={{ fontSize: '0.5875rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6B1F1F', marginLeft: '0.875rem' }}>
                    ⚡ Última hora
                  </span>
                )}
                <Link href={`/noticias/${lead.slug}`} className="block group">
                  <h2
                    className="card-hl font-normal mt-2 mb-5"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', lineHeight: 1.09, letterSpacing: '-0.025em' }}
                  >
                    {lead.titulo}
                  </h2>
                </Link>
                {lead.imagen_url && (
                  <Image
                    src={lead.imagen_url}
                    alt=""
                    width={860}
                    height={600}
                    style={{ width: '100%', height: 'auto', display: 'block', filter: 'grayscale(8%)', marginBottom: '1.5rem' }}
                    sizes="(max-width: 1024px) 100vw, 680px"
                    priority
                  />
                )}
                {lead.resumen && (
                  <p className="lead-dek mb-6" style={{ maxWidth: '40rem' }}>{lead.resumen}</p>
                )}
                <div className="meta-row flex items-center flex-wrap" style={{ gap: '0.5rem 1rem', borderTop: '1px solid #E0D9CC', paddingTop: '1rem' }}>
                  <span className="font-medium" style={{ color: '#151515' }}>
                    {lead.fuente_nombre ?? 'Guajiro Digital'}
                  </span>
                  <span style={{ color: '#C8BFB0' }}>·</span>
                  <time dateTime={lead.created_at} style={{ color: '#767676' }}>{fmtDate(lead.created_at)}</time>
                  <span style={{ color: '#C8BFB0' }}>·</span>
                  <Link href={`/noticias/${lead.slug}`} className="font-medium hover:underline" style={{ color: '#6B1F1F' }}>
                    Leer artículo →
                  </Link>
                </div>
              </div>

              {/* Secondary sidebar */}
              <div className="flex flex-col" style={{ gap: 0 }}>
                {secondary.map((n, i) => (
                  <Link key={n.slug} href={`/noticias/${n.slug}`} className="block group" style={{ borderTop: i === 0 ? 'none' : '1px solid #E0D9CC', paddingTop: i === 0 ? 0 : '1.25rem', paddingBottom: '1.25rem' }}>
                    <article>
                      {n.imagen_url && (
                        <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', overflow: 'hidden', marginBottom: '0.875rem', background: '#F0EDE6' }}>
                          <Image
                            src={n.imagen_url}
                            alt=""
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top', filter: 'grayscale(10%)' }}
                            sizes="(max-width: 1024px) 50vw, 220px"
                          />
                        </div>
                      )}
                      <CatLabel label={n.categoria} />
                      {n.ultima_hora && (
                        <span className="font-sans" style={{ fontSize: '0.5625rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6B1F1F', marginLeft: '0.75rem' }}>
                          ⚡
                        </span>
                      )}
                      <h3 className="card-hl font-normal mt-1.5" style={{ fontSize: '1.0625rem', lineHeight: 1.32, letterSpacing: '-0.005em', marginBottom: '0.625rem' }}>
                        {n.titulo}
                      </h3>
                      <div className="meta-row">{fmtDateShort(n.created_at)}</div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Última hora ── */}
        {ultimaHoraItems.length > 0 && (
          <section id="ultima-hora" style={{ marginBottom: '4rem' }}>
            <div style={{ background: '#141414', padding: '2rem 2.5rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.875rem' }}>
                <div className="flex items-center" style={{ gap: '0.625rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#6B1F1F', flexShrink: 0 }} />
                  <span className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                    Última hora
                  </span>
                </div>
                <Link href="/ultima-hora" className="font-sans" style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.04em' }}>
                  Ver todo →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '0 3rem' }}>
                {ultimaHoraItems.map((n, i) => (
                  <Link key={n.slug} href={`/noticias/${n.slug}`} className="block group" style={{ borderTop: i < 2 ? 'none' : '1px solid rgba(255,255,255,0.07)', paddingTop: i < 2 ? 0 : '1rem', paddingBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                    <time dateTime={n.created_at} className="font-sans tabular-nums flex-shrink-0" style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.25)', width: '2.75rem', paddingTop: '0.15rem' }}>
                      {fmtTime(n.created_at)}
                    </time>
                    <div>
                      <span className="font-sans" style={{ fontSize: '0.5625rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: '0.2rem' }}>
                        {n.categoria}
                      </span>
                      <span className="font-sans" style={{ fontSize: '0.9375rem', fontWeight: 400, lineHeight: 1.4, color: 'rgba(255,255,255,0.82)', display: 'block' }}>
                        {n.titulo}
                      </span>
                      <span className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.28)', marginTop: '0.25rem', display: 'block' }}>
                        {n.fuente_nombre ?? 'Guajiro Digital'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Editorial sections ── */}
        {EDITORIAL_SECTIONS.map(({ cat, label }) => {
          const items = bySection(cat)
          if (items.length === 0) return null
          const [main, ...rest] = items
          return (
            <section key={cat} id={CAT_SLUG[cat] ?? cat.toLowerCase()} style={{ marginBottom: '3.75rem' }}>
              <SectionRule label={label} cat={cat} />
              {rest.length === 0
                ? <SectionLayoutB n={main} />
                : <SectionLayoutA main={main} rest={rest} />}
            </section>
          )
        })}

        {/* ── Sistema MULE ── */}
        <section id="mule" style={{ borderTop: '1px solid #E0D9CC', padding: '2.5rem 0', marginBottom: '0' }}>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]" style={{ gap: '1.5rem 4rem', alignItems: 'start' }}>
            <div>
              <p className="font-sans" style={{ fontSize: '0.5875rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#9E9689', marginBottom: '0.5rem' }}>
                Sistema MULE
              </p>
              <h2 className="font-serif font-normal text-ink" style={{ fontSize: '1.375rem', lineHeight: 1.18, letterSpacing: '-0.012em', marginBottom: '0.625rem' }}>
                Mecanismo Unificado de Logística de Emergencia
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
              <p className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#4B4B4B' }}>
                Canal de visibilización y conexión para urgencias reales: medicamentos urgentes, alimentos básicos y necesidades críticas de familias vulnerables en Cuba.
              </p>
              <Link href="/mule#enviar-caso" className="font-sans font-medium" style={{ fontSize: '0.875rem', color: '#6B1F1F', textDecoration: 'none', letterSpacing: '0.02em', borderBottom: '1px solid #6B1F1F', paddingBottom: '1px', alignSelf: 'flex-start' }}>
                Enviar un caso urgente →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Denuncias form ── */}
        <section id="denuncias" style={{ borderTop: '2.5px solid #151515', borderBottom: '1px solid #E0D9CC', padding: '3.5rem 0', marginBottom: '0' }}>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr]" style={{ gap: '2.5rem 4rem', alignItems: 'start' }}>
            <div>
              <span className="cat-label" style={{ marginBottom: '1rem', display: 'block' }}>Denuncias y testimonios</span>
              <h2 className="font-serif font-normal text-ink" style={{ fontSize: '1.875rem', lineHeight: 1.15, letterSpacing: '-0.015em', marginBottom: '1rem', textWrap: 'balance' }}>
                Envía tu denuncia o testimonio
              </h2>
              <p className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#4B4B4B', marginBottom: '1.25rem' }}>
                Recibimos testimonios, documentos y denuncias sobre la realidad cubana. Tu identidad está protegida. Toda información es verificada antes de publicarse.
              </p>
              <p className="font-sans" style={{ fontSize: '0.8125rem', color: '#767676', lineHeight: 1.6 }}>
                Cada envío llega directamente al panel privado de la redacción. No se publica nada sin verificación previa.
              </p>
            </div>
            <DenunciasForm />
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer style={{ background: '#111111' }}>
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '3.5rem 2rem 2.5rem' }}>

          {/* Quiénes somos — bloque institucional completo */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '2rem 5rem', paddingBottom: '2.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '2.75rem' }}>
            <div>
              <h2 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1rem' }}>
                Quiénes somos
              </h2>
              <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)' }}>
                Guajiro Digital es un proyecto periodístico independiente impulsado por el Equipo Guajiro Digital. Nace de la necesidad de ofrecer una lectura más clara, rigurosa y honesta de la realidad cubana frente a coberturas que, por sesgo, equidistancia o falta de contexto, no siempre reflejan con precisión lo que sucede en la isla.
              </p>
              <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', marginTop: '0.875rem' }}>
                Es un proyecto sin ánimo de lucro y de acceso libre: no exige suscripción para leer. Su prioridad es informar con claridad, sin artificios y sin barreras innecesarias. La dirección editorial del proyecto está respaldada por formación científica y una cultura de rigor, método y verificación.
              </p>
            </div>
            <div>
              <h2 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1rem' }}>
                Principios editoriales
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', listStyle: 'none', margin: 0, padding: 0 }}>
                {[
                  'Independencia editorial. Sin financiación de gobiernos, instituciones ni partidos políticos.',
                  'Acceso libre. Sin muros de pago, sin suscripciones, sin registros obligatorios.',
                  'Privacidad. Sin cookies ni rastreo de lectores.',
                  'Verificación. Ningún contenido se publica sin comprobación previa.',
                  'Claridad. Información directa sobre Cuba, sin relativizaciones ni eufemismos.',
                ].map((item, i) => (
                  <li key={i} className="font-sans" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.38)', display: 'flex', gap: '0.625rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Logo + secciones + participar */}
          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr_1fr]" style={{ gap: '2.5rem 4rem', marginBottom: '3rem' }}>
            <div>
              <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
                  <Image src="/GuajiroDigital.jpeg" alt="Guajiro Digital" fill className="object-cover" style={{ filter: 'grayscale(40%)' }} sizes="36px" />
                </div>
                <span className="font-serif font-normal" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.85)' }}>Guajiro Digital</span>
              </div>
              <p className="font-sans" style={{ fontSize: '0.8125rem', lineHeight: 1.65, color: 'rgba(255,255,255,0.28)', fontStyle: 'italic' }}>
                Chapeando con la derecha, porque la izquierda no funciona
              </p>
              <p className="font-sans" style={{ fontSize: '0.6875rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.16)', marginTop: '1.25rem' }}>
                Fundado en España · 18 de marzo de 2026
              </p>
            </div>
            <div>
              <h3 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1.25rem' }}>Secciones</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {[
                  { label: 'Última hora', href: '/ultima-hora' },
                  { label: 'Apagones',    href: '/seccion/apagones' },
                  { label: 'Represión',   href: '/seccion/represion' },
                  { label: 'Economía',    href: '/seccion/economia' },
                  { label: 'Protesta',    href: '/seccion/protesta' },
                  { label: 'Régimen',     href: '/seccion/regimen' },
                  { label: 'Oposición',   href: '/seccion/oposicion' },
                  { label: 'Opinión',     href: '/seccion/opinion' },
                  { label: 'Transición',  href: '/seccion/transicion' },
                ].map(({ label, href }) => (
                  <li key={label}><Link href={href} className="footer-link font-sans">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: '1.25rem' }}>Contacto</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                <li><a href="/#denuncias" className="footer-link font-sans">Enviar denuncia</a></li>
                <li><a href="mailto:redaccion@guajirodigital.com" className="footer-link font-sans">Redacción</a></li>
                <li><a href="mailto:prensa@guajirodigital.com" className="footer-link font-sans">Prensa</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-sans" style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
              © {new Date().getFullYear()} Guajiro Digital. Todos los derechos reservados.
            </span>
            <span className="font-sans" style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.14)', letterSpacing: '0.04em' }}>
              Proyecto independiente sin ánimo de lucro · Acceso libre · Sin cookies ni rastreo
            </span>
          </div>

        </div>
      </footer>
    </>
  )
}
