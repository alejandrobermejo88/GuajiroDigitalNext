'use client'

import { useState, useTransition } from 'react'

interface Props {
  deleteAction: () => Promise<void>
  label?: string
}

export default function DeleteButton({ deleteAction, label = 'Eliminar noticia' }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (confirming) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        background: '#FDF5F5',
        border: '1px solid #F9EDED',
      }}>
        <span style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '0.875rem',
          color: '#383838',
        }}>
          ¿Eliminar esta noticia? Esta acción no se puede deshacer.
        </span>
        <button
          onClick={() => startTransition(() => deleteAction())}
          disabled={isPending}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8125rem',
            fontWeight: 600,
            padding: '0.4375rem 1rem',
            background: '#6B1F1F',
            color: '#FEFCF8',
            border: 'none',
            cursor: isPending ? 'wait' : 'pointer',
            opacity: isPending ? 0.6 : 1,
          }}
        >
          {isPending ? 'Eliminando…' : 'Sí, eliminar'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.8125rem',
            padding: '0.4375rem 0.875rem',
            background: 'transparent',
            color: '#767676',
            border: '1px solid #E0D9CC',
            cursor: 'pointer',
          }}
        >
          Cancelar
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.8125rem',
        fontWeight: 500,
        padding: '0.75rem 1.25rem',
        background: 'transparent',
        color: '#C8BFB0',
        border: '1px solid #E0D9CC',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#6B1F1F'
        e.currentTarget.style.borderColor = '#6B1F1F'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#C8BFB0'
        e.currentTarget.style.borderColor = '#E0D9CC'
      }}
    >
      {label}
    </button>
  )
}
