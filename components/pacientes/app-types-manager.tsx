'use client'

import { useState } from 'react'
import { X, Plus, Tags, Pencil, Check, Trash2 } from 'lucide-react'

// Default APP types seeded from common clinical antecedents
const DEFAULT_TYPES = [
  { id: 1, label: 'HTA', description: 'Hipertensión arterial', color: 'bg-blue-100 text-blue-700' },
  { id: 2, label: 'DM TIPO 2', description: 'Diabetes Mellitus Tipo 2', color: 'bg-amber-100 text-amber-700' },
  { id: 3, label: 'EPOC', description: 'Enfermedad Pulmonar Obstructiva Crónica', color: 'bg-orange-100 text-orange-700' },
  { id: 4, label: 'INS. RENAL', description: 'Insuficiencia Renal Crónica', color: 'bg-red-100 text-red-700' },
  { id: 5, label: 'CAR. PULMONAR', description: 'Carcinoma Pulmonar', color: 'bg-purple-100 text-purple-700' },
  { id: 6, label: 'MELANOMA', description: 'Melanoma', color: 'bg-slate-100 text-slate-700' },
]

type AppType = {
  id: number
  label: string
  description: string
  color: string
}

const COLOR_OPTIONS = [
  { value: 'bg-blue-100 text-blue-700', label: 'Azul' },
  { value: 'bg-teal-100 text-teal-700', label: 'Teal' },
  { value: 'bg-green-100 text-green-700', label: 'Verde' },
  { value: 'bg-amber-100 text-amber-700', label: 'Ámbar' },
  { value: 'bg-orange-100 text-orange-700', label: 'Naranja' },
  { value: 'bg-red-100 text-red-700', label: 'Rojo' },
  { value: 'bg-purple-100 text-purple-700', label: 'Morado' },
  { value: 'bg-slate-100 text-slate-700', label: 'Gris' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function AppTypesManager({ open, onClose }: Props) {
  const [types, setTypes] = useState<AppType[]>(DEFAULT_TYPES)
  const [newLabel, setNewLabel] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [editColor, setEditColor] = useState('')
  const [saving, setSaving] = useState(false)

  if (!open) return null

  const handleAdd = async () => {
    const label = newLabel.trim().toUpperCase()
    if (!label) return
    setSaving(true)
    // TODO: POST /api/app-types — { data: { label, description: newDesc, color: newColor } }
    await new Promise((r) => setTimeout(r, 400))
    setTypes([...types, { id: Date.now(), label, description: newDesc.trim(), color: newColor }])
    setNewLabel('')
    setNewDesc('')
    setNewColor(COLOR_OPTIONS[0].value)
    setSaving(false)
  }

  const handleStartEdit = (t: AppType) => {
    setEditingId(t.id)
    setEditLabel(t.label)
    setEditDesc(t.description)
    setEditColor(t.color)
  }

  const handleSaveEdit = async (id: number) => {
    setSaving(true)
    // TODO: PUT /api/app-types/:id — { data: { label: editLabel, description: editDesc, color: editColor } }
    await new Promise((r) => setTimeout(r, 400))
    setTypes(types.map((t) => t.id === id ? { ...t, label: editLabel.toUpperCase(), description: editDesc, color: editColor } : t))
    setEditingId(null)
    setSaving(false)
  }

  const handleDelete = async (id: number) => {
    // TODO: DELETE /api/app-types/:id
    setTypes(types.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center">
              <Tags className="w-4.5 h-4.5 text-[var(--brand-teal)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">Tipos de APP</h2>
              <p className="text-xs text-[var(--muted-foreground)]">Gestionar antecedentes patológicos disponibles</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
          {types.map((t) => (
            <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors group">
              {editingId === t.id ? (
                // Edit row
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Etiqueta"
                      className="flex-1 px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-sm font-semibold focus:outline-none focus:border-[var(--brand-teal)] transition-colors uppercase"
                    />
                    <select
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="px-2 py-1.5 border border-[var(--border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                    >
                      {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${t.color}`}>{t.label}</span>
                  <p className="text-sm text-[var(--muted-foreground)] truncate">{t.description || <em>Sin descripción</em>}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {editingId === t.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(t.id)}
                      disabled={saving}
                      className="p-1.5 rounded-lg bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleStartEdit(t)} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] opacity-0 group-hover:opacity-100 transition-all">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {types.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--muted-foreground)]">
              No hay tipos de APP registrados. Crea uno abajo.
            </div>
          )}
        </div>

        {/* Add new */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)] rounded-b-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">Nuevo Tipo de APP</p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Etiqueta (ej: ICC)"
                className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors uppercase placeholder:normal-case"
              />
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="px-2 py-2 border border-[var(--border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
              >
                {COLOR_OPTIONS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || saving}
              className="flex items-center justify-center gap-2 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Agregar Tipo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
