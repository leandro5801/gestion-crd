'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Save, FlaskConical, AlertTriangle, Users, Calendar, CheckCircle } from 'lucide-react'
import type { Estudio } from '@/lib/mock-data'

const selectCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors'
const inputCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors'

interface Props {
  estudio: Estudio | null
  onClose: () => void
}

export function VerEditarEstudioModal({ estudio, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Estudio | null>(null)

  useEffect(() => {
    if (estudio) { setForm({ ...estudio }); setEditing(false); setSaved(false) }
  }, [estudio])

  if (!estudio || !form) return null

  const handleSave = async () => {
    setSaving(true)
    // TODO: PUT /api/estudios/:id — { data: form }
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const TextField = ({ label, fkey, type = 'text' }: { label: string; fkey: keyof Estudio; type?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</label>
      {editing ? (
        <input type={type} value={String(form[fkey] ?? '')} onChange={(e) => setForm({ ...form, [fkey]: e.target.value })} className={inputCls} />
      ) : (
        <p className="text-sm font-medium text-[var(--foreground)]">{String(form[fkey] ?? '—')}</p>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
              <FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--foreground)] truncate">{form.codigoProtocolo}</h2>
              <p className="text-xs text-[var(--muted-foreground)]">{editing ? 'Editando estudio' : 'Detalle del Estudio'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
            {saved && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--brand-teal)] border border-[var(--brand-teal)] rounded-lg hover:bg-[var(--brand-teal-muted)] transition-colors">
                <Edit2 className="w-3.5 h-3.5" /> Editar
              </button>
            ) : (
              <>
                <button onClick={() => { setForm({ ...estudio }); setEditing(false) }} className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Cancelar</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--brand-teal)] text-white rounded-lg hover:bg-[var(--brand-teal-dark)] disabled:opacity-60 transition-colors">
                  <Save className="w-3.5 h-3.5" />{saving ? 'Guardando...' : 'Guardar'}
                </button>
              </>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField label="Código Protocolo" fkey="codigoProtocolo" />
            <TextField label="Investigador Principal" fkey="pi" />
          </div>
          <TextField label="Título del Estudio" fkey="titulo" />
          <TextField label="Medicamento" fkey="medicamento" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Fase — select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Fase</label>
              {editing ? (
                <select value={form.fase} onChange={(e) => setForm({ ...form, fase: e.target.value })} className={selectCls}>
                  {['Fase I', 'Fase II', 'Fase III', 'Fase IV', 'Post-mercado'].map((f) => <option key={f}>{f}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.fase}</p>
              )}
            </div>
            {/* Estado — select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estado</label>
              {editing ? (
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Estudio['estado'] })} className={selectCls}>
                  {['Activo', 'Completado', 'Suspendido', 'En revisión'].map((s) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.estado}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField label="Fecha Inicio" fkey="fechaInicio" type="date" />
            <TextField label="Fecha Fin Vigilancia" fkey="fechaFinVigilancia" type="date" />
          </div>

          {/* Read-only metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <div className="text-center">
              <Users className="w-4 h-4 text-[var(--brand-teal)] mx-auto mb-1" />
              <p className="text-lg font-bold text-[var(--foreground)]">{form.totalPacientes.toLocaleString()}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">Pacientes</p>
            </div>
            <div className="text-center border-x border-[var(--border)]">
              <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-[var(--foreground)]">{form.eventosAdversos}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">Eventos Adv.</p>
            </div>
            <div className="text-center">
              <Calendar className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-[var(--foreground)]">{form.sitiosActivos}</p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">Sitios</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
