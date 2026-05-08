'use client'

import { useState } from 'react'
import { Search, FileDown, Pill, CheckCircle2, XCircle, Clock4, Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevaAdministracionModal } from '@/components/modals/nueva-administracion-modal'
import { VerEditarAdministracionModal } from '@/components/modals/ver-editar-administracion-modal'
import { mockAdministraciones, type AdministracionMedicamento } from '@/lib/mock-data'

const estadoBadge: Record<string, { cls: string; label: string }> = {
  Administrado: { cls: 'bg-green-50 text-green-700 border border-green-200', label: 'ADMINISTRADO' },
  Omitido: { cls: 'bg-red-50 text-red-700 border border-red-200', label: 'OMITIDO' },
  Pospuesto: { cls: 'bg-amber-50 text-amber-700 border border-amber-200', label: 'POSPUESTO' },
}

export function AdministracionContent() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [estudio, setEstudio] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<AdministracionMedicamento | null>(null)

  const estudios = ['Todos', ...Array.from(new Set(mockAdministraciones.map((a) => a.estudio)))]

  const filtered = mockAdministraciones.filter((a) => {
    const matchSearch =
      a.pacienteId.toLowerCase().includes(search.toLowerCase()) ||
      a.medicamento.toLowerCase().includes(search.toLowerCase()) ||
      a.iniciales.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estado === 'Todos' || a.estado === estado
    const matchEstudio = estudio === 'Todos' || a.estudio === estudio
    return matchSearch && matchEstado && matchEstudio
  })

  const totalAdm = mockAdministraciones.length
  const administradas = mockAdministraciones.filter((a) => a.estado === 'Administrado').length
  const omitidas = mockAdministraciones.filter((a) => a.estado === 'Omitido').length
  const pospuestas = mockAdministraciones.filter((a) => a.estado === 'Pospuesto').length

  return (
    <>
    <NuevaAdministracionModal open={showModal} onClose={() => setShowModal(false)} />
    <VerEditarAdministracionModal admin={selected} onClose={() => setSelected(null)} />
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Administración de Medicamentos"
        subtitle="Registro de administración del medicamento del estudio por paciente y fecha"
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
          value={totalAdm}
          badge="8.5k doses"
          badgeVariant="teal"
          icon={<Pill className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Administradas"
          value={administradas}
          badge={`${Math.round((administradas / totalAdm) * 100)}%`}
          badgeVariant="green"
          icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
          accentColor="#16a34a"
        />
        <StatCard
          label="Omitidas"
          value={omitidas}
          badge="Revisar"
          badgeVariant="red"
          icon={<XCircle className="w-5 h-5 text-red-500" />}
          accentColor="#ef4444"
        />
        <StatCard
          label="Pospuestas"
          value={pospuestas}
          badge="Pendiente"
          badgeVariant="amber"
          icon={<Clock4 className="w-5 h-5 text-amber-500" />}
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
              placeholder="Buscar por ID Paciente o medicamento..."
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
              {['Todos', 'Administrado', 'Omitido', 'Pospuesto'].map((s) => (
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
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors min-w-[160px]"
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
            Registrar Administración
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
                  'Dosis',
                  'Fecha',
                  'Estudio',
                  'Estado',
                  'Observación',
                  'Acción',
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
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--brand-teal)]">{a.iniciales}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--brand-teal)]">{a.pacienteId}</p>
                        <p className="text-xs text-[var(--muted-foreground)]">{a.iniciales}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm font-medium text-[var(--foreground)]">{a.medicamento}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{a.via}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">{a.dosis}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {new Date(a.fechaAdministracion).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-medium text-[var(--foreground)] bg-[var(--muted)] px-2 py-1 rounded">
                      {a.estudio}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        estadoBadge[a.estado]?.cls ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {estadoBadge[a.estado]?.label ?? a.estado}
                    </span>
                  </td>
                  <td className="px-5 py-4 max-w-[180px]">
                    <p className="text-xs text-[var(--muted-foreground)] italic truncate">
                      {a.observacion || '—'}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(a)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-teal)] hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No se encontraron registros con los filtros aplicados.
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
            <span className="font-semibold text-[var(--foreground)]">{totalAdm}</span> registros
          </p>
          <DataPagination current={page} total={Math.max(1, Math.ceil(totalAdm / 10))} onChange={setPage} />
        </div>
      </div>

      {/* Protocol note */}
      <div className="flex items-start gap-3 p-4 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-xl">
        <div className="w-8 h-8 rounded-full bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
          <Pill className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--brand-teal)]">Reconciliación de Medicación — ICH E6(R2)</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
            Cada omisión de dosis debe quedar documentada con su justificación. Las administraciones pospuestas deben
            ser rescatadas dentro de la ventana de tiempo permitida por el protocolo{' '}
            <span className="font-semibold text-[var(--foreground)]">PV-2024-ALPHA</span>.
          </p>
        </div>
      </div>
    </div>
    </>
  )
}
