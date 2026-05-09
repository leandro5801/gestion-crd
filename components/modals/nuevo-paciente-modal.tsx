'use client'

import { useState } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { pacientesApi } from '@/lib/api/pacientes'
import { useEstudios } from '@/lib/api/estudios'
import { useSitiosClinicos } from '@/lib/api/sitios-clinicos'
import type { Sexo, ColorPiel } from '@/lib/types'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoPacienteModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    iniciales: '',
    codigoInclusion: '',
    edad: '',
    sexo: '' as Sexo | '',
    colorPiel: '' as ColorPiel | '',
    pesoKg: '',
    tallaCm: '',
    fechaInclusion: '',
    estudioId: '',
    sitioClinicoId: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { items: estudios } = useEstudios({ pagination: { pageSize: 100 } })
  const { items: sitios } = useSitiosClinicos({ pagination: { pageSize: 100 } })

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await pacientesApi.create({
        iniciales: form.iniciales.toUpperCase(),
        codigoInclusion: form.codigoInclusion,
        edad: parseInt(form.edad, 10),
        sexo: form.sexo as Sexo,
        colorPiel: form.colorPiel as ColorPiel || undefined,
        pesoKg: form.pesoKg ? parseFloat(form.pesoKg) : undefined,
        tallaCm: form.tallaCm ? parseFloat(form.tallaCm) : undefined,
        fechaInclusion: form.fechaInclusion,
        estudio: form.estudioId ? { id: parseInt(form.estudioId, 10) } as never : undefined,
        sitioClinico: form.sitioClinicoId ? { id: parseInt(form.sitioClinicoId, 10) } as never : undefined,
      })
      setForm({ iniciales: '', codigoInclusion: '', edad: '', sexo: '', colorPiel: '', pesoKg: '', tallaCm: '', fechaInclusion: '', estudioId: '', sitioClinicoId: '' })
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el paciente')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Registrar Nuevo Paciente"
      subtitle="Inclusión de un nuevo sujeto al estudio clínico"
      size="xl"
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
            form="nuevo-paciente-form"
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
              'Registrar Paciente'
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
      <form id="nuevo-paciente-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Identification */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Identificación
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Iniciales del Paciente" required>
              <input
                className={inputCls}
                placeholder="Ej: JRM"
                maxLength={4}
                value={form.iniciales}
                onChange={(e) => update('iniciales', e.target.value.toUpperCase())}
                required
              />
            </FormField>
            <FormField label="Código de Inclusión" required>
              <input
                className={inputCls}
                placeholder="Ej: PV-ALPHA-00128"
                value={form.codigoInclusion}
                onChange={(e) => update('codigoInclusion', e.target.value)}
                required
              />
            </FormField>
          </div>
        </div>

        {/* Demographics */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Datos Demográficos
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Edad" required>
              <input
                type="number"
                className={inputCls}
                placeholder="Años"
                min="18"
                max="99"
                value={form.edad}
                onChange={(e) => update('edad', e.target.value)}
                required
              />
            </FormField>
            <FormField label="Sexo Biológico" required>
              <select
                className={selectCls}
                value={form.sexo}
                onChange={(e) => update('sexo', e.target.value)}
                required
              >
                <option value="">Seleccionar...</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </FormField>
            <FormField label="Color de Piel">
              <select
                className={selectCls}
                value={form.colorPiel}
                onChange={(e) => update('colorPiel', e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {['Blanca', 'Mestiza', 'Negra', 'Amarilla'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Fecha de Inclusión" required>
              <input
                type="date"
                className={inputCls}
                value={form.fechaInclusion}
                onChange={(e) => update('fechaInclusion', e.target.value)}
                required
              />
            </FormField>
            <FormField label="Peso (kg)">
              <input
                type="number"
                className={inputCls}
                placeholder="Kg"
                step="0.1"
                value={form.pesoKg}
                onChange={(e) => update('pesoKg', e.target.value)}
              />
            </FormField>
            <FormField label="Talla (cm)">
              <input
                type="number"
                className={inputCls}
                placeholder="cm"
                value={form.tallaCm}
                onChange={(e) => update('tallaCm', e.target.value)}
              />
            </FormField>
          </div>
        </div>

        {/* Study assignment */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-3">
            Asignación al Estudio
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Estudio Clínico" required className="col-span-1 sm:col-span-2">
              <select
                className={selectCls}
                value={form.estudioId}
                onChange={(e) => update('estudioId', e.target.value)}
                required
              >
                <option value="">Seleccionar estudio...</option>
                {estudios.map((e) => (
                  <option key={e.id} value={String(e.id)}>
                    {e.codigoProtocolo} — {e.titulo}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Sitio Clínico" className="col-span-1 sm:col-span-2">
              <select
                className={selectCls}
                value={form.sitioClinicoId}
                onChange={(e) => update('sitioClinicoId', e.target.value)}
              >
                <option value="">Seleccionar sitio...</option>
                {sitios.map((s) => (
                  <option key={s.id} value={String(s.id)}>
                    {s.codigo} — {s.nombre}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>
      </form>
    </Modal>
  )
}
