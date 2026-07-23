"use client";

import { useState, useEffect } from "react";
import { X, Edit2, Save, Pill, CheckCircle } from "lucide-react";
import { administracionesApi } from "@/lib/api/administraciones";
import type { AdministracionMedicamento, Via } from "@/lib/types";

const selectCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors";
const inputCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors";

const viaBadge: Record<Via, string> = {
  SC: "bg-green-50 text-green-700 border border-green-200",
  IV: "bg-blue-50 text-blue-700 border border-blue-200",
};

interface Props {
  admin: AdministracionMedicamento | null;
  onClose: () => void;
}

export function VerEditarAdministracionModal({ admin, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AdministracionMedicamento | null>(null);

  useEffect(() => {
    if (admin) {
      setForm({ ...admin });
      setEditing(false);
      setSaved(false);
      setError(null);
    }
  }, [admin]);

  if (!admin || !form) return null;

  const crd = typeof form.crd === "object" ? form.crd : null;
  const paciente = typeof crd?.paciente === "object" ? crd?.paciente : null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await administracionesApi.update(admin.documentId, {
        numeroDosis: form.numeroDosis,
        dosisMg: form.dosisMg,
        via: form.via,
        fechaHora: form.fechaHora,
        numeroLote: form.numeroLote,
        numeroUnidades: form.numeroUnidades,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
              <Pill className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[var(--foreground)] truncate">
                Dosis #{form.numeroDosis} — {form.dosisMg}mg {form.via}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {paciente?.codigoInclusion ?? `CRD #${crd?.id ?? "?"}`} ·{" "}
                {editing ? "Editando registro" : "Detalle Administración"}
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
                    setForm({ ...admin });
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

          {/* Read-only patient/CRD info */}
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Paciente
              </span>
              <span className="text-sm font-medium">
                {paciente?.codigoInclusion ?? "—"}{" "}
                {paciente?.iniciales ? `(${paciente.iniciales})` : ""}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                CRD
              </span>
              <span className="text-sm font-medium">
                {crd ? `CRD #${crd.id}` : "—"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Número Dosis */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Número de Dosis
              </label>
              {editing ? (
                <input
                  type="number"
                  min="1"
                  value={form.numeroDosis}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      numeroDosis: parseInt(e.target.value, 10),
                    })
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  #{form.numeroDosis}
                </p>
              )}
            </div>
            {/* Dosis Mg */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Dosis (mg)
              </label>
              {editing ? (
                <input
                  type="number"
                  step="0.01"
                  value={form.dosisMg}
                  onChange={(e) =>
                    setForm({ ...form, dosisMg: parseFloat(e.target.value) })
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {form.dosisMg} mg
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Vía */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Vía de Administración
              </label>
              {editing ? (
                <select
                  value={form.via}
                  onChange={(e) =>
                    setForm({ ...form, via: e.target.value as Via })
                  }
                  className={selectCls}
                >
                  <option value="SC">SC — Subcutánea</option>
                  <option value="IV">IV — Intravenosa</option>
                </select>
              ) : (
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${viaBadge[form.via]}`}
                >
                  {form.via}
                </span>
              )}
            </div>
            {/* Fecha/Hora */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Fecha y Hora
              </label>
              {editing ? (
                <input
                  type="datetime-local"
                  value={form.fechaHora?.slice(0, 16)}
                  onChange={(e) =>
                    setForm({ ...form, fechaHora: e.target.value })
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {new Date(form.fechaHora).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Lote */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Número de Lote
              </label>
              {editing ? (
                <input
                  value={form.numeroLote ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, numeroLote: e.target.value })
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {form.numeroLote ?? "—"}
                </p>
              )}
            </div>
            {/* Unidades */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Número de Unidades
              </label>
              {editing ? (
                <input
                  type="number"
                  min="1"
                  value={form.numeroUnidades ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      numeroUnidades: parseInt(e.target.value, 10),
                    })
                  }
                  className={inputCls}
                />
              ) : (
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {form.numeroUnidades ?? "—"}
                </p>
              )}
            </div>
          </div>

          {/* Eventos adversos vinculados */}
          <div className="p-4 bg-[var(--muted)] rounded-xl">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-1">
              Eventos Adversos vinculados
            </p>
            <p className="text-lg font-bold text-[var(--foreground)]">
              {form.evento_adversos?.length ?? 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
