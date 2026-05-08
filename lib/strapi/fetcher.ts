/**
 * Client-side fetcher used by SWR. Always hits our Next.js proxy
 * (`/api/strapi/*`) – never Strapi directly. The proxy reads the session
 * cookie server-side and adds the JWT.
 */
import { PROXY_BASE } from './config'
import { buildQuery, type StrapiQuery } from './qs'

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
  signal?: AbortSignal
}

export class ApiError extends Error {
  status: number
  details: unknown
  constructor(message: string, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal } = options

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  const url = path.startsWith('http') || path.startsWith('/') ? path : `${PROXY_BASE}/${path}`

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? (body as FormData) : JSON.stringify(body)) : undefined,
    signal,
    credentials: 'include',
  })

  const text = await res.text()
  const data = text ? safeJson(text) : null

  if (!res.ok) {
    const message =
      (data as { error?: { message?: string } })?.error?.message ||
      `Request failed: ${res.status}`
    throw new ApiError(message, res.status, data)
  }
  return data as T
}

/** Convenience helper for SWR keys: `[resource, query]` -> proxied URL. */
export function strapiKey(resource: string, query?: StrapiQuery): string {
  return `${PROXY_BASE}/${resource}${buildQuery(query)}`
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

export const swrFetcher = (url: string) => apiFetch(url)
