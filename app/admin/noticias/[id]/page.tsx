import Link from 'next/link'
import { notFound } from 'next/navigation'
import AdminTopBar from '@/components/AdminTopBar'
import NoticiaForm from '@/components/NoticiaForm'
import DeleteButton from '@/components/DeleteButton'
import { adminGetNoticiaById } from '@/lib/noticias'
import { updateNoticiaAction, deleteNoticiaAction } from '../actions'

export const dynamic = 'force-dynamic'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ESTADO_STYLE: Record<string, { color: string; bg: string }> = {
  publicada: { color: '#1F6B3A', bg: '#EDF9F0' },
  borrador:  { color: '#767676', bg: '#F3F0EA' },
}

export default async function EditNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const noticia = await adminGetNoticiaById(id)
  if (!noticia) notFound()

  // Bind the server actions to this specific noticia id
  const updateAction = updateNoticiaAction.bind(null, noticia.id)
  const deleteAction = deleteNoticiaAction.bind(null, noticia.id)

  const st = ESTADO_STYLE[noticia.estado] ?? ESTADO_STYLE.borrador

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="noticias" />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Breadcrumb + header */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            href="/admin/noticias"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}
          >
            ← Volver a noticias
          </Link>

          <div style={{
            borderTop: '2.5px solid #151515',
            borderBottom: '1px solid #E0D9CC',
            paddingTop: '0.4rem',
            paddingBottom: '0.4rem',
            marginTop: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676' }}>
              Editar noticia
            </span>
            {/* Estado badge */}
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: st.color, background: st.bg, padding: '0.2rem 0.625rem' }}>
              {noticia.estado}
            </span>
          </div>

          {/* Title + meta */}
          <div style={{ marginTop: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
            <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.5rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.015em', lineHeight: 1.2, flex: 1 }}>
              {noticia.titulo}
            </h1>
            {noticia.estado === 'publicada' && (
              <Link
                href={`/noticias/${noticia.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#1F6B3A', textDecoration: 'none', whiteSpace: 'nowrap', border: '1px solid #C5E5D0', padding: '0.3rem 0.75rem', flexShrink: 0 }}
              >
                Ver publicada ↗
              </Link>
            )}
          </div>

          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', color: '#C8BFB0', marginTop: '0.375rem' }}>
            Creada: {fmtDate(noticia.created_at)} · Actualizada: {fmtDate(noticia.updated_at)}
          </p>
        </div>

        {/* Form */}
        <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '2rem 2.5rem', marginBottom: '1.5rem' }}>
          <NoticiaForm noticia={noticia} saveAction={updateAction} />
        </div>

        {/* Danger zone */}
        <div style={{
          border: '1px solid #F0E8E8',
          padding: '1.25rem 1.5rem',
          background: '#FEFCF8',
        }}>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8BFB0', marginBottom: '0.875rem' }}>
            Zona de peligro
          </p>
          <DeleteButton deleteAction={deleteAction} />
        </div>

      </div>
    </div>
  )
}
