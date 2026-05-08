'use client'

import { createCrud } from './crud'
import type { CRD } from '@/lib/types'

export const crdsApi = createCrud<CRD>({
  resource: 'crds',
  defaultPopulate: {
    paciente: { populate: { estudio: true, sitioClinico: true } },
    administraciones: { fields: ['id'] },
    concomitantes: { fields: ['id'] },
    desenlace: true,
  },
  defaultSort: 'createdAt:desc',
})

export const useCrds = crdsApi.useList
export const useCrd = crdsApi.useOne
