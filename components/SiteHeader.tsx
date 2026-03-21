import Image from 'next/image'
import Link from 'next/link'
import { NAV_ITEMS } from '@/lib/nav'
import SearchButton from '@/components/SearchButton'

interface Props {
  activeSection?: string
}

export default function SiteHeader({ activeSection }: Props) {
  return (
    <>
      {/* Top bar */}
      <div style={{ background: '#1A1A1A' }}>
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1140, padding: '0.5rem 2rem' }}>
          <span className="font-sans" style={{ fontSize: '0.625rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>
            Periodismo independiente sobre Cuba
          </span>
          <Link href="/" className="font-sans" style={{ fontSize: '0.625rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.28)', textDecoration: 'none', textTransform: 'uppercase' }}>
            Guajiro Digital
          </Link>
        </div>
      </div>

      {/* Compact masthead + nav */}
      <header className="bg-bg">
        <div className="mx-auto" style={{ maxWidth: 1140, padding: '0.875rem 2rem', borderBottom: '1px solid #E0D9CC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative', width: 34, height: 34, borderRadius: '50%', overflow: 'hidden', border: '1px solid #C8BFB0', flexShrink: 0 }}>
              <Image src="/GuajiroDigital.jpeg" alt="Guajiro Digital" fill className="object-cover" style={{ filter: 'grayscale(12%)' }} sizes="34px" />
            </div>
            <span className="font-serif font-normal text-ink" style={{ fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
              Guajiro Digital
            </span>
          </Link>
          <Link href="/denuncias" className="font-sans" style={{ fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}>
            Enviar denuncia →
          </Link>
        </div>

        {/* Navigation */}
        <nav
          className="bg-bg/95 sticky top-0 z-40"
          style={{ backdropFilter: 'blur(8px)', borderBottom: '1px solid #E0D9CC' }}
          aria-label="Secciones"
        >
          <div className="mx-auto flex items-center" style={{ maxWidth: 1140, padding: '0 2rem' }}>
            <ul className="flex items-center overflow-x-auto scrollbar-none flex-1">
              {NAV_ITEMS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="nav-link"
                    style={activeSection === label
                      ? { color: '#6B1F1F', fontWeight: 600, borderBottom: '2px solid #6B1F1F' }
                      : undefined
                    }
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <SearchButton />
          </div>
        </nav>
      </header>
    </>
  )
}
