'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FlaskConical,
  Users,
  AlertTriangle,
  Pill,
  ArrowUpRight,
  FileText,
  ShieldAlert,
  RefreshCw,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { StatCard } from '@/components/ui/stat-card'
import { SeverityBadge } from '@/components/ui/status-badge'
import { DataPagination } from '@/components/ui/data-pagination'
import { useDashboardSummary } from '@/lib/api/dashboard'

export function DashboardContent() {
  const [page, setPage] = useState(1)
  const { summary, isLoading } = useDashboardSummary()

  const estudiosActivos = summary?.estudiosActivos ?? 0
  const totalPacientes = summary?.totalPacientes ?? 0
  const totalEA = summary?.eventosAdversos ?? 0
  const seriosEA = summary?.eventosSerios ?? 0
  const medicacion = summary?.medicacionAdministrada ?? 0
  const recentes = summary?.recentes ?? []
  const pacientesPorMes = summary?.pacientesPorMes ?? []

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Estudios Activos"
          value={isLoading ? '...' : estudiosActivos}
          badge="+2 this quarter"
          badgeVariant="teal"
          icon={<FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Total Pacientes"
          value={isLoading ? '...' : totalPacientes.toLocaleString()}
          badge="+124 new"
          badgeVariant="teal"
          icon={<Users className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Eventos Adversos"
          value={isLoading ? '...' : totalEA}
          badge={`${seriosEA} Serious/SAE`}
          badgeVariant="red"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          accentColor="#ef4444"
        />
        <StatCard
          label="Medicación Administrada"
          value={isLoading ? '...' : medicacion}
          badge="Registros"
          badgeVariant="amber"
          icon={<Pill className="w-5 h-5 text-amber-500" />}
          accentColor="#f59e0b"
        />
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Enrollment chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[var(--border)] p-5">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="font-semibold text-base text-[var(--foreground)]">Tendencias de Enrolamiento</h2>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                Comparativa de pacientes proyectados vs reales acumulados
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={pacientesPorMes} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f3f7" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6b7a8d' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7a8d' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                formatter={(value) => (value === 'real' ? 'Real' : 'Proyectado')}
              />
              <Line
                type="monotone"
                dataKey="real"
                stroke="var(--brand-teal)"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="proyectado"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent adverse events */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-[var(--foreground)]">Eventos Recientes</h2>
            <Link
              href="/eventos-adversos"
              className="text-xs text-[var(--brand-teal)] font-semibold hover:underline flex items-center gap-0.5"
            >
              Ver Todo <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {recentes.length === 0 && !isLoading && (
              <p className="text-sm text-[var(--muted-foreground)] italic text-center mt-4">
                No hay eventos recientes.
              </p>
            )}
            {recentes.map((e, i) => (
              <div key={e.id ?? i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${e.intensidad === 'Severo' ? 'bg-red-50' : e.intensidad === 'Moderado' ? 'bg-amber-50' : 'bg-slate-100'}`}>
                  <ShieldAlert className={`w-4 h-4 ${e.intensidad === 'Severo' ? 'text-red-500' : e.intensidad === 'Moderado' ? 'text-amber-500' : 'text-slate-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] leading-tight">
                    {e.SOC ?? 'Evento adverso'}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-0.5">
                    {e.gravedad} · {e.imputabilidad}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mt-1">
                    {e.intensidad}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent cases table */}
      <div className="bg-white rounded-xl border border-[var(--border)]">
        <div className="flex items-center justify-between p-5 pb-4 border-b border-[var(--border)]">
          <h2 className="font-semibold text-base text-[var(--foreground)]">Casos Revisados Recientemente</h2>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-medium border border-[var(--border)] rounded-lg text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
              Exportar
            </button>
            <Link
              href="/eventos-adversos"
              className="px-4 py-2 text-sm font-semibold bg-[var(--brand-teal)] text-white rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              Nuevo Reporte
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['SOC', 'Gravedad', 'Intensidad', 'Imputabilidad', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentes.slice(0, 4).map((e, i) => (
                <tr
                  key={e.id ?? i}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">{e.SOC ?? '—'}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{e.gravedad}</td>
                  <td className="px-5 py-4">
                    <SeverityBadge level={e.intensidad} />
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{e.imputabilidad}</td>
                  <td className="px-5 py-4">
                    <Link
                      href="/eventos-adversos"
                      className="text-sm font-semibold text-[var(--brand-teal)] hover:underline uppercase tracking-wide"
                    >
                      Review Case
                    </Link>
                  </td>
                </tr>
              ))}
              {recentes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]">
                    No hay casos recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 flex items-center justify-end">
          <DataPagination current={page} total={3} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}
