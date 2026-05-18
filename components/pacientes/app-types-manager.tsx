"use client";

import { useState, useEffect } from "react";
import { X, Plus, Tags, Pencil, Check, Trash2 } from "lucide-react";
import { useApps, appsApi } from "@/lib/api/apps";

type AppType = {
  id?: string | number;
  label: string;
  description?: string;
  color: string;
};

const COLOR_OPTIONS = [
  { value: "bg-blue-100 text-blue-700", label: "Azul" },
  { value: "bg-teal-100 text-teal-700", label: "Teal" },
  { value: "bg-green-100 text-green-700", label: "Verde" },
  { value: "bg-amber-100 text-amber-700", label: "Ámbar" },
  { value: "bg-orange-100 text-orange-700", label: "Naranja" },
  { value: "bg-red-100 text-red-700", label: "Rojo" },
  { value: "bg-purple-100 text-purple-700", label: "Morado" },
  { value: "bg-slate-100 text-slate-700", label: "Gris" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AppTypesManager({ open, onClose }: Props) {
  const { data } = useApps();
  console.log(data);

  const [types, setTypes] = useState<AppType[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState(COLOR_OPTIONS[0].value);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editColor, setEditColor] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync API data with local state
  useEffect(() => {
    if (data?.data.length > 0) {
      console.log("AQUI");

      setTypes(
        data?.data.map((t) => ({
          id: t.id,
          label: t.titulo || t.label,
          description: t.descripcion || t.description || "",
          color: t.color || "bg-blue-100 text-blue-700",
        })),
      );
    }
  }, [data]);

  if (!open) return null;

  const handleAdd = async () => {
    const label = newLabel.trim().toUpperCase();
    if (!label) return;
    setSaving(true);
    try {
      await appsApi.create({
        titulo: label,
        descripcion: newDesc.trim(),
        // color: newColor,
      });
      setNewLabel("");
      setNewDesc("");
      setNewColor(COLOR_OPTIONS[0].value);
    } catch (error) {
      console.error("Error adding app type:", error);
    }
    setSaving(false);
  };

  const handleStartEdit = (t: AppType) => {
    setEditingId(t.id);
    setEditLabel(t.label);
    setEditDesc(t.description);
    setEditColor(t.color);
  };

  const handleSaveEdit = async (id: string | number | undefined) => {
    if (!id) return;
    setSaving(true);
    try {
      await appsApi.update(id as string, {
        titulo: editLabel.toUpperCase(),
        descripcion: editDesc,
        color: editColor,
      });
      setEditingId(null);
    } catch (error) {
      console.error("Error updating app type:", error);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string | number | undefined) => {
    if (!id) return;
    try {
      await appsApi.delete(id as string);
    } catch (error) {
      console.error("Error deleting app type:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand-teal-muted)] flex items-center justify-center">
              <Tags className="w-4.5 h-4.5 text-[var(--brand-teal)]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--foreground)]">
                Tipos de APP
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Gestionar antecedentes patológicos disponibles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-4 flex flex-col gap-2">
          {types.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors group"
            >
              {editingId === t.id ? (
                // Edit row
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      value={editLabel}
                      onChange={(e) => setEditLabel(e.target.value)}
                      placeholder="Etiqueta"
                      className="flex-1 px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-sm font-semibold focus:outline-none focus:border-[var(--brand-teal)] transition-colors uppercase"
                    />
                    <select
                      value={editColor}
                      onChange={(e) => setEditColor(e.target.value)}
                      className="px-2 py-1.5 border border-[var(--border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                    >
                      {COLOR_OPTIONS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Descripción (opcional)"
                    className="px-2.5 py-1.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-3">
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${t.color}`}
                  >
                    {t.label}
                  </span>
                  <p className="text-sm text-[var(--muted-foreground)] truncate">
                    {t.description || <em>Sin descripción</em>}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {editingId === t.id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(t.id)}
                      disabled={saving}
                      className="p-1.5 rounded-lg bg-[var(--brand-teal)] text-white hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-60"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleStartEdit(t)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {types.length === 0 && (
            <div className="py-10 text-center text-sm text-[var(--muted-foreground)]">
              No hay tipos de APP registrados. Crea uno abajo.
            </div>
          )}
        </div>

        {/* Add new */}
        <div className="p-4 border-t border-[var(--border)] bg-[var(--muted)] rounded-b-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-3">
            Nuevo Tipo de APP
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Etiqueta (ej: ICC)"
                className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors uppercase placeholder:normal-case"
              />
              <select
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className="px-2 py-2 border border-[var(--border)] rounded-lg text-xs bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
              >
                {COLOR_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descripción (opcional)"
              className="px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
            />
            <button
              onClick={handleAdd}
              disabled={!newLabel.trim() || saving}
              className="flex items-center justify-center gap-2 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              {saving ? "Guardando..." : "Agregar Tipo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
