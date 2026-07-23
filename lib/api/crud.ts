/**
 * Generic CRUD helper bound to a Strapi v4 collection. Each entity service
 * (estudios, pacientes, etc.) is a thin wrapper around this factory that adds
 * defaults like `populate` or extra filters.
 *
 * The factory exposes both a service-like object (for one-off calls and
 * mutations) and an SWR hook (for live lists / details inside React).
 */
'use client'

import useSWR, { mutate as globalMutate, type SWRConfiguration } from 'swr'
import { apiFetch, strapiKey, ApiError } from '@/lib/strapi/fetcher'
import type { StrapiQuery } from '@/lib/strapi/qs'
import { flatten, flattenPaginated } from '@/lib/strapi/mappers'
import type { ID, Paginated } from '@/lib/types'

export interface CrudConfig {
  /** Strapi plural slug, e.g. `estudios`. */
  resource: string
  /** Default populate tree applied on lists/details. */
  defaultPopulate?: StrapiQuery['populate']
  /** Default sort applied on lists. */
  defaultSort?: StrapiQuery['sort']
}

export function createCrud<T extends { id: ID }>(config: CrudConfig) {
  const { resource, defaultPopulate, defaultSort } = config

  const buildListQuery = (q?: StrapiQuery): StrapiQuery => ({
    ...(defaultPopulate && !q?.populate ? { populate: defaultPopulate } : {}),
    ...(defaultSort && !q?.sort ? { sort: defaultSort } : {}),
    ...q,
  })

  const buildSingleQuery = (q?: StrapiQuery): StrapiQuery => ({
    ...(defaultPopulate && !q?.populate ? { populate: defaultPopulate } : {}),
    ...q,
  })

  // --- Service ---
  async function list(query?: StrapiQuery): Promise<Paginated<T>> {
    const raw = await apiFetch(strapiKey(resource, buildListQuery(query)))
    return flattenPaginated<T>(raw)
  }

  async function findOne(id: ID, query?: StrapiQuery): Promise<T> {
    const raw = await apiFetch(strapiKey(`${resource}/${id}`, buildSingleQuery(query)))
    return flatten<T>(raw)
  }

  async function create(data: Partial<T>, query?: StrapiQuery): Promise<T> {
    const raw = await apiFetch(strapiKey(resource, buildSingleQuery(query)), {
      method: 'POST',
      body: { data },
    })
    return flatten<T>(raw)
  }

  async function update(id: ID, data: Partial<T>, query?: StrapiQuery): Promise<T> {
    console.log(data);
    
    const raw = await apiFetch(strapiKey(`${resource}/${id}`, buildSingleQuery(query)), {
      method: 'PUT',
      body: { data },
    })
    console.log(raw);
    
    return flatten<T>(raw)
  }

  async function remove(id: ID): Promise<T> {
    const raw = await apiFetch(strapiKey(`${resource}/${id}`))
    await apiFetch(strapiKey(`${resource}/${id}`), { method: 'DELETE' })
    return flatten<T>(raw)
  }

  /** Invalidate every SWR cache key that targets this resource. */
  function invalidate() {
    return globalMutate((key) => typeof key === 'string' && key.startsWith(`/api/strapi/${resource}`), undefined, { revalidate: true })
  }

  // --- Hooks ---
  function useList(query?: StrapiQuery, swr?: SWRConfiguration) {
    const key = strapiKey(resource, buildListQuery(query))
    const { data, error, isLoading, mutate } = useSWR(key, async (url: string) => {
      const raw = await apiFetch(url)
      return flattenPaginated<T>(raw)
    }, swr)
    return {
      items: data?.data ?? [],
      meta: data?.meta,
      data,
      error: error as ApiError | undefined,
      isLoading,
      mutate,
      key,
    }
  }

  function useOne(id: ID | null | undefined, query?: StrapiQuery, swr?: SWRConfiguration) {
    const key = id != null ? strapiKey(`${resource}/${id}`, buildSingleQuery(query)) : null
    const { data, error, isLoading, mutate } = useSWR(key, async (url: string) => {
      const raw = await apiFetch(url)
      return flatten<T>(raw)
    }, swr)
    return { item: data, error: error as ApiError | undefined, isLoading, mutate, key }
  }

  return {
    resource,
    list,
    findOne,
    create,
    update,
    remove,
    invalidate,
    useList,
    useOne,
  }
}
