/**
 * Domain types for the Pharmacovigilance front-end.
 * Mirrors the Strapi v4 schemas in 1:1 correspondence.
 */
export type ID = number | string

// ---------- Estudio ----------
export interface Estudio {
  id: ID
  codigoProtocolo: string
  titulo: string
  medicamento: string
  fechaInicio: string
  fechaFinVigilancia: string
  variablesObligatorias?: Record<string, unknown> | null
  protocoloDocumento?: MediaFile | null
  sitios_clinicos?: SitioClinico[]
  pacientes?: Paciente[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- Sitio Clínico ----------
export interface SitioClinico {
  id: ID
  codigo: string
  nombre: string
  pacientes?: Paciente[]
  estudio?: Estudio
  createdAt?: string
  updatedAt?: string
}

// ---------- Paciente ----------
export type Sexo = 'M' | 'F'
export type ColorPiel = 'Blanca' | 'Mestiza' | 'Negra' | 'Amarilla'

export interface Paciente {
  id: ID
  codigoInclusion: string
  iniciales: string
  edad: number
  sexo: Sexo
  colorPiel?: ColorPiel
  pesoKg?: number
  tallaCm?: number
  fechaInclusion: string
  estudio?: Estudio
  sitioClinico?: SitioClinico
  crd?: CRD
  registroInvestigador?: RegistroInvestigador
  consentimiento?: ConsentimientoInformado
  apps?: App[]
  diagnosticos?: Diagnostico[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- CRD ----------
export type CRDEstado = 'En curso' | 'Completo' | 'Bloqueado'

export interface CRD {
  id: ID
  fechaCreacion: string
  consentimientoFirmado: boolean
  estado: CRDEstado
  paciente?: Paciente
  administraciones?: AdministracionMedicamento[]
  concomitantes?: TratamientoConcomitante[]
  desenlace?: Desenlace
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- AdministracionMedicamento ----------
export type Via = 'SC' | 'IV'

export interface AdministracionMedicamento {
  id: ID
  numeroDosis: number
  dosisMg: number
  via: Via
  fechaHora: string
  numeroLote?: string
  numeroUnidades?: number
  crd?: CRD
  evento_adversos?: EventoAdverso[]
  createdAt?: string
  updatedAt?: string
}

// ---------- TratamientoConcomitante ----------
export interface TratamientoConcomitante {
  id: ID
  medicamento: string
  via?: string
  dosisDiaria?: string
  crd?: CRD
  createdAt?: string
  updatedAt?: string
}

// ---------- EventoAdverso ----------
export type EventoIntensidad = 'Leve' | 'Moderado' | 'Severo'
export type EventoGravedad =
  | 'No grave'
  | 'Muerte'
  | 'Amenaza vida'
  | 'Hospitalización'
  | 'Invalidez'
  | 'Defecto congénito'
export type EventoImputabilidad =
  | 'Definitiva'
  | 'Probable'
  | 'Posible'
  | 'No relacionado'
  | 'No clasificable'

export interface EventoAdverso {
  id: ID
  SOC?: string
  intensidad: EventoIntensidad
  gravedad: EventoGravedad
  imputabilidad: EventoImputabilidad
  suspensionTratamiento?: boolean
  tipo_evento_adverso?: TipoEventoAdverso
  administracion_medicamento?: AdministracionMedicamento
  createdAt?: string
  updatedAt?: string
}

// ---------- TipoEventoAdverso ----------
export interface TipoEventoAdverso {
  id: ID
  nombre: string
  descripcion?: string
  evento_adversos?: EventoAdverso[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- App (Antecedente Patológico Personal) ----------
export interface App {
  id: ID
  titulo: string
  descripcion?: string
  pacientes?: Paciente[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- Diagnóstico ----------
export interface Diagnostico {
  id: ID
  titulo: string
  descripcion?: string
  pacientes?: Paciente[]
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

// ---------- Desenlace ----------
export type DesenlaceEstado = 'Vivo' | 'Fallecido' | 'Suspendido'

export interface Desenlace {
  id: ID
  estado: DesenlaceEstado
  causa?: string
  fecha: string
  crd?: CRD
}

// ---------- RegistroInvestigador ----------
export interface RegistroInvestigador {
  id: ID
  nombreReal: string
  historiaClinica: string
  direccion?: string
  telefono?: string
  paciente?: Paciente
  documentoIdentidad?: MediaFile
}

// ---------- ConsentimientoInformado ----------
export interface ConsentimientoInformado {
  id: ID
  fechaFirma: string
  version: string
  documentoEscaneado: MediaFile
  paciente?: Paciente
}

// ---------- Media ----------
export interface MediaFile {
  id: ID
  name: string
  url: string
  mime: string
  size: number
  ext?: string
  alternativeText?: string
}

// ---------- Auth ----------
export interface AuthUser {
  id: ID
  username: string
  email: string
  blocked?: boolean
  confirmed?: boolean
  role?: { id: ID; name: string; type: string }
}

// ---------- Pagination meta ----------
export interface PaginationMeta {
  page: number
  pageSize: number
  pageCount: number
  total: number
}

export interface Paginated<T> {
  data: T[]
  meta: PaginationMeta
}
