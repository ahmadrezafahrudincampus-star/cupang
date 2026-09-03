'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminAchievementsPage() {
  const fields = [
    { key: 'title', label: 'Nama Penghargaan / Kejuaraan', type: 'text', required: true, placeholder: 'e.g. Grand Champion — Jakarta Betta Show 2025' },
    { key: 'year', label: 'Tahun', type: 'number', required: true, defaultValue: 2025 },
    { key: 'description', label: 'Kategori / Keterangan Prestasi', type: 'textarea' },
    { key: 'image_path', label: 'Foto Trophy / Sertifikat', type: 'image' },
    { key: 'sort_order', label: 'Urutan', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'image_path', label: 'Foto/Sertifikat', type: 'image' },
    { key: 'title', label: 'Prestasi' },
    { key: 'year', label: 'Tahun' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="Prestasi & Penghargaan Kontes"
      table="achievements"
      fields={fields}
      columns={columns}
      frameType="story"
      bucket="achievements"
      defaultSort="year"
    />
  )
}
