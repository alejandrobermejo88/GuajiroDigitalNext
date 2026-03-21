import Link from 'next/link'
import SiteHeader from '@/components/SiteHeader'
import MuleForm from '@/components/MuleForm'

export const metadata = {
  title: 'Sistema MULE — Guajiro Digital',
  description: 'Mecanismo Unificado de Logística de Emergencia. Canal de visibilización y conexión para urgencias reales: medicamentos, alimentos y necesidades básicas de sectores vulnerables.',
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MulePage() {
  return (
    <>
      <SiteHeader activeSection="MULE" />

      <main className="mx-auto" style={{ maxWidth: 940, padding: '3.5rem 2rem 5rem' }}>

        {/* ── Cabecera MULE ── */}
        <div style={{ marginBottom: '3rem', borderBottom: '2.5px solid #151515', paddingBottom: '1.5rem' }}>
          <p
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.625rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#9E9689',
              marginBottom: '0.875rem',
            }}
          >
            Sistema MULE
          </p>
          <div style={{ borderTop: '1px solid #E0D9CC', marginBottom: '1.25rem' }} />
          <h1
            className="font-serif font-normal text-ink"
            style={{ fontSize: 'clamp(1.625rem, 3.5vw, 2.5rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: '0.875rem' }}
          >
            Mecanismo Unificado de Logística de Emergencia
          </h1>
          <p
            className="font-sans"
            style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#4B4B4B', maxWidth: '42rem' }}
          >
            Canal de visibilización y conexión para urgencias reales que afectan a sectores vulnerables.
            No es una institución. No garantiza solución universal. Visibiliza y conecta.
          </p>
        </div>

        {/* ── Contenido principal ── */}
        <div className="grid grid-cols-1 md:grid-cols-[3fr_2fr]" style={{ gap: '3rem 4rem', alignItems: 'start' }}>

          {/* Columna izquierda: textos institucionales */}
          <div>

            {/* Texto institucional */}
            <section style={{ marginBottom: '2.5rem' }}>
              <p
                className="font-sans"
                style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#383838', marginBottom: '1rem' }}
              >
                Guajiro Digital es un proyecto periodístico independiente impulsado por el Equipo Guajiro
                Digital. Nace de la necesidad de ofrecer una lectura más clara, rigurosa y honesta de la
                realidad cubana frente a coberturas que, por sesgo, equidistancia o falta de contexto, no
                siempre reflejan con precisión lo que sucede en la isla.
              </p>
              <p
                className="font-sans"
                style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#383838', marginBottom: '1rem' }}
              >
                El Sistema MULE nace como una extensión de ese compromiso, orientado a visibilizar urgencias
                reales que afectan a sectores vulnerables. Se centra en necesidades concretas —medicinas,
                alimentos y recursos básicos— con el objetivo de facilitar conexiones directas entre quienes
                necesitan ayuda y quienes pueden ofrecerla.
              </p>
              <p
                className="font-sans"
                style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#383838', marginBottom: '1rem' }}
              >
                Cada caso se gestiona de forma local y particular. Guajiro Digital actúa como canal de
                visibilización y conexión, pero no sustituye instituciones ni garantiza resolución universal
                de las situaciones.
              </p>
              <p
                className="font-sans"
                style={{ fontSize: '0.9375rem', lineHeight: 1.75, color: '#383838' }}
              >
                La dirección editorial del proyecto está respaldada por formación científica y una cultura
                de rigor, método y verificación.
              </p>
            </section>

            {/* Qué canalizamos */}
            <section style={{ marginBottom: '2.5rem', borderTop: '1px solid #E0D9CC', paddingTop: '2rem' }}>
              <h2
                className="font-sans font-semibold"
                style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '1.25rem' }}
              >
                Qué canalizamos
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Medicamentos urgentes, especialmente para menores y pacientes crónicos',
                  'Alimentos básicos para familias en situación de vulnerabilidad extrema',
                  'Ayuda a familias con menores, enfermos o ancianos en situación crítica',
                  'Urgencias localizadas verificables con necesidad concreta identificada',
                  'Necesidades básicas no cubiertas por ningún canal institucional disponible',
                ].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'baseline' }}>
                    <span className="font-sans" style={{ fontSize: '0.75rem', color: '#C8BFB0', flexShrink: 0, marginTop: '0.1rem' }}>—</span>
                    <span className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#383838' }}>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Cómo funciona */}
            <section style={{ marginBottom: '2.5rem', borderTop: '1px solid #E0D9CC', paddingTop: '2rem' }}>
              <h2
                className="font-sans font-semibold"
                style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '1.25rem' }}
              >
                Cómo funciona
              </h2>
              <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0, margin: 0, counterReset: 'mule-steps' }}>
                {[
                  ['Recepción', 'El caso llega a través del formulario con la información necesaria para valorarlo.'],
                  ['Revisión mínima', 'El equipo verifica que la urgencia es real, localizada y tiene necesidad concreta identificable.'],
                  ['Visibilización o canalización', 'Si procede, se publica o se traslada a quienes puedan ayudar directamente.'],
                  ['Contacto directo', 'Se facilita la conexión entre las partes implicadas de forma controlada.'],
                  ['Resolución local', 'Cada caso tiene su propio contexto. No existe un protocolo universal.'],
                ].map(([title, desc], i) => (
                  <li key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                    <span
                      className="font-sans"
                      style={{ fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.08em', color: '#C8BFB0', flexShrink: 0, minWidth: '1.25rem' }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans" style={{ fontSize: '0.9375rem', lineHeight: 1.65, color: '#383838' }}>
                      <strong style={{ fontWeight: 600, color: '#151515' }}>{title}.</strong>{' '}{desc}
                    </span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Advertencia */}
            <section style={{ borderTop: '1px solid #E0D9CC', paddingTop: '2rem' }}>
              <h2
                className="font-sans font-semibold"
                style={{ fontSize: '0.625rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '1.25rem' }}
              >
                Límites y alcance
              </h2>
              <div
                style={{
                  padding: '1.25rem 1.5rem',
                  borderLeft: '3px solid #E0D9CC',
                  background: '#FEFCF8',
                }}
              >
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {[
                    'No se garantiza solución en ningún caso.',
                    'El Sistema MULE no es una estructura institucional.',
                    'No existe cobertura universal ni capacidad de atender todas las urgencias.',
                    'Cada caso depende de sus circunstancias reales y del contexto local.',
                    'Guajiro Digital visibiliza y conecta; no sustituye servicios públicos ni asistencia formal.',
                  ].map((item, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.625rem', alignItems: 'baseline' }}>
                      <span className="font-sans" style={{ fontSize: '0.75rem', color: '#C8BFB0', flexShrink: 0 }}>—</span>
                      <span className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#4B4B4B' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="font-sans" style={{ fontSize: '0.8125rem', color: '#9E9689', lineHeight: 1.6, marginTop: '1rem', fontStyle: 'italic' }}>
                Los datos de contacto facilitados —especialmente el número de teléfono— no se publicarán
                sin consentimiento explícito. Solo se utilizarán para la gestión interna del caso.
              </p>
            </section>

          </div>

          {/* Columna derecha: formulario */}
          <div>
            <div style={{ borderTop: '2.5px solid #151515', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
              <h2
                className="font-serif font-normal text-ink"
                style={{ fontSize: '1.375rem', lineHeight: 1.2, letterSpacing: '-0.012em', marginBottom: '0.625rem' }}
              >
                Enviar un caso
              </h2>
              <p className="font-sans" style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#767676', marginBottom: '1.5rem' }}>
                Rellena el formulario con el mayor detalle posible.
                Los campos marcados con * son obligatorios.
              </p>
            </div>
            <MuleForm />
          </div>

        </div>

        {/* Back link */}
        <div style={{ borderTop: '1px solid #E0D9CC', paddingTop: '2rem', marginTop: '4rem' }}>
          <Link
            href="/"
            className="font-sans"
            style={{ fontSize: '0.8125rem', color: '#767676', textDecoration: 'none', letterSpacing: '0.02em' }}
          >
            ← Volver a portada
          </Link>
        </div>

      </main>
    </>
  )
}
