import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase credentials are not configured or are placeholders, pass through safely
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder')) {
    return supabaseResponse
  }

  try {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    const url = request.nextUrl.clone()
    
    // Protect admin routes except login
    if (url.pathname.startsWith('/admin') && url.pathname !== '/admin/login') {
      if (!user) {
        url.pathname = '/admin/login'
        return NextResponse.redirect(url)
      }
    }

    // Redirect logged-in users away from the login page
    if (url.pathname === '/admin/login' && user) {
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  } catch (err) {
    // Gracefully continue on connection or configuration errors
    console.warn('Middleware auth check skipped:', err?.message || err)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}
