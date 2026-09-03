const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
  console.log('Notice: Supabase URL is placeholder/local. Skipping remote API seed.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding initial breeding stages and content...');
  
  const stages = [
    { stage_number: 1, title: 'Seleksi Indukan', title_en: 'Broodstock Selection', description: 'Evaluasi ketat terhadap simetri dorsal, ketebalan batang ekor, dan catatan silsilah genetik.', description_en: 'Strict evaluation of dorsal symmetry, peduncle thickness, and pedigree lineage records.', image_path: '/images/dummy/breeding/dummy-breeding-01.jpg', sort_order: 1, published: true },
    { stage_number: 2, title: 'Kondisi & Pemijahan', title_en: 'Conditioning & Spawning', description: 'Pemberian pakan hidup berprotein tinggi dan simulasi parameter air optimal.', description_en: 'High-protein live feed conditioning and simulated optimal water chemistry.', image_path: '/images/dummy/breeding/dummy-breeding-02.jpg', sort_order: 2, published: true },
    { stage_number: 3, title: 'Pembesaran & Grading', title_en: 'Grow-Out & Grading', description: 'Pemisahan toples individu, latihan mental flaring harian, dan penyortiran standar kontes.', description_en: 'Individual jar conditioning, daily flaring stamina training, and precision grading.', image_path: '/images/dummy/breeding/dummy-breeding-03.jpg', sort_order: 3, published: true }
  ];

  const { error } = await supabase.from('breeding_stages').upsert(stages, { onConflict: 'stage_number' });
  if (error) {
    console.warn('Breeding seed note:', error.message);
  } else {
    console.log('Breeding stages seeded successfully.');
  }
}

seed();
