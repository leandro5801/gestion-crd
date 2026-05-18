"use client";

import { useState } from "react";
import {
  Search,
  FileDown,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  Trash2,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { SeverityBadge } from "@/components/ui/status-badge";
import { DataPagination } from "@/components/ui/data-pagination";

import { NuevoEventoModal } from "@/components/modals/nuevo-evento-modal";
import { VerEditarEventoModal } from "@/components/modals/ver-editar-evento-modal";
import { ConfirmarEliminacionModal } from "@/components/modals/confirmar-eliminacion-modal";

import {
  useEventosAdversos,
  deleteEventoAdverso,
} from "@/lib/api/eventos-adversos";
import type { EventoAdverso, ID } from "@/lib/types";

const imputabilidadStyle: Record<string, string> = {
  Definitiva: "bg-slate-100 text-slate-700 border border-slate-200",
  Probable: "bg-slate-100 text-slate-700 border border-slate-200",
  Posible: "bg-slate-100 text-slate-600 border border-slate-200",
  "No relacionado": "bg-slate-50 text-slate-500 border border-slate-200",
  "No clasificable": "bg-slate-50 text-slate-400 border border-slate-200",
};

export function EventosAdversosContent() {
  const [search, setSearch] = useState("");
  const [intensidad, setIntensidad] = useState("Todos");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<EventoAdverso | null>(null);

  const [deletingId, setDeletingId] = useState<ID | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filters: Record<string, unknown> = {};
  if (intensidad !== "Todos") filters.intensidad = { $eq: intensidad };
  if (search) {
    filters.$or = [{ SOC: { $containsi: search } }];
  }

  const {
    items: eventos,
    meta,
    isLoading,
    mutate,
  } = useEventosAdversos({
    pagination: { page, pageSize: 10 },
    filters: Object.keys(filters).length ? filters : undefined,
  });

  const totalEventos = meta?.total ?? 0;
  const seriosTotal = eventos.filter((e) => e.intensidad === "Severo").length;

  const handleDelete = (id: ID) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  return (
    <>
      <NuevoEventoModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          mutate();
        }}
      />
      <VerEditarEventoModal
        evento={selected}
        onClose={() => {
          setSelected(null);
          mutate();
        }}
      />

      <ConfirmarEliminacionModal
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeletingId(null);
        }}
        onConfirm={async () => {
          if (!deletingId) return;
          try {
            await deleteEventoAdverso(deletingId);
            await mutate();
          } catch (error) {
            console.error("Error deleting evento:", error);
            alert("Error al eliminar el evento adverso");
          } finally {
            setDeletingId(null);
          }
        }}
        title="Confirmar eliminación"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        dangerText="Eliminar evento adverso"
      />

      <div className="p-6 flex flex-col gap-6">
        <PageHeader
          title="Eventos Adversos"
          subtitle="Pharmacovigilance Dashboard & Surveillance Tracking"
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Export PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Export Excel
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Active Cases"
            value={totalEventos.toLocaleString()}
            badge="En sistema"
            badgeVariant="teal"
            icon={<Activity className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Serious (SAE) página"
            value={seriosTotal}
            badge="Alert"
            badgeVariant="red"
            icon={<AlertTriangle className="w-5 h-5 text-red-500" />}
            accentColor="#ef4444"
          />
          <StatCard
            label="Moderados (página)"
            value={eventos.filter((e) => e.intensidad === "Moderado").length}
            badge="-0.2d"
            badgeVariant="teal"
            icon={<Clock className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Leves (página)"
            value={eventos.filter((e) => e.intensidad === "Leve").length}
            badge="Verified"
            badgeVariant="teal"
            icon={<TrendingUp className="w-5 h-5 text-green-500" />}
            accentColor="#16a34a"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by SOC..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                Severity
              </label>
              <select
                value={intensidad}
                onChange={(e) => {
                  setIntensidad(e.target.value);
                  setPage(1);
                }}
                className="px-3 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-white focus:outline-none focus:border-[var(--brand-teal)] transition-colors"
              >
                {["Todos", "Severo", "Moderado", "Leve"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Case Report
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  {[
                    "SOC / Tipo",
                    "Gravedad",
                    "Intensidad",
                    "Imputabilidad",
                    "Suspensión",
                    "Tipo EA",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      Cargando eventos adversos...
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  eventos.map((e) => {
                    const tipoEA =
                      typeof e.tipo_evento_adverso === "object"
                        ? e.tipo_evento_adverso
                        : null;

                    return (
                      <tr
                        key={e.id}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-[var(--foreground)]">
                            {e.SOC ?? "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-xs text-[var(--foreground)]">
                          {e.gravedad}
                        </td>
                        <td className="px-5 py-4">
                          <SeverityBadge level={e.intensidad} />
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              imputabilidadStyle[e.imputabilidad] ??
                              "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {e.imputabilidad}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                              e.suspensionTratamiento
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-green-50 text-green-700 border border-green-200"
                            }`}
                          >
                            {e.suspensionTratamiento ? "Sí" : "NO"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--muted-foreground)]">
                          {tipoEA?.nombre ?? "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelected(e)}
                              className="p-1.5 rounded-lg text-[var(--brand-teal)] hover:bg-[var(--brand-teal-muted)] transition-colors"
                              title="Ver / Editar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(e.id)}
                              disabled={deletingId === e.id}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                {!isLoading && eventos.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      No adverse events match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Showing{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {eventos.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {totalEventos.toLocaleString()}
              </span>{" "}
              entries
            </p>
            <DataPagination
              current={page}
              total={meta?.pageCount ?? 1}
              onChange={setPage}
            />
          </div>
        </div>

        {/* Bottom panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[var(--brand-teal)] rounded-xl p-6 flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2">
                Automated Signal Detection
              </h3>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Revise los eventos adversos con imputabilidad
                &apos;Definitiva&apos; o &apos;Probable&apos; para identificar
                posibles señales de seguridad y su reporte regulatorio.
              </p>
              <button className="px-4 py-2 bg-white/10 border border-white/30 text-white text-sm font-semibold rounded-lg hover:bg-white/20 transition-colors">
                Review Signal Clusters
              </button>
            </div>
            <div className="hidden md:flex w-28 h-24 rounded-xl bg-white/10 items-center justify-center flex-shrink-0">
              {/* icon placeholder */}
              <div className="w-10 h-10 bg-white/20 rounded-full" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[var(--border)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Surveillance Legend
            </p>
            <div className="flex flex-col gap-3">
              {[
                {
                  color: "bg-red-500",
                  label: "Severe: Immediate MedDRA reporting required",
                },
                {
                  color: "bg-amber-500",
                  label: "Moderate: Review within 48 hours",
                },
                {
                  color: "bg-slate-400",
                  label: "Mild: Baseline observational data",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 mt-0.5 ${item.color}`}
                  />
                  <p className="text-sm text-[var(--foreground)] leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
