'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedInquiry, setSelectedInquiry] = useState(null)

  const supabase = createClient()

  useEffect(() => {
    let active = true
    async function loadInquiries() {
      const { data } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      if (active) {
        setInquiries(data || [])
        setLoading(false)
      }
    }
    loadInquiries()
    return () => { active = false }
  }, [supabase])

  const handleUpdateStatus = async (id, status) => {
    await supabase.from('inquiries').update({ status }).eq('id', id)
    setInquiries((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => ({ ...prev, status }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-display text-primary">Inquiries & Leads</h1>
          <p className="text-xs text-on-surface-variant font-body mt-1">
            Pesan calon pembeli, kolektor, dan pertanyaan ketersediaan spesimen.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
          <p className="text-sm">Memuat pesan masuk...</p>
        </div>
      ) : inquiries.length > 0 ? (
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-surface border border-white/[0.08] rounded overflow-hidden">
            <div className="divide-y divide-white/[0.06]">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => setSelectedInquiry(inq)}
                  className={`p-4 cursor-pointer hover:bg-surface-container transition-colors flex justify-between items-start ${
                    selectedInquiry?.id === inq.id ? 'bg-surface-container border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-on-surface">{inq.name}</span>
                      <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${
                        inq.status === 'pending' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                        inq.status === 'contacted' ? 'bg-blue-950 text-blue-300 border border-blue-500/30' :
                        'bg-zinc-800 text-zinc-400'
                      }`}>
                        {inq.status}
                      </span>
                    </div>
                    <p className="text-xs text-outline">{inq.email} • {inq.phone || 'No phone'}</p>
                    <p className="text-xs text-on-surface-variant line-clamp-1">{inq.message}</p>
                  </div>
                  <span className="text-[10px] text-outline">
                    {new Date(inq.created_at || '2026-01-01').toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 bg-surface border border-white/[0.08] rounded p-6">
            {selectedInquiry ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start border-b border-white/[0.08] pb-4">
                  <div>
                    <h3 className="font-display text-lg text-primary">{selectedInquiry.name}</h3>
                    <p className="text-xs text-outline font-mono">{selectedInquiry.email}</p>
                  </div>
                  <select
                    value={selectedInquiry.status}
                    onChange={(e) => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                    className="bg-surface-container border border-white/[0.2] text-xs p-1.5 rounded text-on-surface"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="space-y-3 text-sm">
                  {selectedInquiry.phone && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-outline block">WhatsApp / Phone:</span>
                      <a
                        href={`https://wa.me/${selectedInquiry.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-xs"
                      >
                        {selectedInquiry.phone} &rarr; Hubungi via WhatsApp
                      </a>
                    </div>
                  )}

                  {selectedInquiry.inquiry_type && (
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-outline block">Tipe Inquiry:</span>
                      <span className="text-on-surface text-xs font-semibold">{selectedInquiry.inquiry_type}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-outline block">Isi Pesan:</span>
                    <p className="text-xs text-on-surface-variant bg-surface-container p-3 rounded mt-1 leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.message}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-on-surface-variant text-xs">
                Pilih salah satu pesan di sebelah kiri untuk melihat detail dan menghubungi calon buyer.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-16 text-center text-on-surface-variant bg-surface border border-white/[0.08] rounded">
          <p className="text-sm font-body mb-2">Belum ada inquiry masuk.</p>
          <p className="text-xs text-outline">Pesan yang dikirim pengunjung melalui form kontak dan form inquiry akan muncul di sini.</p>
        </div>
      )}
    </div>
  )
}
