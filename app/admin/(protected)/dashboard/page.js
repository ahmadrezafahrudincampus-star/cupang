import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Real Database Metrics
  const [
    { count: fishCount },
    { count: availableFish },
    { count: galleryCount },
    { count: breedingCount },
    { count: farmCount },
    { count: inquiriesCount },
    { count: journalCount },
    { count: testimonialCount }
  ] = await Promise.all([
    supabase.from('fish').select('*', { count: 'exact', head: true }),
    supabase.from('fish').select('*', { count: 'exact', head: true }).eq('status', 'available'),
    supabase.from('gallery_items').select('*', { count: 'exact', head: true }),
    supabase.from('breeding_stages').select('*', { count: 'exact', head: true }),
    supabase.from('farm_sections').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('journal_posts').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    { label: 'Total Spesimen Ikan', value: fishCount || 0, href: '/admin/fish', desc: 'Katalog aktif & arsip' },
    { label: 'Ikan Tersedia (Available)', value: availableFish || 0, href: '/admin/fish', desc: 'Siap diadopsi buyer' },
    { label: 'Inquiry Pending', value: inquiriesCount || 0, href: '/admin/inquiries', desc: 'Pesan belum dihubungi', highlight: (inquiriesCount || 0) > 0 },
    { label: 'Tahapan Breeding', value: breedingCount || 0, href: '/admin/breeding', desc: 'Metodologi aktif' },
    { label: 'Plate Galeri Studio', value: galleryCount || 0, href: '/admin/gallery', desc: 'Foto makro terkurasi' },
    { label: 'Modul Fasilitas Farm', value: farmCount || 0, href: '/admin/farm', desc: 'Bio-secure conditioning' },
    { label: 'Artikel Journal', value: journalCount || 0, href: '/admin/journal', desc: 'Edukasi & genetika' },
    { label: 'Ulasan Kolektor', value: testimonialCount || 0, href: '/admin/testimonials', desc: 'Testimoni terverifikasi' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-primary">Super Admin Dashboard</h1>
        <p className="text-xs text-on-surface-variant font-body mt-1">
          Ringkasan metrik inventaris dan manajemen konten Aquatic Art.
        </p>
      </div>

      {/* Grid of Real Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Link key={idx} href={stat.href} className="block group">
            <div className={`bg-surface border rounded-xl p-6 transition-all duration-300 h-full flex flex-col justify-between ${
              stat.highlight
                ? 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400'
                : 'border-white/[0.08] hover:border-primary/50'
            }`}>
              <div>
                <h3 className="text-on-surface-variant text-xs uppercase tracking-wider font-body mb-2">{stat.label}</h3>
                <p className="text-4xl font-display text-primary font-bold">{stat.value}</p>
              </div>
              <p className="text-[11px] text-outline mt-4 pt-3 border-t border-white/[0.06]">{stat.desc} &rarr;</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-surface border border-white/[0.08] rounded-xl p-6">
        <h2 className="text-base font-display text-on-surface font-semibold mb-4">Aksi Cepat Manajemen Konten</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/fish/new"
            className="px-4 py-2 bg-primary text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-opacity-90"
          >
            + Tambah Ikan Baru
          </Link>
          <Link
            href="/admin/breeding"
            className="px-4 py-2 bg-surface-container border border-white/[0.1] text-on-surface hover:text-primary text-xs uppercase tracking-wider rounded"
          >
            + Kelola Tahap Breeding
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2 bg-surface-container border border-white/[0.1] text-on-surface hover:text-primary text-xs uppercase tracking-wider rounded"
          >
            + Tambah Plate Galeri
          </Link>
          <Link
            href="/admin/media"
            className="px-4 py-2 bg-surface-container border border-white/[0.1] text-on-surface hover:text-primary text-xs uppercase tracking-wider rounded"
          >
            Media Library & Upload
          </Link>
        </div>
      </div>
    </div>
  )
}
