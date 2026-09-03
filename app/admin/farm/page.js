'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminFarmPage() {
  const fields = [
    { key: 'title', label: 'Nama Modul / Area Farm', type: 'text', required: true, placeholder: 'e.g. Water Conditioning Lab' },
    { key: 'description', label: 'Deskripsi Teknis & Fasilitas', type: 'textarea', required: true },
    { key: 'image_path', label: 'Foto Fasilitas', type: 'image' },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan ke Website', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'image_path', label: 'Foto', type: 'image' },
    { key: 'title', label: 'Area / Fasilitas' },
    { key: 'description', label: 'Deskripsi', render: (val) => val ? val.slice(0, 80) + '...' : '-' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="Fasilitas Farm & Bio-Aquaculture"
      table="farm_sections"
      fields={fields}
      columns={columns}
      frameType="farm"
      bucket="farm"
      defaultSort="sort_order"
    />
  )
}
