'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router  = useRouter()
  const [pwd,   setPwd]   = useState('')
  const [error, setError] = useState('')
  const [busy,  setBusy]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      const res = await fetch('/api/admin/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ password: pwd }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al iniciar sesión')
      } else {
        router.push('/admin/noticias')
        router.refresh()
      }
    } catch {
      setError('Error de red. Inténtalo de nuevo.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 360 }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <label
          htmlFor="password"
          style={{
            display: 'block',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#767676',
            marginBottom: '0.5rem',
          }}
        >
          Contraseña de administración
        </label>
        <input
          id="password"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          autoFocus
          required
          placeholder="••••••••"
          style={{
            width: '100%',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '1rem',
            padding: '0.75rem 1rem',
            border: error ? '1px solid #6B1F1F' : '1px solid #E0D9CC',
            background: '#FEFCF8',
            color: '#151515',
            outline: 'none',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = '#C8BFB0'
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = '#E0D9CC'
          }}
        />
        {error && (
          <p
            style={{
              marginTop: '0.5rem',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8125rem',
              color: '#6B1F1F',
            }}
          >
            {error}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        style={{
          width: '100%',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          letterSpacing: '0.04em',
          padding: '0.875rem 1.5rem',
          background: busy ? '#383838' : '#151515',
          color: '#F7F4EE',
          border: 'none',
          cursor: busy ? 'wait' : 'pointer',
          transition: 'background 0.15s',
        }}
      >
        {busy ? 'Verificando…' : 'Entrar'}
      </button>
    </form>
  )
}
