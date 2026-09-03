'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminFishPage() {
  const [fish, setFish] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const supabase = createClient()

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function fetchFish() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: fetchErr } = await supabase
          .from('fish')
          .select('*, category:categories(name), bloodline:bloodlines(name), media:fish_media(storage_path)')
          .order('created_at', { ascending: false })

        if (active) {
          if (fetchErr) throw fetchErr
          setFish(data || [])
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    fetchFish()
    return () => { active = false }
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: fetchErr } = await supabase
        .from('fish')
        .select('*, category:categories(name), bloodline:bloodlines(name), media:fish_media(storage_path)')
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setFish(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (confirm(`Hapus spesimen "${name}" dari katalog?`)) {
      await supabase.from('fish').delete().eq('id', id)
      setFish((prev) => prev.filter((f) => f.id !== id))
    }
  }

  const handleUpdateStatus = async (id, status) => {
    await supabase.from('fish').update({ status }).eq('id', id)
    setFish((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)))
  }

  const filteredFish = fish.filter((f) => {
    const matchesSearch = !search ||
      (f.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.fish_code || '').toLowerCase().includes(search.toLowerCase()) ||
      (f.type || '').toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || f.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Katalog Spesimen Ikan</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Kelola inventaris spesimen Plakat, Halfmoon, Crowntail, status ketersediaan, dan harga.
          </p>
        </div>
        <Link
          href="/admin/fish/new"
          className="px-5 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-opacity-90 self-start sm:self-auto"
        >
          + Tambah Ikan Baru
        </Link>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-surface p-4 border border-white/[0.08] rounded-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode (BT-2026-xxx), nama, tipe..."
            className="bg-surface-container border border-white/[0.1] rounded px-4 py-2 text-sm text-on-surface w-full focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-outline uppercase tracking-wider">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container border border-white/[0.1] rounded text-xs p-2 text-on-surface focus:border-primary focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
          <span className="text-xs text-outline">({filteredFish.length} ikan)</span>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
          <p className="text-sm">Memuat katalog ikan...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-surface border border-red-500/20 rounded">
          <p className="text-sm font-semibold mb-2">Gagal Memuat Katalog</p>
          <p className="text-xs font-mono text-outline">{error}</p>
        </div>
      ) : (
        <div className="bg-surface border border-white/[0.08] rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="p-4 font-semibold">Foto</th>
                <th className="p-4 font-semibold">Kode & Nama</th>
                <th className="p-4 font-semibold">Kategori & Bloodline</th>
                <th className="p-4 font-semibold">Harga</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredFish.map((f) => {
                const photoSrc = f.media?.[0]?.storage_path || f.cover_image || '/images/dummy/fish/dummy-fish-photo-01.jpg'
                return (
                  <tr key={f.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-12 h-15 bg-surface-container rounded overflow-hidden border border-white/[0.1] aspect-[4/5]">
                        <Image src={photoSrc} alt={f.name} fill className="object-cover" sizes="48px" />
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-mono text-xs text-primary font-semibold block">{f.fish_code}</span>
                      <span className="font-display text-sm text-on-surface font-semibold">{f.name}</span>
                      <span className="text-xs text-outline block">{f.type || 'Plakat'} • {f.gender || 'Male'}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-on-surface block font-medium">{f.category?.name || 'General'}</span>
                      <span className="text-[11px] text-outline block">{f.bloodline?.name || '-'}</span>
                    </td>
                    <td className="p-4 text-xs font-mono text-on-surface">
                      {f.price ? `IDR ${Number(f.price).toLocaleString('id-ID')}` : 'Inquire'}
                    </td>
                    <td className="p-4">
                      <select
                        value={f.status || 'available'}
                        onChange={(e) => handleUpdateStatus(f.id, e.target.value)}
                        className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-1 rounded border focus:outline-none ${
                          f.status === 'available' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30' :
                          f.status === 'reserved' ? 'bg-amber-950/80 text-amber-300 border-amber-500/30' :
                          f.status === 'sold' ? 'bg-zinc-800 text-zinc-400 border-zinc-700' :
                          'bg-zinc-900 text-zinc-500 border-zinc-800'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="p-4 text-sm text-right space-x-3">
                      <Link
                        href={`/admin/fish/${f.id}`}
                        className="text-primary hover:underline text-xs uppercase font-semibold"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(f.id, f.name)}
                        className="text-red-400 hover:underline text-xs uppercase font-semibold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                )
              })}

              {filteredFish.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-on-surface-variant">
                    <p className="text-sm font-body mb-2">Tidak ada spesimen ikan yang cocok.</p>
                    <Link
                      href="/admin/fish/new"
                      className="px-4 py-2 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded inline-block"
                    >
                      + Tambah Ikan Baru
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
