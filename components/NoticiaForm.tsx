'use client'

import { useState, useTransition, useEffect } from 'react'
import type { Noticia } from '@/lib/noticias'
import { CATEGORIAS } from '@/lib/noticias'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputSx: React.CSSProperties = {
  width: '100%',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.9375rem',
  padding: '0.625rem 0.875rem',
  border: '1px solid #E0D9CC',
  background: '#FEFCF8',
  color: '#151515',
  outline: 'none',
  transition: 'border-color 0.15s',
  lineHeight: 1.5,
}

const labelSx: React.CSSProperties = {
  display: 'block',
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#767676',
  marginBottom: '0.375rem',
}

const noteSx: React.CSSProperties = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: '0.75rem',
  color: '#C8BFB0',
  marginTop: '0.3rem',
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  noticia?: Noticia
  saveAction: (formData: FormData) => Promise<void>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NoticiaForm({ noticia, saveAction }: Props) {
  const isNew = !noticia
  const [isPending, startTransition] = useTransition()

  const [titulo,        setTitulo]        = useState(noticia?.titulo        ?? '')
  const [slug,          setSlug]          = useState(noticia?.slug          ?? '')
  const [slugTouched,   setSlugTouched]   = useState(!isNew)
  const [resumen,       setResumen]       = useState(noticia?.resumen       ?? '')
  const [contenido,     setContenido]     = useState(noticia?.contenido     ?? '')
  const [categoria,     setCategoria]     = useState(noticia?.categoria     ?? 'General')
  const [imagen_url,    setImagenUrl]     = useState(noticia?.imagen_url    ?? '')
  const [fuente_nombre, setFuenteNombre]  = useState(noticia?.fuente_nombre ?? '')
  const [fuente_url,    setFuenteUrl]     = useState(noticia?.fuente_url    ?? '')
  const [destacada,     setDestacada]     = useState(noticia?.destacada     ?? false)
  const [ultima_hora,   setUltimaHora]    = useState(noticia?.ultima_hora   ?? false)
  const [orden_portada, setOrdenPortada]  = useState(noticia?.orden_portada?.toString() ?? '')
  const [error,         setError]         = useState('')

  // Auto-generate slug from título until the user manually edits it
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(titulo))
  }, [titulo, slugTouched])

  function buildFormData(estado: 'borrador' | 'publicada'): FormData {
    const fd = new FormData()
    fd.set('titulo',        titulo.trim())
    fd.set('slug',          slug.trim())
    fd.set('resumen',       resumen.trim())
    fd.set('contenido',     contenido.trim())
    fd.set('categoria',     categoria)
    fd.set('imagen_url',    imagen_url.trim())
    fd.set('fuente_nombre', fuente_nombre.trim())
    fd.set('fuente_url',    fuente_url.trim())
    fd.set('destacada',     destacada   ? 'true' : 'false')
    fd.set('ultima_hora',   ultima_hora ? 'true' : 'false')
    fd.set('orden_portada', orden_portada.trim())
    fd.set('estado',        estado)
    return fd
  }

  function handleSave(estado: 'borrador' | 'publicada') {
    if (!titulo.trim()) { setError('El título es obligatorio.'); return }
    if (!slug.trim())   { setError('El slug es obligatorio.');   return }
    setError('')
    startTransition(async () => {
      try {
        await saveAction(buildFormData(estado))
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al guardar.')
      }
    })
  }

  function focusBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = '#C8BFB0'
  }
  function blurBorder(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.target.style.borderColor = '#E0D9CC'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.375rem' }}>

      {/* Título */}
      <div>
        <label style={labelSx}>Título *</label>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escribe el titular de la noticia"
          style={{ ...inputSx, fontFamily: 'Newsreader, Georgia, serif', fontSize: '1.125rem' }}
          onFocus={focusBorder}
          onBlur={blurBorder}
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label style={labelSx}>Slug (URL pública)</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setSlugTouched(true) }}
          onBlur={(e) => { setSlug(slugify(e.target.value)); blurBorder(e) }}
          onFocus={focusBorder}
          placeholder="url-de-la-noticia"
          style={{ ...inputSx, fontFamily: 'ui-monospace, monospace', fontSize: '0.875rem', color: '#383838' }}
        />
        <p style={noteSx}>
          /noticias/<strong style={{ color: '#767676' }}>{slug || 'slug-auto'}</strong>
          {!slugTouched && <span style={{ marginLeft: 8 }}>· Se genera desde el título automáticamente</span>}
        </p>
      </div>

      {/* Resumen */}
      <div>
        <label style={labelSx}>Resumen / Entradilla</label>
        <textarea
          value={resumen}
          onChange={(e) => setResumen(e.target.value)}
          rows={3}
          placeholder="Breve descripción visible en portada y en la cabecera del artículo"
          style={{ ...inputSx, resize: 'vertical', lineHeight: 1.65 }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
      </div>

      {/* Contenido */}
      <div>
        <label style={labelSx}>Contenido del artículo</label>
        <textarea
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          rows={16}
          placeholder={"Cuerpo de la noticia.\n\nUsa una línea en blanco entre párrafos.\n\nCada bloque separado por línea en blanco se convierte en un párrafo."}
          style={{
            ...inputSx,
            resize: 'vertical',
            lineHeight: 1.75,
            fontFamily: 'Newsreader, Georgia, serif',
            fontSize: '1rem',
          }}
          onFocus={focusBorder}
          onBlur={blurBorder}
        />
        <p style={noteSx}>Separa los párrafos con una línea en blanco.</p>
      </div>

      {/* Categoría + Imagen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
        <div>
          <label style={labelSx}>Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ ...inputSx, appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer' }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelSx}>URL de imagen (opcional)</label>
          <input
            type="url"
            value={imagen_url}
            onChange={(e) => setImagenUrl(e.target.value)}
            placeholder="https://ejemplo.com/imagen.jpg"
            style={inputSx}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      </div>

      {/* Fuente */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelSx}>Fuente — Nombre del medio</label>
          <input
            type="text"
            value={fuente_nombre}
            onChange={(e) => setFuenteNombre(e.target.value)}
            placeholder="Ej: 14ymedio, El Toque, CiberCuba…"
            style={inputSx}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
        <div>
          <label style={labelSx}>Fuente — URL del artículo original</label>
          <input
            type="url"
            value={fuente_url}
            onChange={(e) => setFuenteUrl(e.target.value)}
            placeholder="https://..."
            style={inputSx}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      </div>

      {/* Flags: Destacada · Última hora · Orden */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        padding: '1rem 1.25rem',
        background: '#F0EDE6',
        border: '1px solid #E0D9CC',
        flexWrap: 'wrap',
      }}>
        {/* Destacada */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={destacada}
            onChange={(e) => setDestacada(e.target.checked)}
            style={{ width: 15, height: 15, accentColor: '#6B1F1F', cursor: 'pointer' }}
          />
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#151515',
          }}>
            Noticia destacada
          </span>
          <span style={{ ...noteSx, marginTop: 0 }}>
            (titular principal de portada)
          </span>
        </label>

        {/* Última hora */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={ultima_hora}
            onChange={(e) => setUltimaHora(e.target.checked)}
            style={{ width: 15, height: 15, accentColor: '#6B1F1F', cursor: 'pointer' }}
          />
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: ultima_hora ? '#6B1F1F' : '#151515',
          }}>
            Última hora
          </span>
          <span style={{ ...noteSx, marginTop: 0 }}>
            (aparece en el panel de Última hora)
          </span>
        </label>

        {/* Orden */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <label style={{ ...labelSx, margin: 0, whiteSpace: 'nowrap' }}>
            Orden en portada
          </label>
          <input
            type="number"
            min={1}
            value={orden_portada}
            onChange={(e) => setOrdenPortada(e.target.value)}
            placeholder="1"
            style={{ ...inputSx, width: 70, textAlign: 'center' }}
            onFocus={focusBorder}
            onBlur={blurBorder}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <p style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          color: '#6B1F1F',
          padding: '0.625rem 0.875rem',
          border: '1px solid #F9EDED',
          background: '#FDF5F5',
        }}>
          {error}
        </p>
      )}

      {/* Action buttons */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        borderTop: '1px solid #E0D9CC',
        paddingTop: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <button
          type="button"
          onClick={() => handleSave('borrador')}
          disabled={isPending}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            padding: '0.75rem 1.5rem',
            background: '#F0EDE6',
            color: '#383838',
            border: '1px solid #C8BFB0',
            cursor: isPending ? 'wait' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isPending ? 'Guardando…' : 'Guardar borrador'}
        </button>

        <button
          type="button"
          onClick={() => handleSave('publicada')}
          disabled={isPending}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            letterSpacing: '0.02em',
            padding: '0.75rem 1.75rem',
            background: '#151515',
            color: '#F7F4EE',
            border: 'none',
            cursor: isPending ? 'wait' : 'pointer',
            opacity: isPending ? 0.6 : 1,
            transition: 'opacity 0.15s',
          }}
        >
          {isPending ? 'Publicando…' : isNew ? 'Publicar ahora' : 'Guardar y publicar'}
        </button>
      </div>

    </div>
  )
}
