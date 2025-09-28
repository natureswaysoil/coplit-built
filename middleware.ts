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

  if (!mustEnforce) {
    return NextResponse.next()
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
      return NextResponse.next()
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
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return new NextResponse('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"',
    },
  })
}

export const config = {
  // Protect all admin pages (and nested routes)
  matcher: ['/admin/:path*'],
}
