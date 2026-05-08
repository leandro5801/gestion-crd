/**
 * API stubs para Clinical Curator.
 * Todas las funciones simulan llamadas a la API REST de Strapi.
 * Cuando el backend esté disponible, reemplazar el contenido de cada
 * función con: return fetch(`${STRAPI_URL}/api/<endpoint>`, { ... })
 *
 * Base URL: process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337'
 */

import {
  mockEstudios,
  mockSitiosClinicos,
  mockPacientes,
  mockEventosAdversos,
  mockCRDs,
  mockAdministraciones,
  mockConcomitantes,
  mockActividadReciente,
  mockEnrolamiento,
  type Estudio,
  type SitioClinico,
  type Paciente,
  type EventoAdverso,
  type CRD,
  type AdministracionMedicamento,
  type TratamientoConcomitante,
  type ActividadReciente,
} from './mock-data'

// Simular latencia de red
const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// ─── ESTUDIOS ─────────────────────────────────────────────────────────────────
// Strapi endpoint: GET /api/estudios

export async function getEstudios(): Promise<Estudio[]> {
  await delay()
  return mockEstudios
}

export async function getEstudioById(id: number): Promise<Estudio | undefined> {
  await delay()
  return mockEstudios.find((e) => e.id === id)
}

// ─── SITIOS CLÍNICOS ──────────────────────────────────────────────────────────
// Strapi endpoint: GET /api/sitio-clinicos

export async function getSitiosClinicos(): Promise<SitioClinico[]> {
  await delay()
  return mockSitiosClinicos
}

export async function getSitioClinicoById(id: number): Promise<SitioClinico | undefined> {
  await delay()
  return mockSitiosClinicos.find((s) => s.id === id)
}

// ─── PACIENTES ─────────────────────────────────────────────────────────────────
// Strapi endpoint: GET /api/pacientes?populate=*

export async function getPacientes(filters?: { estudio?: string; estado?: string }): Promise<Paciente[]> {
  await delay()
  let result = [...mockPacientes]
  if (filters?.estudio && filters.estudio !== 'Todos') {
    result = result.filter((p) => p.estudio === filters.estudio)
  }
  if (filters?.estado && filters.estado !== 'Todos') {
    result = result.filter((p) => p.estado === filters.estado)
  }
  return result
}

export async function getPacienteById(id: number): Promise<Paciente | undefined> {
  await delay()
  return mockPacientes.find((p) => p.id === id)
}

// ─── EVENTOS ADVERSOS ─────────────────────────────────────────────────────────
// Strapi endpoint: GET /api/evento-adversos?populate=*

export async function getEventosAdversos(filters?: {
  estudio?: string
  intensidad?: string
  soc?: string
}): Promise<EventoAdverso[]> {
  await delay()
  let result = [...mockEventosAdversos]
  if (filters?.estudio && filters.estudio !== 'All active studies') {
    result = result.filter((e) => e.estudio === filters.estudio)
  }
  if (filters?.intensidad && filters.intensidad !== 'All levels') {
    result = result.filter((e) => e.intensidad === filters.intensidad)
  }
  if (filters?.soc && filters.soc !== 'All systems') {
    result = result.filter((e) => e.SOC === filters.soc)
  }
  return result
}

export async function getEventoAdversoById(id: number): Promise<EventoAdverso | undefined> {
  await delay()
  return mockEventosAdversos.find((e) => e.id === id)
}

// ─── CRDs ─────────────────────────────────────────────────────────────────────
// Strapi endpoint: GET /api/crds?populate=*

export async function getCRDs(filters?: { estudio?: string; estado?: string }): Promise<CRD[]> {
  await delay()
  let result = [...mockCRDs]
  if (filters?.estudio && filters.estudio !== 'Todos') {
    result = result.filter((c) => c.estudio === filters.estudio)
  }
  if (filters?.estado && filters.estado !== 'Todos') {
    result = result.filter((c) => c.estado === filters.estado)
  }
  return result
}

export async function getCRDById(id: number): Promise<CRD | undefined> {
  await delay()
  return mockCRDs.find((c) => c.id === id)
}

// ─── ADMINISTRACIONES MEDICAMENTO ─────────────────────────────────────────────
// Strapi endpoint: GET /api/administracion-medicamentos?populate=*

export async function getAdministraciones(filters?: {
  estudio?: string
  estado?: string
}): Promise<AdministracionMedicamento[]> {
  await delay()
  let result = [...mockAdministraciones]
  if (filters?.estudio && filters.estudio !== 'Todos') {
    result = result.filter((a) => a.estudio === filters.estudio)
  }
  if (filters?.estado && filters.estado !== 'Todos') {
    result = result.filter((a) => a.estado === filters.estado)
  }
  return result
}

// ─── TRATAMIENTOS CONCOMITANTES ───────────────────────────────────────────────
// Strapi endpoint: GET /api/tratamiento-concomitantes?populate=*

export async function getConcomitantes(filters?: {
  estudio?: string
  estado?: string
}): Promise<TratamientoConcomitante[]> {
  await delay()
  let result = [...mockConcomitantes]
  if (filters?.estudio && filters.estudio !== 'Todos') {
    result = result.filter((t) => t.estudio === filters.estudio)
  }
  if (filters?.estado && filters.estado !== 'Todos') {
    result = result.filter((t) => t.estado === filters.estado)
  }
  return result
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  await delay()
  return {
    estudiosActivos: mockEstudios.filter((e) => e.estado === 'Activo').length,
    totalPacientes: mockPacientes.length,
    eventosAdversos: mockEventosAdversos.length,
    eventosSAE: mockEventosAdversos.filter(
      (e) => e.intensidad === 'Severo'
    ).length,
    medicacionAdministrada: mockAdministraciones.filter(
      (a) => a.estado === 'Administrado'
    ).length,
    actividadReciente: mockActividadReciente,
    enrolamiento: mockEnrolamiento,
    casosRecientes: mockEventosAdversos.slice(0, 4).map((e) => ({
      subjectId: e.pacienteId,
      study: e.estudio,
      status: e.intensidad,
      lastEvent: e.tipo,
    })),
  }
}

export type { ActividadReciente }
