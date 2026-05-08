'use client'

import { createCrud } from './crud'
import type { TipoEventoAdverso } from '@/lib/types'

export const tiposEventoAdversoApi = createCrud<TipoEventoAdverso>({
  resource: 'tipo-evento-adversos',
  defaultSort: 'nombre:asc',
})

export const useTiposEventoAdverso = tiposEventoAdversoApi.useList
