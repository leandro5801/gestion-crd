'use client'

import { createCrud } from './crud'
import type { AdministracionMedicamento } from '@/lib/types'

export const administracionesApi = createCrud<AdministracionMedicamento>({
  resource: 'administracion-medicamentos',
  defaultPopulate: {
    crd: { populate: { paciente: { populate: { estudio: true } } } },
    evento_adversos: { fields: ['id'] },
  },
  defaultSort: 'fechaHora:desc',
})

export const useAdministraciones = administracionesApi.useList
export const useAdministracion = administracionesApi.useOne
export const createAdministracion = administracionesApi.create
export const updateAdministracion = administracionesApi.update
export const deleteAdministracion = administracionesApi.delete
