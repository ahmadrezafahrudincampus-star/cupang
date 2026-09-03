-- 001_core_schema.sql

-- Enable pgcrypto for gen_random_uuid() just in case (Supabase usually has it enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- -----------------------------------------------------------------------------
-- TRIGGER FUNCTION FOR updated_at
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- -----------------------------------------------------------------------------
-- CORE TABLES
-- -----------------------------------------------------------------------------

-- profiles
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text,
    avatar_path text,
    role text DEFAULT 'customer' CHECK (role IN ('customer', 'editor', 'admin', 'super_admin')),
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- categories
CREATE TABLE public.categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    image_path text,
    sort_order integer DEFAULT 0,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- bloodlines
CREATE TABLE public.bloodlines (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    history text,
    image_path text,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- fish
CREATE TABLE public.fish (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_code text UNIQUE NOT NULL,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
    bloodline_id uuid REFERENCES public.bloodlines(id) ON DELETE SET NULL,
    species text,
    type text,
    gender text,
    color text,
    pattern text,
    size text,
    grade text,
    origin text,
    description text,
    price numeric(12,2),
    currency text DEFAULT 'IDR',
    status text DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'archived')),
    featured boolean DEFAULT false,
    published boolean DEFAULT true,
    seo_title text,
    seo_description text,
    sku text UNIQUE,
    stock_quantity integer DEFAULT 1,
    weight_grams integer,
    track_inventory boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes for fish table
CREATE INDEX idx_fish_slug ON public.fish(slug);
CREATE INDEX idx_fish_fish_code ON public.fish(fish_code);
CREATE INDEX idx_fish_category_id ON public.fish(category_id);
CREATE INDEX idx_fish_bloodline_id ON public.fish(bloodline_id);
CREATE INDEX idx_fish_status ON public.fish(status);
CREATE INDEX idx_fish_published ON public.fish(published);
CREATE INDEX idx_fish_featured ON public.fish(featured);
CREATE INDEX idx_fish_created_at ON public.fish(created_at);

-- fish_media
CREATE TABLE public.fish_media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    fish_id uuid REFERENCES public.fish(id) ON DELETE CASCADE,
    media_type text CHECK (media_type IN ('image', 'video')),
    storage_path text NOT NULL,
    alt_text text,
    caption text,
    width integer,
    height integer,
    mime_type text,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- gallery_categories
CREATE TABLE public.gallery_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    sort_order integer DEFAULT 0
);

-- gallery_items
CREATE TABLE public.gallery_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
    storage_path text NOT NULL,
    title text,
    alt_text text,
    caption text,
    width integer,
    height integer,
    published boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- breeding_stages
CREATE TABLE public.breeding_stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    image_path text,
    sort_order integer DEFAULT 0,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- farm_sections
CREATE TABLE public.farm_sections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text,
    image_path text,
    sort_order integer DEFAULT 0,
    published boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- achievements
CREATE TABLE public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    organization text,
    year integer,
    description text,
    image_path text,
    published boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

-- testimonials
CREATE TABLE public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name text NOT NULL,
    location text,
    quote text NOT NULL,
    rating integer CHECK (rating >= 1 AND rating <= 5),
    photo_path text,
    fish_id uuid REFERENCES public.fish(id) ON DELETE SET NULL,
    verified boolean DEFAULT false,
    published boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- journal_categories
CREATE TABLE public.journal_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    description text
);

-- journal_posts
CREATE TABLE public.journal_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES public.journal_categories(id) ON DELETE SET NULL,
    author_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    title text NOT NULL,
    slug text UNIQUE NOT NULL,
    excerpt text,
    content text,
    cover_path text,
    seo_title text,
    seo_description text,
    canonical_url text,
    og_image_path text,
    status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- faq_categories
CREATE TABLE public.faq_categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL
);

-- faqs
CREATE TABLE public.faqs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id uuid REFERENCES public.faq_categories(id) ON DELETE SET NULL,
    question text NOT NULL,
    answer text NOT NULL,
    sort_order integer DEFAULT 0,
    published boolean DEFAULT true
);

-- inquiries
CREATE TABLE public.inquiries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    whatsapp text,
    email text,
    fish_id uuid REFERENCES public.fish(id) ON DELETE SET NULL,
    subject text,
    message text,
    status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'negotiating', 'converted', 'closed', 'spam')),
    source text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- site_settings
CREATE TABLE public.site_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name text,
    tagline text,
    logo_path text,
    favicon_path text,
    whatsapp_number text,
    email text,
    social_links jsonb DEFAULT '{}',
    business_area text,
    operating_hours text,
    footer_text text,
    default_seo_title text,
    default_seo_description text,
    default_og_image_path text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- redirects
CREATE TABLE public.redirects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    source_path text UNIQUE NOT NULL,
    destination_path text NOT NULL,
    status_code integer DEFAULT 301,
    active boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- audit_logs
CREATE TABLE public.audit_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    action text NOT NULL,
    entity_type text,
    entity_id uuid,
    metadata jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamptz DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- APPLY TRIGGERS
-- -----------------------------------------------------------------------------
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bloodlines_updated_at BEFORE UPDATE ON public.bloodlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fish_updated_at BEFORE UPDATE ON public.fish FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_breeding_stages_updated_at BEFORE UPDATE ON public.breeding_stages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_farm_sections_updated_at BEFORE UPDATE ON public.farm_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journal_posts_updated_at BEFORE UPDATE ON public.journal_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON public.inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
