'use client'

import { useState } from 'react'
import { Search, FileDown, FileText, CheckCircle, XCircle, Clock, Eye, Plus, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoCRDModal } from '@/components/modals/nuevo-crd-modal'
import { VerEditarCRDModal } from '@/components/modals/ver-editar-crd-modal'
import { useCrds, deleteCrd } from '@/lib/api/crds'
import type { CRD } from '@/lib/types'

export function CRDContent() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<CRD | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filters: Record<string, unknown> = {}
  if (estado !== 'Todos') filters.estado = { $eq: estado }

  const { items: crds, meta, isLoading, mutate } = useCrds({
    pagination: { page, pageSize: 10 },
    filters: Object.keys(filters).length ? filters : undefined,
  })

  const totalCrds = meta?.total ?? 0
  const enCurso = crds.filter((c) => c.estado === 'En curso').length
  const completos = crds.filter((c) => c.estado === 'Completo').length
  const bloqueados = crds.filter((c) => c.estado === 'Bloqueado').length
  const consentidos = crds.filter((c) => c.consentimientoFirmado).length

  const handleDelete = async (id: string) => {
    if (!confirm(`¿Está seguro de que desea eliminar este CRD? Esta acción no se puede deshacer.`)) return
    setDeletingId(id)
    try {
      await deleteCrd(id)
      await mutate()
    } catch (error) {
      console.error('Error deleting CRD:', error)
      alert('Error al eliminar el CRD')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
      <NuevoCRDModal open={showModal} onClose={() => { setShowModal(false); mutate() }} />
      <VerEditarCRDModal crd={selected} onClose={() => { setSelected(null); mutate() }} />
      <div className="p-6 flex flex-col gap-6">
        <PageHeader
          title="Cuaderno de Recogida de Datos"
          subtitle="Registro digital de datos clínicos por paciente — uno por sujeto de estudio"
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total CRDs"
            value={totalCrds}
            badge={`${consentidos} consentidos`}
            badgeVariant="teal"
            icon={<FileText className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="En Curso"
            value={enCurso}
            badge="Active"
            badgeVariant="teal"
            icon={<Clock className="w-5 h-5 text-blue-500" />}
            accentColor="#3b82f6"
          />
          <StatCard
            label="Completados"
            value={completos}
            badge={totalCrds > 0 ? `${Math.round((completos / crds.length) * 100)}%` : '0%'}
            badgeVariant="green"
            icon={<CheckCircle className="w-5 h-5 text-green-500" />}
            accentColor="#16a34a"
          />
          <StatCard
            label="Bloqueados"
            value={bloqueados}
            badge="Requieren atención"
            badgeVariant="red"
            icon={<XCircle className="w-5 h-5 text-red-500" />}
            accentColor="#ef4444"
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
                placeholder="Buscar por ID Paciente o iniciales..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Estado
              </label>
              <select
                value={estado}
                onChange={(e) => { setEstado(e.target.value); setPage(1) }}
                className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
              >
                {['Todos', 'En curso', 'Completo', 'Bloqueado'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo CRD
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {['Paciente', 'Fecha Creación', 'Consentimiento', 'Administraciones', 'Concomitantes', 'Estado', 'Acciones'].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                      Cargando CRDs...
                    </td>
                  </tr>
                )}
                {!isLoading && crds.map((c) => {
                  const paciente = typeof c.paciente === 'object' ? c.paciente : null
                  return (
                    <tr key={c.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[var(--brand-teal)]">
                              {paciente?.iniciales?.slice(0, 2) ?? '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--brand-teal)]">
                              {paciente?.codigoInclusion ?? `CRD #${c.id}`}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">{paciente?.iniciales ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--foreground)]">{c.fechaCreacion}</td>
                      <td className="px-5 py-4">
                        {c.consentimientoFirmado ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                            <CheckCircle className="w-3.5 h-3.5" /> Firmado
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-500">
                            <XCircle className="w-3.5 h-3.5" /> Pendiente
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                        {c.administraciones?.length ?? 0}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                        {c.concomitantes?.length ?? 0}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={c.estado} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelected(c)}
                            className="p-1.5 rounded-lg text-[var(--brand-teal)] hover:bg-[var(--brand-teal-muted)] transition-colors"
                            title="Ver / Editar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            disabled={deletingId === c.id}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {!isLoading && crds.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                      No se encontraron CRDs con los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Mostrando <span className="font-semibold text-[var(--foreground)]">{crds.length}</span> de{' '}
              <span className="font-semibold text-[var(--foreground)]">{totalCrds}</span> registros
            </p>
            <DataPagination current={page} total={meta?.pageCount ?? 1} onChange={setPage} />
          </div>
        </div>

        {/* Protocol reminder */}
        <div className="flex items-start gap-3 p-4 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-teal)]">Integridad de Datos — ICH E6(R2)</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
              Todo CRD debe tener consentimiento informado firmado antes de registrar datos clínicos. Los CRDs bloqueados
              requieren revisión del monitor antes de ser liberados.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
