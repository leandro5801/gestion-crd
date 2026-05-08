'use client'

import { useState } from 'react'
import { Search, FileDown, Stethoscope, Activity, Plus, Eye, Edit } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoConcomitanteModal } from '@/components/modals/nuevo-concomitante-modal'
import { VerEditarConcomitanteModal } from '@/components/modals/ver-editar-concomitante-modal'
import { mockConcomitantes, type TratamientoConcomitante } from '@/lib/mock-data'

const estadoBadge: Record<string, { cls: string; label: string }> = {
  Activo: { cls: 'bg-green-50 text-green-700 border border-green-200', label: 'ACTIVO' },
  Finalizado: { cls: 'bg-slate-100 text-slate-600 border border-slate-200', label: 'FINALIZADO' },
  Suspendido: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'SUSPENDIDO' },
}

export function TratamientoConcomitanteContent() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [estudio, setEstudio] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<TratamientoConcomitante | null>(null)

  const estudios = ['Todos', ...Array.from(new Set(mockConcomitantes.map((c) => c.estudio)))]

  const filtered = mockConcomitantes.filter((c) => {
    const matchSearch =
      c.pacienteId.toLowerCase().includes(search.toLowerCase()) ||
      c.medicamento.toLowerCase().includes(search.toLowerCase()) ||
      c.motivoUso.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estado === 'Todos' || c.estado === estado
    const matchEstudio = estudio === 'Todos' || c.estudio === estudio
    return matchSearch && matchEstado && matchEstudio
  })

  const totalRegistros = 24
  const activos = mockConcomitantes.filter((c) => c.estado === 'Activo').length
  const finalizados = mockConcomitantes.filter((c) => c.estado === 'Finalizado').length
  const suspendidos = mockConcomitantes.filter((c) => c.estado === 'Suspendido').length

  return (
    <>
    <NuevoConcomitanteModal open={showModal} onClose={() => setShowModal(false)} />
    <VerEditarConcomitanteModal concomitante={selected} onClose={() => setSelected(null)} />
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Gestión de Tratamiento Concomitante"
        subtitle="Registro de medicamentos adicionales administrados a pacientes durante el estudio"
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
          label="Total Registros"
          value={totalRegistros}
          badge={`${mockConcomitantes.length} cargados`}
          badgeVariant="teal"
          icon={<Stethoscope className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Activos"
          value={activos}
          badge="En curso"
          badgeVariant="teal"
          icon={<Activity className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Finalizados"
          value={finalizados}
          badge="Completado"
          badgeVariant="gray"
          icon={<Activity className="w-5 h-5 text-slate-400" />}
          accentColor="#94a3b8"
        />
        <StatCard
          label="Suspendidos"
          value={suspendidos}
          badge="Revisar"
          badgeVariant="amber"
          icon={<Activity className="w-5 h-5 text-amber-500" />}
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
              placeholder="ID Paciente o Nombre Medicamento..."
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
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            >
              {['Todos', 'Activo', 'Finalizado', 'Suspendido'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Estudio Clínico
            </label>
            <select
              value={estudio}
              onChange={(e) => setEstudio(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors min-w-[180px]"
            >
              {estudios.map((s) => (
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
            Registrar Nuevo Medicamento
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {[
                  'Paciente (ID/Iniciales)',
                  'Medicamento',
                  'Vía de Adm.',
                  'Dosis Diaria',
                  'Fecha Inicio',
                  'Fecha Fin',
                  'Motivo de Uso',
                  'Estado',
                  'Acciones',
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--brand-teal)]">{c.iniciales}</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--brand-teal)]">{c.pacienteId}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[var(--foreground)]">{c.medicamento}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{c.via}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{c.dosisDiaria}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {new Date(c.fechaInicio).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {c.fechaFin
                      ? new Date(c.fechaFin).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : <span className="text-[var(--muted-foreground)]">—</span>}
                  </td>
                  <td className="px-5 py-4 max-w-[140px]">
                    <p className="text-xs italic text-[var(--muted-foreground)] truncate">{c.motivoUso}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        estadoBadge[c.estado]?.cls ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {estadoBadge[c.estado]?.label ?? c.estado}
                    </span>
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
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No se encontraron tratamientos concomitantes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando{' '}
            <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span> de{' '}
            <span className="font-semibold text-[var(--foreground)]">{totalRegistros}</span> registros
          </p>
          <DataPagination current={page} total={Math.max(1, Math.ceil(totalRegistros / 10))} onChange={setPage} />
        </div>
      </div>

      {/* Protocol reminder */}
      <div className="flex items-start gap-3 p-4 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--brand-teal)]">Recordatorio de Protocolo</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
            Todos los tratamientos concomitantes deben ser validados contra los criterios de exclusión del protocolo{' '}
            <span className="font-semibold text-[var(--foreground)]">PV-2024-ALPHA</span>. Cualquier interacción
            medicamentosa sospechosa debe reportarse como Evento Adverso de Especial Interés (AESI) dentro de las 24h.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
