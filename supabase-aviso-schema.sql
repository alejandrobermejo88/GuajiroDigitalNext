-- ============================================================
-- Guajiro Digital · Tabla aviso_editorial
-- Tabla de fila única (singleton) para el aviso institucional.
-- Ejecuta en: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Tabla
CREATE TABLE IF NOT EXISTS aviso_editorial (
  id         text        PRIMARY KEY DEFAULT 'singleton',
  active     boolean     NOT NULL DEFAULT false,
  texto      text        NOT NULL DEFAULT '',
  tipo       text        NOT NULL DEFAULT 'informativo'
             CHECK (tipo IN ('informativo', 'mantenimiento', 'importante')),
  updated_at timestamptz NOT NULL DEFAULT now(),

  -- Garantiza que solo exista la fila singleton
  CONSTRAINT aviso_singleton CHECK (id = 'singleton')
);

-- 2. Row Level Security
ALTER TABLE aviso_editorial ENABLE ROW LEVEL SECURITY;

-- El cliente anónimo solo puede leer (para el banner público)
CREATE POLICY "Aviso: lectura pública"
  ON aviso_editorial FOR SELECT
  TO anon
  USING (true);

-- El service_role (admin client) tiene acceso total sin restricciones por RLS

-- 3. Fila inicial (singleton)
INSERT INTO aviso_editorial (id, active, texto, tipo)
VALUES ('singleton', false, '', 'informativo')
ON CONFLICT (id) DO NOTHING;
