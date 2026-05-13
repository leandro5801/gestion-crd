'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const { login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login(identifier, password)
      const next = params.get('next') || '/dashboard'
      router.replace(next)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Credenciales incorrectas'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-[var(--brand-teal)] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/5" />

        <div className="relative flex items-center gap-3">
          <Image src="/alca-logo.png" alt="Alca Laboratorios" width={44} height={44} className="object-contain" />
          <div>
            <p className="font-bold text-lg text-white leading-tight">Alca Laboratorios</p>
            <p className="text-xs text-white/70 uppercase tracking-widest">Farmacovigilancia</p>
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight text-balance mb-4">
            Vigilancia farmacológica de precisión
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-10 text-balance">
            Plataforma integral para la gestión de estudios clínicos, eventos adversos y seguimiento de pacientes en tiempo real.
          </p>

          <div className="flex flex-col gap-4">
            {[
              { label: 'Detección automática de señales SAE', detail: 'Alerta inmediata ante eventos graves' },
              { label: 'CRD digital integrado', detail: 'Cuaderno de recogida de datos en la nube' },
              { label: 'Dashboard ejecutivo en tiempo real', detail: 'Métricas de enrolamiento y seguridad' },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-white/60 text-xs">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-white/70 text-xs">
            Sistema certificado para estudios clínicos. Cumplimiento GCP-ICH y RGPD.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="flex lg:hidden items-center gap-2.5 mb-10">
          <Image src="/alca-logo.png" alt="Alca Laboratorios" width={40} height={40} className="object-contain" />
          <div>
            <p className="font-bold text-base text-[var(--foreground)]">Alca Laboratorios</p>
            <p className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-widest">Farmacovigilancia</p>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-1">Iniciar sesión</h2>
            <p className="text-[var(--muted-foreground)] text-sm">Acceda a su cuenta de farmacovigilancia</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="identifier" className="text-sm font-medium text-[var(--foreground)]">
                Usuario o correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                  id="identifier"
                  type="text"
                  autoComplete="username"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="investigador@hospital.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/30 focus:border-[var(--brand-teal)] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-[var(--foreground)]">
                  Contraseña
                </label>
                <Link href="#" className="text-xs text-[var(--brand-teal)] hover:underline font-medium">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/30 focus:border-[var(--brand-teal)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-[var(--border)] accent-[var(--brand-teal)]" />
              <span className="text-sm text-[var(--muted-foreground)]">Mantener sesión iniciada</span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 w-full py-3 bg-[var(--brand-teal)] hover:bg-[var(--brand-teal-dark)] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                <>
                  Ingresar al sistema
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--muted-foreground)] mt-8">
            ¿Problemas de acceso? Contacte al{' '}
            <Link href="#" className="text-[var(--brand-teal)] hover:underline font-medium">
              administrador del sistema
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
