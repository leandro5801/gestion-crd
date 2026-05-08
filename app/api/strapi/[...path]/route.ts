/**
 * Generic proxy that forwards `/api/strapi/<resource>?...` to the real
 * Strapi instance. The user's JWT (read from the session cookie) is attached
 * server-side so it never reaches the browser.
 *
 * It supports JSON and multipart bodies (file uploads via /upload).
 */
import { NextRequest, NextResponse } from 'next/server'
import { STRAPI_URL, STRAPI_API_TOKEN } from '@/lib/strapi/config'
import { getSession } from '@/lib/auth/session'

const ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const

async function buildAuthHeader(): Promise<string | undefined> {
  const session = await getSession()
  if (session?.jwt) return `Bearer ${session.jwt}`
  if (STRAPI_API_TOKEN) return `Bearer ${STRAPI_API_TOKEN}`
  return undefined
}

async function forward(req: NextRequest, segments: string[]) {
  const method = req.method.toUpperCase()
  if (!ALLOWED_METHODS.includes(method as (typeof ALLOWED_METHODS)[number])) {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const search = req.nextUrl.search // already includes the `?`
  const url = `${STRAPI_URL}/api/${segments.join('/')}${search}`

  const auth = await buildAuthHeader()
  const headers: Record<string, string> = {
    Accept: 'application/json',
  }
  if (auth) headers.Authorization = auth

  // Forward Content-Type only for non-GET/DELETE requests.
  const contentType = req.headers.get('content-type')
  let body: BodyInit | undefined

  if (method !== 'GET' && method !== 'DELETE') {
    if (contentType?.includes('multipart/form-data')) {
      // Pass the original FormData (browser sets the boundary).
      body = await req.formData()
    } else if (contentType?.includes('application/json')) {
      headers['Content-Type'] = 'application/json'
      body = await req.text()
    } else if (contentType) {
      headers['Content-Type'] = contentType
      body = await req.text()
    }
  }

  const upstream = await fetch(url, {
    method,
    headers,
    body,
    cache: 'no-store',
  })

  const respHeaders = new Headers()
  const upstreamCT = upstream.headers.get('content-type') || 'application/json'
  respHeaders.set('content-type', upstreamCT)
  // Forward Strapi pagination/meta hints if present.
  for (const h of ['x-pagination-page', 'x-pagination-page-count', 'x-pagination-total']) {
    const v = upstream.headers.get(h)
    if (v) respHeaders.set(h, v)
  }

  const buf = await upstream.arrayBuffer()
  return new NextResponse(buf, { status: upstream.status, headers: respHeaders })
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params
  return forward(req, path)
}
