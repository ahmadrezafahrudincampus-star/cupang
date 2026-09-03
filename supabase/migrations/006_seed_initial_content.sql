-- 006_seed_initial_content.sql
-- Seed baseline content: categories, bloodlines, breeding stages, farm sections, gallery, site settings.
-- Uses deterministic UUIDs and primary key conflict targets for complete idempotency.

-- Categories
INSERT INTO public.categories (id, name, slug, description, sort_order, published)
VALUES 
  ('c1000000-0000-0000-0000-000000000001', 'Plakat (HMPK)', 'plakat-hmpk', 'Short-finned show Betta with muscular form and clean dorsal symmetry.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Halfmoon (HM)', 'halfmoon-hm', 'Caudal spread exhibiting 180-degree straight edge margin.', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Crowntail (CT)', 'crowntail-ct', 'Ray branching and web reduction creating crown finnage.', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Bloodlines (Genetic Lineages)
INSERT INTO public.bloodlines (id, name, slug, description, history, published)
VALUES 
  ('b1000000-0000-0000-0000-000000000001', 'Galaxy Koi Lineage', 'galaxy-koi', 'Selective line emphasizing dense iridescence and high contrast pattern.', 'Curated broodstock selected for fin ray branching stability.', true),
  ('b1000000-0000-0000-0000-000000000002', 'Super Red Lineage', 'super-red', 'Solid red pigmentation with clean scale coverage.', 'Form selected for dorsal symmetry and 180-degree caudal spread.', true),
  ('b1000000-0000-0000-0000-000000000003', 'Blue Rim Lineage', 'blue-rim', 'Porcelain white body with defined blue fin margins.', 'Targeted breeding for crisp edge margins.', true)
ON CONFLICT (slug) DO NOTHING;

-- Breeding Stages
INSERT INTO public.breeding_stages (id, stage_number, title, title_en, description, description_en, image_path, sort_order, published)
VALUES
  ('s1000000-0000-0000-0000-000000000001', 1, 'Seleksi Indukan', 'Broodstock Selection', 'Evaluasi simetri dorsal, ketebalan batang ekor, dan catatan silsilah genetik.', 'Evaluation of dorsal symmetry, peduncle thickness, and lineage records.', '/images/dummy/breeding/dummy-breeding-01.jpg', 1, true),
  ('s1000000-0000-0000-0000-000000000002', 2, 'Kondisi & Pemijahan', 'Conditioning & Spawning', 'Pemberian pakan berkualitas tinggi dan penyesuaian parameter air optimal.', 'Conditioning diet and optimal water chemistry adjustments.', '/images/dummy/breeding/dummy-breeding-02.jpg', 2, true),
  ('s1000000-0000-0000-0000-000000000003', 3, 'Pembesaran & Grading', 'Grow-Out & Grading', 'Pemisahan toples individu, latihan mental flaring, dan penilaian standar kualitas.', 'Individual jar conditioning, flaring stamina training, and quality grading.', '/images/dummy/breeding/dummy-breeding-03.jpg', 3, true)
ON CONFLICT (stage_number) DO NOTHING;

-- Farm Sections
INSERT INTO public.farm_sections (id, title, description, image_path, sort_order, published)
VALUES
  ('f1000000-0000-0000-0000-000000000001', 'Water Conditioning Reservoir', 'Filtration and conditioning tanks maintaining stable pH and low TDS water parameters.', '/images/dummy/farm/dummy-farm-01.jpg', 1, true),
  ('f1000000-0000-0000-0000-000000000002', 'Individual Conditioning Racks', 'Individual glass containers with visual dividers for stamina and finnage development.', '/images/dummy/farm/dummy-farm-02.jpg', 2, true),
  ('f1000000-0000-0000-0000-000000000003', 'Spawning & Nursery Area', 'Temperature-monitored tanks and dedicated live feed culture setup.', '/images/dummy/farm/dummy-farm-03.jpg', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Gallery Items
INSERT INTO public.gallery_items (id, title, caption, storage_path, category, sort_order, published)
VALUES
  ('g1000000-0000-0000-0000-000000000001', 'Galaxy Koi Plakat Studio Study', 'High grade Galaxy Koi with dense iridescent scales.', '/images/dummy/gallery/dummy-gallery-01.jpg', 'Studio Series', 1, true),
  ('g1000000-0000-0000-0000-000000000002', 'Super Red Halfmoon Full Flare', 'Spread study highlighting crimson ray branching.', '/images/dummy/gallery/dummy-gallery-02.jpg', 'Studio Series', 2, true),
  ('g1000000-0000-0000-0000-000000000003', 'Blue Rim Marble Contrast', 'Porcelain white body with deep cobalt margins.', '/images/dummy/gallery/dummy-gallery-03.jpg', 'Studio Series', 3, true),
  ('g1000000-0000-0000-0000-000000000004', 'Aquatic Art Masterpiece Plate', 'Studio lighting capturing fin dynamics.', '/images/dummy/gallery/dummy-gallery-04.jpg', 'Exhibition', 4, true),
  ('g1000000-0000-0000-0000-000000000005', 'Black Samurai Metallic Mask', 'Platinum mask contrasting dark scales.', '/images/dummy/gallery/dummy-gallery-05.jpg', 'Studio Series', 5, true),
  ('g1000000-0000-0000-0000-000000000006', 'Copper Crowntail Ray Symmetry', 'Ray branching and delicate fin webbing.', '/images/dummy/gallery/dummy-gallery-06.jpg', 'Exhibition', 6, true),
  ('g1000000-0000-0000-0000-000000000007', 'Avatar Gordon Electric Cyan', 'Iridescent star-tail patterns on dark body.', '/images/dummy/gallery/dummy-gallery-07.jpg', 'Studio Series', 7, true),
  ('g1000000-0000-0000-0000-000000000008', 'Candy Multi-Color Plakat', 'Chromatic layering in studio black backdrop.', '/images/dummy/gallery/dummy-gallery-08.jpg', 'Studio Series', 8, true)
ON CONFLICT (id) DO NOTHING;

-- Site Settings
INSERT INTO public.site_settings (id, brand_name, tagline, whatsapp_number, email, business_area, operating_hours, footer_text, default_seo_title, default_seo_description)
VALUES
  ('e1000000-0000-0000-0000-000000000001', 'AQUATIC ART', 'Betta Fish Breeder & Lineage Portfolio', '6281234567890', 'info@aquaticart.com', 'Indonesia', '09:00 - 18:00 WIB', '© 2026 AQUATIC ART. ALL RIGHTS RESERVED.', 'Aquatic Art — Betta Fish Portfolio', 'Selective Betta fish genetics and breeder portfolio.')
ON CONFLICT (id) DO NOTHING;
