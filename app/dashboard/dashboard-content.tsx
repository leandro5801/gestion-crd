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
import {
  mockEnrolamiento,
  mockActividadReciente,
  mockEventosAdversos,
  type ActividadReciente,
} from '@/lib/mock-data'

const actividadIcon: Record<ActividadReciente['tipo'], React.ReactNode> = {
  sae: <ShieldAlert className="w-4 h-4 text-red-500" />,
  enrollment: <Users className="w-4 h-4 text-[var(--brand-teal)]" />,
  medication: <Pill className="w-4 h-4 text-amber-500" />,
  crd: <FileText className="w-4 h-4 text-slate-500" />,
  signal: <RefreshCw className="w-4 h-4 text-blue-500" />,
}

const actividadBg: Record<ActividadReciente['tipo'], string> = {
  sae: 'bg-red-50',
  enrollment: 'bg-[var(--brand-teal-muted)]',
  medication: 'bg-amber-50',
  crd: 'bg-slate-100',
  signal: 'bg-blue-50',
}

const casosRecientes = mockEventosAdversos.slice(0, 4).map((e) => ({
  subjectId: e.pacienteId,
  study: e.estudio,
  status: e.intensidad,
  lastEvent: e.tipo,
}))

export function DashboardContent() {
  const [page, setPage] = useState(1)

  const estudiosActivos = 12
  const totalPacientes = 1482
  const totalEA = 24
  const seriosEA = 3
  const medicacion = '8.5k'

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Estudios Activos"
          value={estudiosActivos}
          badge="+2 this quarter"
          badgeVariant="teal"
          icon={<FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Total Pacientes"
          value={totalPacientes.toLocaleString()}
          badge="+124 new"
          badgeVariant="teal"
          icon={<Users className="w-5 h-5 text-[var(--brand-teal)]" />}
          accentColor="var(--brand-teal)"
        />
        <StatCard
          label="Eventos Adversos"
          value={totalEA}
          badge={`${seriosEA} Serious/SAE`}
          badgeVariant="red"
          icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
          accentColor="#ef4444"
        />
        <StatCard
          label="Medicación Administrada"
          value={medicacion}
          badge="8.5k doses"
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
            <LineChart data={mockEnrolamiento} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
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

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-base text-[var(--foreground)]">Actividad Reciente</h2>
            <Link
              href="/eventos-adversos"
              className="text-xs text-[var(--brand-teal)] font-semibold hover:underline flex items-center gap-0.5"
            >
              Ver Todo <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            {mockActividadReciente.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${actividadBg[item.tipo]}`}
                >
                  {actividadIcon[item.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] leading-tight">{item.titulo}</p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-0.5 line-clamp-2">
                    {item.descripcion}
                  </p>
                  <p className="text-[10px] font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mt-1">
                    {item.tiempo}
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
            <button className="px-4 py-2 text-sm font-semibold bg-[var(--brand-teal)] text-white rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors">
              Nuevo Reporte
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Subject ID', 'Study', 'Status', 'Last Event', 'Actions'].map((h) => (
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
              {casosRecientes.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="px-5 py-4 text-sm font-semibold text-[var(--foreground)]">#{row.subjectId}</td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{row.study}</td>
                  <td className="px-5 py-4">
                    <SeverityBadge level={row.status} />
                  </td>
                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">{row.lastEvent}</td>
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
