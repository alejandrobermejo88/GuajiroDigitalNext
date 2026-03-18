-- ─── Guajiro Digital · Migración editorial v2 ────────────────────────────────
-- Ejecutar en el SQL Editor de Supabase → Run

-- 1. Nueva columna ultima_hora
ALTER TABLE noticias
  ADD COLUMN IF NOT EXISTS ultima_hora BOOLEAN NOT NULL DEFAULT false;

-- 2. Normalizar filas antiguas antes de aplicar el nuevo CHECK
UPDATE noticias
SET categoria = 'General'
WHERE categoria NOT IN (
  'Apagones', 'Represión', 'Economía', 'Protesta',
  'Régimen', 'Oposición', 'Denuncias', 'Transición', 'General'
);

-- 3. Eliminar CHECK anterior y aplicar el nuevo
ALTER TABLE noticias
  DROP CONSTRAINT IF EXISTS noticias_categoria_check;

ALTER TABLE noticias
  ADD CONSTRAINT noticias_categoria_check
  CHECK (categoria IN (
    'Apagones', 'Represión', 'Economía', 'Protesta',
    'Régimen', 'Oposición', 'Denuncias', 'Transición', 'General'
  ));

-- 4. Índice para la sección de Última hora (consultas frecuentes)
CREATE INDEX IF NOT EXISTS noticias_ultima_hora_idx
  ON noticias (created_at DESC)
  WHERE ultima_hora = true AND estado = 'publicada';
