'use client'

import { createCrud } from './crud'
import type { Desenlace } from '@/lib/types'

export const desenlacesApi = createCrud<Desenlace>({
  resource: 'desenlaces',
  defaultPopulate: { crd: true },
  defaultSort: 'fecha:desc',
})

export const useDesenlaces = desenlacesApi.useList
