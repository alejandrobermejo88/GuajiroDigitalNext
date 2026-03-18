-- ============================================================
-- Guajiro Digital · Supabase Schema
-- Ejecuta esto en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla principal
CREATE TABLE IF NOT EXISTS denuncias (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  timestamptz DEFAULT now() NOT NULL,
  nombre      text,                        -- NULL = anónimo
  provincia   text,
  tipo        text,
  mensaje     text        NOT NULL,
  estado      text        NOT NULL DEFAULT 'nueva'
              CHECK (estado IN ('nueva', 'revisada', 'publicada', 'archivada'))
);

-- 2. Row Level Security
ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;

-- 3. Política: cualquier visitante puede insertar (enviar denuncia)
--    pero NO puede leer ni modificar registros.
CREATE POLICY "public_insert" ON denuncias
  FOR INSERT TO anon
  WITH CHECK (
    mensaje IS NOT NULL AND
    length(trim(mensaje)) >= 10
  );

-- 4. El service_role key (usado sólo en el servidor de Next.js)
--    bypasses RLS por defecto → puede leer, actualizar y borrar.

-- 5. Índices de rendimiento
CREATE INDEX IF NOT EXISTS denuncias_created_at_idx ON denuncias (created_at DESC);
CREATE INDEX IF NOT EXISTS denuncias_estado_idx     ON denuncias (estado);
