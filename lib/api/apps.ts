'use client'

import { createCrud } from './crud'
import type { App } from '@/lib/types'

export const appsApi = createCrud<App>({
  resource: 'apps',
  defaultPopulate: { pacientes: { fields: ['id'] } },
  defaultSort: 'titulo:asc',
})

export const useApps = appsApi.useList
