// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Estructura basada en los schemas de Strapi del proyecto.
// Reemplazar las funciones API con llamadas reales a Strapi cuando el backend esté listo.

// ─── TIPOS ────────────────────────────────────────────────────────────────────

export type EstadoPaciente = 'Activo' | 'Suspendido' | 'Fallecido' | 'Completado'
export type Intensidad = 'Leve' | 'Moderado' | 'Severo'
export type Imputabilidad = 'Definitiva' | 'Probable' | 'Posible' | 'No relacionado' | 'No clasificable'
export type Gravedad = 'No grave' | 'Muerte' | 'Amenaza vida' | 'Hospitalización' | 'Invalidez' | 'Defecto congénito'
export type EstadoCRD = 'En curso' | 'Completo' | 'Bloqueado'
export type EstadoEstudio = 'Activo' | 'Completado' | 'Suspendido' | 'En revisión'
export type EstadoConcomitante = 'Activo' | 'Finalizado' | 'Suspendido'
export type EstadoSitio = 'Activo' | 'Inactivo' | 'Pendiente'

// ─── ESTUDIOS ─────────────────────────────────────────────────────────────────

export interface Estudio {
  id: number
  codigoProtocolo: string
  titulo: string
  medicamento: string
  fase: string
  fechaInicio: string
  fechaFinVigilancia: string
  estado: EstadoEstudio
  totalPacientes: number
  sitiosActivos: number
  eventosAdversos: number
  pi: string
}

export const mockEstudios: Estudio[] = [
  {
    id: 1,
    codigoProtocolo: 'PV-2024-ALPHA',
    titulo: 'Farmacovigilancia de Enoxaparina en Pacientes con Trombosis Venosa Profunda',
    medicamento: 'Enoxaparina 40mg',
    fase: 'Fase III',
    fechaInicio: '2024-01-15',
    fechaFinVigilancia: '2025-06-30',
    estado: 'Activo',
    totalPacientes: 892,
    sitiosActivos: 12,
    eventosAdversos: 42,
    pi: 'Dr. Aris Thorne',
  },
  {
    id: 2,
    codigoProtocolo: 'ONCO-2023',
    titulo: 'Seguimiento de Seguridad en Inmunoterapia Oncológica',
    medicamento: 'Pembrolizumab 200mg',
    fase: 'Fase II',
    fechaInicio: '2023-09-01',
    fechaFinVigilancia: '2025-12-31',
    estado: 'Activo',
    totalPacientes: 214,
    sitiosActivos: 5,
    eventosAdversos: 18,
    pi: 'Dra. Elena Ross',
  },
  {
    id: 3,
    codigoProtocolo: 'CARDIO-SYNC-II',
    titulo: 'Cardio-Sync II: Monitoreo de Eventos Cardiovasculares',
    medicamento: 'Rivaroxabán 20mg',
    fase: 'Fase IV',
    fechaInicio: '2023-03-10',
    fechaFinVigilancia: '2024-12-15',
    estado: 'En revisión',
    totalPacientes: 567,
    sitiosActivos: 8,
    eventosAdversos: 31,
    pi: 'Dr. Marcos Vidal',
  },
  {
    id: 4,
    codigoProtocolo: 'NEURO-ALPHA-I',
    titulo: 'Neuro-Alpha Phase I: Seguridad Neurológica',
    medicamento: 'Levetiracetam 500mg',
    fase: 'Fase I',
    fechaInicio: '2024-04-01',
    fechaFinVigilancia: '2025-03-31',
    estado: 'Activo',
    totalPacientes: 89,
    sitiosActivos: 3,
    eventosAdversos: 7,
    pi: 'Dra. Lucía Miró',
  },
  {
    id: 5,
    codigoProtocolo: 'COV-V3-POST',
    titulo: 'COVID-19 V3: Vigilancia Post-Vacunal',
    medicamento: 'Vacuna ARNm (Booster)',
    fase: 'Post-mercado',
    fechaInicio: '2022-11-01',
    fechaFinVigilancia: '2024-10-31',
    estado: 'Completado',
    totalPacientes: 1284,
    sitiosActivos: 0,
    eventosAdversos: 127,
    pi: 'Dr. Alejandro Ruiz',
  },
]

// ─── SITIOS CLÍNICOS ──────────────────────────────────────────────────────────

export interface SitioClinico {
  id: number
  codigo: string
  nombre: string
  tipo: string
  ubicacion: string
  investigadorPrincipal: string
  avatar: string
  estado: EstadoSitio
  estudiosActivos: number
  totalPacientes: number
  ultimaActividad: string
}

export const mockSitiosClinicos: SitioClinico[] = [
  {
    id: 1,
    codigo: 'HSA-001',
    nombre: 'Hospital de la Paz',
    tipo: 'General Hospital',
    ubicacion: 'Castellana 261, Madrid',
    investigadorPrincipal: 'Dr. Alejandro Ruiz',
    avatar: 'AR',
    estado: 'Activo',
    estudiosActivos: 12,
    totalPacientes: 340,
    ultimaActividad: '2024-10-24',
  },
  {
    id: 2,
    codigo: 'INAC-204',
    nombre: 'Hospital Clínic Barcelona',
    tipo: 'Research Institute',
    ubicacion: 'Villarroel 170, Barcelona',
    investigadorPrincipal: 'Dra. Elena Costa',
    avatar: 'EC',
    estado: 'Activo',
    estudiosActivos: 8,
    totalPacientes: 215,
    ultimaActividad: '2024-10-22',
  },
  {
    id: 3,
    codigo: 'VAL-992',
    nombre: 'Hospital La Fe',
    tipo: 'University Poly',
    ubicacion: 'Fernando Abril, Valencia',
    investigadorPrincipal: 'Dr. Marcos Vidal',
    avatar: 'MV',
    estado: 'Pendiente',
    estudiosActivos: 0,
    totalPacientes: 0,
    ultimaActividad: '2024-09-15',
  },
  {
    id: 4,
    codigo: 'SEV-441',
    nombre: 'Inst. Macarena',
    tipo: 'Seville Research Foundation',
    ubicacion: 'Avda. Dr. Fedriani, Sevilla',
    investigadorPrincipal: 'Dra. Lucía Miró',
    avatar: 'LM',
    estado: 'Inactivo',
    estudiosActivos: 2,
    totalPacientes: 45,
    ultimaActividad: '2024-07-01',
  },
  {
    id: 5,
    codigo: 'BCN-033',
    nombre: 'Clínica Quirón Badalona',
    tipo: 'Private Clinic',
    ubicacion: 'Magnolias 4, Badalona',
    investigadorPrincipal: 'Dr. Jordi Puig',
    avatar: 'JP',
    estado: 'Activo',
    estudiosActivos: 5,
    totalPacientes: 98,
    ultimaActividad: '2024-10-20',
  },
]

// ─── PACIENTES ─────────────────────────────────────────────────────────────────

export interface Paciente {
  id: number
  codigoInclusion: string
  iniciales: string
  edad: number
  sexo: 'M' | 'F'
  pesoKg: number
  tallaCm: number
  fechaInclusion: string
  estado: EstadoPaciente
  estudio: string
  sitioClinico: string
  diagnosticos: string[]
  eventosAdversos: number
}

export const mockPacientes: Paciente[] = [
  {
    id: 1,
    codigoInclusion: 'PV-ALPHA-00124',
    iniciales: 'JRM',
    edad: 64,
    sexo: 'M',
    pesoKg: 82.5,
    tallaCm: 174,
    fechaInclusion: '2024-01-20',
    estado: 'Activo',
    estudio: 'PV-2024-ALPHA',
    sitioClinico: 'HSA-001',
    diagnosticos: ['HTA', 'DM Tipo 2'],
    eventosAdversos: 1,
  },
  {
    id: 2,
    codigoInclusion: 'PV-ALPHA-00125',
    iniciales: 'LCS',
    edad: 58,
    sexo: 'F',
    pesoKg: 67.0,
    tallaCm: 162,
    fechaInclusion: '2024-01-25',
    estado: 'Suspendido',
    estudio: 'PV-2024-ALPHA',
    sitioClinico: 'INAC-204',
    diagnosticos: ['EPOC'],
    eventosAdversos: 2,
  },
  {
    id: 3,
    codigoInclusion: 'PV-ALPHA-00126',
    iniciales: 'AGP',
    edad: 72,
    sexo: 'M',
    pesoKg: 75.3,
    tallaCm: 169,
    fechaInclusion: '2024-02-01',
    estado: 'Fallecido',
    estudio: 'PV-2024-ALPHA',
    sitioClinico: 'HSA-001',
    diagnosticos: ['Insuficiencia Renal'],
    eventosAdversos: 3,
  },
  {
    id: 4,
    codigoInclusion: 'PV-ALPHA-00127',
    iniciales: 'MRT',
    edad: 45,
    sexo: 'F',
    pesoKg: 59.8,
    tallaCm: 158,
    fechaInclusion: '2024-02-10',
    estado: 'Activo',
    estudio: 'PV-2024-ALPHA',
    sitioClinico: 'BCN-033',
    diagnosticos: ['Arritmia', 'HTA'],
    eventosAdversos: 0,
  },
  {
    id: 5,
    codigoInclusion: 'ONCO-00041',
    iniciales: 'FGH',
    edad: 61,
    sexo: 'M',
    pesoKg: 88.0,
    tallaCm: 178,
    fechaInclusion: '2023-10-05',
    estado: 'Activo',
    estudio: 'ONCO-2023',
    sitioClinico: 'INAC-204',
    diagnosticos: ['Carcinoma Pulmonar'],
    eventosAdversos: 1,
  },
  {
    id: 6,
    codigoInclusion: 'ONCO-00042',
    iniciales: 'RSP',
    edad: 53,
    sexo: 'F',
    pesoKg: 61.5,
    tallaCm: 165,
    fechaInclusion: '2023-10-12',
    estado: 'Completado',
    estudio: 'ONCO-2023',
    sitioClinico: 'HSA-001',
    diagnosticos: ['Melanoma Estadio III'],
    eventosAdversos: 0,
  },
]

// ─── EVENTOS ADVERSOS ─────────────────────────────────────────────────────────

export interface EventoAdverso {
  id: number
  tipo: string
  SOC: string
  fechaReportado: string
  fechaInicio: string
  fechaFin?: string
  pacienteId: string
  estudio: string
  intensidad: Intensidad
  gravedad: Gravedad
  imputabilidad: Imputabilidad
  suspensionTratamiento: boolean
  estado: 'Activo' | 'Resuelto' | 'En seguimiento'
}

export const mockEventosAdversos: EventoAdverso[] = [
  {
    id: 1,
    tipo: 'Infarto Agudo de Miocardio',
    SOC: 'Cardiac Disorders',
    fechaReportado: '2024-10-24',
    fechaInicio: '2024-10-23',
    pacienteId: 'PT-9921-X',
    estudio: 'PV-2024-ALPHA',
    intensidad: 'Severo',
    gravedad: 'Hospitalización',
    imputabilidad: 'Probable',
    suspensionTratamiento: true,
    estado: 'En seguimiento',
  },
  {
    id: 2,
    tipo: 'Hiperpirexia',
    SOC: 'General Disorders',
    fechaReportado: '2024-10-22',
    fechaInicio: '2024-10-21',
    fechaFin: '2024-10-23',
    pacienteId: 'PT-8802-A',
    estudio: 'PV-2024-ALPHA',
    intensidad: 'Moderado',
    gravedad: 'No grave',
    imputabilidad: 'Posible',
    suspensionTratamiento: false,
    estado: 'Resuelto',
  },
  {
    id: 3,
    tipo: 'Eritema Localizado',
    SOC: 'Skin & Subcutaneous',
    fechaReportado: '2024-10-21',
    fechaInicio: '2024-10-20',
    pacienteId: 'PT-7712-B',
    estudio: 'PV-2024-ALPHA',
    intensidad: 'Leve',
    gravedad: 'No grave',
    imputabilidad: 'No relacionado',
    suspensionTratamiento: false,
    estado: 'Resuelto',
  },
  {
    id: 4,
    tipo: 'Reacción Anafiláctica',
    SOC: 'Immune System',
    fechaReportado: '2024-10-20',
    fechaInicio: '2024-10-20',
    pacienteId: 'PT-1244-K',
    estudio: 'COV-V3-POST',
    intensidad: 'Severo',
    gravedad: 'Amenaza vida',
    imputabilidad: 'Definitiva',
    suspensionTratamiento: true,
    estado: 'En seguimiento',
  },
  {
    id: 5,
    tipo: 'Neutropenia Aguda',
    SOC: 'Blood Disorders',
    fechaReportado: '2024-10-18',
    fechaInicio: '2024-10-17',
    pacienteId: 'PT-4432-M',
    estudio: 'ONCO-2023',
    intensidad: 'Severo',
    gravedad: 'Hospitalización',
    imputabilidad: 'Probable',
    suspensionTratamiento: true,
    estado: 'Activo',
  },
  {
    id: 6,
    tipo: 'Trombocitopenia',
    SOC: 'Blood Disorders',
    fechaReportado: '2024-10-15',
    fechaInicio: '2024-10-14',
    pacienteId: 'PT-2211-R',
    estudio: 'PV-2024-ALPHA',
    intensidad: 'Moderado',
    gravedad: 'No grave',
    imputabilidad: 'Posible',
    suspensionTratamiento: false,
    estado: 'En seguimiento',
  },
  {
    id: 7,
    tipo: 'Cefalea Severa',
    SOC: 'Nervous System',
    fechaReportado: '2024-10-12',
    fechaInicio: '2024-10-11',
    fechaFin: '2024-10-14',
    pacienteId: 'PT-3301-L',
    estudio: 'NEURO-ALPHA-I',
    intensidad: 'Moderado',
    gravedad: 'No grave',
    imputabilidad: 'Probable',
    suspensionTratamiento: false,
    estado: 'Resuelto',
  },
  {
    id: 8,
    tipo: 'Hematoma en sitio de inyección',
    SOC: 'General Disorders',
    fechaReportado: '2024-10-10',
    fechaInicio: '2024-10-10',
    fechaFin: '2024-10-12',
    pacienteId: 'PT-5512-G',
    estudio: 'PV-2024-ALPHA',
    intensidad: 'Leve',
    gravedad: 'No grave',
    imputabilidad: 'Definitiva',
    suspensionTratamiento: false,
    estado: 'Resuelto',
  },
]

// ─── CRDs ─────────────────────────────────────────────────────────────────────

export interface CRD {
  id: number
  pacienteId: string
  iniciales: string
  estudio: string
  fechaCreacion: string
  consentimientoFirmado: boolean
  estado: EstadoCRD
  eventosAdversos: number
  administraciones: number
  ultimaModificacion: string
  firma: string
}

export const mockCRDs: CRD[] = [
  {
    id: 1,
    pacienteId: 'PV-ALPHA-00124',
    iniciales: 'JRM',
    estudio: 'PV-2024-ALPHA',
    fechaCreacion: '2024-01-20',
    consentimientoFirmado: true,
    estado: 'En curso',
    eventosAdversos: 1,
    administraciones: 14,
    ultimaModificacion: '2024-10-22',
    firma: 'Dr. Aris Thorne',
  },
  {
    id: 2,
    pacienteId: 'PV-ALPHA-00125',
    iniciales: 'LCS',
    estudio: 'PV-2024-ALPHA',
    fechaCreacion: '2024-01-25',
    consentimientoFirmado: true,
    estado: 'Bloqueado',
    eventosAdversos: 2,
    administraciones: 10,
    ultimaModificacion: '2024-10-10',
    firma: 'Dra. Elena Costa',
  },
  {
    id: 3,
    pacienteId: 'PV-ALPHA-00126',
    iniciales: 'AGP',
    estudio: 'PV-2024-ALPHA',
    fechaCreacion: '2024-02-01',
    consentimientoFirmado: true,
    estado: 'Completo',
    eventosAdversos: 3,
    administraciones: 20,
    ultimaModificacion: '2024-09-30',
    firma: 'Dr. Aris Thorne',
  },
  {
    id: 4,
    pacienteId: 'ONCO-00041',
    iniciales: 'FGH',
    estudio: 'ONCO-2023',
    fechaCreacion: '2023-10-05',
    consentimientoFirmado: true,
    estado: 'En curso',
    eventosAdversos: 1,
    administraciones: 31,
    ultimaModificacion: '2024-10-20',
    firma: 'Dra. Elena Costa',
  },
  {
    id: 5,
    pacienteId: 'ONCO-00042',
    iniciales: 'RSP',
    estudio: 'ONCO-2023',
    fechaCreacion: '2023-10-12',
    consentimientoFirmado: true,
    estado: 'Completo',
    eventosAdversos: 0,
    administraciones: 28,
    ultimaModificacion: '2024-08-20',
    firma: 'Dr. Alejandro Ruiz',
  },
  {
    id: 6,
    pacienteId: 'PV-ALPHA-00127',
    iniciales: 'MRT',
    estudio: 'PV-2024-ALPHA',
    fechaCreacion: '2024-02-10',
    consentimientoFirmado: false,
    estado: 'En curso',
    eventosAdversos: 0,
    administraciones: 8,
    ultimaModificacion: '2024-10-23',
    firma: '',
  },
]

// ─── ADMINISTRACIONES MEDICAMENTO ─────────────────────────────────────────────

export interface AdministracionMedicamento {
  id: number
  pacienteId: string
  iniciales: string
  medicamento: string
  via: string
  dosis: string
  fechaAdministracion: string
  estudio: string
  estado: 'Administrado' | 'Omitido' | 'Pospuesto'
  observacion?: string
}

export const mockAdministraciones: AdministracionMedicamento[] = [
  {
    id: 1,
    pacienteId: 'PV-ALPHA-00124',
    iniciales: 'JRM',
    medicamento: 'Enoxaparina 40mg',
    via: 'Subcutánea',
    dosis: '40mg/día',
    fechaAdministracion: '2024-10-24',
    estudio: 'PV-2024-ALPHA',
    estado: 'Administrado',
  },
  {
    id: 2,
    pacienteId: 'PV-ALPHA-00125',
    iniciales: 'LCS',
    medicamento: 'Enoxaparina 40mg',
    via: 'Subcutánea',
    dosis: '40mg/día',
    fechaAdministracion: '2024-10-23',
    estudio: 'PV-2024-ALPHA',
    estado: 'Omitido',
    observacion: 'Paciente suspendido del estudio',
  },
  {
    id: 3,
    pacienteId: 'PV-ALPHA-00126',
    iniciales: 'AGP',
    medicamento: 'Enoxaparina 40mg',
    via: 'Subcutánea',
    dosis: '60mg/día',
    fechaAdministracion: '2024-10-22',
    estudio: 'PV-2024-ALPHA',
    estado: 'Administrado',
  },
  {
    id: 4,
    pacienteId: 'ONCO-00041',
    iniciales: 'FGH',
    medicamento: 'Pembrolizumab 200mg',
    via: 'Intravenosa',
    dosis: '200mg/3 semanas',
    fechaAdministracion: '2024-10-15',
    estudio: 'ONCO-2023',
    estado: 'Administrado',
  },
  {
    id: 5,
    pacienteId: 'PV-ALPHA-00127',
    iniciales: 'MRT',
    medicamento: 'Enoxaparina 40mg',
    via: 'Subcutánea',
    dosis: '40mg/día',
    fechaAdministracion: '2024-10-24',
    estudio: 'PV-2024-ALPHA',
    estado: 'Pospuesto',
    observacion: 'Paciente no disponible',
  },
]

// ─── TRATAMIENTOS CONCOMITANTES ───────────────────────────────────────────────

export interface TratamientoConcomitante {
  id: number
  pacienteId: string
  iniciales: string
  medicamento: string
  via: string
  dosisDiaria: string
  fechaInicio: string
  fechaFin?: string
  motivoUso: string
  estado: EstadoConcomitante
  estudio: string
}

export const mockConcomitantes: TratamientoConcomitante[] = [
  {
    id: 1,
    pacienteId: 'PV-ALPHA-00124',
    iniciales: 'JMB',
    medicamento: 'Metformina 850mg',
    via: 'Oral',
    dosisDiaria: '1.7g (2 tabs/día)',
    fechaInicio: '2024-01-12',
    motivoUso: 'Diabetes Mellitus II',
    estado: 'Activo',
    estudio: 'PV-2024-ALPHA',
  },
  {
    id: 2,
    pacienteId: 'PV-ALPHA-00124',
    iniciales: 'ALC',
    medicamento: 'Lisinopril 10mg',
    via: 'Oral',
    dosisDiaria: '10mg (1 tab/día)',
    fechaInicio: '2024-02-05',
    fechaFin: '2024-03-20',
    motivoUso: 'Hipertensión arterial',
    estado: 'Finalizado',
    estudio: 'PV-2024-ALPHA',
  },
  {
    id: 3,
    pacienteId: 'PV-ALPHA-00125',
    iniciales: 'RSG',
    medicamento: 'Atorvastatina 40mg',
    via: 'Oral',
    dosisDiaria: '40mg (Noche)',
    fechaInicio: '2024-03-15',
    motivoUso: 'Dislipidemia mixta',
    estado: 'Suspendido',
    estudio: 'PV-2024-ALPHA',
  },
  {
    id: 4,
    pacienteId: 'PV-ALPHA-00127',
    iniciales: 'MTP',
    medicamento: 'Paracetamol 500mg',
    via: 'Oral',
    dosisDiaria: '1.5g (SOS)',
    fechaInicio: '2024-03-22',
    fechaFin: '2024-03-25',
    motivoUso: 'Cefalea tensional',
    estado: 'Finalizado',
    estudio: 'PV-2024-ALPHA',
  },
  {
    id: 5,
    pacienteId: 'PV-ALPHA-00124',
    iniciales: 'KLD',
    medicamento: 'Salbutamol Inhalador',
    via: 'Inhalatoria',
    dosisDiaria: '100mcg (2 puffs/día)',
    fechaInicio: '2024-04-02',
    motivoUso: 'Asma Bronquial',
    estado: 'Activo',
    estudio: 'PV-2024-ALPHA',
  },
  {
    id: 6,
    pacienteId: 'ONCO-00041',
    iniciales: 'FGH',
    medicamento: 'Ondansetrón 8mg',
    via: 'Oral',
    dosisDiaria: '8mg (prn náuseas)',
    fechaInicio: '2023-10-10',
    motivoUso: 'Náuseas por quimioterapia',
    estado: 'Activo',
    estudio: 'ONCO-2023',
  },
]

// ─── ACTIVIDAD RECIENTE (dashboard) ───────────────────────────────────────────

export interface ActividadReciente {
  id: number
  tipo: 'sae' | 'enrollment' | 'medication' | 'crd' | 'signal'
  titulo: string
  descripcion: string
  tiempo: string
}

export const mockActividadReciente: ActividadReciente[] = [
  {
    id: 1,
    tipo: 'sae',
    titulo: 'New SAE reported',
    descripcion: 'Subject PT-9921-X reported severe cardiac event after medication.',
    tiempo: 'HACE 15 MIN',
  },
  {
    id: 2,
    tipo: 'enrollment',
    titulo: 'New Enrollment',
    descripcion: 'Study PV-2024-ALPHA added 2 new participants in Site HSA-001.',
    tiempo: 'HACE 2 HORAS',
  },
  {
    id: 3,
    tipo: 'medication',
    titulo: 'Medication Reconciliation',
    descripcion: 'Dosage sync completed for Phase III cohort A.',
    tiempo: 'HACE 4 HORAS',
  },
  {
    id: 4,
    tipo: 'crd',
    titulo: 'CRD Updated',
    descripcion: 'Digital signature verified for Case Review #PV-ALPHA-00126.',
    tiempo: 'HACE 6 HORAS',
  },
]

// ─── DATOS ENROLAMIENTO (gráfica dashboard) ────────────────────────────────────

export const mockEnrolamiento = [
  { mes: 'ENE', real: 45, proyectado: 50 },
  { mes: 'FEB', real: 112, proyectado: 120 },
  { mes: 'MAR', real: 198, proyectado: 200 },
  { mes: 'ABR', real: 310, proyectado: 320 },
  { mes: 'MAY', real: 430, proyectado: 450 },
  { mes: 'JUN', real: 560, proyectado: 600 },
  { mes: 'JUL', real: 680, proyectado: 750 },
  { mes: 'AGO', real: 790, proyectado: 860 },
  { mes: 'SEP', real: 892, proyectado: 950 },
]
