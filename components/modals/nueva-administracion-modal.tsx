'use client'

import { useState, useMemo } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { mockPacientes, mockEstudios } from '@/lib/mock-data'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevaAdministracionModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    pacienteId: '',
    estudio: '',
    medicamento: '',
    via: '',
    dosis: '',
    fechaAdministracion: '',
    estado: 'Administrado',
    observacion: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  // When patient changes, auto-fill estudio and medicamento from that patient's study
  const handlePacienteChange = (codigoInclusion: string) => {
    const paciente = mockPacientes.find((p) => p.codigoInclusion === codigoInclusion)
    const estudio = paciente ? mockEstudios.find((e) => e.codigoProtocolo === paciente.estudio) : null
    setForm((f) => ({
      ...f,
      pacienteId: codigoInclusion,
      estudio: estudio?.codigoProtocolo ?? '',
      medicamento: estudio?.medicamento ?? '',
    }))
  }

  // Patients filtered to only active
  const activePacientes = useMemo(() => mockPacientes.filter((p) => p.estado === 'Activo'), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/administracion-medicamentos con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar Nueva Administración"
      subtitle="Registro de administración del medicamento del estudio"
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
            form="nueva-adm-form"
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
              'Registrar Administración'
            )}
          </button>
        </>
      }
    >
      <form id="nueva-adm-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Select patient — drives everything else */}
        <FormField label="Paciente" required className="col-span-1 sm:col-span-2">
          <select
            className={selectCls}
            value={form.pacienteId}
            onChange={(e) => handlePacienteChange(e.target.value)}
            required
          >
            <option value="">Seleccionar paciente activo...</option>
            {activePacientes.map((p) => (
              <option key={p.id} value={p.codigoInclusion}>
                {p.codigoInclusion} — {p.iniciales} ({p.estudio})
              </option>
            ))}
          </select>
        </FormField>

        {/* Step 2: Estudio auto-filled from patient, read-only */}
        <FormField label="Estudio (asignado al paciente)" required className="col-span-1">
          <input
            className={`${inputCls} bg-[var(--muted)] cursor-not-allowed`}
            value={form.estudio || '—'}
            readOnly
            tabIndex={-1}
          />
        </FormField>

        {/* Step 3: Medicamento auto-filled from study, read-only */}
        <FormField label="Medicamento del Estudio" required className="col-span-1">
          <input
            className={`${inputCls} bg-[var(--muted)] cursor-not-allowed`}
            value={form.medicamento || '—'}
            readOnly
            tabIndex={-1}
          />
        </FormField>

        <FormField label="Vía de Administración" required className="col-span-1">
          <select
            className={selectCls}
            value={form.via}
            onChange={(e) => update('via', e.target.value)}
            required
          >
            <option value="">Seleccionar vía...</option>
            {['Oral', 'Intravenosa', 'Subcutánea', 'Intramuscular', 'Inhalatoria', 'Tópica', 'Transdérmica'].map(
              (v) => <option key={v}>{v}</option>
            )}
          </select>
        </FormField>

        <FormField label="Dosis Administrada" required className="col-span-1">
          <input
            className={inputCls}
            placeholder="Ej: 40mg"
            value={form.dosis}
            onChange={(e) => update('dosis', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Fecha de Administración" required className="col-span-1">
          <input
            type="date"
            className={inputCls}
            value={form.fechaAdministracion}
            onChange={(e) => update('fechaAdministracion', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Estado" className="col-span-1">
          <select
            className={selectCls}
            value={form.estado}
            onChange={(e) => update('estado', e.target.value)}
          >
            <option>Administrado</option>
            <option>Omitido</option>
            <option>Pospuesto</option>
          </select>
        </FormField>

        <FormField label="Observaciones" className="col-span-1 sm:col-span-2">
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            placeholder="Notas adicionales (reacciones, motivo de omisión, etc.)"
            value={form.observacion}
            onChange={(e) => update('observacion', e.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  )
}
