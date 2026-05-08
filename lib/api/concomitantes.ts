'use client'

import { createCrud } from './crud'
import type { TratamientoConcomitante } from '@/lib/types'

export const concomitantesApi = createCrud<TratamientoConcomitante>({
  resource: 'tratamiento-concomitantes',
  defaultPopulate: {
    crd: { populate: { paciente: { populate: { estudio: true } } } },
  },
  defaultSort: 'createdAt:desc',
})

export const useConcomitantes = concomitantesApi.useList
export const useConcomitante = concomitantesApi.useOne
