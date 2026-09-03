'use client'

import CRUDManager from '@/components/admin/CRUDManager'

export default function AdminFAQPage() {
  const fields = [
    { key: 'question', label: 'Pertanyaan (ID)', type: 'text', required: true, placeholder: 'e.g. Bagaimana protokol pengiriman luar pulau & ekspor?' },
    { key: 'answer', label: 'Jawaban Lengkap (ID)', type: 'textarea', required: true },
    { key: 'category', label: 'Kategori FAQ', type: 'text', placeholder: 'e.g. Pengiriman / Perawatan / Garansi' },
    { key: 'sort_order', label: 'Urutan', type: 'number', defaultValue: 1 },
    { key: 'published', label: 'Publikasikan', type: 'checkbox', defaultValue: true }
  ]

  const columns = [
    { key: 'question', label: 'Pertanyaan' },
    { key: 'category', label: 'Kategori', render: (val) => val || 'Umum' },
    { key: 'sort_order', label: 'Urutan' }
  ]

  return (
    <CRUDManager
      title="FAQ (Tanya Jawab)"
      table="faqs"
      fields={fields}
      columns={columns}
      defaultSort="sort_order"
    />
  )
}
