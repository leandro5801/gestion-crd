'use client'

import { createCrud } from './crud'
import type { Paciente } from '@/lib/types'

export const pacientesApi = createCrud<Paciente>({
  resource: 'pacientes',
  defaultPopulate: {
    estudio: true,
    sitioClinico: true,
    crd: true,
    apps: true,
    diagnosticos: true,
  },
  defaultSort: 'fechaInclusion:desc',
})

export const usePacientes = pacientesApi.useList
export const usePaciente = pacientesApi.useOne
export const createPaciente = pacientesApi.create
export const updatePaciente = pacientesApi.update
export const deletePaciente = pacientesApi.delete
