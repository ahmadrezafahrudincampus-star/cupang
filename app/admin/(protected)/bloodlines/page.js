'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminBloodlinesPage() {
  const fields = [
    { key: 'name', label: 'Nama Galur / Bloodline', type: 'text', required: true, placeholder: 'e.g. Grand Master Koi Lineage' },
    { key: 'slug', label: 'Slug', type: 'text', required: true, placeholder: 'e.g. grand-master-koi' },
    { key: 'history', label: 'Silsilah & Karakteristik Genetik', type: 'textarea' },
    { key: 'image_path', label: 'Foto Indukan Utama', type: 'image' },
    { key: 'published', label: 'Publikasikan', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'image_path', label: 'Foto', type: 'image' },
    { key: 'name', label: 'Galur Murni' },
    { key: 'slug', label: 'Slug' },
    { key: 'history', label: 'Silsilah Genetik', render: (val) => val ? val.slice(0, 80) + '...' : '-' }
  ]

  return (
    <CRUDManager
      title="Galur Murni (Bloodlines)"
      table="bloodlines"
      fields={fields}
      columns={columns}
      frameType="fish"
      bucket="fish-media"
      defaultSort="name"
    />
  )
}
