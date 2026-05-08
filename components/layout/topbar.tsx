'use client'

import { Bell, Settings, Search } from 'lucide-react'
import Image from 'next/image'
import { useAuth } from '@/components/auth/auth-provider'

interface TopbarProps {
  currentStudy?: string
  userName?: string
  userRole?: string
  userAvatar?: string
}

export function Topbar({
  currentStudy,
  userName,
  userRole,
  userAvatar,
}: TopbarProps) {
  const { user } = useAuth()
  const displayName = userName || user?.username || user?.email || 'Investigador'
  const displayRole = userRole || user?.role?.name || 'Pharmacovigilance'
  return (
    <header className="h-14 bg-white border-b border-[var(--border)] flex items-center px-6 gap-4 flex-shrink-0">
      {/* Brand text */}
      <div className="flex items-center gap-2 mr-2">
        <span className="font-bold text-base text-[var(--foreground)]">Clinical Curator</span>
      </div>

      {/* Current study pill */}
      {currentStudy && (
        <div className="hidden md:block">
          <span className="text-sm font-medium text-[var(--brand-teal)] border-b-2 border-[var(--brand-teal)] pb-0.5">
            Estudio actual: {currentStudy}
          </span>
        </div>
      )}

      {/* Search */}
      <div className="flex-1 max-w-md ml-auto hidden lg:flex items-center gap-2 bg-[var(--muted)] rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />
        <input
          type="text"
          placeholder="Buscar paciente, estudio o evento..."
          className="bg-transparent text-sm w-full outline-none text-[var(--foreground)] placeholder:text-[var(--muted-foreground)]"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-auto lg:ml-4">
        <button
          aria-label="Notificaciones"
          className="relative p-2 rounded-lg hover:bg-[var(--muted)] transition-colors"
        >
          <Bell className="w-5 h-5 text-[var(--muted-foreground)]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <button aria-label="Configuración" className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <Settings className="w-5 h-5 text-[var(--muted-foreground)]" />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-[var(--border)]">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-[var(--foreground)] leading-tight">{displayName}</p>
            <p className="text-xs text-[var(--muted-foreground)] uppercase tracking-wide leading-tight">{displayRole}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-[var(--brand-teal)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden">
            {userAvatar ? (
              <Image src={userAvatar} alt={displayName} width={36} height={36} className="w-full h-full object-cover" />
            ) : (
              displayName
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase() ?? '')
                .join('') || 'U'
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
