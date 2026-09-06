import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol === 'https:' ? 'https' : 'http')

  // Target canonical domain: https://invitations.adinfinity.gr
  const canonicalHost = 'invitations.adinfinity.gr'
  const isWww = hostname.startsWith('www.')
  const hostWithoutWww = isWww ? hostname.slice(4) : hostname
  const isCanonical = hostWithoutWww === canonicalHost && protocol === 'https'

  // Handle protocol/www normalization - fix GSC indexing issues
  // Uses 308 (not 301) to preserve request method for POST/PUT requests
  if (!isCanonical) {
    const canonicalUrl = new URL(`https://${canonicalHost}${url.pathname}${url.search}`)
    console.log(`[SEO] Normalizing: ${protocol}://${hostname}${url.pathname} -> ${canonicalUrl.toString()}`)
    return NextResponse.redirect(canonicalUrl, 308) // Permanent redirect, preserves method
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static assets and API internals
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
}
