/**
 * CRDs (Case Report Forms) Custom Controller
 * 
 * Custom business logic for CRDs
 * Includes CRD lifecycle management and status tracking.
 */

'use strict'

module.exports = {
  /**
   * Get CRD by paciente and estudio
   * GET /api/crds/by-patient-study?pacienteId=:id&estudioId=:id
   */
  async byPatientStudy(ctx) {
    const { pacienteId, estudioId } = ctx.query

    if (!pacienteId || !estudioId) {
      ctx.throw(400, 'Missing required query params: pacienteId, estudioId')
    }

    try {
      const crds = await strapi
        .documentService('api::crd.crd')
        .findMany({
          filters: {
            $and: [
              { paciente: { id: { $eq: pacienteId } } },
              { estudio: { id: { $eq: estudioId } } },
            ],
          },
          populate: { paciente: true, estudio: true },
        })

      ctx.body = crds
    } catch (error) {
      ctx.throw(500, `Error fetching CRDs: ${error.message}`)
    }
  },

  /**
   * Get CRD completion status (progress)
   * GET /api/crds/:id/progress
   */
  async progress(ctx) {
    const { id } = ctx.params

    try {
      const crd = await strapi
        .documentService('api::crd.crd')
        .findOne(id, {
          populate: {
            administraciones: { fields: ['id'] },
            eventosAdversos: { fields: ['id'] },
            tratamientosConcomitantes: { fields: ['id'] },
          },
        })

      if (!crd) {
        ctx.throw(404, 'CRD not found')
      }

      const sections = {
        administraciones: {
          required: 1,
          completed: crd.administraciones?.length || 0,
        },
        eventosAdversos: {
          required: 0, // Optional
          completed: crd.eventosAdversos?.length || 0,
        },
        concomitantes: {
          required: 0, // Optional
          completed: crd.tratamientosConcomitantes?.length || 0,
        },
      }

      const totalRequired = Object.values(sections).reduce(
        (sum, s) => sum + s.required,
        0
      )
      const totalCompleted = Object.values(sections).reduce(
        (sum, s) => sum + Math.min(s.completed, s.required || 1),
        0
      )

      ctx.body = {
        crdId: id,
        sections,
        overall: {
          percentage:
            totalRequired > 0
              ? Math.round((totalCompleted / totalRequired) * 100)
              : 100,
          isComplete: totalRequired === totalCompleted,
        },
      }
    } catch (error) {
      ctx.throw(500, `Error calculating CRD progress: ${error.message}`)
    }
  },

  /**
   * Get CRDs by study with completion stats
   * GET /api/crds/by-study/:estudioId
   */
  async byStudy(ctx) {
    const { estudioId } = ctx.params

    try {
      const crds = await strapi
        .documentService('api::crd.crd')
        .findMany({
          filters: { estudio: { id: { $eq: estudioId } } },
          populate: {
            paciente: true,
            administraciones: { fields: ['id'] },
            eventosAdversos: { fields: ['id'] },
          },
        })

      const withStats = crds.map((crd) => ({
        ...crd,
        stats: {
          administracionCount: crd.administraciones?.length || 0,
          eventoCount: crd.eventosAdversos?.length || 0,
          isIncomplete:
            !crd.administraciones || crd.administraciones.length === 0,
        },
      }))

      ctx.body = withStats
    } catch (error) {
      ctx.throw(500, `Error fetching CRDs by study: ${error.message}`)
    }
  },

  /**
   * Update CRD status/estado
   * PATCH /api/crds/:id/status
   */
  async updateStatus(ctx) {
    const { id } = ctx.params
    const { estado, completedAt } = ctx.request.body

    if (!estado) {
      ctx.throw(400, 'Missing required field: estado')
    }

    try {
      const updateData = { estado }
      if (estado === 'Completo') {
        updateData.completedAt = completedAt || new Date().toISOString()
      }

      const updated = await strapi
        .documentService('api::crd.crd')
        .update(id, { data: updateData })

      ctx.body = { success: true, crd: updated }
    } catch (error) {
      ctx.throw(500, `Error updating CRD status: ${error.message}`)
    }
  },
}
