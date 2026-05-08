'use client'

import { useState, useMemo } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { mockPacientes, mockEstudios } from '@/lib/mock-data'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoConcomitanteModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    pacienteId: '',
    estudio: '',
    medicamento: '',
    via: '',
    dosisDiaria: '',
    fechaInicio: '',
    fechaFin: '',
    sinFechaFin: false,
    motivoUso: '',
    estado: 'Activo',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  // When patient changes, auto-fill estudio from that patient's assigned study
  const handlePacienteChange = (codigoInclusion: string) => {
    const paciente = mockPacientes.find((p) => p.codigoInclusion === codigoInclusion)
    const estudio = paciente ? mockEstudios.find((e) => e.codigoProtocolo === paciente.estudio) : null
    setForm((f) => ({
      ...f,
      pacienteId: codigoInclusion,
      estudio: estudio?.codigoProtocolo ?? '',
    }))
  }

  const activePacientes = useMemo(() => mockPacientes.filter((p) => p.estado === 'Activo'), [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/tratamiento-concomitantes con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar Tratamiento Concomitante"
      subtitle="Medicamento adicional administrado durante el período del estudio"
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
            form="nuevo-concomitante-form"
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
              'Registrar Medicamento'
            )}
          </button>
        </>
      }
    >
      <form id="nuevo-concomitante-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Patient drives the study selection */}
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

        {/* Estudio auto-filled, read-only */}
        <FormField label="Estudio (asignado al paciente)" required className="col-span-1 sm:col-span-2">
          <input
            className={`${inputCls} bg-[var(--muted)] cursor-not-allowed`}
            value={form.estudio || '—'}
            readOnly
            tabIndex={-1}
          />
        </FormField>

        <FormField label="Nombre del Medicamento" required className="col-span-1 sm:col-span-2">
          <input
            className={inputCls}
            placeholder="Ej: Metformina 850mg"
            value={form.medicamento}
            onChange={(e) => update('medicamento', e.target.value)}
            required
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

        <FormField label="Dosis Diaria" required className="col-span-1">
          <input
            className={inputCls}
            placeholder="Ej: 1.7g (2 tabs/día)"
            value={form.dosisDiaria}
            onChange={(e) => update('dosisDiaria', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Motivo de Uso" required className="col-span-1 sm:col-span-2">
          <input
            className={inputCls}
            placeholder="Diagnóstico o indicación clínica"
            value={form.motivoUso}
            onChange={(e) => update('motivoUso', e.target.value)}
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

        <FormField label="Fecha de Fin" className="col-span-1">
          <input
            type="date"
            className={inputCls}
            value={form.fechaFin}
            onChange={(e) => update('fechaFin', e.target.value)}
            disabled={form.sinFechaFin as boolean}
          />
        </FormField>

        <div className="col-span-1 sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded accent-[var(--brand-teal)]"
              checked={form.sinFechaFin as boolean}
              onChange={(e) => update('sinFechaFin', e.target.checked)}
            />
            <span className="text-sm text-[var(--foreground)]">Tratamiento crónico (sin fecha de fin definida)</span>
          </label>
        </div>

        <FormField label="Estado" className="col-span-1 sm:col-span-2">
          <select
            className={selectCls}
            value={form.estado}
            onChange={(e) => update('estado', e.target.value)}
          >
            <option>Activo</option>
            <option>Finalizado</option>
            <option>Suspendido</option>
          </select>
        </FormField>

        <div className="col-span-1 sm:col-span-2 p-3 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-lg">
          <p className="text-xs text-[var(--brand-teal)] leading-relaxed">
            <span className="font-semibold">Recordatorio:</span> Toda interacción farmacológica sospechosa con el
            medicamento del estudio debe reportarse como Evento Adverso de Especial Interés (AESI) dentro de las 24h.
          </p>
        </div>
      </form>
    </Modal>
  )
}
