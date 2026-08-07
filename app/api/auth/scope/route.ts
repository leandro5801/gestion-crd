import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { strapi } from '@/lib/strapi/client'
import { buildScope, emptyScope } from '@/lib/auth/scope'
import type { AuthUser } from '@/lib/types'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null, scope: emptyScope(null) }, { status: 401 })

  const user = session.user as AuthUser

  // Preferred backend contract: Strapi resolves the investigator's effective scope
  // server-side and applies the same scope in its collection controllers/policies.
  try {
    const scoped = await strapi.raw<{ user?: AuthUser; scope?: Record<string, unknown> }>('/api/me/data-scope')
    return NextResponse.json({
      user: scoped.user ?? user,
      scope: buildScope(scoped.user ?? user, scoped.scope ?? {}),
    })
  } catch {
    // Compatibility fallback while the custom Strapi endpoint is being added.
    // The frontend can render the relations, but this fallback is not an authorization boundary.
    try {
      const populated = await strapi.raw<AuthUser>(
        '/api/users/me?populate[estudios]=*&populate[sitiosClinicos]=*&populate[sitios_clinicos]=*&populate[pacientes][populate][estudio]=*&populate[pacientes][populate][sitioClinico]=*'
      )
      return NextResponse.json({ user: populated, scope: buildScope(populated, populated as unknown as Record<string, unknown>) })
    } catch {
      return NextResponse.json({ user, scope: emptyScope(user) })
    }
  }
}
