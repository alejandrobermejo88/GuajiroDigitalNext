'use client'

import { useState, useEffect } from 'react'

const LINK_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.8125rem',
  color: '#767676',
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  paddingBottom: '1px',
  transition: 'color 0.15s, border-color 0.15s',
}

const BTN_STYLE: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.8125rem',
  color: '#767676',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  borderBottom: '1px solid transparent',
  paddingBottom: '1px',
  transition: 'color 0.15s',
}

export default function ShareBar({ titulo }: { titulo: string }) {
  const [pageUrl, setPageUrl] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  function copyLink() {
    const url = pageUrl || window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }).catch(() => {
      // fallback for older browsers
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    })
  }

  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(titulo)

  return (
    <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E0D9CC', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
      <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C8BFB0' }}>
        Compartir
      </span>

      {pageUrl && (
        <>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
          >
            X / Twitter
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
          >
            Facebook
          </a>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(titulo + ' — ' + pageUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
          >
            WhatsApp
          </a>
        </>
      )}

      <button onClick={copyLink} style={{ ...BTN_STYLE, color: copied ? '#1F6B3A' : '#767676' }}>
        {copied ? '✓ Enlace copiado' : 'Copiar enlace'}
      </button>
    </div>
  )
}
