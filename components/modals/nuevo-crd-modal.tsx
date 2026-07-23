'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls } from '@/components/ui/modal'
import { SearchableRelationSelect } from '@/components/ui/searchable-relation-select'
import { crdsApi } from '@/lib/api/crds'
import { usePacientes } from '@/lib/api/pacientes'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoCRDModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    pacienteId: '',
    fechaCreacion: new Date().toISOString().split('T')[0],
    estado: 'En curso' as 'En curso' | 'Completo' | 'Bloqueado',
    consentimientoFirmado: false,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items: pacientes } = usePacientes({ pagination: { pageSize: 200 }, populate: undefined })

  const pacienteOptions = pacientes.map((p) => ({
    value: String(p.id),
    label: `${p.codigoInclusion} — ${p.iniciales}`,
  }))

  const update = (k: keyof typeof form, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await crdsApi.create({
        fechaCreacion: form.fechaCreacion,
        estado: form.estado,
        consentimientoFirmado: form.consentimientoFirmado,
        paciente: form.pacienteId ? { id: parseInt(form.pacienteId, 10) } as never : undefined,
      })
      setForm({ pacienteId: '', fechaCreacion: new Date().toISOString().split('T')[0], estado: 'En curso', consentimientoFirmado: false })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el CRD')
    } finally {
      setSaving(false)
    }
  }

  const selectCls = 'w-full px-3 py-2.5 bg-white border border-[var(--border)] rounded-lg text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-teal)]/20 focus:border-[var(--brand-teal)] transition-colors'

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
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      <form id="nuevo-crd-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Paciente" required>
          <SearchableRelationSelect
            options={pacienteOptions}
            value={form.pacienteId}
            onChange={(v) => update('pacienteId', v)}
            placeholder="Buscar paciente..."
            emptyLabel="Seleccionar paciente..."
            required
          />
        </FormField>

        <FormField label="Fecha de Creación" required>
          <input
            type="date"
            className={inputCls}
            value={form.fechaCreacion}
            onChange={(e) => update('fechaCreacion', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Estado inicial">
          <select
            className={selectCls}
            value={form.estado}
            onChange={(e) => update('estado', e.target.value)}
          >
            {['En curso', 'Completo', 'Bloqueado'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
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
