import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth/auth-provider'
import { getSession } from '@/lib/auth/session'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Alca Laboratorios — Farmacovigilancia',
  description: 'Plataforma integral de farmacovigilancia clínica y gestión de estudios.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#1b9fba',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider initialUser={session?.user ?? null}>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
