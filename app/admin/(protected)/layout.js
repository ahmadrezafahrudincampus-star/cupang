import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ProtectedAdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, active')
    .eq('id', user.id)
    .maybeSingle()

  if (!profile || !['admin', 'super_admin', 'editor'].includes(profile.role) || profile.active === false) {
    redirect('/admin/login?error=unauthorized')
  }

  const sections = [
    {
      group: 'BERANDA',
      links: [
        { href: '/admin/dashboard', label: 'DASHBOARD' }
      ]
    },
    {
      group: 'IKAN',
      links: [
        { href: '/admin/fish', label: 'DATA IKAN' },
        { href: '/admin/categories', label: 'KATEGORI IKAN' },
        { href: '/admin/bloodlines', label: 'GALUR / BLOODLINE' },
      ]
    },
    {
      group: 'PEMBUDIDAYAAN',
      links: [
        { href: '/admin/breeding', label: 'PROSES BREEDING' },
        { href: '/admin/farm', label: 'FASILITAS FARM' },
        { href: '/admin/gallery', label: 'GALERI FOTO' },
      ]
    },
    {
      group: 'KONTEN WEBSITE',
      links: [
        { href: '/admin/journal', label: 'ARTIKEL / JURNAL' },
        { href: '/admin/testimonials', label: 'TESTIMONI PELANGGAN' },
        { href: '/admin/achievements', label: 'PRESTASI & KONTES' },
        { href: '/admin/faq', label: 'PERTANYAAN UMUM (FAQ)' },
      ]
    },
    {
      group: 'MEDIA & KONTAK',
      links: [
        { href: '/admin/media', label: 'FOTO & MEDIA' },
        { href: '/admin/inquiries', label: 'PESAN MASUK' },
      ]
    },
    {
      group: 'PENGATURAN',
      links: [
        { href: '/admin/settings', label: 'PENGATURAN & WHATSAPP' },
      ]
    }
  ]

  const userEmail = user?.email || 'admin@aquaticart.com'

  return (
    <div className="min-h-screen bg-background text-on-surface flex">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/[0.08] hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-white/[0.08]">
          <Link href="/admin/dashboard" className="block">
            <h2 className="text-xl font-display text-primary font-bold tracking-wider">AQUATIC ART</h2>
            <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-body mt-0.5">SUPER ADMIN PORTAL</p>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-outline px-3 block mb-1">
                {sec.group}
              </span>
              <ul className="space-y-0.5">
                {sec.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-3 py-1.5 rounded text-[11px] font-medium tracking-wide text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/[0.08] flex justify-between items-center text-xs">
          <Link href="/id" target="_blank" className="text-primary hover:underline text-[11px] font-semibold">
            &larr; Buka Website
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-surface border-b border-white/[0.08] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-outline">Status Sistem: Terhubung & Aktif</span>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-xs text-on-surface-variant font-mono">{userEmail}</span>
            <form action="/api/auth/signout" method="post">
              <button type="submit" className="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors font-semibold cursor-pointer">
                Keluar
              </button>
            </form>
          </div>
        </header>

        {/* Content View */}
        <div className="flex-1 overflow-auto p-8 bg-background">
          {children}
        </div>
      </main>
    </div>
  )
}
