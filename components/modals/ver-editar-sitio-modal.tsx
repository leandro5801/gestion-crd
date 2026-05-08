'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Save, MapPin, Users, FlaskConical, CheckCircle } from 'lucide-react'
import type { SitioClinico } from '@/lib/mock-data'

interface Props {
  sitio: SitioClinico | null
  onClose: () => void
}

export function VerEditarSitioModal({ sitio, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<SitioClinico | null>(null)

  useEffect(() => {
    if (sitio) { setForm({ ...sitio }); setEditing(false); setSaved(false) }
  }, [sitio])

  if (!sitio || !form) return null

  const handleSave = async () => {
    setSaving(true)
    // TODO: PUT /api/sitio-clinicos/:id — { data: form }
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const Field = ({ label, fkey, type = 'text' }: { label: string; fkey: keyof SitioClinico; type?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</label>
      {editing ? (
        <input
          type={type}
          value={String(form[fkey] ?? '')}
          onChange={(e) => setForm({ ...form, [fkey]: e.target.value })}
          className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
        />
      ) : (
        <p className="text-sm font-medium text-[var(--foreground)]">{String(form[fkey] ?? '—')}</p>
      )}
    </div>
  )

  const estadoOptions = ['Activo', 'Pendiente', 'Inactivo']
  const tipoOptions = ['General Hospital', 'Research Institute', 'University Poly', 'Private Clinic', 'Seville Research Foundation']

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--foreground)]">{form.nombre}</h2>
              <p className="text-xs text-[var(--muted-foreground)]">{form.codigo} · {editing ? 'Editando sitio' : 'Detalle del Sitio Clínico'}</p>
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
                <button onClick={() => { setForm({ ...sitio }); setEditing(false) }} className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Cancelar</button>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Nombre del Sitio" fkey="nombre" />
            <Field label="Código" fkey="codigo" />
          </div>
          <Field label="Ubicación" fkey="ubicacion" />
          <Field label="Investigador Principal" fkey="investigadorPrincipal" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Tipo de Centro</label>
              {editing ? (
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors">
                  {tipoOptions.map((t) => <option key={t}>{t}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.tipo}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estado</label>
              {editing ? (
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as SitioClinico['estado'] })} className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors">
                  {estadoOptions.map((s) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.estado}</p>
              )}
            </div>
          </div>

          <Field label="Última Actividad" fkey="ultimaActividad" type="date" />

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--muted)] rounded-xl">
            <div className="flex items-center gap-3">
              <FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />
              <div>
                <p className="text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Estudios Activos</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{form.estudiosActivos}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[var(--brand-teal)]" />
              <div>
                <p className="text-[11px] font-semibold uppercase text-[var(--muted-foreground)]">Total Pacientes</p>
                <p className="text-2xl font-bold text-[var(--foreground)]">{form.totalPacientes}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
