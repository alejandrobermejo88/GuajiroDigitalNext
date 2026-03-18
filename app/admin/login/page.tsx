import Image from 'next/image'
import AdminLoginForm from '@/components/AdminLoginForm'

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: '#F7F4EE',
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.875rem',
          marginBottom: '2.5rem',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 36,
            height: 36,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid #C8BFB0',
            flexShrink: 0,
          }}
        >
          <Image
            src="/GuajiroDigital.jpeg"
            alt="Guajiro Digital"
            fill
            className="object-cover"
            sizes="36px"
          />
        </div>
        <span
          style={{
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: '1.5rem',
            fontWeight: 400,
            color: '#151515',
            letterSpacing: '-0.02em',
          }}
        >
          Guajiro Digital
        </span>
      </div>

      {/* Card */}
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#FEFCF8',
          border: '1px solid #E0D9CC',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.625rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#6B1F1F',
              marginBottom: '0.5rem',
            }}
          >
            Panel de administración
          </p>
          <h1
            style={{
              fontFamily: 'Newsreader, Georgia, serif',
              fontSize: '1.625rem',
              fontWeight: 400,
              color: '#151515',
              letterSpacing: '-0.015em',
              lineHeight: 1.2,
            }}
          >
            Acceso privado
          </h1>
        </div>

        <div style={{ borderTop: '1px solid #E0D9CC', marginBottom: '1.75rem' }} />

        <AdminLoginForm />
      </div>

      <p
        style={{
          marginTop: '1.5rem',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.75rem',
          color: '#C8BFB0',
        }}
      >
        Sólo para uso interno de la redacción.
      </p>
    </main>
  )
}
