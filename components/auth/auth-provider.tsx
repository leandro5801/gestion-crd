'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { SWRConfig } from 'swr'
import { swrFetcher, ApiError } from '@/lib/strapi/fetcher'
import type { AuthUser } from '@/lib/types'

interface AuthState {
  user: AuthUser | null
  loading: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider />')
  return ctx
}

export function AuthProvider({ children, initialUser = null }: { children: ReactNode; initialUser?: AuthUser | null }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(initialUser)
  const [loading, setLoading] = useState(initialUser === null)

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include', cache: 'no-store' })
      if (!res.ok) {
        setUser(null)
        return
      }
      const data = await res.json()
      setUser(data.user ?? null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!initialUser) refresh()
  }, [initialUser, refresh])

  const login = useCallback(
    async (identifier: string, password: string) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new ApiError(data?.error || 'No se pudo iniciar sesión', res.status, data)
      setUser(data.user)
      router.refresh()
    },
    [router]
  )

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    setUser(null)
    router.replace('/login')
  }, [router])

  const value = useMemo<AuthState>(() => ({ user, loading, login, logout, refresh }), [user, loading, login, logout, refresh])

  return (
    <AuthContext.Provider value={value}>
      <SWRConfig
        value={{
          fetcher: swrFetcher,
          revalidateOnFocus: false,
          shouldRetryOnError: false,
          dedupingInterval: 4000,
        }}
      >
        {children}
      </SWRConfig>
    </AuthContext.Provider>
  )
}
