import type { ID, AuthUser, Estudio, SitioClinico, Paciente } from '@/lib/types'

export interface StudyScope {
  role: string | null
  isInvestigator: boolean
  estudios: Estudio[]
  sitiosClinicos: SitioClinico[]
  pacientes: Paciente[]
  estudioIds: ID[]
  sitioClinicoIds: ID[]
  pacienteIds: ID[]
}

export interface AuthScopeResponse {
  user: AuthUser | null
  scope: StudyScope
}

export const ALL_STUDIES_VALUE = 'all'

export function normalizeRole(role?: string | null) {
  return role?.trim().toLowerCase().replace(/\s+/g, '-') ?? ''
}

export function isInvestigatorRole(role?: string | null) {
  return normalizeRole(role) === 'medico-investigador'
}

export function emptyScope(user?: AuthUser | null): StudyScope {
  const role = user?.role?.name ?? null
  return {
    role,
    isInvestigator: isInvestigatorRole(role),
    estudios: [],
    sitiosClinicos: [],
    pacientes: [],
    estudioIds: [],
    sitioClinicoIds: [],
    pacienteIds: [],
  }
}

function relationArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[]
  if (value && typeof value === 'object' && 'data' in value) {
    const data = (value as { data?: unknown }).data
    return Array.isArray(data) ? (data as T[]) : data ? [data as T] : []
  }
  return value && typeof value === 'object' ? [value as T] : []
}

function uniqueIds(values: { id?: ID; documentId?: ID }[]) {
  return Array.from(new Set(values.flatMap((value) => [value.id, value.documentId].filter((id): id is ID => id != null))))
}

export function buildScope(user: AuthUser | null, raw: Record<string, unknown> = {}): StudyScope {
  const role = user?.role?.name ?? (typeof raw.role === 'string' ? raw.role : null)
  const estudios = relationArray<Estudio>(raw.estudios ?? raw.studies)
  const sitiosClinicos = relationArray<SitioClinico>(raw.sitiosClinicos ?? raw.sitios_clinicos ?? raw.sites)
  const pacientes = relationArray<Paciente>(raw.pacientes ?? raw.patients)
  const derivedStudies = [...estudios, ...pacientes.flatMap((patient) => relationArray<Estudio>(patient.estudio))]
  const derivedSites = [...sitiosClinicos, ...pacientes.flatMap((patient) => relationArray<SitioClinico>(patient.sitioClinico))]
  const explicitStudyIds = (raw.estudioIds ?? raw.studyIds) as ID[] | undefined
  const explicitSiteIds = (raw.sitioClinicoIds ?? raw.sitiosClinicosIds ?? raw.siteIds) as ID[] | undefined
  const explicitPatientIds = (raw.pacienteIds ?? raw.patientIds) as ID[] | undefined

  return {
    role,
    isInvestigator: isInvestigatorRole(role),
    estudios: Array.from(new Map(derivedStudies.map((item) => [String(item.id ?? item.documentId), item])).values()),
    sitiosClinicos: Array.from(new Map(derivedSites.map((item) => [String(item.id ?? item.documentId), item])).values()),
    pacientes: Array.from(new Map(pacientes.map((item) => [String(item.id ?? item.documentId), item])).values()),
    estudioIds: explicitStudyIds?.length ? explicitStudyIds : uniqueIds(derivedStudies),
    sitioClinicoIds: explicitSiteIds?.length ? explicitSiteIds : uniqueIds(derivedSites),
    pacienteIds: explicitPatientIds?.length ? explicitPatientIds : uniqueIds(pacientes),
  }
}
