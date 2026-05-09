'use client'

import { useState } from 'react'
import { Search, FileDown, Pill, CheckCircle2, XCircle, Plus, Eye } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevaAdministracionModal } from '@/components/modals/nueva-administracion-modal'
import { VerEditarAdministracionModal } from '@/components/modals/ver-editar-administracion-modal'
import { useAdministraciones } from '@/lib/api/administraciones'
import type { AdministracionMedicamento } from '@/lib/types'

export function AdministracionContent() {
  const [search, setSearch] = useState('')
  const [via, setVia] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<AdministracionMedicamento | null>(null)

  const filters: Record<string, unknown> = {}
  if (via !== 'Todos') filters.via = { $eq: via }

  const { items: admins, meta, isLoading, mutate } = useAdministraciones({
    pagination: { page, pageSize: 10 },
    filters: Object.keys(filters).length ? filters : undefined,
  })

  const totalAdm = meta?.total ?? 0
  const byViaSC = admins.filter((a) => a.via === 'SC').length
  const byViaIV = admins.filter((a) => a.via === 'IV').length

  return (
    <>
      <NuevaAdministracionModal open={showModal} onClose={() => { setShowModal(false); mutate() }} />
      <VerEditarAdministracionModal admin={selected} onClose={() => { setSelected(null); mutate() }} />
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
            badge="En sistema"
            badgeVariant="teal"
            icon={<Pill className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Vía SC (página)"
            value={byViaSC}
            badge="Subcutánea"
            badgeVariant="green"
            icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
            accentColor="#16a34a"
          />
          <StatCard
            label="Vía IV (página)"
            value={byViaIV}
            badge="Intravenosa"
            badgeVariant="red"
            icon={<XCircle className="w-5 h-5 text-red-500" />}
            accentColor="#ef4444"
          />
          <StatCard
            label="Cargados (página)"
            value={admins.length}
            badge="Página actual"
            badgeVariant="teal"
            icon={<Pill className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
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
                placeholder="Buscar por CRD, lote..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Vía
              </label>
              <select
                value={via}
                onChange={(e) => { setVia(e.target.value); setPage(1) }}
                className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
              >
                {['Todos', 'SC', 'IV'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
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
                  {['CRD / Paciente', 'Nº Dosis', 'Dosis (mg)', 'Vía', 'Fecha / Hora', 'Nº Lote', 'Unidades', 'Acción'].map((h) => (
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
                {isLoading && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                      Cargando registros...
                    </td>
                  </tr>
                )}
                {!isLoading && admins.map((a) => {
                  const crd = typeof a.crd === 'object' ? a.crd : null
                  const paciente = typeof crd?.paciente === 'object' ? crd?.paciente : null
                  return (
                    <tr
                      key={a.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-[var(--brand-teal)]">
                              {paciente?.iniciales?.slice(0, 2) ?? 'CR'}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--brand-teal)]">
                              {paciente?.codigoInclusion ?? `CRD #${crd?.id ?? a.id}`}
                            </p>
                            <p className="text-xs text-[var(--muted-foreground)]">{paciente?.iniciales ?? '—'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        #{a.numeroDosis}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">
                        {a.dosisMg} mg
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${a.via === 'SC' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                          {a.via}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                        {new Date(a.fechaHora).toLocaleString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                        {a.numeroLote ?? '—'}
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                        {a.numeroUnidades ?? '—'}
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
                  )
                })}
                {!isLoading && admins.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
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
              <span className="font-semibold text-[var(--foreground)]">{admins.length}</span> de{' '}
              <span className="font-semibold text-[var(--foreground)]">{totalAdm}</span> registros
            </p>
            <DataPagination current={page} total={meta?.pageCount ?? 1} onChange={setPage} />
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
              Cada administración debe quedar documentada con número de dosis, dosis en mg, vía y fecha/hora exacta.
              Las administraciones vinculadas a eventos adversos se muestran en la sección de Eventos Adversos.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
