import { cn } from '@/lib/utils'

type SeverityLevel = 'Severo' | 'Moderado' | 'Leve'
type StatusType =
  | 'Activo'
  | 'Suspendido'
  | 'Fallecido'
  | 'Completado'
  | 'En curso'
  | 'Completo'
  | 'Bloqueado'
  | 'Finalizado'
  | 'Inactivo'
  | 'Pendiente'
  | 'En revisión'
  | 'Administrado'
  | 'Omitido'
  | 'Pospuesto'
  | 'En seguimiento'
  | 'Resuelto'

const severityStyles: Record<SeverityLevel, string> = {
  Severo: 'bg-red-100 text-red-700 border border-red-200',
  Moderado: 'bg-amber-100 text-amber-700 border border-amber-200',
  Leve: 'bg-slate-100 text-slate-600 border border-slate-200',
}

const statusStyles: Record<string, string> = {
  Activo: 'bg-green-50 text-green-700 border border-green-200',
  Active: 'bg-green-50 text-green-700 border border-green-200',
  Suspendido: 'bg-amber-50 text-amber-700 border border-amber-200',
  Fallecido: 'bg-red-50 text-red-700 border border-red-200',
  Completado: 'bg-[var(--brand-teal-muted)] text-[var(--brand-teal)] border border-teal-200',
  'En curso': 'bg-blue-50 text-blue-700 border border-blue-200',
  Completo: 'bg-[var(--brand-teal-muted)] text-[var(--brand-teal)] border border-teal-200',
  Bloqueado: 'bg-red-50 text-red-700 border border-red-200',
  Finalizado: 'bg-slate-100 text-slate-600 border border-slate-200',
  Inactivo: 'bg-red-50 text-red-700 border border-red-200',
  Pendiente: 'bg-amber-50 text-amber-700 border border-amber-200',
  'En revisión': 'bg-purple-50 text-purple-700 border border-purple-200',
  Administrado: 'bg-green-50 text-green-700 border border-green-200',
  Omitido: 'bg-red-50 text-red-700 border border-red-200',
  Pospuesto: 'bg-amber-50 text-amber-700 border border-amber-200',
  'En seguimiento': 'bg-blue-50 text-blue-700 border border-blue-200',
  Resuelto: 'bg-green-50 text-green-700 border border-green-200',
} as Record<string, string>

interface SeverityBadgeProps {
  level: SeverityLevel | string
  dot?: boolean
  size?: 'sm' | 'md'
}

export function SeverityBadge({ level, dot = true, size = 'md' }: SeverityBadgeProps) {
  const style = severityStyles[level as SeverityLevel] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
  const dotColor =
    level === 'Severo'
      ? 'bg-red-500'
      : level === 'Moderado'
      ? 'bg-amber-500'
      : 'bg-slate-400'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        style
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor)} />}
      {level}
    </span>
  )
}

interface StatusBadgeProps {
  status: StatusType | string
  dot?: boolean
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, dot = true, size = 'md' }: StatusBadgeProps) {
  const style = statusStyles[status] ?? 'bg-slate-100 text-slate-600 border border-slate-200'
  const dotColor =
    status === 'Activo' || status === 'Administrado' || status === 'Resuelto' || status === 'Completo' || status === 'Completado'
      ? 'bg-green-500'
      : status === 'Suspendido' || status === 'Pendiente' || status === 'Pospuesto'
      ? 'bg-amber-500'
      : status === 'Fallecido' || status === 'Bloqueado' || status === 'Inactivo' || status === 'Omitido'
      ? 'bg-red-500'
      : status === 'En curso' || status === 'En seguimiento'
      ? 'bg-blue-500'
      : 'bg-slate-400'

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]',
        style
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor)} />}
      {status}
    </span>
  )
}
