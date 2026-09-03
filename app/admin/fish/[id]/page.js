'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function EditFishPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
    featured: false,
    published: true,
    cover_image: '',
  })

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function loadData() {
      const { data: cats } = await supabase.from('categories').select('id, name')
      const { data: bloods } = await supabase.from('bloodlines').select('id, name')
      const { data: fish } = await supabase.from('fish').select('*').eq('id', id).maybeSingle()
      const { data: media } = await supabase.from('fish_media').select('storage_path').eq('fish_id', id).limit(1).maybeSingle()

      if (active) {
        if (cats) setCategories(cats)
        if (bloods) setBloodlines(bloods)
        if (fish) {
          setForm({
            ...fish,
            cover_image: media?.storage_path || fish.cover_image || ''
          })
        }
        setLoading(false)
      }
    }

    if (id) {
      loadData()
    }
    return () => { active = false }
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()

    const payload = {
      ...form,
      price: form.price ? parseFloat(form.price) : null,
      category_id: form.category_id || null,
      bloodline_id: form.bloodline_id || null,
    }

    const { error } = await supabase.from('fish').update(payload).eq('id', id)

    if (error) {
      alert(error.message)
      setSaving(false)
    } else {
      if (form.cover_image) {
        // Upsert primary media record
        const { data: existingMedia } = await supabase.from('fish_media').select('id').eq('fish_id', id).limit(1).maybeSingle()
        if (existingMedia?.id) {
          await supabase.from('fish_media').update({ storage_path: form.cover_image }).eq('id', existingMedia.id)
        } else {
          await supabase.from('fish_media').insert([{
            fish_id: id,
            storage_bucket: 'fish-media',
            storage_path: form.cover_image,
            is_primary: true
          }])
        }
      }
      router.push('/admin/fish')
    }
  }

  if (loading) {
    return (
      <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
        <p className="text-sm">Memuat data spesimen ikan...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Edit Spesimen: {form.name}</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">ID: {form.fish_code}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 border border-white/[0.08] rounded-xl">
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
              value={form.fish_code || ''}
              onChange={(e) => setForm({ ...form, fish_code: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Nama Spesimen *</label>
            <input
              type="text"
              required
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Kategori</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.category_id || ''}
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
              value={form.bloodline_id || ''}
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
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Tipe</label>
            <input
              type="text"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.type || ''}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Gender</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.gender || 'Male'}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Pair">Pair</option>
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Status</label>
            <select
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.status || 'available'}
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
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Harga (IDR)</label>
            <input
              type="number"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Grade</label>
            <input
              type="text"
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              value={form.grade || ''}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Deskripsi</label>
          <textarea
            rows={4}
            className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
            value={form.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="flex gap-6 pt-2 border-t border-white/[0.08]">
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="rounded bg-surface-container border-white/[0.2] text-primary"
            />
            Tampilkan di Koleksi Unggulan (Homepage)
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={!!form.published}
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
            disabled={saving}
            className="px-6 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Update Spesimen'}
          </button>
        </div>
      </form>
    </div>
  )
}
