'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FlaskConical,
  FileText,
  Users,
  MapPin,
  AlertTriangle,
  Pill,
  Stethoscope,
  HelpCircle,
  LogOut,
  Plus,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/components/auth/auth-provider'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/estudios', label: 'Estudios', icon: FlaskConical },
  { href: '/crd', label: 'CRD', icon: FileText },
  { href: '/pacientes', label: 'Pacientes', icon: Users },
  { href: '/sitios-clinicos', label: 'Sitios Clínicos', icon: MapPin },
  { href: '/eventos-adversos', label: 'Eventos Adversos', icon: AlertTriangle },
  { href: '/administracion-medicamentos', label: 'Administración de Medicamentos', icon: Pill },
  { href: '/tratamiento-concomitante', label: 'Tratamiento Concomitante', icon: Stethoscope },
]

const ctaByPath: Record<string, { label: string }> = {
  '/pacientes': { label: 'Nuevo Registro' },
  '/sitios-clinicos': { label: 'Registrar Nuevo Sitio' },
  '/eventos-adversos': { label: 'New Case Report' },
  '/estudios': { label: 'Nuevo Estudio' },
  '/crd': { label: 'Nuevo CRD' },
  '/administracion-medicamentos': { label: 'Nueva Administración' },
  '/tratamiento-concomitante': { label: 'Registrar Medicamento' },
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const ctaEntry = Object.entries(ctaByPath).find(([key]) => pathname.startsWith(key))
  const cta = ctaEntry ? ctaEntry[1] : null

  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[var(--sidebar-border)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-[var(--foreground)] leading-tight">PV Manager</p>
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest leading-tight">
              Precision Safety
            </p>
          </div>
        </div>
        {/* Close button only on mobile */}
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 rounded text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                isActive
                  ? 'bg-[var(--brand-teal)] text-white shadow-sm'
                  : 'text-[var(--sidebar-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--brand-teal)]'
              )}
            >
              <Icon className={cn('w-4 h-4 flex-shrink-0 transition-colors', isActive ? 'text-white' : 'text-[var(--muted-foreground)] group-hover:text-[var(--brand-teal)]')} />
              <span className="leading-tight">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* CTA button */}
      {cta && (
        <div className="px-3 pb-4">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            {cta.label}
          </button>
        </div>
      )}

      {/* Footer links */}
      <div className="px-3 py-4 border-t border-[var(--sidebar-border)] flex flex-col gap-0.5">
        <Link href="/soporte" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--sidebar-accent)] hover:text-[var(--brand-teal)] transition-all">
          <HelpCircle className="w-4 h-4" />
          Centro de Ayuda
        </Link>
        <button
          type="button"
          onClick={() => {
            onClose?.()
            void logout()
          }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all text-left"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile hamburger button — shown on small screens */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3.5 left-4 z-40 p-2 rounded-lg bg-white border border-[var(--border)] shadow-sm text-[var(--foreground)]"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={cn(
        'lg:hidden fixed top-0 left-0 z-50 h-full w-[240px] bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] transition-transform duration-300',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <SidebarContent onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-[220px] min-h-screen bg-[var(--sidebar)] border-r border-[var(--sidebar-border)] flex-col flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
