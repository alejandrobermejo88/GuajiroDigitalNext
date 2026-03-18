import Link from 'next/link'
import AdminTopBar from '@/components/AdminTopBar'
import NoticiaForm from '@/components/NoticiaForm'
import { createNoticiaAction } from '../actions'

export default function NuevaNoticiaPage() {
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
          }}>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676' }}>
              Nueva noticia
            </span>
          </div>

          <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.75rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.015em', marginTop: '0.875rem' }}>
            Crear noticia
          </h1>
        </div>

        <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '2rem 2.5rem' }}>
          <NoticiaForm saveAction={createNoticiaAction} />
        </div>

      </div>
    </div>
  )
}
