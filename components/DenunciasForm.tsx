'use client'

import { useState } from 'react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

const PROVINCIAS = [
  'La Habana', 'Santiago de Cuba', 'Holguín', 'Camagüey',
  'Villa Clara', 'Cienfuegos', 'Matanzas', 'Granma',
  'Las Tunas', 'Guantánamo', 'Pinar del Río', 'Artemisa',
  'Mayabeque', 'Sancti Spíritus', 'Ciego de Ávila', 'Isla de la Juventud',
]

const TIPOS = [
  'Represión / detención',
  'Apagón / falta de servicios',
  'Escasez de alimentos o medicinas',
  'Corrupción',
  'Violación de derechos',
  'Otro',
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

export default function DenunciasForm() {
  const [state,    setState]    = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fields,   setFields]   = useState({
    nombre:   '',
    provincia: '',
    tipo:     '',
    mensaje:  '',
  })

  function update(k: keyof typeof fields, v: string) {
    setFields((f) => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (fields.mensaje.trim().length < 10) {
      setErrorMsg('El mensaje debe tener al menos 10 caracteres.')
      return
    }

    setState('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/denuncias', {
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
        setFields({ nombre: '', provincia: '', tipo: '', mensaje: '' })
      }
    } catch {
      setErrorMsg('Error de red. Comprueba tu conexión.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div
        style={{
          padding: '2rem',
          border: '1px solid #C8BFB0',
          background: '#FEFCF8',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: '1.25rem',
            color: '#151515',
            marginBottom: '0.5rem',
            fontStyle: 'italic',
          }}
        >
          Tu denuncia fue recibida.
        </p>
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            color: '#767676',
          }}
        >
          La revisaremos y verificaremos antes de publicarla. Gracias.
        </p>
        <button
          onClick={() => setState('idle')}
          style={{
            marginTop: '1.25rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8125rem',
            color: '#6B1F1F',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Enviar otra denuncia
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Nombre + Provincia */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle} htmlFor="nombre">Nombre (opcional)</label>
          <input
            id="nombre"
            type="text"
            value={fields.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            placeholder="Anónimo"
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = '#C8BFB0' }}
            onBlur={(e)  => { e.target.style.borderColor = '#E0D9CC' }}
          />
        </div>
        <div>
          <label style={labelStyle} htmlFor="provincia">Provincia</label>
          <select
            id="provincia"
            value={fields.provincia}
            onChange={(e) => update('provincia', e.target.value)}
            style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
            onFocus={(e) => { e.target.style.borderColor = '#C8BFB0' }}
            onBlur={(e)  => { e.target.style.borderColor = '#E0D9CC' }}
          >
            <option value="">Seleccionar…</option>
            {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Tipo */}
      <div>
        <label style={labelStyle} htmlFor="tipo">Tipo de denuncia</label>
        <select
          id="tipo"
          value={fields.tipo}
          onChange={(e) => update('tipo', e.target.value)}
          style={{ ...inputStyle, appearance: 'none', WebkitAppearance: 'none' }}
          onFocus={(e) => { e.target.style.borderColor = '#C8BFB0' }}
          onBlur={(e)  => { e.target.style.borderColor = '#E0D9CC' }}
        >
          <option value="">Seleccionar…</option>
          {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label style={labelStyle} htmlFor="mensaje">Tu mensaje *</label>
        <textarea
          id="mensaje"
          required
          rows={5}
          value={fields.mensaje}
          onChange={(e) => update('mensaje', e.target.value)}
          placeholder="Describe lo que ocurrió con el mayor detalle posible…"
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          onFocus={(e) => { e.target.style.borderColor = '#C8BFB0' }}
          onBlur={(e)  => { e.target.style.borderColor = '#E0D9CC' }}
        />
      </div>

      {/* Error */}
      {(state === 'error' || errorMsg) && (
        <p
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8125rem',
            color: '#6B1F1F',
            margin: 0,
          }}
        >
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
        {state === 'sending' ? 'Enviando…' : 'Enviar denuncia'}
      </button>
    </form>
  )
}
