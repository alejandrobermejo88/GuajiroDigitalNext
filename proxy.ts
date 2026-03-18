import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from './lib/auth'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas dentro de /admin
  if (
    pathname === '/admin/login' ||
    pathname.startsWith('/api/admin/login') ||
    pathname.startsWith('/api/admin/logout')
  ) {
    return NextResponse.next()
  }

  const token  = request.cookies.get(COOKIE_NAME)?.value
  const secret = process.env.ADMIN_SECRET ?? ''

  if (!token || !(await verifyToken(token, secret))) {
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
