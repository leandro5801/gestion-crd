'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { SearchableRelationSelect } from '@/components/ui/searchable-relation-select'
import { eventosAdversosApi } from '@/lib/api/eventos-adversos'
import { useAdministraciones } from '@/lib/api/administraciones'
import { useTiposEventoAdverso } from '@/lib/api/tipos-evento-adverso'
import type { EventoIntensidad, EventoGravedad, EventoImputabilidad } from '@/lib/types'

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
    administracionId: '',
    tipoEventoAdversoId: '',
    SOC: '',
    intensidad: '' as EventoIntensidad | '',
    gravedad: '' as EventoGravedad | '',
    imputabilidad: '' as EventoImputabilidad | '',
    suspensionTratamiento: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items: administraciones } = useAdministraciones({
    pagination: { pageSize: 200 },
    populate: { crd: { populate: { paciente: { fields: ['id', 'iniciales', 'codigoInclusion'] } } } },
  })
  const { items: tiposEA } = useTiposEventoAdverso({ pagination: { pageSize: 100 } })

  const adminOptions = administraciones.map((a) => {
    const crd = typeof a.crd === 'object' ? a.crd : null
    const p = typeof crd?.paciente === 'object' ? crd?.paciente : null
    return {
      value: String(a.id),
      label: `#${a.id} — ${p?.codigoInclusion ?? 'CRD desconocido'} — Dosis #${a.numeroDosis} (${a.dosisMg}mg ${a.via})`,
    }
  })

  const tipoEAOptions = tiposEA.map((t) => ({
    value: String(t.id),
    label: t.nombre,
  }))

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const isSevero = form.intensidad === 'Severo'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await eventosAdversosApi.create({
        SOC: form.SOC || undefined,
        intensidad: form.intensidad as EventoIntensidad,
        gravedad: form.gravedad as EventoGravedad,
        imputabilidad: form.imputabilidad as EventoImputabilidad,
        suspensionTratamiento: form.suspensionTratamiento,
        administracion_medicamento: form.administracionId
          ? { id: parseInt(form.administracionId, 10) } as never
          : undefined,
        tipo_evento_adverso: form.tipoEventoAdversoId
          ? { id: parseInt(form.tipoEventoAdversoId, 10) } as never
          : undefined,
      })
      setForm({ administracionId: '', tipoEventoAdversoId: '', SOC: '', intensidad: '', gravedad: '', imputabilidad: '', suspensionTratamiento: false })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el evento')
    } finally {
      setSaving(false)
    }
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
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
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

        {/* Administración vinculada */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Vinculación
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Administración de medicamento" required className="col-span-1 sm:col-span-2">
              <SearchableRelationSelect
                options={adminOptions}
                value={form.administracionId}
                onChange={(v) => update('administracionId', v)}
                placeholder="Buscar administración o paciente..."
                emptyLabel="Seleccionar administración..."
                required
              />
            </FormField>

            <FormField label="Tipo de Evento Adverso" className="col-span-1 sm:col-span-2">
              <SearchableRelationSelect
                options={tipoEAOptions}
                value={form.tipoEventoAdversoId}
                onChange={(v) => update('tipoEventoAdversoId', v)}
                placeholder="Buscar tipo de evento..."
                emptyLabel="Seleccionar tipo (opcional)..."
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
            <FormField label="Clasificación SOC (WHO-ART)" className="col-span-1 sm:col-span-2">
              <select
                className={selectCls}
                value={form.SOC}
                onChange={(e) => update('SOC', e.target.value)}
              >
                <option value="">Seleccionar sistema orgánico...</option>
                {SOC_LIST.map((s) => <option key={s}>{s}</option>)}
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

            <FormField label="Gravedad (ICH E2A)" required className="col-span-1">
              <select
                className={selectCls}
                value={form.gravedad}
                onChange={(e) => update('gravedad', e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                {['No grave', 'Muerte', 'Amenaza vida', 'Hospitalización', 'Invalidez', 'Defecto congénito'].map(
                  (g) => <option key={g}>{g}</option>
                )}
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
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4 rounded accent-[var(--brand-teal)]"
            checked={form.suspensionTratamiento}
            onChange={(e) => update('suspensionTratamiento', e.target.checked)}
          />
          <span className="text-sm text-[var(--foreground)]">Requirió suspensión del tratamiento del estudio</span>
        </label>
      </form>
    </Modal>
  )
}
