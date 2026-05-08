import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE } from '@/lib/strapi/config'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
  const session = req.cookies.get(SESSION_COOKIE)?.value

  // Redirect logged-in users away from /login.
  if (pathname === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (isPublic) return NextResponse.next()
  if (session) return NextResponse.next()

  // Anything else with no session goes to login.
  const loginUrl = new URL('/login', req.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Skip static assets, _next internals, the proxy, and root redirect.
  matcher: ['/((?!_next|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.css$|.*\\.js$|api/strapi).*)'],
}
