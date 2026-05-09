/**
 * Eventos Adversos Custom Controller
 * 
 * Custom business logic for Eventos Adversos (Adverse Events)
 * Includes SAE (Serious Adverse Event) handling and regulatory reporting.
 */

'use strict'

module.exports = {
  /**
   * Get serious adverse events (SAE) flagged for reporting
   * GET /api/eventos-adversos/sae
   */
  async sae(ctx) {
    try {
      const saeEvents = await strapi
        .documentService('api::evento-adverso.evento-adverso')
        .findMany({
          filters: { intensidad: { $eq: 'Severo' } },
          populate: { paciente: true, estudio: true },
          sort: { fechaReportado: 'desc' },
        })

      // Flag if reporting is overdue (>24 hours per ICH E2A)
      const flagged = saeEvents.map((event) => {
        const reportedTime = new Date(event.fechaReportado).getTime()
        const now = Date.now()
        const hoursElapsed = (now - reportedTime) / (1000 * 60 * 60)
        return {
          ...event,
          reportingOverdue: hoursElapsed > 24,
          hoursElapsed: Math.round(hoursElapsed * 10) / 10,
        }
      })

      ctx.body = flagged
    } catch (error) {
      ctx.throw(500, `Error fetching SAE events: ${error.message}`)
    }
  },

  /**
   * Get events by patient
   * GET /api/eventos-adversos/by-patient/:pacienteId
   */
  async byPatient(ctx) {
    const { pacienteId } = ctx.params
    const { intensidad } = ctx.query

    try {
      const filters = { paciente: { id: { $eq: pacienteId } } }
      if (intensidad) filters.intensidad = { $eq: intensidad }

      const events = await strapi
        .documentService('api::evento-adverso.evento-adverso')
        .findMany({
          filters,
          populate: { paciente: true, estudio: true },
          sort: { fechaReportado: 'desc' },
        })

      ctx.body = events
    } catch (error) {
      ctx.throw(500, `Error fetching events by patient: ${error.message}`)
    }
  },

  /**
   * Get events by study with aggregation
   * GET /api/eventos-adversos/by-study/:estudioId/summary
   */
  async studySummary(ctx) {
    const { estudioId } = ctx.params

    try {
      const events = await strapi
        .documentService('api::evento-adverso.evento-adverso')
        .findMany({
          filters: { estudio: { id: { $eq: estudioId } } },
          populate: { paciente: true, estudio: true },
        })

      const summary = {
        total: events.length,
        bySeverity: {
          Leve: events.filter((e) => e.intensidad === 'Leve').length,
          Moderado: events.filter((e) => e.intensidad === 'Moderado').length,
          Severo: events.filter((e) => e.intensidad === 'Severo').length,
        },
        byStatus: {
          Activo: events.filter((e) => e.estado === 'Activo').length,
          Resuelto: events.filter((e) => e.estado === 'Resuelto').length,
          'En seguimiento': events.filter((e) => e.estado === 'En seguimiento').length,
        },
        saeCount: events.filter((e) => e.intensidad === 'Severo').length,
        treatmentSuspensionCount: events.filter((e) => e.suspensionTratamiento).length,
      }

      ctx.body = summary
    } catch (error) {
      ctx.throw(500, `Error generating study summary: ${error.message}`)
    }
  },

  /**
   * Mark event as reported
   * PATCH /api/eventos-adversos/:id/mark-reported
   */
  async markReported(ctx) {
    const { id } = ctx.params
    const { reportDate } = ctx.request.body

    try {
      const updated = await strapi
        .documentService('api::evento-adverso.evento-adverso')
        .update(id, {
          data: {
            reportedAt: reportDate || new Date().toISOString(),
            estado: 'Reportado',
          },
        })

      ctx.body = { success: true, evento: updated }
    } catch (error) {
      ctx.throw(500, `Error marking event as reported: ${error.message}`)
    }
  },
}
