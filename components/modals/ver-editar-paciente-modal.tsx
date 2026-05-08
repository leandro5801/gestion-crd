'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Edit2, Save, User, AlertTriangle, CheckCircle } from 'lucide-react'
import { mockEstudios, mockSitiosClinicos, type Paciente } from '@/lib/mock-data'

const selectCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors'
const inputCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors'

interface Props {
  paciente: Paciente | null
  onClose: () => void
}

export function VerEditarPacienteModal({ paciente, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Paciente | null>(null)
  const [diagInput, setDiagInput] = useState('')

  useEffect(() => {
    if (paciente) { setForm({ ...paciente, diagnosticos: [...paciente.diagnosticos] }); setEditing(false); setSaved(false) }
  }, [paciente])

  if (!paciente || !form) return null

  const handleSave = async () => {
    setSaving(true)
    // TODO: PUT /api/pacientes/:id — { data: form }
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false); setSaved(true); setEditing(false)
    setTimeout(() => setSaved(false), 2500)
  }

  const addDiag = () => {
    const d = diagInput.trim().toUpperCase()
    if (d && !form.diagnosticos.includes(d)) {
      setForm({ ...form, diagnosticos: [...form.diagnosticos, d] })
    }
    setDiagInput('')
  }

  const removeDiag = (d: string) => setForm({ ...form, diagnosticos: form.diagnosticos.filter((x) => x !== d) })

  const activeEstudios = useMemo(() => mockEstudios.filter((e) => e.estado === 'Activo'), [])
  const activeSitios = useMemo(() => mockSitiosClinicos.filter((s) => s.estado === 'Activo'), [])
  const sexoColor = { M: 'bg-blue-100 text-blue-700', F: 'bg-pink-100 text-pink-700' }

  const Field = ({ label, fkey, type = 'text' }: { label: string; fkey: keyof Paciente; type?: string }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">{label}</label>
      {editing ? (
        <input
          type={type}
          value={String(form[fkey] ?? '')}
          onChange={(e) => setForm({ ...form, [fkey]: type === 'number' ? Number(e.target.value) : e.target.value })}
          className={inputCls}
        />
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
              <User className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--foreground)]">{form.iniciales}</h2>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sexoColor[form.sexo]}`}>
                  {form.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{form.codigoInclusion} · {editing ? 'Editando paciente' : 'Detalle del Paciente'}</p>
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
                <button onClick={() => { setForm({ ...paciente, diagnosticos: [...paciente.diagnosticos] }); setEditing(false) }} className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Cancelar</button>
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
            <Field label="Código de Inclusión" fkey="codigoInclusion" />
            <Field label="Iniciales" fkey="iniciales" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-5">
            <Field label="Edad" fkey="edad" type="number" />
            <Field label="Peso (kg)" fkey="pesoKg" type="number" />
            <Field label="Talla (cm)" fkey="tallaCm" type="number" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Sexo — select when editing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Sexo</label>
              {editing ? (
                <select value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value as 'M' | 'F' })} className={selectCls}>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              ) : (
                <span className={`text-[10px] font-bold px-2 py-1 rounded w-fit ${sexoColor[form.sexo]}`}>{form.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}</span>
              )}
            </div>
            {/* Estado — select when editing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estado</label>
              {editing ? (
                <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as Paciente['estado'] })} className={selectCls}>
                  {['Activo', 'Suspendido', 'Fallecido', 'Completado'].map((s) => <option key={s}>{s}</option>)}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.estado}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Estudio — select when editing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estudio</label>
              {editing ? (
                <select value={form.estudio} onChange={(e) => setForm({ ...form, estudio: e.target.value })} className={selectCls}>
                  <option value="">Seleccionar estudio...</option>
                  {activeEstudios.map((e) => (
                    <option key={e.id} value={e.codigoProtocolo}>{e.codigoProtocolo} — {e.titulo}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.estudio || '—'}</p>
              )}
            </div>
            {/* Sitio — select when editing */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Sitio Clínico</label>
              {editing ? (
                <select value={form.sitioClinico} onChange={(e) => setForm({ ...form, sitioClinico: e.target.value })} className={selectCls}>
                  <option value="">Seleccionar sitio...</option>
                  {activeSitios.map((s) => (
                    <option key={s.id} value={s.codigo}>{s.codigo} — {s.nombre}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium">{form.sitioClinico || '—'}</p>
              )}
            </div>
          </div>
          <Field label="Fecha de Inclusión" fkey="fechaInclusion" type="date" />

          {/* APP / Diagnósticos */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">APP / Antecedentes Patológicos</label>
            <div className="flex flex-wrap gap-1.5">
              {form.diagnosticos.map((d) => (
                <span key={d} className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[var(--muted)] text-[var(--foreground)] px-2 py-1 rounded-full uppercase">
                  {d}
                  {editing && (
                    <button onClick={() => removeDiag(d)} className="ml-0.5 hover:text-red-500 transition-colors leading-none">&times;</button>
                  )}
                </span>
              ))}
              {form.diagnosticos.length === 0 && <p className="text-sm text-[var(--muted-foreground)] italic">Sin antecedentes registrados</p>}
            </div>
            {editing && (
              <div className="flex gap-2 mt-1">
                <input
                  value={diagInput}
                  onChange={(e) => setDiagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addDiag())}
                  placeholder="Ej: HTA, DM TIPO 2..."
                  className={inputCls}
                />
                <button type="button" onClick={addDiag} className="px-3 py-2 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors flex-shrink-0">Añadir</button>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="p-4 bg-[var(--muted)] rounded-xl flex items-center gap-4">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${form.eventosAdversos > 0 ? 'text-red-500' : 'text-slate-400'}`} />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Eventos Adversos registrados</p>
              <p className={`text-2xl font-bold ${form.eventosAdversos > 0 ? 'text-red-600' : 'text-[var(--foreground)]'}`}>{form.eventosAdversos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
