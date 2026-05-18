'use client'

import { createCrud } from './crud'
import type { Estudio } from '@/lib/types'

export const estudiosApi = createCrud<Estudio>({
  resource: 'estudios',
  defaultPopulate: {
    sitios_clinicos: true,
    pacientes: { fields: ['id'] },
    protocoloDocumento: true,
  },
  defaultSort: 'createdAt:desc',
})

export const useEstudios = estudiosApi.useList
export const useEstudio = estudiosApi.useOne
export const createEstudio = estudiosApi.create
export const updateEstudio = estudiosApi.update
export const deleteEstudio = estudiosApi.delete
