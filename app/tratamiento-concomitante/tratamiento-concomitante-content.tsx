"use client";

import { useState } from "react";
import {
  Search,
  FileDown,
  Stethoscope,
  Activity,
  Plus,
  Eye,
  Trash2,
} from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { DataPagination } from "@/components/ui/data-pagination";

import { NuevoConcomitanteModal } from "@/components/modals/nuevo-concomitante-modal";
import { VerEditarConcomitanteModal } from "@/components/modals/ver-editar-concomitante-modal";
import { ConfirmarEliminacionModal } from "@/components/modals/confirmar-eliminacion-modal";

import {
  useConcomitantes,
  deleteTratamientoConcomitante,
} from "@/lib/api/concomitantes";
import type { TratamientoConcomitante, ID } from "@/lib/types";

export function TratamientoConcomitanteContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<TratamientoConcomitante | null>(
    null,
  );

  const [deletingId, setDeletingId] = useState<ID | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filters: Record<string, unknown> = search
    ? { medicamento: { $containsi: search } }
    : {};

  const {
    items: concomitantes,
    meta,
    isLoading,
    mutate,
  } = useConcomitantes({
    pagination: { page, pageSize: 10 },
    filters: Object.keys(filters).length ? filters : undefined,
  });

  const totalRegistros = meta?.total ?? 0;

  const handleDelete = (id: ID) => {
    setDeletingId(id);
    setDeleteOpen(true);
  };

  return (
    <>
      <NuevoConcomitanteModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          mutate();
        }}
      />
      <VerEditarConcomitanteModal
        concomitante={selected}
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
            await deleteTratamientoConcomitante(deletingId);
            await mutate();
          } catch (error) {
            console.error("Error deleting concomitante:", error);
            alert("Error al eliminar el tratamiento concomitante");
          } finally {
            setDeletingId(null);
          }
        }}
        title="Confirmar eliminación"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        dangerText="Eliminar tratamiento concomitante"
      />

      <div className="p-6 flex flex-col gap-6">
        <PageHeader
          title="Gestión de Tratamiento Concomitante"
          subtitle="Registro de medicamentos adicionales administrados a pacientes durante el estudio"
          actions={
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Exportar PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-[var(--border)] rounded-lg bg-white hover:bg-[var(--muted)] transition-colors">
                <FileDown className="w-4 h-4" />
                Exportar Excel
              </button>
            </div>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Registros"
            value={totalRegistros}
            badge="En sistema"
            badgeVariant="teal"
            icon={<Stethoscope className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Cargados (página)"
            value={concomitantes.length}
            badge="En página"
            badgeVariant="teal"
            icon={<Activity className="w-5 h-5 text-[var(--brand-teal)]" />}
            accentColor="var(--brand-teal)"
          />
          <StatCard
            label="Con CRD vinculado"
            value={concomitantes.filter((c) => !!c.crd).length}
            badge="Vinculados"
            badgeVariant="gray"
            icon={<Activity className="w-5 h-5 text-slate-400" />}
            accentColor="#94a3b8"
          />
          <StatCard
            label="Sin CRD"
            value={concomitantes.filter((c) => !c.crd).length}
            badge="Sin CRD"
            badgeVariant="amber"
            icon={<Activity className="w-5 h-5 text-amber-500" />}
            accentColor="#f59e0b"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Buscar por nombre de medicamento..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--muted)] border border-transparent rounded-lg text-sm focus:outline-none focus:border-[var(--brand-teal)] focus:bg-white transition-all placeholder:text-[var(--muted-foreground)]"
              />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="ml-auto flex items-center gap-2 px-4 py-2.5 bg-[var(--brand-teal)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--brand-teal-dark)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Registrar Nuevo Medicamento
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
                    "CRD / Paciente",
                    "Medicamento",
                    "Vía de Adm.",
                    "Dosis Diaria",
                    "Acciones",
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
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      Cargando tratamientos concomitantes...
                    </td>
                  </tr>
                )}

                {!isLoading &&
                  concomitantes.map((c) => {
                    const crd = typeof c.crd === "object" ? c.crd : null;
                    const paciente =
                      typeof crd?.paciente === "object" ? crd?.paciente : null;

                    return (
                      <tr
                        key={c.id}
                        className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--brand-teal-muted)] flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-[var(--brand-teal)]">
                                {paciente?.iniciales?.slice(0, 2) ?? "CR"}
                              </span>
                            </div>
                            <span className="text-sm font-semibold text-[var(--brand-teal)]">
                              {paciente?.codigoInclusion ??
                                `CRD #${crd?.id ?? "—"}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm font-medium text-[var(--foreground)]">
                          {c.medicamento}
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                          {c.via ?? "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                          {c.dosisDiaria ?? "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelected(c)}
                              className="p-1.5 rounded-lg text-[var(--brand-teal)] hover:bg-[var(--brand-teal-muted)] transition-colors"
                              title="Ver / Editar"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              disabled={deletingId === c.id}
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

                {!isLoading && concomitantes.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-12 text-center text-sm text-[var(--muted-foreground)]"
                    >
                      No se encontraron tratamientos concomitantes con los
                      filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-4 flex items-center justify-between border-t border-[var(--border)]">
            <p className="text-sm text-[var(--muted-foreground)]">
              Mostrando{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {concomitantes.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-[var(--foreground)]">
                {totalRegistros}
              </span>{" "}
              registros
            </p>
            <DataPagination
              current={page}
              total={meta?.pageCount ?? 1}
              onChange={setPage}
            />
          </div>
        </div>

        {/* Protocol reminder */}
        <div className="flex items-start gap-3 p-4 bg-[var(--brand-teal-muted)] border border-teal-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-[var(--brand-teal)] flex items-center justify-center flex-shrink-0">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--brand-teal)]">
              Recordatorio de Protocolo
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 leading-relaxed">
              Todos los tratamientos concomitantes deben ser validados contra
              los criterios de exclusión del protocolo. Cualquier interacción
              medicamentosa sospechosa debe reportarse como Evento Adverso de
              Especial Interés (AESI) dentro de las 24h.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
