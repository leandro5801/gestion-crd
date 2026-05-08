'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { mockPacientes, mockEstudios } from '@/lib/mock-data'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoCRDModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    pacienteId: '',
    estudio: '',
    consentimientoFirmado: false,
    observaciones: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/crds con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo Cuaderno de Recogida de Datos"
      subtitle="Crear un CRD digital para un sujeto de estudio"
      size="md"
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
            form="nuevo-crd-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creando CRD...
              </>
            ) : (
              'Crear CRD'
            )}
          </button>
        </>
      }
    >
      <form id="nuevo-crd-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Paciente" required>
          <select
            className={selectCls}
            value={form.pacienteId}
            onChange={(e) => update('pacienteId', e.target.value)}
            required
          >
            <option value="">Seleccionar paciente...</option>
            {mockPacientes.map((p) => (
              <option key={p.id} value={p.codigoInclusion}>
                {p.codigoInclusion} — {p.iniciales}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Estudio Clínico" required>
          <select
            className={selectCls}
            value={form.estudio}
            onChange={(e) => update('estudio', e.target.value)}
            required
          >
            <option value="">Seleccionar estudio...</option>
            {mockEstudios.map((e) => (
              <option key={e.id} value={e.codigoProtocolo}>
                {e.codigoProtocolo} — {e.titulo}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Observaciones iniciales">
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Notas clínicas relevantes al momento de apertura del CRD..."
            value={form.observaciones}
            onChange={(e) => update('observaciones', e.target.value)}
          />
        </FormField>

        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-[var(--border)] accent-[var(--brand-teal)]"
            checked={form.consentimientoFirmado}
            onChange={(e) => update('consentimientoFirmado', e.target.checked)}
          />
          <div>
            <p className="text-sm font-medium text-[var(--foreground)]">Consentimiento Informado Firmado</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              Confirma que el paciente ha firmado el consentimiento informado (ICH E6-R2)
            </p>
          </div>
        </label>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700">Importante</p>
          <p className="text-xs text-amber-600 mt-0.5">
            No se puede registrar datos clínicos en el CRD sin consentimiento informado firmado.
          </p>
        </div>
      </form>
    </Modal>
  )
}
