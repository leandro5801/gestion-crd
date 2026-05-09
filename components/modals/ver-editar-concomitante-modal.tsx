'use client'

import { useState, useEffect } from 'react'
import { X, Edit2, Save, Stethoscope, CheckCircle } from 'lucide-react'
import { type TratamientoConcomitante } from '@/lib/mock-data'
import { usePacientes } from '@/lib/api/pacientes'
import { useEstudios } from '@/lib/api/estudios'
import { updateTratamientoConcomitante } from '@/lib/api/concomitantes'

const selectCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors'
const inputCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors'
const readOnlyCls = 'w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--muted)] cursor-not-allowed'

const estadoStyle: Record<string, string> = {
  Activo: 'bg-green-50 text-green-700 border border-green-200',
  Finalizado: 'bg-slate-100 text-slate-600 border border-slate-200',
  Suspendido: 'bg-amber-50 text-amber-700 border border-amber-200',
}

interface Props {
  concomitante: TratamientoConcomitante | null
  onClose: () => void
}

export function VerEditarConcomitanteModal({ concomitante, onClose }: Props) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<TratamientoConcomitante | null>(null)
  const { data: pacientes = [] } = usePacientes()
  const { data: estudios = [] } = useEstudios()

  useEffect(() => {
    if (concomitante) { setForm({ ...concomitante }); setEditing(false); setSaved(false) }
  }, [concomitante])

  if (!concomitante || !form) return null

  // When patient changes, auto-fill estudio
  const handlePacienteChange = (codigoInclusion: string) => {
    const paciente = pacientes.find((p) => p.codigoInclusion === codigoInclusion)
    const estudio = paciente ? estudios.find((e) => e.codigoProtocolo === paciente.estudio) : null
    setForm((f) => f ? {
      ...f,
      pacienteId: codigoInclusion,
      iniciales: paciente?.iniciales ?? f.iniciales,
      estudio: estudio?.codigoProtocolo ?? f.estudio,
    } : f)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTratamientoConcomitante(concomitante.id, form)
      setSaving(false); setSaved(true); setEditing(false)
      setTimeout(() => setSaved(false), 2500)
    } catch (error) {
      console.error('Error saving concomitante:', error)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[var(--foreground)] truncate">{form.medicamento}</h2>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{form.pacienteId} · {editing ? 'Editando tratamiento' : 'Detalle Concomitante'}</p>
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
                <button onClick={() => { setForm({ ...concomitante }); setEditing(false) }} className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors">Cancelar</button>
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
          {/* Paciente — select with cascade */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Paciente</label>
            {editing ? (
              <select value={form.pacienteId} onChange={(e) => handlePacienteChange(e.target.value)} className={selectCls}>
                <option value="">Seleccionar paciente...</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.codigoInclusion}>{p.codigoInclusion} — {p.iniciales} ({p.estudio})</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">{form.pacienteId} ({form.iniciales})</p>
            )}
          </div>

          {/* Estudio — auto-filled, read-only when editing */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estudio</label>
            {editing ? (
              <input value={form.estudio} readOnly className={readOnlyCls} tabIndex={-1} />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">{form.estudio}</p>
            )}
          </div>

          {/* Medicamento (editable — concomitant can be anything) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Medicamento</label>
            {editing ? (
              <input value={form.medicamento} onChange={(e) => setForm({ ...form, medicamento: e.target.value })} className={inputCls} />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">{form.medicamento}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vía — select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Vía de Administración</label>
              {editing ? (
                <select value={form.via} onChange={(e) => setForm({ ...form, via: e.target.value })} className={selectCls}>
                  {['Oral', 'Intravenosa', 'Subcutánea', 'Intramuscular', 'Inhalatoria', 'Tópica', 'Transdérmica'].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">{form.via}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Dosis Diaria</label>
              {editing ? (
                <input value={form.dosisDiaria} onChange={(e) => setForm({ ...form, dosisDiaria: e.target.value })} className={inputCls} />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">{form.dosisDiaria}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Fecha Inicio</label>
              {editing ? (
                <input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} className={inputCls} />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">{form.fechaInicio}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Fecha Fin</label>
              {editing ? (
                <input type="date" value={form.fechaFin ?? ''} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} className={inputCls} />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">{form.fechaFin || '—'}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Motivo de Uso</label>
            {editing ? (
              <input value={form.motivoUso} onChange={(e) => setForm({ ...form, motivoUso: e.target.value })} className={inputCls} />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)] italic">{form.motivoUso}</p>
            )}
          </div>

          {/* Estado — select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Estado</label>
            {editing ? (
              <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value as TratamientoConcomitante['estado'] })} className={selectCls}>
                {['Activo', 'Finalizado', 'Suspendido'].map((s) => <option key={s}>{s}</option>)}
              </select>
            ) : (
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${estadoStyle[form.estado]}`}>{form.estado.toUpperCase()}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
