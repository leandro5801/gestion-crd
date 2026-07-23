"use client";

import { useState, useEffect } from "react";
import { X, Edit2, Save, Stethoscope, CheckCircle } from "lucide-react";
import { type TratamientoConcomitante } from "@/lib/types";
import { useCrds } from "@/lib/api/crds";
import { concomitantesApi } from "@/lib/api/concomitantes";
import { SearchableRelationSelect } from "@/components/ui/searchable-relation-select";

const selectCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors";
const inputCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors";
const readOnlyCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--muted)] cursor-not-allowed";

interface Props {
  concomitante: TratamientoConcomitante | null;
  onClose: () => void;
}

export function VerEditarConcomitanteModal({ concomitante, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<TratamientoConcomitante | null>(null);
  const [crdId, setCrdId] = useState("");

  const { items: crds } = useCrds({
    pagination: { pageSize: 200 },
    populate: { paciente: { fields: ["id", "iniciales", "codigoInclusion"] } },
  });

  useEffect(() => {
    if (concomitante) {
      setForm({ ...concomitante });
      setEditing(false);
      setSaved(false);
      setError(null);
      const crd =
        typeof concomitante.crd === "object" ? concomitante.crd : null;
      setCrdId(crd ? String(crd.id) : "");
    }
  }, [concomitante]);

  if (!concomitante || !form) return null;

  const currentCrd =
    typeof form.crd === "object" ? form.crd : null;
  const currentPaciente =
    currentCrd && typeof currentCrd.paciente === "object"
      ? currentCrd.paciente
      : null;

  const crdOptions = crds.map((c) => {
    const p = typeof c.paciente === "object" ? c.paciente : null;
    return {
      value: String(c.id),
      label: `CRD #${c.id} — ${p?.codigoInclusion ?? "?"} ${p?.iniciales ? `(${p.iniciales})` : ""}`,
    };
  });

  const selectedCrd = crds.find((c) => String(c.id) === crdId);
  const selectedPaciente =
    selectedCrd && typeof selectedCrd.paciente === "object"
      ? selectedCrd.paciente
      : null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await concomitantesApi.update(concomitante.documentId, {
        medicamento: form.medicamento,
        via: form.via,
        dosisDiaria: form.dosisDiaria,
        crd: crdId ? ({ id: parseInt(crdId, 10) } as never) : undefined,
      });
      setSaving(false);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[var(--foreground)] truncate">
                {form.medicamento}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {currentPaciente?.codigoInclusion
                  ? `${currentPaciente.codigoInclusion}${currentPaciente.iniciales ? ` (${currentPaciente.iniciales})` : ""}`
                  : currentCrd
                    ? `CRD #${currentCrd.id}`
                    : "Sin CRD"}{" "}
                · {editing ? "Editando tratamiento" : "Detalle Concomitante"}
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
                    setForm({ ...concomitante });
                    const crd =
                      typeof concomitante.crd === "object"
                        ? concomitante.crd
                        : null;
                    setCrdId(crd ? String(crd.id) : "");
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

          {/* CRD / Paciente */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              CRD / Paciente
            </label>
            {editing ? (
              <SearchableRelationSelect
                options={crdOptions}
                value={crdId}
                onChange={setCrdId}
                placeholder="Buscar CRD o paciente..."
                emptyLabel="Sin CRD asignado"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">
                {currentPaciente
                  ? `${currentPaciente.codigoInclusion}${currentPaciente.iniciales ? ` (${currentPaciente.iniciales})` : ""}`
                  : currentCrd
                    ? `CRD #${currentCrd.id}`
                    : "—"}
              </p>
            )}
          </div>

          {/* Paciente derivado (solo lectura en edición) */}
          {editing && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Paciente (derivado del CRD)
              </label>
              <input
                readOnly
                tabIndex={-1}
                value={
                  selectedPaciente
                    ? `${selectedPaciente.codigoInclusion} — ${selectedPaciente.iniciales ?? ""}`
                    : "Selecciona un CRD"
                }
                className={readOnlyCls}
              />
            </div>
          )}

          {/* Medicamento */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Medicamento
            </label>
            {editing ? (
              <input
                value={form.medicamento}
                onChange={(e) =>
                  setForm({ ...form, medicamento: e.target.value })
                }
                className={inputCls}
              />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">
                {form.medicamento}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vía */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Vía de Administración
              </label>
              {editing ? (
                <select
                  value={form.via ?? ""}
                  onChange={(e) => setForm({ ...form, via: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Seleccionar vía...</option>
                  {[
                    "Oral",
                    "Intravenosa",
                    "Subcutánea",
                    "Intramuscular",
                    "Inhalatoria",
                    "Tópica",
                    "Transdérmica",
                  ].map((v) => (
                    <option key={v}>{v}</option>
                  ))}
                </select>
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {form.via ?? "—"}
                </p>
              )}
            </div>

            {/* Dosis Diaria */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Dosis Diaria
              </label>
              {editing ? (
                <input
                  value={form.dosisDiaria ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, dosisDiaria: e.target.value })
                  }
                  className={inputCls}
                  placeholder="Ej: 1.7g (2 tabs/día)"
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {form.dosisDiaria ?? "—"}
                </p>
              )}
            </div>
          </div>

          {/* Created / Updated info */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--muted)] rounded-xl">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Creado
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {form.createdAt
                  ? new Date(form.createdAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Actualizado
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {form.updatedAt
                  ? new Date(form.updatedAt).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
