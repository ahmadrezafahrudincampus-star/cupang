'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminGalleryPage() {
  const fields = [
    { key: 'title', label: 'Judul Plate Foto', type: 'text', required: true, placeholder: 'e.g. Galaxy Koi Plakat Studio Study' },
    { key: 'caption', label: 'Keterangan Fotografi / Deskripsi', type: 'textarea' },
    { key: 'storage_path', label: 'Foto Studio / Exhibition Plate', type: 'image', required: true },
    { key: 'category', label: 'Kategori / Seri', type: 'text', placeholder: 'e.g. Macro Series' },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan ke Galeri', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'storage_path', label: 'Preview', type: 'image' },
    { key: 'title', label: 'Judul Foto' },
    { key: 'category', label: 'Kategori', render: (val) => val || 'Exhibition' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="Galeri Fotografi Spesimen"
      table="gallery_items"
      fields={fields}
      columns={columns}
      frameType="gallery"
      bucket="gallery"
      defaultSort="sort_order"
    />
  )
}
