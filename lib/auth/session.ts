/**
 * Server-side session helpers. The session is a small JSON payload
 * (`{ jwt, user }`) stored as an httpOnly cookie. We never store it in
 * localStorage to avoid XSS exposure.
 */
import 'server-only'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, SESSION_TTL_DAYS } from '@/lib/strapi/config'
import type { AuthUser } from '@/lib/types'

export interface Session {
  jwt: string
  user: AuthUser
}

export async function getSession(): Promise<Session | null> {
  try {
    const store = await cookies()
    const raw = store.get(SESSION_COOKIE)?.value
    if (!raw) return null
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

export async function setSession(session: Session) {
  const store = await cookies()
  store.set({
    name: SESSION_COOKIE,
    value: JSON.stringify(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  })
}

export async function clearSession() {
  const store = await cookies()
  store.set({
    name: SESSION_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}
