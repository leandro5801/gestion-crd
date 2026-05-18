"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type ConfirmarEliminacionModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  confirmText?: string;
  dangerText?: string;
};

export function ConfirmarEliminacionModal({
  open,
  onClose,
  onConfirm,
  title = "Confirmar eliminación",
  description = "Esta acción no se puede deshacer.",
  confirmText = "Eliminar",
  dangerText = "Eliminar registro",
}: ConfirmarEliminacionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const canSubmit = useMemo(() => !isSubmitting, [isSubmitting]);

  const handleConfirm = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogOverlay />
      <DialogContent className="p-0 overflow-hidden border border-red-100">
        <div className="p-6">
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-[1.05rem] leading-tight">
                  {title}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  <span className="block text-sm text-[var(--muted-foreground)]">
                    {description}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-red-700">
                    {dangerText}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 bg-[var(--brand-teal-muted)] border border-teal-100/70 rounded-xl p-4">
            <p
              className={cn(
                "text-xs text-[var(--muted-foreground)]",
                hasMounted ? "" : "opacity-0",
              )}
            >
              Asegúrate de que el registro seleccionado sea el correcto antes de
              continuar.
            </p>
          </div>

          <DialogFooter className="mt-6">
            <div className="flex w-full gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="border-[var(--border)]"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirm}
                disabled={!canSubmit}
                className="bg-red-600 hover:bg-red-600/90"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {confirmText}
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
