'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminTestimonialsPage() {
  const fields = [
    { key: 'customer_name', label: 'Nama Customer / Kolektor', type: 'text', required: true },
    { key: 'location', label: 'Lokasi / Asal Kota & Negara', type: 'text', placeholder: 'e.g. Singapore / Jakarta' },
    { key: 'quote', label: 'Isi Ulasan / Testimoni', type: 'textarea', required: true },
    { key: 'rating', label: 'Rating (1 - 5)', type: 'number', defaultValue: 5, required: true },
    { key: 'sort_order', label: 'Urutan Tampil', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan ke Website', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'customer_name', label: 'Kolektor' },
    { key: 'location', label: 'Lokasi' },
    { key: 'rating', label: 'Rating', render: (val) => `${val} ★` },
    { key: 'quote', label: 'Kutipan Ulasan', render: (val) => val ? val.slice(0, 80) + '...' : '-' }
  ]

  return (
    <CRUDManager
      title="Testimoni Kolektor & Buyer"
      table="testimonials"
      fields={fields}
      columns={columns}
      frameType="story"
      bucket="testimonials"
      defaultSort="sort_order"
    />
  )
}
