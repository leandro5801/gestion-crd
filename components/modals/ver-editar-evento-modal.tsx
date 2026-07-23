"use client";

import { useState, useEffect } from "react";
import { X, Edit2, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { type EventoAdverso } from "@/lib/types";
import { useAdministraciones } from "@/lib/api/administraciones";
import { useTiposEventoAdverso } from "@/lib/api/tipos-evento-adverso";
import { eventosAdversosApi } from "@/lib/api/eventos-adversos";
import { SearchableRelationSelect } from "@/components/ui/searchable-relation-select";

const selectCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors";
const inputCls =
  "w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors";

const SOC_LIST = [
  "Blood Disorders",
  "Cardiac Disorders",
  "General Disorders",
  "Immune System",
  "Nervous System",
  "Respiratory Disorders",
  "Skin & Subcutaneous",
  "Gastrointestinal Disorders",
  "Hepatobiliary Disorders",
  "Renal & Urinary Disorders",
];

const intensidadStyle: Record<string, string> = {
  Leve: "bg-blue-50 text-blue-700 border border-blue-200",
  Moderado: "bg-amber-50 text-amber-700 border border-amber-200",
  Severo: "bg-red-50 text-red-700 border border-red-200",
};

interface Props {
  evento: EventoAdverso | null;
  onClose: () => void;
}

export function VerEditarEventoModal({ evento, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<EventoAdverso | null>(null);
  const [adminId, setAdminId] = useState("");
  const [tipoEAId, setTipoEAId] = useState("");

  const { items: administraciones } = useAdministraciones({
    pagination: { pageSize: 200 },
    populate: {
      crd: {
        populate: { paciente: { fields: ["id", "iniciales", "codigoInclusion"] } },
      },
    },
  });

  const { items: tiposEA } = useTiposEventoAdverso({
    pagination: { pageSize: 100 },
  });

  useEffect(() => {
    if (evento) {
      setForm({ ...evento });
      setEditing(false);
      setSaved(false);
      const adm =
        typeof evento.administracion_medicamento === "object"
          ? evento.administracion_medicamento
          : null;
      const tipo =
        typeof evento.tipo_evento_adverso === "object"
          ? evento.tipo_evento_adverso
          : null;
      setAdminId(adm ? String(adm.id) : "");
      setTipoEAId(tipo ? String(tipo.id) : "");
    }
  }, [evento]);

  if (!evento || !form) return null;

  const isSAE = form.intensidad === "Severo";

  // derive patient info from the selected administracion
  const adminOptions = administraciones.map((a) => {
    const crd = typeof a.crd === "object" ? a.crd : null;
    const p = typeof crd?.paciente === "object" ? crd?.paciente : null;
    return {
      value: String(a.id),
      label: `#${a.id} — ${p?.codigoInclusion ?? "CRD desconocido"} — Dosis #${a.numeroDosis} (${a.dosisMg}mg ${a.via})`,
    };
  });

  const tipoEAOptions = tiposEA.map((t) => ({
    value: String(t.id),
    label: t.nombre,
  }));

  const selectedAdmin = administraciones.find(
    (a) => String(a.id) === adminId,
  );
  const selectedCrd =
    selectedAdmin && typeof selectedAdmin.crd === "object"
      ? selectedAdmin.crd
      : null;
  const selectedPaciente =
    selectedCrd && typeof selectedCrd.paciente === "object"
      ? selectedCrd.paciente
      : null;

  // current linked admin (view mode)
  const currentAdmin =
    typeof evento.administracion_medicamento === "object"
      ? evento.administracion_medicamento
      : null;
  const currentCrd =
    currentAdmin && typeof currentAdmin.crd === "object"
      ? currentAdmin.crd
      : null;
  const currentPaciente =
    currentCrd && typeof currentCrd.paciente === "object"
      ? currentCrd.paciente
      : null;

  const currentTipo =
    typeof evento.tipo_evento_adverso === "object"
      ? evento.tipo_evento_adverso
      : null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await eventosAdversosApi.update(evento.documentId, {
        SOC: form.SOC,
        intensidad: form.intensidad,
        gravedad: form.gravedad,
        imputabilidad: form.imputabilidad,
        suspensionTratamiento: form.suspensionTratamiento,
        administracion_medicamento: adminId
          ? ({ id: parseInt(adminId, 10) } as never)
          : undefined,
        tipo_evento_adverso: tipoEAId
          ? ({ id: parseInt(tipoEAId, 10) } as never)
          : undefined,
      });
      setSaving(false);
      setSaved(true);
      setEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Error saving evento:", error);
      setSaving(false);
    }
  };

  const SelectField = ({
    label,
    fkey,
    options,
  }: {
    label: string;
    fkey: keyof EventoAdverso;
    options: string[];
  }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </label>
      {editing ? (
        <select
          value={String(form[fkey] ?? "")}
          onChange={(e) => setForm({ ...form, [fkey]: e.target.value })}
          className={selectCls}
        >
          <option value="">Seleccionar...</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
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
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSAE ? "bg-red-100" : "bg-amber-100"}`}
            >
              <AlertTriangle
                className={`w-5 h-5 ${isSAE ? "text-red-600" : "text-amber-600"}`}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-[var(--foreground)] truncate">
                  {currentTipo?.nombre ?? form.SOC ?? "Evento Adverso"}
                </h2>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${intensidadStyle[form.intensidad]}`}
                >
                  {form.intensidad}
                  {isSAE ? " (SAE)" : ""}
                </span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] truncate">
                {currentPaciente?.codigoInclusion ?? "—"}
                {currentPaciente?.iniciales
                  ? ` (${currentPaciente.iniciales})`
                  : ""}
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
                    setForm({ ...evento });
                    const adm =
                      typeof evento.administracion_medicamento === "object"
                        ? evento.administracion_medicamento
                        : null;
                    const tipo =
                      typeof evento.tipo_evento_adverso === "object"
                        ? evento.tipo_evento_adverso
                        : null;
                    setAdminId(adm ? String(adm.id) : "");
                    setTipoEAId(tipo ? String(tipo.id) : "");
                    setEditing(false);
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

        {/* SAE Alert */}
        {isSAE && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">
              <span className="font-bold">Evento Adverso Grave (SAE).</span>{" "}
              Requiere notificación regulatoria en menos de 24 horas según ICH
              E2A.
            </p>
          </div>
        )}

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 flex flex-col gap-5">

          {/* Vinculación */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Administración de Medicamento
            </label>
            {editing ? (
              <SearchableRelationSelect
                options={adminOptions}
                value={adminId}
                onChange={setAdminId}
                placeholder="Buscar administración o paciente..."
                emptyLabel="Sin administración vinculada"
              />
            ) : (
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {currentAdmin
                    ? `#${currentAdmin.id} — Dosis #${currentAdmin.numeroDosis} (${currentAdmin.dosisMg}mg ${currentAdmin.via})`
                    : "—"}
                </p>
                {currentPaciente && (
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Paciente: {currentPaciente.codigoInclusion}{" "}
                    {currentPaciente.iniciales
                      ? `(${currentPaciente.iniciales})`
                      : ""}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Paciente derivado (solo lectura en edición) */}
          {editing && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Paciente (derivado)
              </label>
              <input
                readOnly
                tabIndex={-1}
                value={
                  selectedPaciente
                    ? `${selectedPaciente.codigoInclusion} — ${selectedPaciente.iniciales ?? ""}`
                    : "Selecciona una administración"
                }
                className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--muted)] cursor-not-allowed"
              />
            </div>
          )}

          {/* Tipo EA */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Tipo de Evento Adverso
            </label>
            {editing ? (
              <SearchableRelationSelect
                options={tipoEAOptions}
                value={tipoEAId}
                onChange={setTipoEAId}
                placeholder="Buscar tipo de evento adverso..."
                emptyLabel="Sin tipo asignado"
              />
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">
                {currentTipo?.nombre ?? "—"}
              </p>
            )}
          </div>

          {/* SOC */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              SOC (WHO-ART)
            </label>
            {editing ? (
              <select
                value={form.SOC ?? ""}
                onChange={(e) => setForm({ ...form, SOC: e.target.value })}
                className={selectCls}
              >
                <option value="">Seleccionar sistema orgánico...</option>
                {SOC_LIST.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            ) : (
              <p className="text-sm font-medium text-[var(--foreground)]">
                {form.SOC || "—"}
              </p>
            )}
          </div>

          {/* Intensidad */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Intensidad
            </label>
            {editing ? (
              <div className="flex gap-2">
                {(["Leve", "Moderado", "Severo"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setForm({ ...form, intensidad: lvl })}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg border transition-all ${
                      form.intensidad === lvl
                        ? lvl === "Severo"
                          ? "bg-red-600 text-white border-red-600"
                          : lvl === "Moderado"
                            ? "bg-amber-500 text-white border-amber-500"
                            : "bg-slate-500 text-white border-slate-500"
                        : "bg-white text-[var(--muted-foreground)] border-[var(--border)] hover:bg-[var(--muted)]"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            ) : (
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${intensidadStyle[form.intensidad]}`}
              >
                {form.intensidad}
                {isSAE ? " (SAE)" : ""}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <SelectField
              label="Imputabilidad"
              fkey="imputabilidad"
              options={[
                "Definitiva",
                "Probable",
                "Posible",
                "No relacionado",
                "No clasificable",
              ]}
            />
            <SelectField
              label="Gravedad (ICH E2A)"
              fkey="gravedad"
              options={[
                "No grave",
                "Muerte",
                "Amenaza vida",
                "Hospitalización",
                "Invalidez",
                "Defecto congénito",
              ]}
            />
          </div>

          {/* Suspensión */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
              Suspensión de Tratamiento
            </label>
            {editing ? (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.suspensionTratamiento ?? false}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      suspensionTratamiento: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[var(--brand-teal)] rounded"
                />
                <span className="text-sm text-[var(--foreground)]">
                  Tratamiento suspendido por este evento
                </span>
              </label>
            ) : (
              <span
                className={`flex items-center gap-1.5 text-sm font-semibold ${form.suspensionTratamiento ? "text-red-600" : "text-green-600"}`}
              >
                {form.suspensionTratamiento
                  ? "Sí — Tratamiento suspendido"
                  : "No — Tratamiento continuado"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
