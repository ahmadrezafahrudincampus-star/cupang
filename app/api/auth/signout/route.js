import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request) {
  const cookieStore = await cookies()
  cookieStore.delete('admin_dev_session')
  
  const url = request.nextUrl.clone()
  url.pathname = '/admin/login'
  return NextResponse.redirect(url)
}
