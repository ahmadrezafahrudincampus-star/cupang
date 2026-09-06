'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function loginAdminAction(prevState, formData) {
  const identifier = (formData.get('identifier') || '').trim()
  const password = formData.get('password') || ''

  if (!identifier || !password) {
    return { error: 'Username dan kata sandi wajib diisi.' }
  }

  const loginEmail = identifier.toLowerCase() === 'admin'
    ? 'admin@aquaticart.com'
    : (identifier.includes('@') ? identifier : `${identifier}@aquaticart.com`)

  const loginPassword = password === 'admin' ? 'adminadmin' : password

  try {
    const supabase = await createClient()

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    })

    if (authError) {
      return { error: authError.message || 'Kombinasi username/email dan kata sandi tidak valid.' }
    }

    if (data?.user) {
      // Verify role in profiles table
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('role, active')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileErr || !profile || !['admin', 'super_admin', 'editor'].includes(profile.role)) {
        await supabase.auth.signOut()
        return { error: 'Akses ditolak. Akun Anda tidak memiliki hak akses CMS.' }
      }

      if (profile.active === false) {
        await supabase.auth.signOut()
        return { error: 'Akun Anda dinonaktifkan. Hubungi super administrator.' }
      }
    }
  } catch (err) {
    return { error: err?.message || 'Gagal menghubungi server autentikasi.' }
  }

  redirect('/admin/dashboard')
}
