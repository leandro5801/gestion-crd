'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls } from '@/components/ui/modal'
import { sitiosApi } from '@/lib/api/sitios-clinicos'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoSitioModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    codigo: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await sitiosApi.create({
        nombre: form.nombre,
        codigo: form.codigo.toUpperCase(),
      })
      setForm({ nombre: '', codigo: '' })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el sitio')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar Nuevo Sitio Clínico"
      subtitle="Incorporar un nuevo centro de investigación al estudio"
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
            form="nuevo-sitio-form"
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Registrando...
              </>
            ) : (
              'Registrar Sitio'
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
      <form id="nuevo-sitio-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormField label="Nombre del Centro" required>
          <input
            className={inputCls}
            placeholder="Ej: Hospital Universitario La Paz"
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Código del Sitio" required>
          <input
            className={inputCls}
            placeholder="Ej: MAD-015"
            value={form.codigo}
            onChange={(e) => update('codigo', e.target.value.toUpperCase())}
            required
          />
        </FormField>
      </form>
    </Modal>
  )
}
