/**
 * Dashboard Custom Controller
 * 
 * Aggregated analytics and stats endpoints for dashboard
 */

'use strict'

module.exports = {
  /**
   * Get global dashboard stats
   * GET /api/dashboard/stats
   */
  async stats(ctx) {
    try {
      const [
        estudios,
        pacientes,
        crds,
        eventosAdversos,
        administraciones,
      ] = await Promise.all([
        strapi.documentService('api::estudio.estudio').findMany(),
        strapi.documentService('api::paciente.paciente').findMany(),
        strapi.documentService('api::crd.crd').findMany(),
        strapi.documentService('api::evento-adverso.evento-adverso').findMany(),
        strapi.documentService('api::administracion.administracion').findMany(),
      ])

      ctx.body = {
        estudios: {
          total: estudios.length,
          activos: estudios.filter((e) => e.estado === 'Activo').length,
          finalizados: estudios.filter((e) => e.estado === 'Finalizado')
            .length,
        },
        pacientes: {
          total: pacientes.length,
          activos: pacientes.filter((p) => p.estado === 'Activo').length,
          finalizados: pacientes.filter((p) => p.estado === 'Finalizado')
            .length,
        },
        crds: {
          total: crds.length,
          completos: crds.filter((c) => c.estado === 'Completo').length,
          incompletos: crds.filter((c) => c.estado === 'Incompleto').length,
        },
        eventosAdversos: {
          total: eventosAdversos.length,
          sae: eventosAdversos.filter((e) => e.intensidad === 'Severo')
            .length,
          graves: eventosAdversos.filter((e) =>
            ['Severo', 'Moderado'].includes(e.intensidad)
          ).length,
        },
        administraciones: {
          total: administraciones.length,
          activas: administraciones.filter((a) => a.estado === 'Activo')
            .length,
        },
      }
    } catch (error) {
      ctx.throw(500, `Error fetching dashboard stats: ${error.message}`)
    }
  },

  /**
   * Get study details for dashboard
   * GET /api/dashboard/study/:estudioId
   */
  async studyDetail(ctx) {
    const { estudioId } = ctx.params

    try {
      const estudio = await strapi
        .documentService('api::estudio.estudio')
        .findOne(estudioId, {
          populate: { pacientes: true, sitios: true },
        })

      if (!estudio) {
        ctx.throw(404, 'Study not found')
      }

      // Get associated data counts
      const crds = await strapi
        .documentService('api::crd.crd')
        .findMany({
          filters: { estudio: { id: { $eq: estudioId } } },
        })

      const eventos = await strapi
        .documentService('api::evento-adverso.evento-adverso')
        .findMany({
          filters: { estudio: { id: { $eq: estudioId } } },
        })

      ctx.body = {
        estudio,
        stats: {
          pacientes: estudio.pacientes?.length || 0,
          crds: crds.length,
          crdsCompletos: crds.filter((c) => c.estado === 'Completo').length,
          eventos: eventos.length,
          sae: eventos.filter((e) => e.intensidad === 'Severo').length,
        },
      }
    } catch (error) {
      ctx.throw(500, `Error fetching study detail: ${error.message}`)
    }
  },

  /**
   * Get recent activity feed
   * GET /api/dashboard/activity?limit=10
   */
  async activity(ctx) {
    const { limit = 10 } = ctx.query

    try {
      const [pacientes, crds, eventos] = await Promise.all([
        strapi
          .documentService('api::paciente.paciente')
          .findMany({
            sort: { updatedAt: 'desc' },
            limit: parseInt(limit),
            populate: { estudio: true },
          }),
        strapi
          .documentService('api::crd.crd')
          .findMany({
            sort: { updatedAt: 'desc' },
            limit: parseInt(limit),
            populate: { paciente: true },
          }),
        strapi
          .documentService('api::evento-adverso.evento-adverso')
          .findMany({
            sort: { updatedAt: 'desc' },
            limit: parseInt(limit),
            populate: { paciente: true },
          }),
      ])

      // Merge and sort by date
      const activity = [
        ...pacientes.map((p) => ({
          type: 'paciente',
          action: 'updated',
          entityId: p.id,
          display: `Paciente ${p.codigoInclusion} actualizado`,
          timestamp: p.updatedAt,
        })),
        ...crds.map((c) => ({
          type: 'crd',
          action: c.estado === 'Completo' ? 'completed' : 'updated',
          entityId: c.id,
          display: `CRD para ${c.paciente?.codigoInclusion || 'paciente'} ${c.estado === 'Completo' ? 'completado' : 'actualizado'}`,
          timestamp: c.updatedAt,
        })),
        ...eventos.map((e) => ({
          type: 'evento',
          action: 'reported',
          entityId: e.id,
          display: `Evento ${e.intensidad} reportado: ${e.tipo}`,
          timestamp: e.updatedAt,
          severity: e.intensidad,
        })),
      ]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, parseInt(limit))

      ctx.body = activity
    } catch (error) {
      ctx.throw(500, `Error fetching activity: ${error.message}`)
    }
  },
}
