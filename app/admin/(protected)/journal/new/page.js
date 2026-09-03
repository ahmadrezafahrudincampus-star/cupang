'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

export default function NewJournalPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    category_id: '',
    excerpt: '',
    content: '',
    cover_path: '',
    published: true,
  })

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function loadMeta() {
      const { data: cats } = await supabase.from('categories').select('id, name')
      if (active && cats) setCategories(cats)
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
      category_id: form.category_id || null,
      published_at: form.published ? new Date().toISOString() : null,
    }

    const { error } = await supabase.from('journal_posts').insert([payload])

    if (error) {
      alert(error.message)
      setLoading(false)
    } else {
      router.push('/admin/journal')
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Tulis Artikel Journal Baru</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">Edukasi pemuliaan genetik, water parameter, dan nutrisi burayak.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-8 border border-white/[0.08] rounded-xl">
        <ImageUploader
          label="Foto Sampul Artikel (Cover Header)"
          value={form.cover_path}
          onChange={(url) => setForm({ ...form, cover_path: url })}
          frameType="journal"
          bucket="journal"
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Judul Artikel *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') })}
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
              placeholder="e.g. Water Chemistry & Tannin Management"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Slug URL *</label>
            <input
              type="text"
              required
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Kategori Artikel</label>
          <select
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="">Pilih Kategori (Opsional)</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Ringkasan / Excerpt *</label>
          <textarea
            rows={2}
            required
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
            placeholder="Ringkasan 1-2 kalimat untuk preview card..."
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">Konten Lengkap Artikel *</label>
          <textarea
            rows={10}
            required
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full bg-surface-container border border-white/[0.1] p-3 rounded text-sm text-on-surface font-mono leading-relaxed focus:border-primary focus:outline-none"
            placeholder="Tulis artikel lengkap di sini (mendukung paragraf dan format teks)..."
          />
        </div>

        <div className="pt-2 border-t border-white/[0.08]">
          <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
              className="rounded bg-surface-container border-white/[0.2] text-primary"
            />
            Publikasikan Artikel Segera ke Website
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/admin/journal')}
            className="px-5 py-2.5 border border-white/[0.1] text-xs uppercase tracking-wider text-on-surface rounded hover:bg-surface-container"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : 'Terbitkan Artikel'}
          </button>
        </div>
      </form>
    </div>
  )
}
