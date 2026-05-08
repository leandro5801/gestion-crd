/**
 * Centralised Strapi configuration.
 *
 * The browser never talks to Strapi directly. Every request is proxied through
 * Next.js routes living under `/api/*` so the JWT (stored in an httpOnly cookie)
 * never leaves the server. This keeps the integration secure for a clinical
 * pharmacovigilance system.
 *
 * Environment variables:
 *   STRAPI_URL              - Internal Strapi URL the Next.js server uses (server-only)
 *   NEXT_PUBLIC_STRAPI_URL  - Optional, only if you ever need the URL on the client
 *   STRAPI_API_TOKEN        - Optional fallback API token used when no user is logged in
 */
export const STRAPI_URL =
  process.env.STRAPI_URL ||
  process.env.NEXT_PUBLIC_STRAPI_URL ||
  'http://localhost:1337'

export const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''

export const SESSION_COOKIE = 'pv_session'
export const SESSION_TTL_DAYS = 7

export const PROXY_BASE = '/api/strapi'
