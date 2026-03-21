'use client'

import { useState } from 'react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const TIPOS_URGENCIA = [
  'Medicamentos urgentes',
  'Alimentos básicos',
  'Ayuda a familia vulnerable',
  'Situación crítica — menor',
  'Situación crítica — enfermo',
  'Situación crítica — anciano',
  'Otra urgencia localizada',
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.9375rem',
  padding: '0.6875rem 0.875rem',
  background: '#FEFCF8',
  border: '1px solid #E0D9CC',
  color: '#151515',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#767676',
  marginBottom: '0.4rem',
}

const noteStyle: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.75rem',
  color: '#C8BFB0',
  marginTop: '0.3rem',
}

function focus(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = '#C8BFB0'
}
function blur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
  e.target.style.borderColor = '#E0D9CC'
}

export default function MuleForm() {
  const [state,    setState]    = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields,   setFields]   = useState({
    nombre:            '',
    telefono:          '',
    localidad:         '',
    tipo_urgencia:     '',
    descripcion:       '',
    persona_afectada:  '',
    necesidad_concreta:'',
  })

  function update(k: keyof typeof fields, v: string) {
    setFields(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!fields.telefono.trim()) {
      setErrorMsg('El teléfono de contacto es obligatorio.')
      return
    }
    if (!fields.tipo_urgencia) {
      setErrorMsg('Selecciona el tipo de urgencia.')
      return
    }
    if (fields.descripcion.trim().length < 10) {
      setErrorMsg('La descripción debe tener al menos 10 caracteres.')
      return
    }

    setState('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/mule', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(fields),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error ?? 'Error al enviar. Inténtalo de nuevo.')
        setState('error')
      } else {
        setState('success')
        setFields({ nombre: '', telefono: '', localidad: '', tipo_urgencia: '', descripcion: '', persona_afectada: '', necesidad_concreta: '' })
      }
    } catch {
      setErrorMsg('Error de red. Comprueba tu conexión.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div style={{ padding: '2rem', border: '1px solid #C8BFB0', background: '#FEFCF8', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.25rem', color: '#151515', marginBottom: '0.5rem', fontStyle: 'italic' }}>
          Tu caso fue recibido.
        </p>
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.875rem', color: '#767676', lineHeight: 1.6 }}>
          Lo revisaremos en el menor tiempo posible. No publicaremos tus datos de contacto sin tu consentimiento expreso.
        </p>
        <button
          onClick={() => setState('idle')}
          style={{ marginTop: '1.25rem', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#6B1F1F', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Enviar otro caso
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>

      {/* Teléfono — campo prioritario */}
      <div>
        <label style={labelStyle} htmlFor="m-telefono">Teléfono de contacto *</label>
        <input
          id="m-telefono"
          type="tel"
          required
          value={fields.telefono}
          onChange={e => update('telefono', e.target.value)}
          placeholder="+53 5 000 0000"
          style={inputStyle}
          onFocus={focus}
          onBlur={blur}
        />
        <p style={noteStyle}>No se publicará sin consentimiento expreso.</p>
      </div>

      {/* Localidad + Tipo */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
        <div>
          <label style={labelStyle} htmlFor="m-localidad">Localidad *</label>
          <input
            id="m-localidad"
            type="text"
            required
            value={fields.localidad}
            onChange={e => update('localidad', e.target.value)}
            placeholder="Municipio o barrio"
            style={inputStyle}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="m-tipo">Tipo de urgencia *</label>
          <select
            id="m-tipo"
            required
            value={fields.tipo_urgencia}
            onChange={e => update('tipo_urgencia', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
            onFocus={focus}
            onBlur={blur}
          >
            <option value="">Seleccionar…</option>
            {TIPOS_URGENCIA.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label style={labelStyle} htmlFor="m-desc">Descripción *</label>
        <textarea
          id="m-desc"
          required
          rows={3}
          value={fields.descripcion}
          onChange={e => update('descripcion', e.target.value)}
          placeholder="Describe brevemente la situación…"
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      {/* Necesidad concreta */}
      <div>
        <label style={labelStyle} htmlFor="m-necesidad">Necesidad concreta</label>
        <input
          id="m-necesidad"
          type="text"
          value={fields.necesidad_concreta ?? ''}
          onChange={e => update('necesidad_concreta', e.target.value)}
          placeholder="Ej: Insulina 30 UI, leche en polvo, pañales…"
          style={inputStyle}
          onFocus={focus}
          onBlur={blur}
        />
      </div>

      {/* Campos secundarios */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
        <div>
          <label style={{ ...labelStyle, color: '#C8BFB0' }} htmlFor="m-nombre">Nombre (opcional)</label>
          <input
            id="m-nombre"
            type="text"
            value={fields.nombre}
            onChange={e => update('nombre', e.target.value)}
            placeholder="Anónimo si prefiere"
            style={{ ...inputStyle, color: '#767676' }}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
        <div>
          <label style={{ ...labelStyle, color: '#C8BFB0' }} htmlFor="m-persona">Persona afectada (opcional)</label>
          <input
            id="m-persona"
            type="text"
            value={fields.persona_afectada}
            onChange={e => update('persona_afectada', e.target.value)}
            placeholder="Ej: niña 4 años…"
            style={{ ...inputStyle, color: '#767676' }}
            onFocus={focus}
            onBlur={blur}
          />
        </div>
      </div>

      {/* Error */}
      {(state === 'error' || errorMsg) && (
        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.8125rem', color: '#6B1F1F', margin: 0 }}>
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'sending'}
        style={{
          alignSelf: 'flex-start',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          padding: '0.8125rem 1.75rem',
          background: state === 'sending' ? '#383838' : '#151515',
          color: '#F7F4EE',
          border: 'none',
          cursor: state === 'sending' ? 'wait' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {state === 'sending' ? 'Enviando…' : 'Enviar caso'}
      </button>
    </form>
  )
}
