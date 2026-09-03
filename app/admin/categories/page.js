'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminCategoriesPage() {
  const fields = [
    { key: 'name', label: 'Nama Kategori Ikan', type: 'text', required: true, placeholder: 'e.g. Plakat (HMPK)' },
    { key: 'slug', label: 'Slug URL', type: 'text', required: true, placeholder: 'e.g. plakat-hmpk' },
    { key: 'description', label: 'Deskripsi Kategori', type: 'textarea' },
    { key: 'image_path', label: 'Foto Sampul Kategori', type: 'image' },
    { key: 'sort_order', label: 'Urutan', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Tampilkan di Filter', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'image_path', label: 'Sampul', type: 'image' },
    { key: 'name', label: 'Kategori' },
    { key: 'slug', label: 'Slug' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="Kategori Ikan Cupang"
      table="categories"
      fields={fields}
      columns={columns}
      frameType="fish"
      bucket="branding"
      defaultSort="sort_order"
    />
  )
}
