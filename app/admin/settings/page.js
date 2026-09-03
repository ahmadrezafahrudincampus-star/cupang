'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    brand_name: 'AQUATIC ART',
    tagline: 'Premium Betta Fish Breeder',
    whatsapp_number: '6281234567890',
    email: 'info@aquaticart.com',
    business_area: 'Indonesia',
    operating_hours: '09:00 - 18:00',
    footer_text: 'All rights reserved.',
    default_seo_title: 'Aquatic Art - Luxury Betta Fish',
    default_seo_description: 'Premium Betta fish bred with care and precision.',
  })

  useEffect(() => {
    let active = true
    const supabase = createClient()
    async function fetchSettings() {
      const { data } = await supabase.from('site_settings').select('*').limit(1).maybeSingle()
      if (active) {
        if (data) setSettings(data)
        setLoading(false)
      }
    }
    fetchSettings()
    return () => { active = false }
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    const supabase = createClient()
    
    if (settings.id) {
      await supabase.from('site_settings').update(settings).eq('id', settings.id)
    } else {
      await supabase.from('site_settings').insert([settings])
    }

    setSaving(false)
    alert('Settings saved successfully!')
  }

  if (loading) return <p>Loading settings...</p>

  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-4 bg-surface p-6 border border-white/[0.08] rounded">
        <div>
          <label className="block text-sm mb-1">Brand Name</label>
          <input
            type="text"
            className="w-full bg-surface-container border border-white/[0.2] p-2 rounded text-sm"
            value={settings.brand_name || ''}
            onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Tagline</label>
          <input
            type="text"
            className="w-full bg-surface-container border border-white/[0.2] p-2 rounded text-sm"
            value={settings.tagline || ''}
            onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">WhatsApp Number</label>
            <input
              type="text"
              className="w-full bg-surface-container border border-white/[0.2] p-2 rounded text-sm"
              value={settings.whatsapp_number || ''}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-surface-container border border-white/[0.2] p-2 rounded text-sm"
              value={settings.email || ''}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Operating Hours</label>
          <input
            type="text"
            className="w-full bg-surface-container border border-white/[0.2] p-2 rounded text-sm"
            value={settings.operating_hours || ''}
            onChange={(e) => setSettings({ ...settings, operating_hours: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-primary text-black font-semibold rounded hover:bg-opacity-90"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
