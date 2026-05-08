'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoSitioModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    codigo: '',
    tipo: '',
    ubicacion: '',
    investigadorPrincipal: '',
    email: '',
    telefono: '',
    estado: 'Activo',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/sitios-clinicos con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar Nuevo Sitio Clínico"
      subtitle="Incorporar un nuevo centro de investigación al estudio"
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
      <form id="nuevo-sitio-form" onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <FormField label="Nombre del Centro" required className="col-span-2">
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

        <FormField label="Tipo de Centro" required>
          <select
            className={selectCls}
            value={form.tipo}
            onChange={(e) => update('tipo', e.target.value)}
            required
          >
            <option value="">Seleccionar tipo...</option>
            {[
              'General Hospital',
              'University Hospital',
              'Research Institute',
              'Private Clinic',
              'University Poly',
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </FormField>

        <FormField label="Dirección / Ubicación" required className="col-span-2">
          <input
            className={inputCls}
            placeholder="Calle, número, ciudad"
            value={form.ubicacion}
            onChange={(e) => update('ubicacion', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Investigador Principal" required className="col-span-2">
          <input
            className={inputCls}
            placeholder="Dr./Dra. Nombre Apellido"
            value={form.investigadorPrincipal}
            onChange={(e) => update('investigadorPrincipal', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Correo electrónico">
          <input
            type="email"
            className={inputCls}
            placeholder="pi@hospital.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
          />
        </FormField>

        <FormField label="Teléfono de contacto">
          <input
            type="tel"
            className={inputCls}
            placeholder="+34 91 000 0000"
            value={form.telefono}
            onChange={(e) => update('telefono', e.target.value)}
          />
        </FormField>

        <FormField label="Estado Inicial">
          <select
            className={selectCls}
            value={form.estado}
            onChange={(e) => update('estado', e.target.value)}
          >
            <option>Activo</option>
            <option>Pendiente</option>
          </select>
        </FormField>
      </form>
    </Modal>
  )
}
