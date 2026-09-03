'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminJournalPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  const supabase = createClient()

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function fetchPosts() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: err } = await supabase
          .from('journal_posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (active) {
          if (err) throw err
          setPosts(data || [])
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchPosts()
    return () => { active = false }
  }, [])

  const loadPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('journal_posts')
        .select('*')
        .order('created_at', { ascending: false })
      if (err) throw err
      setPosts(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, title) => {
    if (confirm(`Hapus artikel "${title}"?`)) {
      await supabase.from('journal_posts').delete().eq('id', id)
      setPosts((prev) => prev.filter((p) => p.id !== id))
    }
  }

  const handleTogglePublish = async (post) => {
    const newStatus = !post.published
    await supabase.from('journal_posts').update({ published: newStatus }).eq('id', post.id)
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: newStatus } : p)))
  }

  const filteredPosts = posts.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (p.title || '').toLowerCase().includes(q) || (p.excerpt || '').toLowerCase().includes(q)
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Breeder&apos;s Journal</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Publikasi artikel edukasi, panduan genetika, dan perawatan indukan cupang.
          </p>
        </div>
        <Link
          href="/admin/journal/new"
          className="px-5 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-opacity-90 self-start sm:self-auto"
        >
          + Tulis Artikel Baru
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari artikel journal..."
          className="bg-surface border border-white/[0.1] rounded px-4 py-2 text-sm text-on-surface w-full max-w-md focus:border-primary focus:outline-none"
        />
        <span className="text-xs text-outline">Total: {posts.length} artikel</span>
      </div>

      {loading ? (
        <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
          <p className="text-sm">Memuat artikel journal...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-surface border border-red-500/20 rounded">
          <p className="text-sm font-semibold mb-2">Gagal Memuat Data</p>
          <p className="text-xs font-mono text-outline">{error}</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/[0.08] rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="p-4 font-semibold">Cover</th>
                <th className="p-4 font-semibold">Judul Artikel</th>
                <th className="p-4 font-semibold">Kategori</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Tanggal</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container/50 transition-colors">
                  <td className="p-4">
                    <div className="relative w-16 h-10 bg-surface-container rounded overflow-hidden border border-white/[0.1]">
                      {post.cover_path ? (
                        <Image src={post.cover_path} alt="Cover" fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-outline">No Cover</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-sm text-on-surface block">{post.title}</span>
                    <span className="text-xs text-outline line-clamp-1">{post.excerpt || post.slug}</span>
                  </td>
                  <td className="p-4 text-xs text-on-surface-variant">
                    {post.category?.name || 'Husbandry & Care'}
                  </td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(post)}
                      className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors ${
                        post.published
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-xs text-outline">
                    {new Date(post.published_at || post.created_at || '2026-01-01').toLocaleDateString('id-ID')}
                  </td>
                  <td className="p-4 text-sm text-right space-x-3">
                    <Link
                      href={`/admin/journal/${post.id}`}
                      className="text-primary hover:underline text-xs uppercase font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="text-red-400 hover:underline text-xs uppercase font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-on-surface-variant">
                    <p className="text-sm font-body mb-2">Belum ada artikel journal.</p>
                    <Link
                      href="/admin/journal/new"
                      className="px-4 py-2 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded inline-block"
                    >
                      + Tulis Artikel Sekarang
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
