'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { concomitantesApi } from '@/lib/api/concomitantes'
import { useCrds } from '@/lib/api/crds'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoConcomitanteModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    crdId: '',
    medicamento: '',
    via: '',
    dosisDiaria: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items: crds } = useCrds({
    pagination: { pageSize: 200 },
    populate: { paciente: { fields: ['id', 'iniciales', 'codigoInclusion'] } },
  })

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await concomitantesApi.create({
        medicamento: form.medicamento,
        via: form.via || undefined,
        dosisDiaria: form.dosisDiaria || undefined,
        crd: form.crdId ? { id: parseInt(form.crdId, 10) } as never : undefined,
      })
      setForm({ crdId: '', medicamento: '', via: '', dosisDiaria: '' })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el tratamiento')
    } finally {
      setSaving(false)
    }
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
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <form id="nuevo-concomitante-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="CRD / Paciente" required className="col-span-1 sm:col-span-2">
          <select
            className={selectCls}
            value={form.crdId}
            onChange={(e) => update('crdId', e.target.value)}
            required
          >
            <option value="">Seleccionar CRD...</option>
            {crds.map((c) => {
              const p = typeof c.paciente === 'object' ? c.paciente : null
              return (
                <option key={c.id} value={String(c.id)}>
                  CRD #{c.id} — {p?.codigoInclusion ?? '?'} {p?.iniciales ? `(${p.iniciales})` : ''}
                </option>
              )
            })}
          </select>
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

        <FormField label="Vía de Administración" className="col-span-1">
          <select
            className={selectCls}
            value={form.via}
            onChange={(e) => update('via', e.target.value)}
          >
            <option value="">Seleccionar vía...</option>
            {['Oral', 'Intravenosa', 'Subcutánea', 'Intramuscular', 'Inhalatoria', 'Tópica', 'Transdérmica'].map(
              (v) => <option key={v}>{v}</option>
            )}
          </select>
        </FormField>

        <FormField label="Dosis Diaria" className="col-span-1">
          <input
            className={inputCls}
            placeholder="Ej: 1.7g (2 tabs/día)"
            value={form.dosisDiaria}
            onChange={(e) => update('dosisDiaria', e.target.value)}
          />
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
