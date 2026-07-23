"use client";

import { useState, useEffect } from "react";
import { X, Edit2, Save, User, AlertTriangle, CheckCircle } from "lucide-react";
import { pacientesApi } from "@/lib/api/pacientes";
import { useEstudios } from "@/lib/api/estudios";
import { useSitiosClinicos } from "@/lib/api/sitios-clinicos";
import type { Paciente, Sexo } from "@/lib/types";

const selectCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors";
const inputCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors";

interface Props {
  paciente: Paciente | null;
  onClose: () => void;
}

export function VerEditarPacienteModal({ paciente, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Paciente | null>(null);
  const [estudioId, setEstudioId] = useState("");
  const [sitioId, setSitioId] = useState("");

  const { items: estudios } = useEstudios({ pagination: { pageSize: 100 } });
  const { items: sitios } = useSitiosClinicos({
    pagination: { pageSize: 100 },
  });

  useEffect(() => {
    if (paciente) {
      setForm({ ...paciente });
      setEditing(false);
      setSaved(false);
      setError(null);
      const est =
        typeof paciente.estudio === "object" ? paciente.estudio : null;
      const sit =
        typeof paciente.sitioClinico === "object"
          ? paciente.sitioClinico
          : null;
      setEstudioId(est ? String(est.id) : "");
      setSitioId(sit ? String(sit.id) : "");
    }
  }, [paciente]);

  if (!paciente || !form) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await pacientesApi.update(paciente.documentId, {
        iniciales: form.iniciales,
        codigoInclusion: form.codigoInclusion,
        edad: form.edad,
        sexo: form.sexo,
        colorPiel: form.colorPiel,
        pesoKg: form.pesoKg,
        tallaCm: form.tallaCm,
        fechaInclusion: form.fechaInclusion,
        estudio: estudioId
          ? ({ id: parseInt(estudioId, 10) } as never)
          : undefined,
        sitioClinico: sitioId
          ? ({ id: parseInt(sitioId, 10) } as never)
          : undefined,
      });
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const sexoColor = {
    M: "bg-blue-100 text-blue-700",
    F: "bg-pink-100 text-pink-700",
  } as const;

  const Field = ({
    label,
    fkey,
    type = "text",
  }: {
    label: string;
    fkey: keyof Paciente;
    type?: string;
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={String(form[fkey] ?? "")}
          onChange={(e) =>
            setForm({
              ...form,
              [fkey]:
                type === "number" ? Number(e.target.value) : e.target.value,
            })
          }
          className={inputCls}
        />
      ) : (
        <p className="text-sm font-medium text-[var(--foreground)]">
          {String(form[fkey] ?? "—")}
        </p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-[var(--foreground)]">
                  {form.iniciales}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${sexoColor[form.sexo as "M" | "F"] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {form.sexo === "M" ? "MASCULINO" : "FEMENINO"}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {form.codigoInclusion} ·{" "}
                {editing ? "Editando paciente" : "Detalle del Paciente"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
            {saved && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" /> Guardado
              </span>
            )}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--brand-teal)] border border-[var(--brand-teal)] rounded-lg hover:bg-[var(--brand-teal-muted)] transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" /> Editar
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setForm({ ...paciente });
                    setEditing(false);
                    setError(null);
                  }}
                  className="px-3 py-1.5 text-sm text-[var(--muted-foreground)] border border-[var(--border)] rounded-lg hover:bg-[var(--muted)] transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold bg-[var(--brand-teal)] text-white rounded-lg hover:bg-[var(--brand-teal-dark)] disabled:opacity-60 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col gap-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Código de Inclusión" fkey="codigoInclusion" />
            <Field label="Iniciales" fkey="iniciales" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-5">
            <Field label="Edad" fkey="edad" type="number" />
            <Field label="Peso (kg)" fkey="pesoKg" type="number" />
            <Field label="Talla (cm)" fkey="tallaCm" type="number" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Sexo
              </label>
              {editing ? (
                <select
                  value={form.sexo}
                  onChange={(e) =>
                    setForm({ ...form, sexo: e.target.value as Sexo })
                  }
                  className={selectCls}
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              ) : (
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded w-fit ${sexoColor[form.sexo as "M" | "F"] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {form.sexo === "M" ? "MASCULINO" : "FEMENINO"}
                </span>
              )}
            </div>
            <Field
              label="Fecha de Inclusión"
              fkey="fechaInclusion"
              type="date"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Estudio
              </label>
              {editing ? (
                <select
                  value={estudioId}
                  onChange={(e) => setEstudioId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Sin estudio</option>
                  {estudios.map((e) => (
                    <option key={e.id} value={String(e.id)}>
                      {e.codigoProtocolo} — {e.titulo}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium">
                  {typeof form.estudio === "object"
                    ? form.estudio?.codigoProtocolo
                    : (form.estudio ?? "—")}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Sitio Clínico
              </label>
              {editing ? (
                <select
                  value={sitioId}
                  onChange={(e) => setSitioId(e.target.value)}
                  className={selectCls}
                >
                  <option value="">Sin sitio</option>
                  {sitios.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.codigo} — {s.nombre}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium">
                  {typeof form.sitioClinico === "object"
                    ? form.sitioClinico?.nombre
                    : (form.sitioClinico ?? "—")}
                </p>
              )}
            </div>
          </div>

          {/* APP/Diagnósticos — read only, managed from Strapi directly */}
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              APP / Antecedentes Patológicos
            </label>
            <div className="flex flex-wrap gap-1.5">
              {(form.diagnosticos ?? []).map((d) => (
                <span
                  key={typeof d === "object" ? d.id : d}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[var(--muted)] text-[var(--foreground)] px-2 py-1 rounded-full uppercase"
                >
                  {typeof d === "object" ? d.titulo : d}
                </span>
              ))}
              {!form.diagnosticos?.length && (
                <p className="text-sm text-[var(--muted-foreground)] italic">
                  Sin antecedentes registrados
                </p>
              )}
            </div>
          </div>

          {/* CRD info */}
          <div className="p-4 bg-[var(--muted)] rounded-xl flex items-center gap-4">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-slate-400" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                CRD asignado
              </p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {form.crd
                  ? `CRD #${typeof form.crd === "object" ? form.crd.id : form.crd}`
                  : "Sin CRD asignado"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
