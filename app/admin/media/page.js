'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

const BUCKETS = [
  { id: 'fish-media', label: 'Fish Media' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'journal', label: 'Journal' },
  { id: 'branding', label: 'Branding & Farm' },
]

export default function MediaPage() {
  const [selectedBucket, setSelectedBucket] = useState('fish-media')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState('')

  useEffect(() => {
    let active = true
    const supabase = createClient()

    async function loadBucketFiles() {
      try {
        const { data, error } = await supabase.storage
          .from(selectedBucket)
          .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

        if (active) {
          if (error) {
            setFiles([])
          } else {
            setFiles(data || [])
          }
          setLoading(false)
        }
      } catch {
        if (active) {
          setFiles([])
          setLoading(false)
        }
      }
    }

    loadBucketFiles()
    return () => { active = false }
  }, [selectedBucket])

  const refreshFiles = async () => {
    setLoading(true)
    const supabase = createClient()
    try {
      const { data } = await supabase.storage
        .from(selectedBucket)
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
      setFiles(data || [])
    } catch {
      setFiles([])
    }
    setLoading(false)
  }

  const handleUpload = async (e) => {
    const uploadedFiles = e.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return

    setUploading(true)
    const supabase = createClient()

    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      
      const { error } = await supabase.storage
        .from(selectedBucket)
        .upload(fileName, file, { cacheControl: '3600', upsert: true })

      if (error) {
        alert(`Upload failed for ${file.name}: ${error.message}`)
      }
    }
    setUploading(false)
    refreshFiles()
  }

  const handleDelete = async (fileName) => {
    if (confirm(`Delete ${fileName} from ${selectedBucket}?`)) {
      const supabase = createClient()
      await supabase.storage.from(selectedBucket).remove([fileName])
      refreshFiles()
    }
  }

  const getPublicUrl = (fileName) => {
    const supabase = createClient()
    const { data } = supabase.storage.from(selectedBucket).getPublicUrl(fileName)
    return data?.publicUrl || ''
  }

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(''), 2500)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display text-primary">Media Library & Storage</h1>
          <p className="text-sm text-on-surface-variant font-body">Manage photography assets across Supabase Storage buckets.</p>
        </div>

        {/* Upload Control */}
        <div>
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-black font-semibold text-xs uppercase tracking-widest rounded hover:bg-opacity-90 transition-all">
            <span>{uploading ? 'Uploading...' : '+ Upload Asset'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bucket Tabs */}
      <div className="flex border-b border-white/[0.08] gap-4">
        {BUCKETS.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => {
              setLoading(true)
              setSelectedBucket(b.id)
            }}
            className={`pb-3 text-xs uppercase tracking-widest font-body border-b-2 transition-all ${
              selectedBucket === b.id
                ? 'border-primary text-primary font-semibold'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* File Grid */}
      {loading ? (
        <p className="text-on-surface-variant text-sm py-12 text-center">Loading storage assets...</p>
      ) : files.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {files.map((file) => {
            const publicUrl = getPublicUrl(file.name)
            return (
              <div key={file.id || file.name} className="group bg-surface border border-white/[0.08] rounded overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-square bg-surface-container">
                  <Image
                    src={publicUrl}
                    alt={file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
                <div className="p-3 bg-surface-container flex flex-col gap-2">
                  <p className="text-[11px] font-mono text-on-surface truncate" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-white/[0.08] text-[10px]">
                    <button
                      type="button"
                      onClick={() => handleCopy(publicUrl)}
                      className="text-primary hover:underline"
                    >
                      {copiedUrl === publicUrl ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file.name)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-surface border border-white/[0.08] p-16 text-center rounded flex flex-col items-center gap-4">
          <p className="text-on-surface-variant text-sm font-body">
            No media files uploaded in <span className="text-primary">{selectedBucket}</span> yet.
          </p>
          <p className="text-xs text-outline max-w-md">
            Click &quot;+ Upload Asset&quot; to upload real breeder photography to Supabase Storage. The public website will automatically prioritize uploaded media.
          </p>
        </div>
      )}
    </div>
  )
}
