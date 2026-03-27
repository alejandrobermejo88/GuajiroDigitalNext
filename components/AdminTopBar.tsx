import Image from 'next/image'
import Link from 'next/link'
import AdminLogoutButton from './AdminLogoutButton'

interface Props {
  active?: 'noticias' | 'denuncias' | 'mule' | 'aviso'
}

export default function AdminTopBar({ active }: Props) {
  const linkStyle = (section: string): React.CSSProperties => ({
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '0.8125rem',
    fontWeight: active === section ? 600 : 400,
    color: active === section ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
    textDecoration: 'none',
    padding: '0 0.125rem',
    borderBottom: active === section ? '2px solid #6B1F1F' : '2px solid transparent',
    paddingBottom: '2px',
    transition: 'color 0.15s',
  })

  return (
    <div style={{ background: '#1A1A1A' }}>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          height: 48,
          gap: '1.5rem',
        }}
      >
        {/* Brand */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginRight: '0.5rem' }}>
          <div style={{ position: 'relative', width: 22, height: 22, borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
            <Image src="/GuajiroDigital.jpeg" alt="" fill className="object-cover" style={{ filter: 'grayscale(30%)' }} sizes="22px" />
          </div>
          <span style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.65)', letterSpacing: '-0.01em' }}>
            Guajiro Digital
          </span>
        </Link>

        <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '0.875rem' }}>/</span>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          <Link href="/admin/noticias"  style={linkStyle('noticias')}>Noticias</Link>
          <Link href="/admin/denuncias" style={linkStyle('denuncias')}>Denuncias</Link>
          <Link href="/admin/mule"      style={linkStyle('mule')}>MULE</Link>
          <Link href="/admin/aviso"     style={linkStyle('aviso')}>Aviso</Link>
        </nav>

        {/* Right side */}
        <Link
          href="/"
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.3)',
            textDecoration: 'none',
            marginRight: '0.5rem',
          }}
        >
          ← Ver sitio
        </Link>

        <AdminLogoutButton />
      </div>
    </div>
  )
}
