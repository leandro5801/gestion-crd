/**
 * Pacientes Custom Controller
 * 
 * Custom business logic for Pacientes (Patients)
 * These endpoints extend the default Strapi REST API.
 */

'use strict'

module.exports = {
  /**
   * Get patient profile with related data
   * GET /api/pacientes/profile/:id
   */
  async profile(ctx) {
    const { id } = ctx.params

    try {
      const patient = await strapi
        .documentService('api::paciente.paciente')
        .findOne(id, {
          populate: {
            estudio: true,
            apps: true,
            administraciones: true,
            eventosAdversos: true,
            tratamientosConcomitantes: true,
          },
        })

      if (!patient) {
        ctx.throw(404, 'Patient not found')
      }

      ctx.body = patient
    } catch (error) {
      ctx.throw(500, `Error fetching patient profile: ${error.message}`)
    }
  },

  /**
   * Get patients by study
   * GET /api/pacientes/by-study/:estudioId
   */
  async byStudy(ctx) {
    const { estudioId } = ctx.params
    const { estado, page = 1, pageSize = 10 } = ctx.query

    try {
      const filters = { estudio: { id: { $eq: estudioId } } }
      if (estado) filters.estado = { $eq: estado }

      const patients = await strapi
        .documentService('api::paciente.paciente')
        .findMany({
          filters,
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
          },
          populate: { estudio: true, apps: { fields: ['id', 'titulo'] } },
          sort: { codigoInclusion: 'asc' },
        })

      ctx.body = patients
    } catch (error) {
      ctx.throw(500, `Error fetching patients by study: ${error.message}`)
    }
  },

  /**
   * Update patient clinical status
   * PATCH /api/pacientes/:id/clinical-status
   */
  async updateClinicalStatus(ctx) {
    const { id } = ctx.params
    const { estado, motivoFin, fechaFin } = ctx.request.body

    if (!estado) {
      ctx.throw(400, 'Missing required field: estado')
    }

    try {
      const updateData = { estado }
      if (estado === 'Finalizado') {
        updateData.motivoFin = motivoFin
        updateData.fechaFin = fechaFin || new Date().toISOString()
      }

      const updated = await strapi
        .documentService('api::paciente.paciente')
        .update(id, { data: updateData })

      ctx.body = { success: true, paciente: updated }
    } catch (error) {
      ctx.throw(500, `Error updating clinical status: ${error.message}`)
    }
  },

  /**
   * Get patient APP types (antecedentes patológicos)
   * GET /api/pacientes/:id/apps
   */
  async getApps(ctx) {
    const { id } = ctx.params

    try {
      const patient = await strapi
        .documentService('api::paciente.paciente')
        .findOne(id, { populate: { apps: true } })

      if (!patient) {
        ctx.throw(404, 'Patient not found')
      }

      ctx.body = { pacienteId: id, apps: patient.apps || [] }
    } catch (error) {
      ctx.throw(500, `Error fetching patient apps: ${error.message}`)
    }
  },
}
