'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import useSWR, { mutate as globalMutate } from 'swr'
import { useAuth } from '@/components/auth/auth-provider'
import { apiFetch, strapiKey } from '@/lib/strapi/fetcher'
import { flattenPaginated } from '@/lib/strapi/mappers'
import { buildScope, emptyScope, ALL_STUDIES_VALUE, type AuthScopeResponse, type StudyScope } from '@/lib/auth/scope'
import type { Estudio, ID, Paginated } from '@/lib/types'

interface StudyScopeState {
  scope: StudyScope
  studies: Estudio[]
  selectedStudyId: string
  selectedStudy: Estudio | null
  setSelectedStudyId: (value: string) => void
  isLoading: boolean
}

const StudyScopeContext = createContext<StudyScopeState | undefined>(undefined)

export function useStudyScope() {
  const context = useContext(StudyScopeContext)
  if (!context) throw new Error('useStudyScope must be used inside <StudyScopeProvider />')
  return context
}

function idMatches(value: ID | undefined, selected: string) {
  return value != null && String(value) === selected
}

export function StudyScopeProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const { data: scopeData, isLoading: scopeLoading } = useSWR<AuthScopeResponse>(
    user ? '/api/auth/scope' : null,
    (url: string) => apiFetch<AuthScopeResponse>(url),
    { revalidateOnFocus: false, shouldRetryOnError: false }
  )
  const isInvestigator = scopeData?.scope?.isInvestigator ?? user?.role?.name?.toLowerCase() === 'medico-investigador'
  const { data: allStudiesData, isLoading: allStudiesLoading } = useSWR<Paginated<Estudio>>(
    user && !isInvestigator ? strapiKey('estudios', { pagination: { page: 1, pageSize: 100 }, globalStudyFilter: false }) : null,
    async (url: string) => flattenPaginated<Estudio>(await apiFetch(url)),
    { revalidateOnFocus: false }
  )

  const scope = scopeData?.scope ?? emptyScope(user)
  const studies = isInvestigator ? scope.estudios : allStudiesData?.data ?? []
  const [selectedStudyId, setSelectedStudyIdState] = useState(ALL_STUDIES_VALUE)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (scope.isInvestigator) {
      window.sessionStorage.setItem('investigator-scope', JSON.stringify(scope))
      window.sessionStorage.setItem('investigator-read-only', 'true')
    } else {
      window.sessionStorage.removeItem('investigator-scope')
      window.sessionStorage.removeItem('investigator-read-only')
    }
  }, [scope])

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('estudio')
    const fromSession = window.sessionStorage.getItem('selected-study-id')
    setSelectedStudyIdState(fromUrl || fromSession || ALL_STUDIES_VALUE)
  }, [])

  useEffect(() => {
    if (isInvestigator && scopeLoading) return
    if (selectedStudyId !== ALL_STUDIES_VALUE && !studies.some((study) => idMatches(study.id, selectedStudyId) || idMatches(study.documentId, selectedStudyId))) {
      setSelectedStudyIdState(ALL_STUDIES_VALUE)
    }
  }, [isInvestigator, scopeLoading, selectedStudyId, studies])

  const setSelectedStudyId = useCallback((value: string) => {
    setSelectedStudyIdState(value || ALL_STUDIES_VALUE)
    window.sessionStorage.setItem('selected-study-id', value || ALL_STUDIES_VALUE)
    const url = new URL(window.location.href)
    if (!value || value === ALL_STUDIES_VALUE) url.searchParams.delete('estudio')
    else url.searchParams.set('estudio', value)
    window.history.replaceState({}, '', url)
    void globalMutate((key) => typeof key === 'string' && (key.startsWith('/api/strapi/') || key.startsWith('dashboard:summary')), undefined, { revalidate: true })
  }, [])

  const selectedStudy = studies.find((study) => idMatches(study.id, selectedStudyId) || idMatches(study.documentId, selectedStudyId)) ?? null
  const value = useMemo<StudyScopeState>(() => ({
    scope,
    studies,
    selectedStudyId,
    selectedStudy,
    setSelectedStudyId,
    isLoading: authLoading || scopeLoading || allStudiesLoading,
  }), [scope, studies, selectedStudyId, selectedStudy, setSelectedStudyId, authLoading, scopeLoading, allStudiesLoading])

  return <StudyScopeContext.Provider value={value}>{children}</StudyScopeContext.Provider>
}
