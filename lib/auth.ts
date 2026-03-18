export const COOKIE_NAME = 'gd_admin'
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 horas

// ── HMAC-SHA256 con Web Crypto (Edge-compatible) ──────────────────────────────

async function hmacSign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(value)
  )
  // base64url
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// ── Token format: "<timestamp>.<signature>" ───────────────────────────────────

export async function createToken(secret: string): Promise<string> {
  const ts = Date.now().toString()
  const sig = await hmacSign(ts, secret)
  return `${ts}.${sig}`
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  try {
    const dot = token.lastIndexOf('.')
    if (dot === -1) return false

    const ts  = token.slice(0, dot)
    const sig = token.slice(dot + 1)

    // Verifica expiración
    if (Date.now() - parseInt(ts, 10) > SESSION_DURATION_MS) return false

    // Verifica firma
    const expected = await hmacSign(ts, secret)
    if (sig.length !== expected.length) return false

    // Comparación en tiempo constante
    let diff = 0
    for (let i = 0; i < sig.length; i++) {
      diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i)
    }
    return diff === 0
  } catch {
    return false
  }
}
