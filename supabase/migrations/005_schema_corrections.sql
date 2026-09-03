-- 005_schema_corrections.sql
-- Idempotent schema corrections. Safe for both fresh databases and pre-existing databases.

-- breeding_stages
ALTER TABLE public.breeding_stages
  ADD COLUMN IF NOT EXISTS stage_number integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_breeding_stages_stage_number ON public.breeding_stages(stage_number);

-- gallery_items
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS category text;

-- faqs
ALTER TABLE public.faqs
  ADD COLUMN IF NOT EXISTS question_en text,
  ADD COLUMN IF NOT EXISTS answer_en text;

-- farm_sections
ALTER TABLE public.farm_sections
  ADD COLUMN IF NOT EXISTS title_en text,
  ADD COLUMN IF NOT EXISTS description_en text;

-- fish_media
ALTER TABLE public.fish_media
  ADD COLUMN IF NOT EXISTS storage_bucket text DEFAULT 'fish-media',
  ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

-- testimonials
ALTER TABLE public.testimonials
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- journal_posts
ALTER TABLE public.journal_posts
  ADD COLUMN IF NOT EXISTS published boolean DEFAULT true;
