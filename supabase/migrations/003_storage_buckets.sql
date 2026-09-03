-- 003_storage_buckets.sql

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET CREATION & POLICIES
-- -----------------------------------------------------------------------------

-- Create the required public storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('fish-media', 'fish-media', true),
('gallery', 'gallery', true),
('journal', 'journal', true),
('testimonials', 'testimonials', true),
('branding', 'branding', true),
('farm', 'farm', true),
('achievements', 'achievements', true)
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- STORAGE RLS POLICIES
-- -----------------------------------------------------------------------------

-- Public can SELECT (read/download) from all these buckets
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access'
  ) THEN
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (
      bucket_id IN ('fish-media', 'gallery', 'journal', 'testimonials', 'branding', 'farm', 'achievements')
    );
  END IF;
END $$;

-- Authenticated Admin/Editor can INSERT, UPDATE, DELETE objects
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin and Editor Insert'
  ) THEN
    CREATE POLICY "Admin and Editor Insert" ON storage.objects FOR INSERT WITH CHECK (
      auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin and Editor Update'
  ) THEN
    CREATE POLICY "Admin and Editor Update" ON storage.objects FOR UPDATE USING (
      auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Admin and Editor Delete'
  ) THEN
    CREATE POLICY "Admin and Editor Delete" ON storage.objects FOR DELETE USING (
      auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
    );
  END IF;
END $$;
