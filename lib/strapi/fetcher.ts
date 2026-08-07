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

const studyFilterPaths: Record<string, string> = {
  estudios: 'filters[id][$eq]',
  'sitios-clinicos': 'filters[estudio][id][$eq]',
  pacientes: 'filters[estudio][id][$eq]',
  crds: 'filters[paciente][estudio][id][$eq]',
  'administracion-medicamentos': 'filters[crd][paciente][estudio][id][$eq]',
  concomitantes: 'filters[crd][paciente][estudio][id][$eq]',
  'eventos-adversos': 'filters[administracion_medicamento][crd][paciente][estudio][id][$eq]',
  apps: 'filters[pacientes][estudio][id][$eq]',
  diagnosticos: 'filters[pacientes][estudio][id][$eq]',
}

const investigatorFilterPaths: Record<string, string> = {
  estudios: 'filters[id][$in]',
  'sitios-clinicos': 'filters[id][$in]',
  pacientes: 'filters[id][$in]',
  crds: 'filters[paciente][id][$in]',
  'administracion-medicamentos': 'filters[crd][paciente][id][$in]',
  concomitantes: 'filters[crd][paciente][id][$in]',
  'eventos-adversos': 'filters[administracion_medicamento][crd][paciente][id][$in]',
  apps: 'filters[pacientes][id][$in]',
  diagnosticos: 'filters[pacientes][id][$in]',
}

function applyGlobalStudyFilter(path: string) {
  if (typeof window === 'undefined' || !path.includes('/api/strapi/')) return path
  const url = new URL(path, window.location.origin)
  const bypass = url.searchParams.get('globalStudyFilter') === 'false'
  url.searchParams.delete('globalStudyFilter')
  if (bypass) return `${url.pathname}${url.search}`

  const selected = window.sessionStorage.getItem('selected-study-id')
  const resource = url.pathname.split('/api/strapi/')[1]?.split('/')[0]
  const scopeFilterKey = resource ? investigatorFilterPaths[resource] : undefined
  const rawScope = window.sessionStorage.getItem('investigator-scope')
  if (scopeFilterKey && rawScope) {
    try {
      const scope = JSON.parse(rawScope) as { isInvestigator?: boolean; estudioIds?: (string | number)[]; sitioClinicoIds?: (string | number)[]; pacienteIds?: (string | number)[] }
      const ids = resource === 'estudios' ? scope.estudioIds : resource === 'sitios-clinicos' ? scope.sitioClinicoIds : scope.pacienteIds
      if (scope.isInvestigator && !url.searchParams.has(`${scopeFilterKey}[0]`)) {
        const allowedIds = ids?.length ? ids : ['__no_access__']
        allowedIds.forEach((id, index) => url.searchParams.set(`${scopeFilterKey}[${index}]`, String(id)))
      }
    } catch {
      // Ignore malformed browser state; Strapi remains the authorization boundary.
    }
  }

  if (!selected || selected === 'all') return `${url.pathname}${url.search}`
  const filterKey = resource ? studyFilterPaths[resource] : undefined
  if (filterKey && !url.searchParams.has(filterKey)) url.searchParams.set(filterKey, selected)
  return `${url.pathname}${url.search}`
}

export async function apiFetch<T = unknown>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, signal } = options

  if (method !== 'GET' && typeof window !== 'undefined' && window.sessionStorage.getItem('investigator-read-only') === 'true') {
    throw new ApiError('El rol médico-investigador tiene acceso de solo lectura', 403)
  }

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData
  if (body && !isFormData) {
    finalHeaders['Content-Type'] = 'application/json'
  }

  const rawUrl = path.startsWith('http') || path.startsWith('/') ? path : `${PROXY_BASE}/${path}`
  const url = method === 'GET' ? applyGlobalStudyFilter(rawUrl) : rawUrl

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
