'use client'

import { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { mockEstudios, mockPacientes } from '@/lib/mock-data'

interface Props {
  open: boolean
  onClose: () => void
}

const SOC_LIST = [
  'Blood Disorders',
  'Cardiac Disorders',
  'General Disorders',
  'Immune System',
  'Nervous System',
  'Respiratory Disorders',
  'Skin & Subcutaneous',
  'Gastrointestinal Disorders',
  'Hepatobiliary Disorders',
  'Renal & Urinary Disorders',
]

export function NuevoEventoModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    tipo: '',
    SOC: '',
    pacienteId: '',
    estudio: '',
    intensidad: '',
    gravedad: '',
    imputabilidad: '',
    fechaInicio: '',
    fechaFin: '',
    ongoing: false,
    suspensionTratamiento: false,
    descripcion: '',
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

  // Patients filtered to active only
  const activePacientes = useMemo(() => mockPacientes.filter((p) => p.estado === 'Activo'), [])

  const isSevero = form.intensidad === 'Severo'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/eventos-adversos con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo Evento Adverso"
      subtitle="Reportar un evento adverso según criterios MedDRA / ICH E2A"
      size="xl"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[var(--foreground)] border border-[var(--border)] rounded-lg hover:bg-white transition-colors"
          >
            Descartar
          </button>
          <button
            form="nuevo-evento-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Reportando...
              </>
            ) : (
              'Validar & Reportar'
            )}
          </button>
        </>
      }
    >
      <form id="nuevo-evento-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* SAE Alert */}
        {isSevero && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Alerta SAE — Evento Adverso Serio Detectado</p>
              <p className="text-xs text-red-600 mt-0.5">
                Al seleccionar &apos;Severo&apos;, debe completar el formulario de Notificación Regulatoria dentro de
                las 24 horas del primer conocimiento del evento.
              </p>
            </div>
          </div>
        )}

        {/* Patient / Study — patient drives study */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Paciente y Estudio
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <FormField label="Estudio (asignado al paciente)" required className="col-span-1 sm:col-span-2">
              <input
                className={`${inputCls} bg-[var(--muted)] cursor-not-allowed`}
                value={form.estudio || '—'}
                readOnly
                tabIndex={-1}
              />
            </FormField>
          </div>
        </div>

        {/* Event info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Datos del Evento
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Tipo de Evento / Término MedDRA" required className="col-span-1 sm:col-span-2">
              <input
                className={inputCls}
                placeholder="Ej: Infarto Agudo de Miocardio"
                value={form.tipo}
                onChange={(e) => update('tipo', e.target.value)}
                required
              />
            </FormField>

            <FormField label="Clasificación SOC (WHO-ART)" required className="col-span-1">
              <select
                className={selectCls}
                value={form.SOC}
                onChange={(e) => update('SOC', e.target.value)}
                required
              >
                <option value="">Seleccionar sistema orgánico...</option>
                {SOC_LIST.map((s) => <option key={s}>{s}</option>)}
              </select>
            </FormField>

            <FormField label="Imputabilidad al Fármaco" required className="col-span-1">
              <select
                className={selectCls}
                value={form.imputabilidad}
                onChange={(e) => update('imputabilidad', e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                {['Definitiva', 'Probable', 'Posible', 'No relacionado', 'No clasificable'].map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Intensidad / Severidad" required className="col-span-1 sm:col-span-2">
              <div className="flex gap-2">
                {(['Leve', 'Moderado', 'Severo'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => update('intensidad', lvl)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
                      form.intensidad === lvl
                        ? lvl === 'Severo'
                          ? 'bg-red-600 text-white border-red-600'
                          : lvl === 'Moderado'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-500 text-white border-slate-500'
                        : 'bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:bg-[var(--muted)]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </FormField>

            <FormField label="Gravedad (ICH E2A)" className="col-span-1">
              <select
                className={selectCls}
                value={form.gravedad}
                onChange={(e) => update('gravedad', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {['No grave', 'Muerte', 'Amenaza vida', 'Hospitalización', 'Invalidez', 'Defecto congénito'].map(
                  (g) => <option key={g}>{g}</option>
                )}
              </select>
            </FormField>

            <FormField label="Descripción Clínica" required className="col-span-1 sm:col-span-2">
              <textarea
                className={`${inputCls} resize-none`}
                rows={3}
                placeholder="Descripción clínica detallada del evento..."
                value={form.descripcion}
                onChange={(e) => update('descripcion', e.target.value)}
                required
              />
            </FormField>
          </div>
        </div>

        {/* Dates */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Temporalidad
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                disabled={form.ongoing}
              />
            </FormField>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[var(--brand-teal)]"
                checked={form.ongoing}
                onChange={(e) => update('ongoing', e.target.checked)}
              />
              <span className="text-sm text-[var(--foreground)]">Evento en curso (sin fecha de resolución)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[var(--brand-teal)]"
                checked={form.suspensionTratamiento}
                onChange={(e) => update('suspensionTratamiento', e.target.checked)}
              />
              <span className="text-sm text-[var(--foreground)]">Requirió suspensión del tratamiento del estudio</span>
            </label>
          </div>
        </div>
      </form>
    </Modal>
  )
}
