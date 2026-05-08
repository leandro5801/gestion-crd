/**
 * Tiny query-string serializer that follows Strapi v4's bracket-notation rules.
 * It avoids depending on the `qs` package while supporting nested filters,
 * populate trees, sort and pagination.
 */
type Primitive = string | number | boolean | null | undefined

function append(out: string[], key: string, value: unknown) {
  if (value === undefined || value === null) return
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      if (typeof v === 'object' && v !== null) {
        append(out, `${key}[${i}]`, v)
      } else {
        out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(v))}`)
      }
    })
    return
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      append(out, `${key}[${k}]`, v)
    }
    return
  }
  out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value as Primitive))}`)
}

export interface StrapiQuery {
  /** Field-level filters using Strapi operators ($eq, $contains, $in...) */
  filters?: Record<string, unknown>
  /** `*` or a structured populate tree */
  populate?: string | Record<string, unknown> | string[]
  /** Single field, an array of fields, or `field:asc` / `field:desc` */
  sort?: string | string[]
  pagination?: {
    page?: number
    pageSize?: number
    withCount?: boolean
    start?: number
    limit?: number
  }
  fields?: string[]
  publicationState?: 'live' | 'preview'
  locale?: string
  /** Anything else you want to forward as-is */
  [key: string]: unknown
}

export function buildQuery(input?: StrapiQuery): string {
  if (!input) return ''
  const parts: string[] = []
  for (const [key, value] of Object.entries(input)) {
    append(parts, key, value)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}
