'use client'

import { useState } from 'react'
import { Search, FileDown, Plus, FlaskConical, Users, AlertTriangle, Calendar, Eye, MoreHorizontal } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoEstudioModal } from '@/components/modals/nuevo-estudio-modal'
import { VerEditarEstudioModal } from '@/components/modals/ver-editar-estudio-modal'
import { mockEstudios, type Estudio } from '@/lib/mock-data'

export function EstudiosContent() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Estudio | null>(null)

  const filtered = mockEstudios.filter((e) => {
    const matchSearch =
      e.codigoProtocolo.toLowerCase().includes(search.toLowerCase()) ||
      e.titulo.toLowerCase().includes(search.toLowerCase()) ||
      e.medicamento.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estado === 'Todos' || e.estado === estado
    return matchSearch && matchEstado
  })

  const totalActivos = mockEstudios.filter((e) => e.estado === 'Activo').length
  const totalPacientes = mockEstudios.reduce((acc, e) => acc + e.totalPacientes, 0)
  const totalEA = mockEstudios.reduce((acc, e) => acc + e.eventosAdversos, 0)

  return (
    <>
    <NuevoEstudioModal open={showModal} onClose={() => setShowModal(false)} />
    <VerEditarEstudioModal estudio={selected} onClose={() => setSelected(null)} />
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Estudios Clínicos"
        subtitle="Gestión y seguimiento de protocolos de farmacovigilancia activos"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors bg-white">
              <FileDown className="w-4 h-4" />
              Exportar PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors bg-white">
              <FileDown className="w-4 h-4" />
              Exportar Excel
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Estudios"
          value={mockEstudios.length}
          badge={`${totalActivos} activos`}
          badgeVariant="teal"
          icon={<FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Pacientes Enrolados"
          value={totalPacientes.toLocaleString()}
          badge="+4.2%"
          badgeVariant="teal"
          icon={<Users className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Eventos Adversos"
          value={totalEA}
          badge="Alta vigilancia"
          badgeVariant="red"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          accentColor="#ef4444"
        />
        <StatCard
          label="Estudios en Revisión"
          value={mockEstudios.filter((e) => e.estado === 'En revisión').length}
          badge="Pendiente"
          badgeVariant="amber"
          icon={<Calendar className="w-5 h-5 text-amber-500" />}
          accentColor="#f59e0b"
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, título o medicamento..."
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Estado
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            >
              {['Todos', 'Activo', 'Completado', 'Suspendido', 'En revisión'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors">
            Aplicar Filtros
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Estudio
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Protocolo', 'Título / Medicamento', 'Fase', 'Fechas', 'Pacientes', 'EA', 'Estado', 'Acción'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-semibold text-[var(--brand-teal)]">
                      {e.codigoProtocolo}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <p className="text-sm font-medium text-[var(--foreground)] leading-tight line-clamp-2">
                      {e.titulo}
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{e.medicamento}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-semibold px-2 py-1 bg-[var(--muted)] rounded-full text-[var(--muted-foreground)]">
                      {e.fase}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-xs text-[var(--foreground)]">{e.fechaInicio}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">→ {e.fechaFinVigilancia}</p>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                    {e.totalPacientes.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-sm font-bold ${e.eventosAdversos > 20 ? 'text-red-600' : 'text-[var(--foreground)]'}`}
                    >
                      {e.eventosAdversos}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={e.estado} />
                  </td>
                    <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(e)}
                        className="p-1.5 rounded-lg text-[var(--brand-teal)] hover:bg-[var(--brand-teal-muted)] transition-colors"
                        title="Ver / Editar"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No se encontraron estudios con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span> de{' '}
            <span className="font-semibold text-[var(--foreground)]">{filtered.length}</span> estudios
          </p>
          <DataPagination current={page} total={Math.max(1, Math.ceil(filtered.length / 10))} onChange={setPage} />
        </div>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--brand-teal)]">Recordatorio de Protocolo</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
            Todos los estudios activos deben reportar eventos adversos graves (SAE) dentro de las{' '}
            <span className="font-semibold text-[var(--foreground)]">24 horas</span> de su detección según los
            requerimientos regulatorios vigentes.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
