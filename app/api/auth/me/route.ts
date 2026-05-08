import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { strapi } from '@/lib/strapi/client'
import type { AuthUser } from '@/lib/types'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 })
  }
  try {
    // Refresh the user from Strapi so role / blocked status are up to date.
    const user = await strapi.raw<AuthUser>('/api/users/me?populate=role')
    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ user: session.user })
  }
}
