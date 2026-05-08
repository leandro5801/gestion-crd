'use client'

import { useState, useMemo } from 'react'
import { Modal, FormField, inputCls, selectCls } from '@/components/ui/modal'
import { mockEstudios, mockSitiosClinicos } from '@/lib/mock-data'

interface Props {
  open: boolean
  onClose: () => void
}

export function NuevoPacienteModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    iniciales: '',
    codigoInclusion: '',
    edad: '',
    sexo: '',
    pesoKg: '',
    tallaCm: '',
    fechaInclusion: '',
    estudio: '',
    sitioClinico: '',
    diagnosticos: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }))

  // Filter sites based on selected study (sites with estudiosActivos > 0 only)
  const filteredSites = useMemo(() => {
    return mockSitiosClinicos.filter((s) => s.estado === 'Activo' && s.estudiosActivos > 0)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    // TODO: POST /api/pacientes con el payload `form`
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    onClose()
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
                value={form.estudio}
                onChange={(e) => {
                  update('estudio', e.target.value)
                  // Clear sitio when study changes
                  if (form.sitioClinico) update('sitioClinico', '')
                }}
                required
              >
                <option value="">Seleccionar estudio...</option>
                {mockEstudios.filter((e) => e.estado === 'Activo').map((e) => (
                  <option key={e.id} value={e.codigoProtocolo}>
                    {e.codigoProtocolo} — {e.titulo}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="Sitio Clínico" required>
              <select
                className={selectCls}
                value={form.sitioClinico}
                onChange={(e) => update('sitioClinico', e.target.value)}
                required
              >
                <option value="">Seleccionar sitio activo...</option>
                {filteredSites.map((s) => (
                  <option key={s.id} value={s.codigo}>
                    {s.codigo} — {s.nombre}
                  </option>
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
            <FormField label="Diagnósticos Previos (APP)" className="col-span-1 sm:col-span-2">
              <input
                className={inputCls}
                placeholder="Ej: HTA, DM Tipo 2 (separados por coma)"
                value={form.diagnosticos}
                onChange={(e) => update('diagnosticos', e.target.value)}
              />
            </FormField>
          </div>
        </div>
      </form>
    </Modal>
  )
}
