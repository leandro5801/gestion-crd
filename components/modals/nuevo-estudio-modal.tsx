'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoEstudioModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    codigoProtocolo: '',
    titulo: '',
    medicamento: '',
    fase: '',
    fechaInicio: '',
    fechaFinVigilancia: '',
    pi: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/estudios con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo Estudio Clínico"
      subtitle="Complete los datos del protocolo de farmacovigilancia"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-white transition-colors"
          >
            Cancelar
          </button>
          <button
            form="nuevo-estudio-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Crear Estudio'
            )}
          </button>
        </>
      }
    >
      <form id="nuevo-estudio-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <FormField label="Código de Protocolo" required className="col-span-1">
          <input
            className={inputCls}
            placeholder="Ej: PV-2025-BETA"
            value={form.codigoProtocolo}
            onChange={(e) => update('codigoProtocolo', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Fase" required className="col-span-1">
          <select
            className={selectCls}
            value={form.fase}
            onChange={(e) => update('fase', e.target.value)}
            required
          >
            <option value="">Seleccionar fase...</option>
            {['Fase I', 'Fase II', 'Fase III', 'Fase IV', 'Post-mercado'].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Título del Estudio" required className="col-span-2">
          <input
            className={inputCls}
            placeholder="Descripción completa del protocolo..."
            value={form.titulo}
            onChange={(e) => update('titulo', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Medicamento / INN" required className="col-span-2">
          <input
            className={inputCls}
            placeholder="Ej: Enoxaparina 40mg"
            value={form.medicamento}
            onChange={(e) => update('medicamento', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Investigador Principal" required className="col-span-2">
          <input
            className={inputCls}
            placeholder="Nombre completo del PI"
            value={form.pi}
            onChange={(e) => update('pi', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Fecha de Inicio" required className="col-span-1">
          <input
            type="date"
            className={inputCls}
            value={form.fechaInicio}
            onChange={(e) => update('fechaInicio', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Fecha Fin de Vigilancia" required className="col-span-1">
          <input
            type="date"
            className={inputCls}
            value={form.fechaFinVigilancia}
            onChange={(e) => update('fechaFinVigilancia', e.target.value)}
            required
          />
        </FormField>
      </form>
    </Modal>
  )
}
