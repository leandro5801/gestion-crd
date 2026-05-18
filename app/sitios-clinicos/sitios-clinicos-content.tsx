'use client'

import { useState } from 'react'
import { Search, FileDown, MapPin, Globe, Building2, Eye, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoSitioModal } from '@/components/modals/nuevo-sitio-modal'
import { VerEditarSitioModal } from '@/components/modals/ver-editar-sitio-modal'
import { useSitiosClinicos, deleteSitioClinico } from '@/lib/api/sitios-clinicos'
import type { SitioClinico } from '@/lib/types'

export function SitiosClinicosContent() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<SitioClinico | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { items: sitios, meta, isLoading, mutate } = useSitiosClinicos({
    pagination: { page, pageSize: 10 },
    filters: search
      ? {
          $or: [
            { nombre: { $containsi: search } },
            { codigo: { $containsi: search } },
          ],
        }
      : undefined,
  })

  const totalSitios = meta?.total ?? 0

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar este sitio clínico? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    try {
      await deleteSitioClinico(id)
      await mutate()
    } catch (error) {
      console.error('Error deleting sitio:', error)
      alert('Error al eliminar el sitio clínico')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <NuevoSitioModal open={showModal} onClose={() => { setShowModal(false); mutate() }} />
      <VerEditarSitioModal sitio={selected} onClose={() => { setSelected(null); mutate() }} />
      <div className="p-6 flex flex-col gap-6">
        <PageHeader
          title="Gestión de Sitios Clínicos"
          subtitle="Clinical Site Management &amp; Investigator Tracking"
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Sitios"
            value={totalSitios}
            badge="En sistema"
            badgeVariant="teal"
            icon={<Building2 className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Con Pacientes"
            value={sitios.filter((s) => (s.pacientes?.length ?? 0) > 0).length}
            badge="Activos"
            badgeVariant="teal"
            icon={<MapPin className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Cargados (página)"
            value={sitios.length}
            icon={<Globe className="w-5 h-5 text-slate-500" />}
            accentColor="#94a3b8"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Buscar por nombre o código de sitio..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar Nuevo Sitio
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Nombre del Sitio', 'Código', 'Pacientes', 'Acción'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                      Cargando sitios clínicos...
                    </td>
                  </tr>
                )}
                {!isLoading && sitios.map((s) => (
                  <tr key={s.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-[var(--foreground)]">{s.nombre}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-medium text-[var(--foreground)]">{s.codigo}</span>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-[var(--foreground)]">
                      {s.pacientes?.length ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelected(s)}
                          className="p-1.5 rounded-lg text-[var(--brand-teal)] hover:bg-[var(--brand-teal-muted)] transition-colors"
                          title="Ver / Editar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingId === s.id}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && sitios.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                      No se encontraron sitios con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Mostrando <span className="font-semibold text-[var(--foreground)]">{sitios.length}</span> de{' '}
              <span className="font-semibold text-[var(--foreground)]">{totalSitios}</span> sitios clínicos
            </p>
            <DataPagination current={page} total={meta?.pageCount ?? 1} onChange={setPage} />
          </div>
        </div>

        {/* Help banner */}
        <div className="bg-[var(--brand-teal)] rounded-xl p-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Asistencia en Gestión de Sitios</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              ¿Necesita ayuda con la certificación de nuevos centros o la gestión de roles de investigadores? Acceda a
              nuestra guía de soporte técnico o contacte con el administrador regional.
            </p>
            <button className="px-4 py-2 bg-white text-[var(--brand-teal)] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">
              Ver Documentación
            </button>
          </div>
          <div className="hidden md:flex w-24 h-24 rounded-xl bg-white/10 items-center justify-center flex-shrink-0">
            <MapPin className="w-10 h-10 text-white/50" />
          </div>
        </div>
      </div>
    </>
  )
}
