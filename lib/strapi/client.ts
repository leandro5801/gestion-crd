/**
 * Server-only Strapi HTTP client.
 *
 * Used inside Next.js route handlers (`/api/*`). It attaches the user's JWT
 * (read from the httpOnly session cookie) or falls back to a configured API
 * token. The client throws `StrapiHttpError` on non-2xx responses so callers
 * can map them to proper HTTP status codes.
 *
 * NEVER import this from a client component. Use the SWR hooks in
 * `lib/hooks/*` which call our internal `/api/strapi/...` proxy instead.
 */
import 'server-only'
import { cookies } from 'next/headers'
import { STRAPI_API_TOKEN, STRAPI_URL, SESSION_COOKIE } from './config'
import { buildQuery, type StrapiQuery } from './qs'

export class StrapiHttpError extends Error {
  status: number
  details: unknown
  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'StrapiHttpError'
    this.status = status
    this.details = details
  }
}

interface Session {
  jwt: string
  user?: { id: number | string; username: string; email: string }
}

async function readSession(): Promise<Session | null> {
  try {
    const store = await cookies()
    const raw = store.get(SESSION_COOKIE)?.value
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  /** Force using the API token instead of the user's JWT. */
  useToken?: boolean
  /** Don't attach any auth – useful for public endpoints. */
  anonymous?: boolean
}

async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, headers, useToken, anonymous, ...rest } = opts

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...(headers as Record<string, string> | undefined),
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  if (!anonymous) {
    if (useToken && STRAPI_API_TOKEN) {
      finalHeaders.Authorization = `Bearer ${STRAPI_API_TOKEN}`
    } else {
      const session = await readSession()
      if (session?.jwt) {
        finalHeaders.Authorization = `Bearer ${session.jwt}`
      } else if (STRAPI_API_TOKEN) {
        finalHeaders.Authorization = `Bearer ${STRAPI_API_TOKEN}`
      }
    }
  }

  const url = path.startsWith('http') ? path : `${STRAPI_URL}${path}`
  const res = await fetch(url, {
    ...rest,
    headers: finalHeaders,
    body: body
      ? isFormData
        ? (body as FormData)
        : JSON.stringify(body)
      : undefined,
    cache: rest.cache ?? 'no-store',
  })

  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    const message =
      (data as { error?: { message?: string } })?.error?.message ||
      `Strapi request failed: ${res.status}`
    throw new StrapiHttpError(message, res.status, data)
  }
  return data as T
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const strapi = {
  /** GET helper that forwards Strapi query options. */
  get<T = unknown>(resource: string, query?: StrapiQuery, init?: Omit<RequestOptions, 'body'>) {
    const path = `/api/${resource}${buildQuery(query)}`
    return request<T>(path, { ...init, method: 'GET' })
  },
  /** Strapi v4 expects creates/updates inside `{ data: ... }`. */
  create<T = unknown>(resource: string, data: unknown, query?: StrapiQuery) {
    return request<T>(`/api/${resource}${buildQuery(query)}`, {
      method: 'POST',
      body: { data },
    })
  },
  update<T = unknown>(resource: string, id: string | number, data: unknown, query?: StrapiQuery) {
    return request<T>(`/api/${resource}/${id}${buildQuery(query)}`, {
      method: 'PUT',
      body: { data },
    })
  },
  remove<T = unknown>(resource: string, id: string | number, query?: StrapiQuery) {
    return request<T>(`/api/${resource}/${id}${buildQuery(query)}`, {
      method: 'DELETE',
    })
  },
  raw<T = unknown>(path: string, init?: RequestOptions) {
    return request<T>(path, init || {})
  },
}

export type { StrapiQuery }
export { readSession }
