'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminBreedingPage() {
  const fields = [
    { key: 'stage_number', label: 'Nomor Tahap (e.g. 1, 2, 3)', type: 'number', required: true, defaultValue: 1 },
    { key: 'title', label: 'Judul Tahap (ID)', type: 'text', required: true, placeholder: 'e.g. Seleksi Indukan' },
    { key: 'title_en', label: 'Judul Tahap (EN)', type: 'text', placeholder: 'e.g. Broodstock Selection' },
    { key: 'description', label: 'Deskripsi Metodologi (ID)', type: 'textarea', required: true },
    { key: 'description_en', label: 'Deskripsi Metodologi (EN)', type: 'textarea' },
    { key: 'image_path', label: 'Foto Dokumentasi Tahap', type: 'image' },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan ke Website', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'image_path', label: 'Foto', type: 'image' },
    { key: 'stage_number', label: 'Tahap #', render: (val) => `Stage 0${val}` },
    { key: 'title', label: 'Judul Metodologi' },
    { key: 'description', label: 'Ringkasan', render: (val) => val ? val.slice(0, 70) + '...' : '-' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="Metodologi Breeding"
      table="breeding_stages"
      fields={fields}
      columns={columns}
      frameType="breeding"
      bucket="farm"
      defaultSort="stage_number"
    />
  )
}
