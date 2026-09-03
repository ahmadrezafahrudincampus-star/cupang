'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ImageUploader from './ImageUploader'
import Image from 'next/image'

export default function CRUDManager({
  title,
  table,
  fields = [],
  columns = [],
  frameType = 'breeding',
  bucket = 'breeding',
  defaultSort = 'sort_order'
}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase.from(table).select('*')
        if (defaultSort) {
          query = query.order(defaultSort, { ascending: true })
        }
        const { data, error: fetchErr } = await query

        if (active) {
          if (fetchErr) {
            setError(fetchErr.message)
            setItems([])
          } else {
            setItems(data || [])
          }
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          setError(err?.message || 'Data tidak dapat dimuat.')
          setItems([])
          setLoading(false)
        }
      }
    }

    fetchData()
    return () => { active = false }
  }, [table, defaultSort])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    try {
      let query = supabase.from(table).select('*')
      if (defaultSort) {
        query = query.order(defaultSort, { ascending: true })
      }
      const { data, error: fetchErr } = await query
      if (fetchErr) {
        setError(fetchErr.message)
        setItems([])
      } else {
        setItems(data || [])
      }
    } catch (err) {
      setError(err?.message || 'Data tidak dapat dimuat.')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = () => {
    const initial = {}
    fields.forEach((f) => {
      initial[f.key] = f.defaultValue !== undefined ? f.defaultValue : ''
    })
    setFormData(initial)
    setEditingItem(null)
    setModalOpen(true)
  }

  const openEditModal = (item) => {
    setFormData({ ...item })
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    try {
      if (editingItem?.id) {
        const { error: updateErr } = await supabase
          .from(table)
          .update(formData)
          .eq('id', editingItem.id)

        if (updateErr) throw updateErr
      } else {
        const { error: insertErr } = await supabase
          .from(table)
          .insert([formData])

        if (insertErr) throw insertErr
      }
      setModalOpen(false)
      loadData()
    } catch (err) {
      alert(`Gagal menyimpan: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name = 'item') => {
    if (confirm(`Yakin ingin menghapus "${name}"?`)) {
      const supabase = createClient()
      try {
        const { error: delErr } = await supabase.from(table).delete().eq('id', id)
        if (delErr) throw delErr
        setItems((prev) => prev.filter((i) => i.id !== id))
      } catch (err) {
        alert(`Gagal menghapus: ${err.message}`)
      }
    }
  }

  const handleTogglePublish = async (item) => {
    const supabase = createClient()
    try {
      const newStatus = !item.published
      await supabase.from(table).update({ published: newStatus }).eq('id', item.id)
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, published: newStatus } : i))
      )
    } catch (err) {
      alert(`Gagal memperbarui status: ${err.message}`)
    }
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return Object.values(item).some((v) => String(v).toLowerCase().includes(q))
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-primary">{title}</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Kelola data dan sinkronisasi langsung dengan website publik.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-opacity-90 transition-all self-start sm:self-auto"
        >
          + Tambah {title}
        </button>
      </div>

      {/* Search Filter */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Cari ${title}...`}
          className="bg-surface border border-white/[0.1] rounded px-4 py-2 text-sm text-on-surface w-full max-w-md focus:border-primary focus:outline-none"
        />
        <span className="text-xs text-outline font-mono">Total: {items.length} data</span>
      </div>

      {/* States */}
      {loading ? (
        <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
          <p className="text-sm">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-400 bg-surface border border-red-500/20 rounded">
          <p className="text-sm font-semibold mb-2">Data tidak dapat dimuat.</p>
          <p className="text-xs font-mono text-outline mb-4">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-1.5 bg-surface-container border border-white/[0.1] text-xs text-on-surface rounded hover:bg-surface-variant"
          >
            Muat Ulang
          </button>
        </div>
      ) : (
        <div className="bg-surface border border-white/[0.08] rounded overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-surface-container text-xs uppercase tracking-wider text-on-surface-variant">
                {columns.map((c) => (
                  <th key={c.key} className="p-4 font-semibold">{c.label}</th>
                ))}
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container/50 transition-colors">
                  {columns.map((c) => (
                    <td key={c.key} className="p-4 text-sm text-on-surface">
                      {c.type === 'image' ? (
                        <div className="relative w-12 h-12 bg-surface-container rounded overflow-hidden border border-white/[0.1]">
                          {item[c.key] ? (
                            <Image src={item[c.key]} alt="Thumb" fill className="object-cover" sizes="48px" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-outline">Tanpa Foto</div>
                          )}
                        </div>
                      ) : c.render ? (
                        c.render(item[c.key], item)
                      ) : (
                        item[c.key]?.toString()
                      )}
                    </td>
                  ))}
                  <td className="p-4 text-sm">
                    {item.published !== undefined ? (
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(item)}
                        className={`px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider rounded transition-colors ${
                          item.published
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                        }`}
                      >
                        {item.published ? 'Tayang' : 'Draf'}
                      </button>
                    ) : (
                      <span className="text-xs text-outline">-</span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-right space-x-3">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="text-primary hover:underline text-xs uppercase font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title || item.name || 'data')}
                      className="text-red-400 hover:underline text-xs uppercase font-semibold"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}

              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 2} className="p-16 text-center text-on-surface-variant">
                    <p className="text-sm font-body mb-2">Belum ada data.</p>
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="px-4 py-2 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded"
                    >
                      + Tambah {title} Sekarang
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Dialog for Create / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-white/[0.1] rounded-xl w-full max-w-xl p-6 space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-3">
              <h2 className="text-xl font-display text-primary">
                {editingItem ? `Edit ${title}` : `Tambah ${title} Baru`}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-on-surface-variant hover:text-white text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  {f.type === 'image' ? (
                    <ImageUploader
                      label={f.label}
                      value={formData[f.key] || ''}
                      onChange={(url) => setFormData({ ...formData, [f.key]: url })}
                      frameType={frameType}
                      bucket={bucket}
                    />
                  ) : f.type === 'textarea' ? (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        {f.label} {f.required && <span className="text-red-400">*</span>}
                      </label>
                      <textarea
                        rows={3}
                        required={f.required}
                        value={formData[f.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                        className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
                        placeholder={f.placeholder}
                      />
                    </div>
                  ) : f.type === 'checkbox' ? (
                    <label className="flex items-center gap-2 text-sm text-on-surface cursor-pointer pt-2">
                      <input
                        type="checkbox"
                        checked={!!formData[f.key]}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.checked })}
                        className="rounded bg-surface-container border-white/[0.2] text-primary focus:ring-0"
                      />
                      {f.label}
                    </label>
                  ) : (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        {f.label} {f.required && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        type={f.type || 'text'}
                        required={f.required}
                        value={formData[f.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
                        className="w-full bg-surface-container border border-white/[0.1] p-2.5 rounded text-sm text-on-surface focus:border-primary focus:outline-none"
                        placeholder={f.placeholder}
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-white/[0.1] text-xs uppercase tracking-wider text-on-surface rounded hover:bg-surface-container"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-black font-semibold text-xs uppercase tracking-wider rounded hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
