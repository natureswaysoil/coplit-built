import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Protect all admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check for admin session cookie
    const adminSession = request.cookies.get('admin-session')
    
    if (!adminSession) {
      // Redirect to admin login if no session
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    // Verify session token (basic validation)
    try {
      const sessionData = JSON.parse(adminSession.value)
      const now = Date.now()
      
      // Check if session is expired (24 hours)
      if (!sessionData.expires || now > sessionData.expires) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        response.cookies.delete('admin-session')
        return response
      }
    } catch {
      // Invalid session format
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('admin-session')
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}
