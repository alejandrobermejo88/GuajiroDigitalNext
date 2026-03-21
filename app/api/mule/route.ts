import { NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const {
    nombre,
    telefono,
    localidad,
    tipo_urgencia,
    descripcion,
    persona_afectada,
    necesidad_concreta,
  } = body as Record<string, string>

  if (!telefono?.trim()) {
    return NextResponse.json(
      { error: 'El teléfono de contacto es obligatorio.' },
      { status: 422 }
    )
  }

  if (!tipo_urgencia?.trim()) {
    return NextResponse.json(
      { error: 'El tipo de urgencia es obligatorio.' },
      { status: 422 }
    )
  }

  if (!descripcion || descripcion.trim().length < 10) {
    return NextResponse.json(
      { error: 'La descripción es obligatoria y debe tener al menos 10 caracteres.' },
      { status: 422 }
    )
  }

  const supabase = createAnonClient()

  const { error } = await supabase.from('urgencias_mule').insert({
    nombre:             nombre?.trim()             || null,
    telefono:           telefono.trim(),
    localidad:          localidad?.trim()          || null,
    tipo_urgencia:      tipo_urgencia.trim(),
    descripcion:        descripcion.trim(),
    persona_afectada:   persona_afectada?.trim()   || null,
    necesidad_concreta: necesidad_concreta?.trim() || null,
    estado:             'pendiente',
  })

  if (error) {
    console.error('[mule] Supabase error:', error.message)
    return NextResponse.json(
      { error: 'No se pudo registrar el caso. Inténtalo de nuevo.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true }, { status: 201 })
}
