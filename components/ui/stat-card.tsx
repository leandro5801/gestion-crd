import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  badge?: string
  badgeVariant?: 'teal' | 'red' | 'amber' | 'green' | 'gray' | 'blue'
  icon?: ReactNode
  accentColor?: string
  className?: string
}

const badgeVariants = {
  teal: 'bg-[var(--brand-teal-muted)] text-[var(--brand-teal)]',
  red: 'bg-red-50 text-red-600',
  amber: 'bg-amber-50 text-amber-600',
  green: 'bg-green-50 text-green-600',
  gray: 'bg-slate-100 text-slate-500',
  blue: 'bg-blue-50 text-blue-600',
}

export function StatCard({ label, value, badge, badgeVariant = 'teal', icon, accentColor, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[var(--border)] p-5 flex flex-col gap-2 relative overflow-hidden',
        className
      )}
    >
      {/* Accent bar */}
      {accentColor && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: accentColor }}
        />
      )}

      <div className="flex items-start justify-between gap-2">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        )}
        {badge && (
          <span
            className={cn(
              'ml-auto text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap',
              badgeVariants[badgeVariant]
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] leading-none mb-1">
          {label}
        </p>
        <p className="text-3xl font-bold text-[var(--foreground)] leading-none">{value}</p>
      </div>
    </div>
  )
}
