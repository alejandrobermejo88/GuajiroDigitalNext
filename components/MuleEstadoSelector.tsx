'use client'

import { useTransition } from 'react'
import { updateMuleEstado } from '@/app/admin/mule/actions'

const ESTADOS = [
  { value: 'pendiente',  label: 'Pendiente',  color: '#6B1F1F' },
  { value: 'en_gestion', label: 'En gestión', color: '#1F4A6B' },
  { value: 'resuelta',   label: 'Resuelta',   color: '#1F6B3A' },
  { value: 'archivada',  label: 'Archivada',  color: '#767676' },
]

export default function MuleEstadoSelector({
  id,
  estado,
}: {
  id: string
  estado: string
}) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    startTransition(() => {
      updateMuleEstado(id, next)
    })
  }

  const current = ESTADOS.find((s) => s.value === estado)

  return (
    <select
      value={estado}
      onChange={handleChange}
      disabled={isPending}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.6875rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: current?.color ?? '#151515',
        background: 'transparent',
        border: `1px solid ${current?.color ?? '#E0D9CC'}`,
        borderRadius: 2,
        padding: '0.25rem 0.5rem',
        cursor: isPending ? 'wait' : 'pointer',
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 0.15s',
        appearance: 'none',
        WebkitAppearance: 'none',
        minWidth: 110,
      }}
    >
      {ESTADOS.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  )
}
