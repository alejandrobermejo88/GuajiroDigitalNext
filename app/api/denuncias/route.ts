import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { nombre, provincia, tipo, mensaje } = body as Record<string, string>

  if (!mensaje || mensaje.trim().length < 10) {
    return NextResponse.json(
      { error: 'El mensaje es obligatorio y debe tener al menos 10 caracteres.' },
      { status: 422 }
    )
  }

  const supabase = createAnonClient()

  const { error } = await supabase.from('denuncias').insert({
    nombre:   nombre?.trim() || null,
    provincia: provincia?.trim() || null,
    tipo:     tipo?.trim() || null,
    mensaje:  mensaje.trim(),
    estado:   'nueva',
  })

  if (error) {
    console.error('[denuncias] Supabase error:', error.message)
    return NextResponse.json(
      { error: 'No se pudo guardar la denuncia. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
