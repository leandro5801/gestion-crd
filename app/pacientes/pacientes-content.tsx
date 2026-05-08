'use client'

import { useState } from 'react'
import { Search, FileDown, Users, TrendingUp, UserPlus, ShieldCheck, Eye, Edit, Plus } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { StatCard } from '@/components/ui/stat-card'
import { StatusBadge } from '@/components/ui/status-badge'
import { DataPagination } from '@/components/ui/data-pagination'
import { NuevoPacienteModal } from '@/components/modals/nuevo-paciente-modal'
import { VerEditarPacienteModal } from '@/components/modals/ver-editar-paciente-modal'
import { AppTypesManager } from '@/components/pacientes/app-types-manager'
import { mockPacientes, type Paciente } from '@/lib/mock-data'

export function PacientesContent() {
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('Todos')
  const [sitio, setSitio] = useState('Todos')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState<Paciente | null>(null)
  const [showAppTypes, setShowAppTypes] = useState(false)

  const sitios = ['Todos', ...Array.from(new Set(mockPacientes.map((p) => p.sitioClinico)))]

  const filtered = mockPacientes.filter((p) => {
    const matchSearch =
      p.iniciales.toLowerCase().includes(search.toLowerCase()) ||
      p.codigoInclusion.toLowerCase().includes(search.toLowerCase())
    const matchEstado = estado === 'Todos' || p.estado === estado
    const matchSitio = sitio === 'Todos' || p.sitioClinico === sitio
    return matchSearch && matchEstado && matchSitio
  })

  const totalPacientes = 1284
  const enrolActivo = 892
  const nuevosRegistros = 54
  const integridad = '99.8%'

  const sexoColor = { M: 'bg-blue-100 text-blue-700', F: 'bg-pink-100 text-pink-700' }

  return (
    <>
    <NuevoPacienteModal open={showModal} onClose={() => setShowModal(false)} />
    <VerEditarPacienteModal paciente={selected} onClose={() => setSelected(null)} />
    <AppTypesManager open={showAppTypes} onClose={() => setShowAppTypes(false)} />
    <div className="p-6 flex flex-col gap-6">
      <PageHeader
        title="Gestión de Pacientes"
        subtitle={
          <>
            Registro centralizado y seguimiento clínico del estudio{' '}
            <span className="font-semibold text-[var(--brand-teal)]">PV-2024-ALPHA</span>
          </>
        }
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
          label="Total Pacientes"
          value={totalPacientes.toLocaleString()}
          badge="+4.2%"
          badgeVariant="teal"
          icon={<Users className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Enrolamiento Activo"
          value={enrolActivo}
          badge="Active"
          badgeVariant="teal"
          icon={<TrendingUp className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Nuevos Registros (Mes)"
          value={nuevosRegistros}
          badge="High"
          badgeVariant="amber"
          icon={<UserPlus className="w-5 h-5 text-amber-500" />}
          accentColor="#f59e0b"
        />
        <StatCard
          label="Integridad de Datos"
          value={integridad}
          badge="Verificado"
          badgeVariant="teal"
          icon={<ShieldCheck className="w-5 h-5 text-green-600" />}
          accentColor="#16a34a"
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
              placeholder="Filtrar por iniciales o código..."
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
              {['Todos', 'Activo', 'Suspendido', 'Fallecido', 'Completado'].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Sitio Clínico
            </label>
            <select
              value={sitio}
              onChange={(e) => setSitio(e.target.value)}
              className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            >
              {sitios.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <button className="px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors">
            Aplicar Filtros
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setShowAppTypes(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border border-[var(--brand-teal)] text-[var(--brand-teal)] rounded-lg hover:bg-[var(--brand-teal-muted)] transition-colors"
            >
              Tipos APP
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nuevo Registro
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Iniciales', 'Código de Inclusión', 'Edad / Sexo', 'APP (Antecedentes)', 'Sitio', 'Estado', 'Acciones'].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-[var(--brand-teal)]">{p.iniciales}</span>
                      </div>
                      <span className="text-sm font-semibold text-[var(--foreground)]">{p.iniciales}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-[var(--brand-teal)]">{p.codigoInclusion}</span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm text-[var(--foreground)]">{p.edad} años</p>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${sexoColor[p.sexo]}`}>
                      {p.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {p.diagnosticos.map((d) => (
                        <span key={d} className="text-[10px] font-semibold bg-[var(--muted)] text-[var(--muted-foreground)] px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {d}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-[var(--muted-foreground)]">{p.sitioClinico}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={p.estado} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(p)}
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
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]">
                    No se encontraron pacientes con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
          <p className="text-sm text-[var(--muted-foreground)]">
            Mostrando <span className="font-semibold text-[var(--foreground)]">1-{filtered.length}</span> de{' '}
            <span className="font-semibold text-[var(--foreground)]">{totalPacientes.toLocaleString()}</span> pacientes
          </p>
          <DataPagination current={page} total={129} onChange={setPage} />
        </div>
      </div>

      {/* Asistencia banner */}
      <div className="bg-[var(--brand-teal)] rounded-xl p-6 flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-2">Asistencia en Gestión de Pacientes</h3>
          <p className="text-white/80 text-sm leading-relaxed mb-4">
            ¿Necesita ayuda con el registro de nuevos pacientes o la actualización de historias clínicas? Acceda a
            nuestra guía de soporte técnico o contacte con el administrador del centro.
          </p>
          <button className="px-4 py-2 bg-white text-[var(--brand-teal)] text-sm font-semibold rounded-lg hover:bg-white/90 transition-colors">
            Ver Documentación
          </button>
        </div>
        <div className="hidden md:flex w-24 h-24 rounded-xl bg-white/10 items-center justify-center flex-shrink-0">
          <Users className="w-10 h-10 text-white/50" />
        </div>
      </div>
    </div>
    </>
  )
}
