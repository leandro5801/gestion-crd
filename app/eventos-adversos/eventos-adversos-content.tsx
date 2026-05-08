'use client'

import { useState } from 'react'
import { Search, FileDown, AlertTriangle, Clock, TrendingUp, Activity, Eye, Plus, TrendingDown } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { SeverityBadge } from '@/components/ui/status-badge'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoEventoModal } from '@/components/modals/nuevo-evento-modal'
import { VerEditarEventoModal } from '@/components/modals/ver-editar-evento-modal'
import { mockEventosAdversos, type EventoAdverso } from '@/lib/mock-data'

const imputabilidadStyle: Record<string, string> = {
  Definitiva: 'bg-slate-100 text-slate-700 border border-slate-200',
  Probable: 'bg-slate-100 text-slate-700 border border-slate-200',
  Posible: 'bg-slate-100 text-slate-600 border border-slate-200',
  'No relacionado': 'bg-slate-50 text-slate-500 border border-slate-200',
  'No clasificable': 'bg-slate-50 text-slate-400 border border-slate-200',
}

export function EventosAdversosContent() {
  const [search, setSearch] = useState('')
  const [estudio, setEstudio] = useState('All active studies')
  const [intensidad, setIntensidad] = useState('All levels')
  const [soc, setSoc] = useState('All systems')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<EventoAdverso | null>(null)

  const estudios = ['All active studies', ...Array.from(new Set(mockEventosAdversos.map((e) => e.estudio)))]
  const socs = ['All systems', ...Array.from(new Set(mockEventosAdversos.map((e) => e.SOC)))]

  const filtered = mockEventosAdversos.filter((e) => {
    const matchSearch =
      e.tipo.toLowerCase().includes(search.toLowerCase()) ||
      e.pacienteId.toLowerCase().includes(search.toLowerCase()) ||
      e.estudio.toLowerCase().includes(search.toLowerCase())
    const matchEstudio = estudio === 'All active studies' || e.estudio === estudio
    const matchIntensidad = intensidad === 'All levels' || e.intensidad === intensidad
    const matchSoc = soc === 'All systems' || e.SOC === soc
    return matchSearch && matchEstudio && matchIntensidad && matchSoc
  })

  const totalActivos = 1284
  const seriosTotal = mockEventosAdversos.filter((e) => e.intensidad === 'Severo').length
  const processingTime = '1.4d'
  const signalThreshold = 'Normal'

  return (
    <>
    <NuevoEventoModal open={showModal} onClose={() => setShowModal(false)} />
    <VerEditarEventoModal evento={selected} onClose={() => setSelected(null)} />
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Eventos Adversos"
        subtitle="Pharmacovigilance Dashboard &amp; Surveillance Tracking"
        actions={
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
              <FileDown className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
              <FileDown className="w-4 h-4" />
              Export Excel
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Active Cases"
          value={totalActivos.toLocaleString()}
          badge="+4.2%"
          badgeVariant="teal"
          icon={<Activity className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Serious Adverse Events"
          value={seriosTotal}
          badge="Alert"
          badgeVariant="red"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          accentColor="#ef4444"
        />
        <StatCard
          label="Avg Processing Time"
          value={processingTime}
          badge="-0.2d"
          badgeVariant="teal"
          icon={<Clock className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Signal Threshold"
          value={signalThreshold}
          badge="Verified"
          badgeVariant="teal"
          icon={<TrendingUp className="w-5 h-5 text-green-500" />}
          accentColor="#16a34a"
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Patient ID, Event, or Study..."
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Study</label>
            <select
              value={estudio}
              onChange={(e) => setEstudio(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors min-w-[160px]"
            >
              {estudios.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Severity</label>
            <select
              value={intensidad}
              onChange={(e) => setIntensidad(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            >
              {['All levels', 'Severo', 'Moderado', 'Leve'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Organ System</label>
            <select
              value={soc}
              onChange={(e) => setSoc(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            >
              {socs.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors">
            Apply Filters
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Case Report
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Event Type', 'Date Reported', 'Patient ID', 'Study', 'Intensity', 'Imputability', 'Action'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{e.tipo}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{e.SOC}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {new Date(e.fechaReportado).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-sm font-semibold text-[var(--brand-teal)]">{e.pacienteId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-mono text-xs font-medium text-[var(--foreground)] bg-[var(--muted)] px-2 py-1 rounded">
                      {e.estudio}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <SeverityBadge level={e.intensidad} />
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${imputabilidadStyle[e.imputabilidad] ?? 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {e.imputabilidad}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(e)}
                      className="flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-teal)] hover:underline"
                    >
                      <Eye className="w-4 h-4" />
                      Ver Caso
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No adverse events match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            Showing <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span> of{' '}
            <span className="font-semibold text-[var(--foreground)]">{totalActivos.toLocaleString()}</span> entries
          </p>
          <DataPagination current={page} total={321} onChange={setPage} />
        </div>
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Automated Signal Detection */}
        <div className="lg:col-span-2 bg-[var(--brand-teal)] rounded-xl p-6 flex items-start justify-between gap-6">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-2">Automated Signal Detection</h3>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Our curator AI has identified 3 new clusters of Cardiac events in the PV-2024-ALPHA study. Please review
              for potential regulatory submission.
            </p>
            <button className="px-4 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors">
              Review Signal Clusters
            </button>
          </div>
          <div className="hidden md:flex w-28 h-24 rounded-xl bg-white/10 items-center justify-center flex-shrink-0">
            <TrendingDown className="w-10 h-10 text-white/50" />
          </div>
        </div>

        {/* Surveillance Legend */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
            Surveillance Legend
          </p>
          <div className="flex flex-col gap-3">
            {[
              { color: 'bg-red-500', label: 'Severe: Immediate MedDRA reporting required' },
              { color: 'bg-amber-500', label: 'Moderate: Review within 48 hours' },
              { color: 'bg-slate-400', label: 'Mild: Baseline observational data' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${item.color}`} />
                <p className="text-sm text-[var(--foreground)] leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
