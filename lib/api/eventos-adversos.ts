'use client'

import { createCrud } from './crud'
import type { EventoAdverso } from '@/lib/types'

export const eventosAdversosApi = createCrud<EventoAdverso>({
  resource: 'evento-adversos',
  defaultPopulate: {
    tipo_evento_adverso: true,
    administracion_medicamento: {
      populate: { crd: { populate: { paciente: { populate: { estudio: true } } } } },
    },
  },
  defaultSort: 'createdAt:desc',
})

export const useEventosAdversos = eventosAdversosApi.useList
export const useEventoAdverso = eventosAdversosApi.useOne
export const updateEventoAdverso = eventosAdversosApi.update
export const createEventoAdverso = eventosAdversosApi.create
export const deleteEventoAdverso = eventosAdversosApi.delete
