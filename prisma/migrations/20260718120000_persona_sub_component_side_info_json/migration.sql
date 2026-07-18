-- Convert PersonaSubComponent.sideInfo from text to jsonb.
-- Existing empty-string values become NULL; any non-empty text is parsed as JSON.
ALTER TABLE "PersonaSubComponent"
  ALTER COLUMN "sideInfo" TYPE JSONB USING NULLIF("sideInfo", '')::jsonb;
