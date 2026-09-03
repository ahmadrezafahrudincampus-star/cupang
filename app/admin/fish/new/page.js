'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NewFishPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [bloodlines, setBloodlines] = useState([])

  const [form, setForm] = useState({
    fish_code: '',
    name: '',
    slug: '',
    category_id: '',
    bloodline_id: '',
    species: 'Betta splendens',
    type: 'Plakat HMPK',
    gender: 'Male',
    color: '',
    pattern: '',
    size: 'M',
    grade: 'Show Grade',
    origin: 'Aquatic Art Breeding Facility',
    description: '',
    price: '',
    currency: 'IDR',
    status: 'available',
    featured: true,
    published: true,
    cover_image: '',
  })

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function loadMeta() {
      const { data: cats } = await supabase.from('categories').select('id, name')
      const { data: bloods } = await supabase.from('bloodlines').select('id, name')
      if (active) {
        if (cats) setCategories(cats)
        if (bloods) setBloodlines(bloods)
      }
    }
    loadMeta()
    return () => { active = false }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      category_id: form.category_id || null,
      bloodline_id: form.bloodline_id || null,
    }

    const { data: insertedFish, error } = await supabase.from('fish').insert([payload]).select().single()

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      // If image uploaded, link to fish_media table
      if (form.cover_image && insertedFish?.id) {
        await supabase.from('fish_media').insert([{
          fish_id: insertedFish.id,
          storage_bucket: 'fish-media',
          storage_path: form.cover_image,
          is_primary: true
        }])
      }
      router.push('/admin/fish')
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Tambah Spesimen Ikan Baru</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">Lengkapi spesifikasi silsilah, grade, dan foto portrait.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 border border-white/[0.08] rounded-xl">
        {/* Photo Uploader */}
        <div>
          <ImageUploader
            label="Foto Portrait Spesimen (Cover)"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            frameType="fish"
            bucket="fish-media"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Kode Ikan *</label>
            <input
              type="text"
              required
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.fish_code}
              onChange={(e) => setForm({ ...form, fish_code: e.target.value })}
              placeholder="e.g. BT-2026-001"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Nama Spesimen *</label>
            <input
              type="text"
              required
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              placeholder="e.g. Galaxy Koi Plakat"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Kategori</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">Pilih Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Galur Murni (Bloodline)</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.bloodline_id}
              onChange={(e) => setForm({ ...form, bloodline_id: e.target.value })}
            >
              <option value="">Pilih Bloodline</option>
              {bloodlines.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Tipe Finnage</label>
            <input
              type="text"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Gender</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Pair">Pair</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Status Ketersediaan</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Harga Referensi (IDR)</label>
            <input
              type="number"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              placeholder="1500000"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Grade</label>
            <input
              type="text"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              placeholder="Show Grade / Grand Champion Line"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Deskripsi Spesimen</label>
          <textarea
            rows={4}
            className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Jelaskan form ekor 180 derajat, densitas sisik, dan karakteristik mental..."
          />
        </div>

        <div className="flex gap-6 pt-2 border-t border-white/[0.08]">
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded bg-surface-container border-white/[0.2] text-primary"
            />
            Tampilkan di Koleksi Unggulan (Homepage)
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded bg-surface-container border-white/[0.2] text-primary"
            />
            Publikasikan ke Website
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/fish')}
            className="px-5 py-2.5 border border-white/[0.1] text-xs uppercase tracking-wider text-on-surface rounded hover:bg-surface-container"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Simpan Spesimen'}
          </button>
        </div>
      </form>
    </div>
  )
}
