'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Save, FileText, CheckCircle, XCircle } from 'lucide-react'
import { crdsApi } from '@/lib/api/crds'
import type { CRD, CRDEstado } from '@/lib/types'

interface Props {
  crd: CRD | null
  onClose: () => void
}

export function VerEditarCRDModal({ crd, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CRD | null>(null)

  useEffect(() => {
    if (crd) { setForm({ ...crd }); setEditing(false); setSaved(false); setError(null) }
  }, [crd])

  if (!crd || !form) return null

  const paciente = typeof form.paciente === 'object' ? form.paciente : null

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      await crdsApi.update(crd.id, {
        estado: form.estado,
        consentimientoFirmado: form.consentimientoFirmado,
        fechaCreacion: form.fechaCreacion,
      })
      setSaved(true)
      setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</span>
      <span className="text-sm font-medium text-[var(--foreground)]">{value}</span>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">
                CRD — {paciente?.codigoInclusion ?? `#${crd.id}`}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">{editing ? 'Editando registro' : 'Cuaderno de Recogida de Datos'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--brand-teal)] border border-[var(--brand-teal)] rounded-lg hover:bg-[var(--brand-teal-muted)] transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Editar
              </button>
            ) : (
              <>
                <button onClick={() => { setForm({ ...crd }); setEditing(false); setError(null) }} className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--brand-teal)] text-white rounded-lg hover:bg-[var(--brand-teal-dark)] disabled:opacity-60 transition-colors">
                  <Save className="w-3.5 h-3.5" />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Row label="Paciente" value={paciente?.codigoInclusion ?? '—'} />
            <Row label="Iniciales" value={paciente?.iniciales ?? '—'} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Fecha de Creación</label>
              {editing ? (
                <input
                  type="date"
                  value={form.fechaCreacion}
                  onChange={(e) => setForm({ ...form, fechaCreacion: e.target.value })}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">{form.fechaCreacion}</p>
              )}
            </div>
            {/* Estado CRD */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estado</label>
              {editing ? (
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as CRDEstado })}
                  className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                >
                  {['En curso', 'Completo', 'Bloqueado'].map((s) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.estado}</p>
              )}
            </div>
          </div>

          {/* Consentimiento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Consentimiento Informado</label>
            {editing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consentimientoFirmado}
                  onChange={(e) => setForm({ ...form, consentimientoFirmado: e.target.checked })}
                  className="w-4 h-4 accent-[var(--brand-teal)] rounded"
                />
                <span className="text-sm text-[var(--foreground)]">Consentimiento firmado</span>
              </label>
            ) : (
              <span className={`flex items-center gap-1.5 text-sm font-semibold ${form.consentimientoFirmado ? 'text-green-600' : 'text-red-500'}`}>
                {form.consentimientoFirmado ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {form.consentimientoFirmado ? 'Firmado' : 'Pendiente'}
              </span>
            )}
          </div>

          {/* Metrics read-only */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--muted)] rounded-xl">
            <Row label="Administraciones" value={<span className="text-lg font-bold text-[var(--foreground)]">{form.administraciones?.length ?? 0}</span>} />
            <Row label="Concomitantes" value={<span className="text-lg font-bold text-[var(--foreground)]">{form.concomitantes?.length ?? 0}</span>} />
          </div>
        </div>
      </div>
    </div>
  )
}
