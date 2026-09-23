import { AlertTriangle, Check, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface DeleteModalProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function DeleteModal({ open, url, onClose }: DeleteModalProps) {
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleDelete = () => {
    setDeleted(true);
    window.setTimeout(() => {
      setDeleted(false);
      onClose();
    }, 1600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <section
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
        className="modal-enter w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
              aria-hidden="true"
            >
              <Trash2 className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-destructive">Shortlinks</p>
              <h2 id="delete-title" className="font-display text-2xl font-bold text-foreground">Eliminar enlace</h2>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon-lg" aria-label="Cerrar modal" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </header>

        <div className="space-y-5 px-6 py-6 sm:px-8">
          <div className="flex gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden="true" />
            <p id="delete-description" className="text-base leading-relaxed text-foreground">
              ¿Seguro que quieres eliminar este enlace corto? Esta acción no se puede deshacer.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-secondary/60 px-4 py-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Enlace a eliminar</p>
            <p className="truncate font-mono text-sm text-foreground">{url}</p>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:px-8">
          <Button type="button" variant="outline" className="h-11 rounded-full px-6" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="h-11 rounded-full px-6"
            onClick={handleDelete}
            disabled={deleted}
          >
            {deleted ? (
              <>
                <Check className="size-4" /> Enlace eliminado
              </>
            ) : (
              <>
                <Trash2 className="size-4" /> Eliminar
              </>
            )}
          </Button>
        </footer>
      </section>
    </div>
  );
}
