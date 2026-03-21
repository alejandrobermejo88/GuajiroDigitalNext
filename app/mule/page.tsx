import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import MuleForm from '@/components/MuleForm'

export const metadata = {
  title: 'Sistema MULE — Guajiro Digital',
  description: 'Mecanismo Unificado de Logística de Emergencia. Canal de visibilización y conexión para urgencias reales: medicamentos, alimentos y necesidades básicas.',
}

export default function MulePage() {
  return (
    <>
      <SiteHeader activeSection="MULE" />

      <main className="mx-auto" style={{ maxWidth: 940, padding: '3rem 2rem 5rem' }}>

        {/* ── Cabecera ── */}
        <div style={{ marginBottom: '2.5rem', borderBottom: '2.5px solid #151515', paddingBottom: '1.25rem' }}>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#9E9689', marginBottom: '0.75rem' }}>
            Sistema MULE
          </p>
          <div style={{ borderTop: '1px solid #E0D9CC', marginBottom: '1rem' }} />
          <h1 className="font-serif font-normal text-ink" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Mecanismo Unificado de Logística de Emergencia
          </h1>
          <p className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.6, color: '#4B4B4B', maxWidth: '38rem' }}>
            Canal de visibilización y conexión para urgencias reales. No garantiza solución universal. Facilita conexiones directas entre quienes necesitan ayuda y quienes pueden ofrecerla.
          </p>
        </div>

        {/* ── Contenido + formulario ── */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: '3rem 4rem', alignItems: 'start' }}>

          {/* Columna izquierda */}
          <div>

            {/* Texto institucional */}
            <p className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: '#383838', marginBottom: '2rem' }}>
              El Sistema MULE nace como extensión del compromiso editorial de Guajiro Digital, orientado a visibilizar urgencias concretas —medicinas, alimentos y necesidades básicas— que afectan a sectores vulnerables. Cada caso se gestiona de forma local. Guajiro Digital actúa como canal, no como garante de resolución.
            </p>

            {/* Qué canalizamos */}
            <section style={{ marginBottom: '1.75rem', borderTop: '1px solid #E0D9CC', paddingTop: '1.5rem' }}>
              <h2 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.875rem' }}>
                Qué canalizamos
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Medicamentos urgentes — menores y pacientes crónicos',
                  'Alimentos básicos — familias en situación crítica',
                  'Urgencias localizadas con necesidad concreta identificada',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C8BFB0', flexShrink: 0 }}>—</span>
                    <span className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#383838' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Cómo funciona */}
            <section style={{ marginBottom: '1.75rem', borderTop: '1px solid #E0D9CC', paddingTop: '1.5rem' }}>
              <h2 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.875rem' }}>
                Cómo funciona
              </h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  ['01', 'Recepción', 'Tu caso llega a través del formulario.'],
                  ['02', 'Revisión',  'Verificamos que la urgencia es real y localizable.'],
                  ['03', 'Conexión',  'Facilitamos contacto directo entre las partes.'],
                ].map(([num, title, desc]) => (
                  <li key={num} style={{ display: 'flex', gap: '0.875rem', alignItems: 'baseline' }}>
                    <span className="font-sans" style={{ fontSize: '0.625rem', fontWeight: 700, color: '#C8BFB0', flexShrink: 0, minWidth: '1.25rem' }}>{num}</span>
                    <span className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#383838' }}>
                      <strong style={{ fontWeight: 600, color: '#151515' }}>{title}.</strong>{' '}{desc}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Límites */}
            <section style={{ borderTop: '1px solid #E0D9CC', paddingTop: '1.5rem' }}>
              <h2 className="font-sans font-semibold" style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.875rem' }}>
                Límites y alcance
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Sin garantía de resolución en ningún caso.',
                  'No es estructura institucional ni servicio público.',
                  'Tu teléfono no se publica sin consentimiento explícito.',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'baseline' }}>
                    <span style={{ fontSize: '0.75rem', color: '#C8BFB0', flexShrink: 0 }}>—</span>
                    <span className="font-sans" style={{ fontSize: '0.8125rem', lineHeight: 1.55, color: '#4B4B4B' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

          </div>

          {/* Columna derecha: formulario */}
          <div id="enviar-caso">
            <div style={{ borderTop: '2.5px solid #151515', paddingTop: '1.25rem', marginBottom: '1.25rem' }}>
              <h2 className="font-serif font-normal text-ink" style={{ fontSize: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.012em', marginBottom: '0.5rem' }}>
                Enviar un caso
              </h2>
              <p className="font-sans" style={{ fontSize: '0.8125rem', lineHeight: 1.6, color: '#767676' }}>
                Los campos con * son obligatorios.
              </p>
            </div>
            <MuleForm />
          </div>

        </div>

        {/* Volver */}
        <div style={{ borderTop: '1px solid #E0D9CC', paddingTop: '1.75rem', marginTop: '3.5rem' }}>
          <Link href="/" className="font-sans" style={{ fontSize: '0.8125rem', color: '#767676', textDecoration: 'none' }}>
            ← Volver a portada
          </Link>
        </div>

      </main>
    </>
  )
}
