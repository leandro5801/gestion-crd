/**
 * Estudios Custom Controller
 * 
 * Custom business logic for Estudios (Clinical Studies)
 * These endpoints extend the default Strapi REST API.
 * 
 * Usage in Strapi:
 * 1. Place this file in your Strapi backend: src/extensions/estudios/controllers/
 * 2. Register custom routes in routes config
 * 3. Restart Strapi server
 */

'use strict'

module.exports = {
  /**
   * Get studies with patient count and latest activity
   * GET /api/estudios/enriched
   */
  async enriched(ctx) {
    try {
      const studies = await strapi
        .documentService('api::estudio.estudio')
        .findMany({
          populate: { pacientes: { fields: ['id'] } },
          sort: { createdAt: 'desc' },
        })

      const enriched = await Promise.all(
        studies.map(async (study) => ({
          ...study,
          pacienteCount: study.pacientes?.length || 0,
        }))
      )

      ctx.body = enriched
    } catch (error) {
      ctx.throw(500, `Error fetching enriched studies: ${error.message}`)
    }
  },

  /**
   * Get studies filtered by site and status
   * GET /api/estudios/by-site?sitioId=:id&status=:status
   */
  async bySite(ctx) {
    const { sitioId, status } = ctx.query

    try {
      const filters = { sitios: { id: { $eq: sitioId } } }
      if (status) filters.estado = { $eq: status }

      const studies = await strapi
        .documentService('api::estudio.estudio')
        .findMany({
          filters,
          populate: { sitios: true },
        })

      ctx.body = studies
    } catch (error) {
      ctx.throw(500, `Error fetching studies by site: ${error.message}`)
    }
  },

  /**
   * Batch update study status
   * PATCH /api/estudios/batch-update-status
   */
  async batchUpdateStatus(ctx) {
    const { estudios: ids, newStatus } = ctx.request.body

    if (!Array.isArray(ids) || !newStatus) {
      ctx.throw(400, 'Missing required fields: estudios (array) or newStatus')
    }

    try {
      const updated = await Promise.all(
        ids.map((id) =>
          strapi.documentService('api::estudio.estudio').update(id, {
            data: { estado: newStatus },
          })
        )
      )

      ctx.body = { success: true, updated: updated.length, newStatus }
    } catch (error) {
      ctx.throw(500, `Error batch updating studies: ${error.message}`)
    }
  },
}
