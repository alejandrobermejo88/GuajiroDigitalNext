import { NextResponse } from 'next/server'
import { createToken, COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { password } = body as { password?: string }
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminSecret   = process.env.ADMIN_SECRET

  if (!adminPassword || !adminSecret) {
    console.error('[admin/login] ADMIN_PASSWORD o ADMIN_SECRET no configurados')
    return NextResponse.json({ error: 'Servidor no configurado' }, { status: 500 })
  }

  if (!password || password !== adminPassword) {
    // Delay para mitigar fuerza bruta
    await new Promise((r) => setTimeout(r, 400))
    return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
  }

  const token = await createToken(adminSecret)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 horas
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
