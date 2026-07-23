'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls } from '@/components/ui/modal'
import { SearchableRelationSelect } from '@/components/ui/searchable-relation-select'
import { administracionesApi } from '@/lib/api/administraciones'
import { useCrds } from '@/lib/api/crds'
import type { Via } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevaAdministracionModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    crdId: '',
    numeroDosis: '',
    dosisMg: '',
    via: '' as Via | '',
    fechaHora: '',
    numeroLote: '',
    numeroUnidades: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items: crds } = useCrds({
    pagination: { pageSize: 200 },
    populate: { paciente: { fields: ['id', 'iniciales', 'codigoInclusion'] } },
  })

  const crdOptions = crds.map((c) => {
    const p = typeof c.paciente === 'object' ? c.paciente : null
    return {
      value: String(c.id),
      label: `CRD #${c.id} — ${p?.codigoInclusion ?? '?'} ${p?.iniciales ? `(${p.iniciales})` : ''}`,
    }
  })

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await administracionesApi.create({
        numeroDosis: parseInt(form.numeroDosis, 10),
        dosisMg: parseFloat(form.dosisMg),
        via: form.via as Via,
        fechaHora: form.fechaHora,
        numeroLote: form.numeroLote || undefined,
        numeroUnidades: form.numeroUnidades ? parseInt(form.numeroUnidades, 10) : undefined,
        crd: form.crdId ? { id: parseInt(form.crdId, 10) } as never : undefined,
      })
      setForm({ crdId: '', numeroDosis: '', dosisMg: '', via: '', fechaHora: '', numeroLote: '', numeroUnidades: '' })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar la administración')
    } finally {
      setSaving(false)
    }
  }

  const selectCls = 'w-full px-3 py-2.5 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/20 focus:border-[var(--brand-teal)] transition-colors'

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
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <form id="nueva-adm-form" onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="CRD / Paciente" required className="col-span-1 sm:col-span-2">
          <SearchableRelationSelect
            options={crdOptions}
            value={form.crdId}
            onChange={(v) => update('crdId', v)}
            placeholder="Buscar CRD o paciente..."
            emptyLabel="Seleccionar CRD..."
            required
          />
        </FormField>

        <FormField label="Número de Dosis" required className="col-span-1">
          <input
            type="number"
            className={inputCls}
            placeholder="Ej: 1"
            min="1"
            value={form.numeroDosis}
            onChange={(e) => update('numeroDosis', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Dosis (mg)" required className="col-span-1">
          <input
            type="number"
            className={inputCls}
            placeholder="Ej: 40"
            step="0.01"
            value={form.dosisMg}
            onChange={(e) => update('dosisMg', e.target.value)}
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
            <option value="SC">SC — Subcutánea</option>
            <option value="IV">IV — Intravenosa</option>
          </select>
        </FormField>

        <FormField label="Fecha y Hora" required className="col-span-1">
          <input
            type="datetime-local"
            className={inputCls}
            value={form.fechaHora}
            onChange={(e) => update('fechaHora', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Número de Lote" className="col-span-1">
          <input
            className={inputCls}
            placeholder="Ej: LOT-2024-001"
            value={form.numeroLote}
            onChange={(e) => update('numeroLote', e.target.value)}
          />
        </FormField>

        <FormField label="Número de Unidades" className="col-span-1">
          <input
            type="number"
            className={inputCls}
            placeholder="Ej: 1"
            min="1"
            value={form.numeroUnidades}
            onChange={(e) => update('numeroUnidades', e.target.value)}
          />
        </FormField>
      </form>
    </Modal>
  )
}
