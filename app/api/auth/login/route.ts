import { NextResponse } from 'next/server'
import { strapi, StrapiHttpError } from '@/lib/strapi/client'
import { setSession } from '@/lib/auth/session'
import type { AuthUser } from '@/lib/types'

interface LoginPayload {
  identifier: string
  password: string
}

interface StrapiLoginResponse {
  jwt: string
  user: AuthUser
}

export async function POST(req: Request) {
  let payload: LoginPayload
  try {
    payload = (await req.json()) as LoginPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!payload.identifier || !payload.password) {
    return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 })
  }

  try {
    const data = await strapi.raw<StrapiLoginResponse>('/api/auth/local', {
      method: 'POST',
      body: payload,
      anonymous: true,
    })
    await setSession({ jwt: data.jwt, user: data.user })
    return NextResponse.json({ user: data.user })
  } catch (err) {
    if (err instanceof StrapiHttpError) {
      return NextResponse.json(
        { error: err.message || 'Credenciales inválidas' },
        { status: err.status >= 400 && err.status < 500 ? 401 : 500 }
      )
    }
    return NextResponse.json({ error: 'No se pudo iniciar sesión' }, { status: 500 })
  }
}
