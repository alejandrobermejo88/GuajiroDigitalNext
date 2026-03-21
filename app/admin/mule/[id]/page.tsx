import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase-admin'
import AdminTopBar from '@/components/AdminTopBar'
import MuleEstadoSelector from '@/components/MuleEstadoSelector'
import { deleteMuleCaseAction } from '../actions'

export const dynamic = 'force-dynamic'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

const ESTADO_STYLE: Record<string, { color: string; bg: string; label: string }> = {
  pendiente:  { color: '#6B1F1F', bg: '#F9EDED', label: 'Pendiente'  },
  en_gestion: { color: '#1F4A6B', bg: '#EDF2F9', label: 'En gestión' },
  resuelta:   { color: '#1F6B3A', bg: '#EDF9F0', label: 'Resuelta'   },
  archivada:  { color: '#767676', bg: '#F3F0EA', label: 'Archivada'  },
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const sb = createAdminClient()
  const { data, error } = await sb
    .from('urgencias_mule')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) notFound()

  const caso = data
  const st = ESTADO_STYLE[caso.estado] ?? ESTADO_STYLE.pendiente

  function Field({ label, value, mono = false }: { label: string; value: string | null; mono?: boolean }) {
    return (
      <div style={{ paddingBottom: '1.25rem', borderBottom: '1px solid #F0EDE6' }}>
        <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.375rem' }}>
          {label}
        </div>
        {value ? (
          <div style={{
            fontFamily: mono ? 'ui-monospace, monospace' : 'Newsreader, Georgia, serif',
            fontSize: mono ? '0.9375rem' : '1rem',
            color: '#151515',
            lineHeight: 1.6,
          }}>
            {value}
          </div>
        ) : (
          <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#C8BFB0', fontStyle: 'italic' }}>
            No proporcionado
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EE' }}>
      <AdminTopBar active="mule" />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '2.5rem 2rem 4rem' }}>

        {/* Back */}
        <Link
          href="/admin/mule"
          style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', textDecoration: 'none', display: 'inline-block', marginBottom: '1.75rem' }}
        >
          ← Volver a Urgencias MULE
        </Link>

        {/* Page header */}
        <div style={{
          borderTop: '2.5px solid #151515',
          borderBottom: '1px solid #E0D9CC',
          paddingTop: '0.4rem',
          paddingBottom: '0.4rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.375rem', fontWeight: 400, color: '#151515', letterSpacing: '-0.012em' }}>
              {caso.tipo_urgencia}
            </h1>
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#767676', marginTop: '0.25rem' }}>
              {fmtDate(caso.created_at)}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <span style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.6875rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: st.color,
              background: st.bg,
              padding: '0.3rem 0.75rem',
            }}>
              {st.label}
            </span>
            <MuleEstadoSelector id={caso.id} estado={caso.estado} />
          </div>
        </div>

        {/* Fields */}
        <div style={{ background: '#FEFCF8', border: '1px solid #E0D9CC', padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Contacto — datos privados */}
          <div style={{ background: '#F0EDE6', border: '1px solid #E0D9CC', padding: '1rem 1.25rem', marginBottom: '0.5rem' }}>
            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#767676', marginBottom: '0.875rem' }}>
              Datos de contacto — privados
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Nombre de contacto" value={caso.nombre} />
              <Field label="Teléfono de contacto" value={caso.telefono} mono />
            </div>
          </div>

          <Field label="Tipo de urgencia"    value={caso.tipo_urgencia} />
          <Field label="Localidad / municipio" value={caso.localidad} />
          <Field label="Persona o personas afectadas" value={caso.persona_afectada} />
          <Field label="Descripción de la situación"  value={caso.descripcion} />
          <Field label="Necesidad concreta"           value={caso.necesidad_concreta} />

        </div>

        {/* Delete action */}
        <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #E0D9CC' }}>
          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#9E9689', marginBottom: '1rem' }}>
            Eliminar el caso de forma permanente. Esta acción no se puede deshacer.
          </p>
          <form action={deleteMuleCaseAction}>
            <input type="hidden" name="id" value={caso.id} />
            <button
              type="submit"
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.8125rem',
                fontWeight: 500,
                padding: '0.5rem 1.125rem',
                background: 'transparent',
                border: '1px solid #E0D9CC',
                color: '#767676',
                cursor: 'pointer',
                letterSpacing: '0.02em',
              }}
            >
              Eliminar caso
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
