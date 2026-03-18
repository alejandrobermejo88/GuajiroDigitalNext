'use client'

import { useRouter } from 'next/navigation'

export default function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.75rem',
        fontWeight: 500,
        letterSpacing: '0.04em',
        color: '#767676',
        background: 'none',
        border: '1px solid #E0D9CC',
        padding: '0.375rem 0.875rem',
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.color = '#151515'
        el.style.borderColor = '#C8BFB0'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.color = '#767676'
        el.style.borderColor = '#E0D9CC'
      }}
    >
      Cerrar sesión
    </button>
  )
}
