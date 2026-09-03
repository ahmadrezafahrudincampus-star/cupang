-- 003_storage_buckets.sql

-- -----------------------------------------------------------------------------
-- STORAGE BUCKET CREATION & POLICIES
-- -----------------------------------------------------------------------------
-- NOTE: Storage bucket creation is usually done via the Supabase Dashboard 
-- or management API. The SQL below is provided as a reference to run in the 
-- Supabase SQL Editor or configured via the dashboard.

/*
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
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (
  bucket_id IN ('fish-media', 'gallery', 'journal', 'testimonials', 'branding', 'farm', 'achievements')
);

-- Authenticated Admin/Editor can INSERT, UPDATE, DELETE objects
CREATE POLICY "Admin and Editor Insert" ON storage.objects FOR INSERT WITH CHECK (
  auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
);

CREATE POLICY "Admin and Editor Update" ON storage.objects FOR UPDATE USING (
  auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
);

CREATE POLICY "Admin and Editor Delete" ON storage.objects FOR DELETE USING (
  auth.role() = 'authenticated' AND public.get_user_role() IN ('admin', 'super_admin', 'editor')
);
*/
