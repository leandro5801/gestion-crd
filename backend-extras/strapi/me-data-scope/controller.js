'use strict'

/**
 * Endpoint: GET /api/me/data-scope
 *
 * Copiar este controlador en:
 *   src/api/me/controllers/me.js
 *
 * Relación esperada:
 *   usuario médico-investigador -> pacientes
 *   paciente -> estudio
 *   paciente -> sitioClinico
 *
 * Si en el proyecto los atributos tienen otros nombres, cambiar únicamente
 * USER_RELATION_FIELDS y/o los nombres de populate indicados abajo.
 */

const USER_RELATION_FIELDS = [
  'pacientes',
  'estudios',
  'sitiosClinicos',
  'sitios_clinicos',
]

const INVESTIGATOR_ROLE = 'medico-investigador'

const normalizeRole = (role) =>
  String(role || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

const asArray = (value) => {
  if (Array.isArray(value)) return value
  if (value && Array.isArray(value.data)) return value.data
  if (value && typeof value === 'object') return [value]
  return []
}

const uniqueById = (items) => {
  const map = new Map()
  for (const item of items) {
    const id = item?.id ?? item?.documentId
    if (id !== undefined && id !== null) map.set(String(id), item)
  }
  return [...map.values()]
}

const relationIds = (items) =>
  uniqueById(items).map((item) => item.id ?? item.documentId)

module.exports = {
  async dataScope(ctx) {
    const currentUser = ctx.state.user

    if (!currentUser) {
      return ctx.unauthorized('Debes iniciar sesión para consultar tu alcance de datos.')
    }

    const user = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      currentUser.id,
      {
        fields: ['id', 'username', 'email'],
        populate: {
          role: { fields: ['id', 'name', 'type'] },
          pacientes: {
            fields: ['id', 'documentId', 'codigoInclusion', 'iniciales'],
            populate: {
              estudio: { fields: ['id', 'documentId', 'codigoProtocolo', 'titulo'] },
              sitioClinico: { fields: ['id', 'documentId', 'codigo', 'nombre'] },
            },
          },
          estudios: {
            fields: ['id', 'documentId', 'codigoProtocolo', 'titulo'],
          },
          sitiosClinicos: {
            fields: ['id', 'documentId', 'codigo', 'nombre'],
          },
        },
      }
    )

    if (!user) {
      return ctx.unauthorized('El usuario autenticado no existe.')
    }

    const roleName = normalizeRole(user.role?.name)
    const patients = asArray(user.pacientes)
    const directStudies = asArray(user.estudios)
    const directSites = [
      ...asArray(user.sitiosClinicos),
      ...asArray(user.sitios_clinicos),
    ]

    // Para médico-investigador, las relaciones del usuario son el alcance.
    // Paciente es la relación principal; estudio y sitio se derivan del paciente.
    if (roleName === INVESTIGATOR_ROLE) {
      const studies = uniqueById([
        ...directStudies,
        ...patients.flatMap((patient) => asArray(patient.estudio)),
      ])
      const sites = uniqueById([
        ...directSites,
        ...patients.flatMap((patient) => asArray(patient.sitioClinico)),
      ])

      return ctx.send({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: { id: user.role?.id, name: user.role?.name },
        },
        scope: {
          role: user.role?.name || INVESTIGATOR_ROLE,
          isInvestigator: true,
          pacientes,
          estudios: studies,
          sitiosClinicos: sites,
          pacienteIds: relationIds(patients),
          estudioIds: relationIds(studies),
          sitioClinicoIds: relationIds(sites),
        },
      })
    }

    // Otros roles reciben el catálogo completo; sus policies siguen controlando
    // las operaciones permitidas en cada content-type.
    const [studies, sites, allPatients] = await Promise.all([
      strapi.entityService.findMany('api::estudio.estudio', {
        fields: ['id', 'documentId', 'codigoProtocolo', 'titulo'],
        limit: 1000,
      }),
      strapi.entityService.findMany('api::sitio-clinico.sitio-clinico', {
        fields: ['id', 'documentId', 'codigo', 'nombre'],
        limit: 1000,
      }),
      strapi.entityService.findMany('api::paciente.paciente', {
        fields: ['id', 'documentId', 'codigoInclusion', 'iniciales'],
        populate: {
          estudio: { fields: ['id', 'documentId', 'codigoProtocolo', 'titulo'] },
          sitioClinico: { fields: ['id', 'documentId', 'codigo', 'nombre'] },
        },
        limit: 1000,
      }),
    ])

    return ctx.send({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: { id: user.role?.id, name: user.role?.name },
      },
      scope: {
        role: user.role?.name || null,
        isInvestigator: false,
        pacientes: allPatients,
        estudios: studies,
        sitiosClinicos: sites,
        pacienteIds: relationIds(allPatients),
        estudioIds: relationIds(studies),
        sitioClinicoIds: relationIds(sites),
      },
    })
  },
}

// Nota: USER_RELATION_FIELDS documenta los nombres soportados en el modelo.
// Si el usuario no tiene relación directa con pacientes, crea esa relación
// many-to-many o usa un campo equivalente como investigador/medicoInvestigador.
void USER_RELATION_FIELDS
