'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export const FRAME_SPECS = {
  hero: {
    label: 'Foto Sampul Hero Utama',
    recommendedWidth: 2400,
    recommendedHeight: 1350,
    aspectRatio: '16:9',
    aspectClass: 'aspect-[16/9]',
    minWidth: 1200,
    minHeight: 675
  },
  story: {
    label: 'Foto Profil / Breeder Story',
    recommendedWidth: 1600,
    recommendedHeight: 2000,
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    minWidth: 800,
    minHeight: 1000
  },
  fish: {
    label: 'Foto Portrait Spesimen Ikan',
    recommendedWidth: 1600,
    recommendedHeight: 2000,
    aspectRatio: '4:5',
    aspectClass: 'aspect-[4/5]',
    minWidth: 800,
    minHeight: 1000
  },
  breeding: {
    label: 'Foto Tahap Breeding',
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    aspectRatio: '16:10',
    aspectClass: 'aspect-[16/10]',
    minWidth: 800,
    minHeight: 500
  },
  farm: {
    label: 'Foto Fasilitas Farm',
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    aspectRatio: '16:10',
    aspectClass: 'aspect-[16/10]',
    minWidth: 800,
    minHeight: 500
  },
  gallery: {
    label: 'Foto Galeri Studio',
    recommendedWidth: 1200,
    recommendedHeight: 1200,
    aspectRatio: '1:1',
    aspectClass: 'aspect-square',
    minWidth: 600,
    minHeight: 600
  },
  journal: {
    label: 'Foto Sampul Artikel',
    recommendedWidth: 1600,
    recommendedHeight: 1000,
    aspectRatio: '16:10',
    aspectClass: 'aspect-[16/10]',
    minWidth: 800,
    minHeight: 500
  }
}

export default function ImageUploader({
  value,
  onChange,
  bucket = 'fish-media',
  frameType = 'fish',
  label = 'Foto / Media',
}) {
  const [uploading, setUploading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [warning, setWarning] = useState(null)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const spec = FRAME_SPECS[frameType] || FRAME_SPECS.fish

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setWarning(null)
    setUploading(true)

    try {
      const imageBitmap = await createImageBitmap(file)
      const width = imageBitmap.width
      const height = imageBitmap.height
      const ratio = (width / height).toFixed(2)
      const sizeKB = (file.size / 1024).toFixed(1)
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2)

      if (width < spec.minWidth || height < spec.minHeight) {
        setWarning('Resolusi foto di bawah ukuran yang disarankan.')
      }

      const fileMeta = {
        width,
        height,
        ratio,
        size: file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`,
        type: file.type ? file.type.replace('image/', '').toUpperCase() : 'JPEG',
        name: file.name
      }
      setMeta(fileMeta)

      const supabase = createClient()
      const fileExt = file.name.split('.').pop() || 'jpg'
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const storagePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(storagePath, file, { cacheControl: '3600', upsert: true })

      if (uploadError) {
        const localPreviewUrl = URL.createObjectURL(file)
        onChange(localPreviewUrl, fileMeta)
      } else {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(storagePath)
        const publicUrl = publicData?.publicUrl || storagePath
        onChange(publicUrl, fileMeta)
      }
    } catch {
      setError('Gagal memproses file foto.')
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onChange('', null)
    setMeta(null)
    setWarning(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <label className="font-semibold text-on-surface tracking-wide">{label}</label>
        <span className="text-primary font-mono text-[11px]">
          Disarankan: {spec.recommendedWidth} × {spec.recommendedHeight} px ({spec.aspectRatio})
        </span>
      </div>

      {/* Compact Upload & Frame Area */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border border-dashed border-white/[0.2] hover:border-primary rounded-lg bg-surface-container/60 cursor-pointer overflow-hidden transition-all group max-w-sm ${
          spec.aspectClass
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />

        {value ? (
          <div className="relative w-full h-full">
            <Image
              src={value}
              alt="Foto Terpilih"
              fill
              className="object-cover"
              sizes="384px"
            />
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center gap-2 p-3">
              <span className="text-xs uppercase tracking-wider text-primary font-semibold">
                Ganti Foto
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors font-medium"
              >
                Hapus Foto
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-on-surface-variant gap-1.5">
            <div className="w-8 h-8 rounded-full bg-surface border border-white/[0.1] flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface">
                {uploading ? 'Mengunggah foto...' : 'Pilih Foto dari Komputer'}
              </p>
              <p className="text-[10px] text-outline mt-0.5">
                JPG, PNG, WebP • Min: {spec.minWidth} × {spec.minHeight} px
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Real Pixel Dimensions Readout */}
      {meta && (
        <div className="p-2.5 bg-surface-container rounded border border-white/[0.08] text-[11px] font-mono grid grid-cols-2 sm:grid-cols-4 gap-2 text-on-surface-variant max-w-sm">
          <div>
            <span className="text-outline block text-[10px]">Ukuran:</span>
            <span className="text-primary font-semibold">{meta.width} × {meta.height} px</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">Rasio:</span>
            <span className="text-on-surface">{meta.ratio} : 1</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">Ukuran File:</span>
            <span className="text-on-surface">{meta.size}</span>
          </div>
          <div>
            <span className="text-outline block text-[10px]">Jenis File:</span>
            <span className="text-on-surface">{meta.type}</span>
          </div>
        </div>
      )}

      {warning && (
        <p className="text-[11px] text-amber-400 max-w-sm">{warning}</p>
      )}

      {error && (
        <p className="text-[11px] text-red-400 max-w-sm">{error}</p>
      )}
    </div>
  )
}
