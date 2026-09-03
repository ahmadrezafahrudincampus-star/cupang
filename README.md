# AQUATIC ART — Premium Betta Fish Portfolio Platform

> Production-ready Betta Fish brand, portfolio, catalog, breeding story, trust platform, and lead generation CMS built with Next.js App Router, Tailwind CSS, and Supabase.

---

## Architecture Overview

- **Framework**: Next.js 16 (App Router, Server Components first)
- **Styling**: Tailwind CSS v4 (`@theme inline` design tokens)
- **Design DNA**: *Obsidian & Gilded Fin* (Bodoni Moda display serif, Hanken Grotesk sans-serif, dark cinematic luxury)
- **Database & Auth**: Supabase PostgreSQL + Supabase Auth + Supabase Storage
- **Commercial Model**: Catalog + Inquiry CRM + Dynamic WhatsApp Lead Generation (Future E-commerce Ready)

---

## Public Routes

- `/` — Editorial Homepage (Hero, Snapshot, Signature Collection, Philosophy, Breeding Process, Farm Preview, Testimonials, Journal, Inquire CTA)
- `/about` — Breeder heritage, philosophy, and breeding standards
- `/collection` — Server-filtered catalog with categories and live status
- `/collection/[category]` — Targeted category landing pages
- `/fish/[slug]` — Individual fish showcase with macro gallery, specifications, bloodline provenance, and WhatsApp inquiry CTA
- `/breeding` — Documented breeding methodology and timeline
- `/farm` — Breeding facility overview and conditioning environment
- `/gallery` — Editorial visual gallery with lightbox
- `/achievements` — Verified contest placements and recognitions
- `/testimonials` — Authentic collector unboxing reviews
- `/journal` & `/journal/[slug]` — Husbandry guides, genetics, and water chemistry
- `/faq` — Accessible accordion FAQ (shipping, live arrival guarantee, care)
- `/contact` — Contact channels, operating hours, and location
- `/inquire` — Spam-protected inquiry form with server actions
- `/privacy`, `/terms`, `/shipping-policy`, `/guarantee` — Legal & policy terms
- `/sitemap.xml` & `/robots.txt` — Dynamic SEO infrastructure

---

## Admin CMS Routes (`/admin`)

- `/admin/login` — Protected admin authentication
- `/admin/dashboard` — Real inventory and inquiry statistics
- `/admin/fish` — Fish inventory management (CRUD, status, media)
- `/admin/categories` — Lineage & category management
- `/admin/bloodlines` — Bloodline provenance registry
- `/admin/gallery` — Storage media manager
- `/admin/breeding` — Breeding timeline stage manager
- `/admin/farm` — Facility section manager
- `/admin/achievements` — Contest records manager
- `/admin/testimonials` — Customer review moderation
- `/admin/journal` — Article publisher
- `/admin/faq` — FAQ manager
- `/admin/inquiries` — Lead CRM & status tracker
- `/admin/media` — Storage file manager
- `/admin/settings` — Site metadata, contact info, and WhatsApp number

---

## Database Migrations (`supabase/migrations/`)

1. `001_core_schema.sql` — Core tables (`profiles`, `categories`, `bloodlines`, `fish`, `fish_media`, `gallery_items`, `breeding_stages`, `farm_sections`, `achievements`, `testimonials`, `journal_posts`, `faqs`, `inquiries`, `site_settings`, `audit_logs`)
2. `002_rls_policies.sql` — Row Level Security (Anon read-only on published, Public insert on inquiries, Admin full CRUD)
3. `003_storage_buckets.sql` — Storage policies for `fish-media`, `gallery`, `journal`, `branding`, etc.
4. `004_dormant_commerce.sql` — Skeleton tables (`orders`, `order_items`, `payments`) with public access fully denied.

---

## Environment Setup

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://aquaticart.com
```

---

## Development & Build

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run linting
npm run lint

# Run production build
npm run build
```

---

## Future E-Commerce Roadmap (Dormant)

Fitur berikut **BELUM DIAKTIFKAN** dan tetap menggunakan model Portfolio + Catalog + Direct WhatsApp Inquiry:

- Aktivasi tabel `orders`, `order_items`, `payments`
- Integrasi Payment Gateway (Midtrans / Xendit / Stripe)
- Kalkulasi ongkir otomatis berbasis `weight_grams` + courier API
- Customer authentication & order tracking UI
