'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
      setError('Konfigurasi Supabase backend belum lengkap pada environment ini.')
      setLoading(false)
      return
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Kombinasi email dan kata sandi tidak valid.')
        setLoading(false)
        return
      }

      if (data?.user) {
        // Verify role server-side via profiles table
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role, active')
          .eq('id', data.user.id)
          .maybeSingle()

        if (profileErr || !profile || !['admin', 'super_admin', 'editor'].includes(profile.role)) {
          await supabase.auth.signOut()
          setError('Akses ditolak. Akun Anda tidak memiliki hak akses CMS.')
          setLoading(false)
          return
        }

        if (profile.active === false) {
          await supabase.auth.signOut()
          setError('Akun Anda dinonaktifkan. Hubungi super administrator.')
          setLoading(false)
          return
        }

        router.push('/admin/dashboard')
        router.refresh()
      }
    } catch (err) {
      setError(err?.message || 'Gagal menghubungi server autentikasi.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-background text-on-surface">
      <div className="w-full max-w-[480px] bg-surface rounded-xl border border-white/[0.08] shadow-2xl p-6 sm:p-10 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-display text-primary tracking-wider mb-2 font-bold">
            AQUATIC ART
          </h1>
          <p className="text-on-surface-variant text-[10px] sm:text-xs uppercase tracking-[0.2em] font-body">
            SUPER ADMIN CMS PORTAL
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3.5 rounded-md mb-6 text-xs leading-relaxed text-center font-body">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-body mb-2">
              Email Administrator
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container border border-white/[0.1] rounded px-4 py-3 focus:outline-none focus:border-primary text-on-surface text-sm transition-colors font-body"
              required
              placeholder="admin@aquaticart.com"
              autoComplete="email"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant font-body">
                Kata Sandi
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-primary hover:underline transition-all cursor-pointer font-medium font-body"
              >
                {showPassword ? 'Sembunyikan' : 'Lihat'}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container border border-white/[0.1] rounded px-4 py-3 focus:outline-none focus:border-primary text-on-surface text-sm transition-colors font-body"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-semibold py-3.5 rounded text-xs uppercase tracking-widest hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 mt-8 shadow-lg cursor-pointer font-body"
          >
            {loading ? 'Memverifikasi...' : 'Masuk Super Admin'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.06] text-center">
          <Link
            href="/id"
            className="text-[11px] text-on-surface-variant hover:text-primary transition-colors font-body tracking-wider"
          >
            &larr; Kembali ke Portfolio Publik
          </Link>
        </div>
      </div>
    </main>
  )
}
