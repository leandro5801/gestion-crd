'use client'

import { createCrud } from './crud'
import type { Diagnostico } from '@/lib/types'

export const diagnosticosApi = createCrud<Diagnostico>({
  resource: 'diagnosticos',
  defaultPopulate: { pacientes: { fields: ['id'] } },
  defaultSort: 'titulo:asc',
})

export const useDiagnosticos = diagnosticosApi.useList
