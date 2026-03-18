-- ============================================================
-- Guajiro Digital · Tabla noticias
-- Ejecuta en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla
CREATE TABLE IF NOT EXISTS noticias (
  id             uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at     timestamptz DEFAULT now() NOT NULL,
  updated_at     timestamptz DEFAULT now() NOT NULL,
  titulo         text        NOT NULL,
  slug           text        NOT NULL UNIQUE,
  resumen        text,
  contenido      text,
  categoria      text        NOT NULL DEFAULT 'Cuba',
  imagen_url     text,
  fuente_nombre  text,
  fuente_url     text,
  estado         text        NOT NULL DEFAULT 'borrador'
                 CHECK (estado IN ('borrador', 'publicada')),
  destacada      boolean     NOT NULL DEFAULT false,
  orden_portada  integer
);

-- 2. Índices de rendimiento
CREATE INDEX IF NOT EXISTS noticias_estado_idx         ON noticias (estado);
CREATE INDEX IF NOT EXISTS noticias_slug_idx           ON noticias (slug);
CREATE INDEX IF NOT EXISTS noticias_created_at_idx     ON noticias (created_at DESC);
CREATE INDEX IF NOT EXISTS noticias_destacada_idx      ON noticias (destacada);
CREATE INDEX IF NOT EXISTS noticias_orden_portada_idx  ON noticias (orden_portada);

-- 3. Trigger: auto-actualiza updated_at en cada UPDATE
CREATE OR REPLACE FUNCTION update_noticias_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS noticias_updated_at ON noticias;
CREATE TRIGGER noticias_updated_at
  BEFORE UPDATE ON noticias
  FOR EACH ROW EXECUTE FUNCTION update_noticias_updated_at();

-- 4. Row Level Security
ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;

-- Lectores públicos: solo pueden ver noticias publicadas
CREATE POLICY "public_read_published" ON noticias
  FOR SELECT TO anon
  USING (estado = 'publicada');

-- El service_role key (usado solo en el servidor de Next.js)
-- bypasses RLS por defecto → puede leer, crear, editar y borrar todo.
