"use client";

import { useState, useEffect } from "react";
import {
  X,
  Edit2,
  Save,
  FlaskConical,
  AlertTriangle,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { estudiosApi } from "@/lib/api/estudios";
import type { Estudio } from "@/lib/types";

const inputCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors";

interface Props {
  estudio: Estudio | null;
  onClose: () => void;
}

export function VerEditarEstudioModal({ estudio, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Estudio | null>(null);

  useEffect(() => {
    if (estudio) {
      setForm({ ...estudio });
      setEditing(false);
      setSaved(false);
      setError(null);
    }
  }, [estudio]);

  if (!estudio || !form) return null;

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await estudiosApi.update(estudio.documentId, {
        codigoProtocolo: form.codigoProtocolo,
        titulo: form.titulo,
        medicamento: form.medicamento,
        fechaInicio: form.fechaInicio,
        fechaFinVigilancia: form.fechaFinVigilancia,
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

  const TextField = ({
    label,
    fkey,
    type = "text",
  }: {
    label: string;
    fkey: keyof Estudio;
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
          onChange={(e) => setForm({ ...form, [fkey]: e.target.value })}
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
              <FlaskConical className="w-5 h-5 text-[var(--brand-teal)]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-[var(--foreground)] truncate">
                {form.codigoProtocolo}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {editing ? "Editando estudio" : "Detalle del Estudio"}
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
                    setForm({ ...estudio });
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
            <TextField label="Código Protocolo" fkey="codigoProtocolo" />
            <TextField label="Medicamento" fkey="medicamento" />
          </div>
          <TextField label="Título del Estudio" fkey="titulo" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <TextField label="Fecha Inicio" fkey="fechaInicio" type="date" />
            <TextField
              label="Fecha Fin Vigilancia"
              fkey="fechaFinVigilancia"
              type="date"
            />
          </div>

          {/* Read-only metrics */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-[var(--muted)] rounded-xl">
            <div className="text-center">
              <Users className="w-4 h-4 text-[var(--brand-teal)] mx-auto mb-1" />
              <p className="text-lg font-bold text-[var(--foreground)]">
                {form.pacientes?.length ?? 0}
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">
                Pacientes
              </p>
            </div>
            <div className="text-center border-x border-[var(--border)]">
              <AlertTriangle className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-[var(--foreground)]">
                {form.sitios_clinicos?.length ?? 0}
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">
                Sitios Clínicos
              </p>
            </div>
            <div className="text-center">
              <Calendar className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <p className="text-sm font-semibold text-[var(--foreground)]">
                {form.fechaFinVigilancia}
              </p>
              <p className="text-[11px] text-[var(--muted-foreground)] font-medium uppercase">
                Fin Vigilancia
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
