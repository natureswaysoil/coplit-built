import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Basic Auth for /admin routes
export function middleware(req: NextRequest) {
  const url = new URL(req.url)

  // Only guard admin paths (extra safety if matcher changes)
  if (!url.pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Resolve credentials from env
  const user = process.env.ADMIN_USER || process.env.BASIC_AUTH_USER || 'admin'
  const pass =
    process.env.ADMIN_PASSWORD || process.env.BASIC_AUTH_PASS || process.env.ADMIN_API_TOKEN || ''

  // In production, require credentials. In development, allow if none configured.
  const isProd = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  const mustEnforce = isProd || (!!process.env.ADMIN_USER && !!(process.env.ADMIN_PASSWORD || process.env.ADMIN_API_TOKEN))

  if (!mustEnforce || !pass) {
    return securityHeaders(NextResponse.next())
  }

  const header = req.headers.get('authorization') || ''
  const [scheme, encoded] = header.split(' ')
  if (scheme !== 'Basic' || !encoded) {
    return unauthorized(req)
  }

  try {
    // atob is available in edge runtime
    const decoded = atob(encoded)
    const [u, p] = decoded.split(':')
    if (u === user && p === pass && pass) {
      return securityHeaders(NextResponse.next())
    }
  } catch (_) {
    // fall through to unauthorized
  }

  return unauthorized(req)
}

function unauthorized(req: NextRequest) {
  // Avoid triggering browser Basic Auth dialog for prefetch requests
  const isPrefetch =
    req.headers.get('x-middleware-prefetch') === '1' ||
    req.headers.get('purpose') === 'prefetch' ||
    req.headers.get('sec-purpose') === 'prefetch'

  if (isPrefetch) {
    return securityHeaders(new NextResponse('Unauthorized', { status: 401 }))
  }

  return securityHeaders(new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"',
    },
  }))
}

function securityHeaders(res: NextResponse) {
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()')
  // Simple CSP (can be expanded later)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://analytics.tiktok.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "connect-src 'self' https://*.supabase.co https://api.resend.com",
    "frame-ancestors 'none'"
  ].join('; ')
  res.headers.set('Content-Security-Policy', csp)
  return res
}

export const config = {
  // Protect all admin pages (and nested routes)
  matcher: ['/admin/:path*'],
}
