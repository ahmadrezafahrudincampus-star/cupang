import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const url = request.nextUrl.clone()
  const pathname = url.pathname

  let response = NextResponse.next({
    request,
  })

  // Only run auth checks on admin routes
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const isLoginPage = pathname === '/admin/login'
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // If Supabase credentials are missing or placeholder, STRICTLY BLOCK admin access
    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
      if (!isLoginPage) {
        url.pathname = '/admin/login'
        url.search = '?error=config_missing'
        return NextResponse.redirect(url)
      }
      return response
    }

    try {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (!isLoginPage) {
        // Protected Admin Route
        if (userError || !user) {
          url.pathname = '/admin/login'
          url.search = ''
          return NextResponse.redirect(url)
        }

        // Verify role in profiles table
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role, active')
          .eq('id', user.id)
          .maybeSingle()

        if (profileErr || !profile || !['admin', 'super_admin', 'editor'].includes(profile.role) || profile.active === false) {
          url.pathname = '/admin/login'
          url.search = '?error=unauthorized'
          return NextResponse.redirect(url)
        }

        // Bare /admin redirects to /admin/dashboard
        if (pathname === '/admin') {
          url.pathname = '/admin/dashboard'
          return NextResponse.redirect(url)
        }
      } else {
        // Login Page: if already authenticated admin, redirect to /admin/dashboard
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, active')
            .eq('id', user.id)
            .maybeSingle()

          if (profile && ['admin', 'super_admin', 'editor'].includes(profile.role) && profile.active !== false) {
            url.pathname = '/admin/dashboard'
            url.search = ''
            return NextResponse.redirect(url)
          }
        }
      }
    } catch {
      // On any unexpected exception, protected routes MUST redirect to login
      if (!isLoginPage) {
        url.pathname = '/admin/login'
        url.search = ''
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
  ],
}
