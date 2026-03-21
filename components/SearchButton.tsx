'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SearchButton() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); setQ('') }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function submit() {
    const trimmed = q.trim()
    if (!trimmed) return
    setOpen(false)
    setQ('')
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
      {open && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
            placeholder="Buscar en el diario…"
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.8125rem',
              padding: '0.3125rem 0.75rem',
              border: '1px solid #E0D9CC',
              background: '#FEFCF8',
              color: '#151515',
              outline: 'none',
              width: 200,
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={submit}
            aria-label="Buscar"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.3125rem',
              color: '#6B1F1F',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="9" cy="9" r="6" />
              <line x1="14" y1="14" x2="19" y2="19" />
            </svg>
          </button>
        </div>
      )}
      <button
        onClick={() => { setOpen(o => !o); if (open) setQ('') }}
        aria-label="Abrir búsqueda"
        title="Buscar"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0.3125rem',
          color: '#767676',
          display: 'flex',
          alignItems: 'center',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#151515')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#767676')}
      >
        {open ? (
          /* × close */
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        ) : (
          /* 🔍 magnifying glass */
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="9" cy="9" r="6" />
            <line x1="14" y1="14" x2="19" y2="19" />
          </svg>
        )}
      </button>
    </div>
  )
}
