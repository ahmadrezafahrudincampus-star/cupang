-- 002_rls_policies.sql

-- -----------------------------------------------------------------------------
-- HELPER FUNCTION
-- -----------------------------------------------------------------------------
-- Fetches the user role securely, bypassing RLS on the profiles table
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;


-- -----------------------------------------------------------------------------
-- ENABLE RLS ON ALL TABLES
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bloodlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fish_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.breeding_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;


-- -----------------------------------------------------------------------------
-- PROFILES POLICIES
-- -----------------------------------------------------------------------------
-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON public.profiles FOR SELECT USING (public.get_user_role() IN ('admin', 'super_admin'));
-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR UPDATE USING (public.get_user_role() IN ('admin', 'super_admin'));


-- -----------------------------------------------------------------------------
-- CONTENT TABLES: PUBLIC READ POLICIES
-- -----------------------------------------------------------------------------
CREATE POLICY "Public can view published categories" ON public.categories FOR SELECT USING (published = true);
CREATE POLICY "Public can view published bloodlines" ON public.bloodlines FOR SELECT USING (published = true);
CREATE POLICY "Public can view published fish" ON public.fish FOR SELECT USING (published = true);

-- fish_media: SELECT where fish is published (using a subquery)
CREATE POLICY "Public can view media for published fish" ON public.fish_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.fish WHERE id = fish_id AND published = true)
);

CREATE POLICY "Public can view all gallery categories" ON public.gallery_categories FOR SELECT USING (true);
CREATE POLICY "Public can view published gallery items" ON public.gallery_items FOR SELECT USING (published = true);
CREATE POLICY "Public can view published breeding stages" ON public.breeding_stages FOR SELECT USING (published = true);
CREATE POLICY "Public can view published farm sections" ON public.farm_sections FOR SELECT USING (published = true);
CREATE POLICY "Public can view published achievements" ON public.achievements FOR SELECT USING (published = true);
CREATE POLICY "Public can view published testimonials" ON public.testimonials FOR SELECT USING (published = true);
CREATE POLICY "Public can view all journal categories" ON public.journal_categories FOR SELECT USING (true);
CREATE POLICY "Public can view published journal posts" ON public.journal_posts FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view all faq categories" ON public.faq_categories FOR SELECT USING (true);
CREATE POLICY "Public can view published faqs" ON public.faqs FOR SELECT USING (published = true);

-- site_settings: Public can read all settings (assuming only safe fields are stored here)
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);

CREATE POLICY "Public can view active redirects" ON public.redirects FOR SELECT USING (active = true);


-- -----------------------------------------------------------------------------
-- CONTENT TABLES: ADMIN & EDITOR CRUD POLICIES
-- -----------------------------------------------------------------------------
-- Create a helper macro-like setup for tables where Editor and Admin share full CRUD
DO $$
DECLARE
    t_name text;
    tables text[] := ARRAY[
        'categories', 'bloodlines', 'fish', 'fish_media', 'gallery_categories',
        'gallery_items', 'breeding_stages', 'farm_sections', 'achievements',
        'testimonials', 'journal_categories', 'journal_posts', 'faq_categories',
        'faqs', 'redirects'
    ];
BEGIN
    FOREACH t_name IN ARRAY tables LOOP
        EXECUTE format(
            'CREATE POLICY "Admin and Editor full access" ON public.%I FOR ALL USING (public.get_user_role() IN (''admin'', ''super_admin'', ''editor''));',
            t_name
        );
    END LOOP;
END $$;


-- -----------------------------------------------------------------------------
-- ADMIN-ONLY FULL ACCESS POLICIES
-- -----------------------------------------------------------------------------
-- Admins have full access to site_settings
CREATE POLICY "Admin full access on site_settings" ON public.site_settings FOR ALL USING (public.get_user_role() IN ('admin', 'super_admin'));
-- Admins can view audit logs
CREATE POLICY "Admin read access on audit_logs" ON public.audit_logs FOR SELECT USING (public.get_user_role() IN ('admin', 'super_admin'));
CREATE POLICY "Admin insert access on audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (public.get_user_role() IN ('admin', 'super_admin'));


-- -----------------------------------------------------------------------------
-- INQUIRIES POLICIES
-- -----------------------------------------------------------------------------
-- Public can only insert inquiries
CREATE POLICY "Public can insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);
-- Admin has full CRUD on inquiries
CREATE POLICY "Admin full access on inquiries" ON public.inquiries FOR ALL USING (public.get_user_role() IN ('admin', 'super_admin'));
