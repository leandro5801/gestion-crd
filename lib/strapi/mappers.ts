/**
 * Mappers between Strapi v4 raw responses and the flat domain types used by
 * the UI. Strapi v4 wraps everything in `{ data, attributes }` envelopes –
 * `flatten()` recursively strips those wrappers so the rest of the app never
 * has to know about it.
 *
 * The mappers are intentionally generic: any Strapi entity can be flattened
 * with the same helper. Service modules can layer extra normalisation on top
 * if a particular endpoint needs it.
 */
import type { MediaFile, Paginated, PaginationMeta } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Anything = any

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * Recursively unwraps Strapi v4 envelopes:
 *   { id, attributes: { ..., relation: { data: { id, attributes } } } }
 *   becomes
 *   { id, ..., relation: { id, ... } }
 */
export function flatten<T = Anything>(input: Anything): T {
  if (input === null || input === undefined) return input as T

  // Pagination wrapper
  if (isPlainObject(input) && Array.isArray((input as Anything).data) && (input as Anything).meta) {
    return {
      data: (input as Anything).data.map(flatten),
      meta: (input as Anything).meta,
    } as unknown as T
  }

  // Single-resource wrapper { data, meta }
  if (isPlainObject(input) && 'data' in input && 'meta' in input && !Array.isArray((input as Anything).data)) {
    return flatten((input as Anything).data) as T
  }

  // Relation wrapper { data: ... }
  if (isPlainObject(input) && 'data' in input && Object.keys(input as object).length === 1) {
    return flatten((input as Anything).data) as T
  }

  // Strapi entity { id, attributes }
  if (
    isPlainObject(input) &&
    'attributes' in input &&
    isPlainObject((input as Anything).attributes)
  ) {
    const { id, attributes } = input as Anything
    const flat: Anything = { id }
    for (const [key, value] of Object.entries(attributes)) {
      flat[key] = flatten(value)
    }
    return flat as T
  }

  if (Array.isArray(input)) {
    return input.map((item) => flatten(item)) as unknown as T
  }

  if (isPlainObject(input)) {
    const out: Anything = {}
    for (const [key, value] of Object.entries(input)) {
      out[key] = flatten(value)
    }
    return out as T
  }

  return input as T
}

export function flattenPaginated<T>(raw: Anything): Paginated<T> {
  const data = (raw?.data ?? []).map((item: Anything) => flatten<T>(item))
  const meta: PaginationMeta = raw?.meta?.pagination ?? {
    page: 1,
    pageSize: data.length,
    pageCount: 1,
    total: data.length,
  }
  return { data, meta }
}

export function absoluteMediaUrl(file?: MediaFile | null, strapiUrl?: string) {
  if (!file?.url) return ''
  if (file.url.startsWith('http')) return file.url
  const base = strapiUrl?.replace(/\/$/, '') || ''
  return `${base}${file.url}`
}
