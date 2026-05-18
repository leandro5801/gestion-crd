'use client'

import { createCrud } from './crud'
import type { SitioClinico } from '@/lib/types'

export const sitiosApi = createCrud<SitioClinico>({
  resource: 'sitio-clinicos',
  defaultPopulate: { pacientes: { fields: ['id'] } },
  defaultSort: 'nombre:asc',
})

export const useSitiosClinicos = sitiosApi.useList
export const useSitioClinico = sitiosApi.useOne
export const createSitioClinico = sitiosApi.create
export const updateSitioClinico = sitiosApi.update
export const deleteSitioClinico = sitiosApi.delete
