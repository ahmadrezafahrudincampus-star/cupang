-- 006_schema_corrections.sql
-- Adds missing columns discovered during forensic audit.
-- Safe to run multiple times (idempotent via IF NOT EXISTS / DO NOTHING).

-- ============================================================
-- breeding_stages: add stage_number, title_en, description_en
-- ============================================================
ALTER TABLE public.breeding_stages
  ADD COLUMN IF NOT EXISTS stage_number integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- Create unique index for ON CONFLICT on stage_number
CREATE UNIQUE INDEX IF NOT EXISTS idx_breeding_stages_stage_number ON public.breeding_stages(stage_number);

-- ============================================================
-- gallery_items: add category text column (plain text label,
-- separate from the FK category_id for gallery_categories)
-- ============================================================
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS category text;

-- ============================================================
-- faqs: add question_en, answer_en for bilingual support
-- ============================================================
ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS question_en text,
  ADD COLUMN IF NOT EXISTS answer_en text;

-- ============================================================
-- farm_sections: add title_en, description_en
-- ============================================================
ALTER TABLE public.farm_sections
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;
