import { useEffect, useRef } from "react";
import { ArrowRight, Check, MousePointerClick } from "lucide-react";

const WELCOME_KEY = "compacto-welcome";

export function hasSeenWelcome() {
  try {
    return localStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return true; // sin almacenamiento, no repetir el modal
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    /* almacenamiento no disponible */
  }
}

export function WelcomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) buttonRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-foreground/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      {/* Aurora: resplandor esmeralda bajando desde arriba */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-56 left-1/2 size-[34rem] -translate-x-1/2 rounded-full bg-primary/35 blur-3xl animate-float-slow" />
        <div className="absolute -top-40 left-1/4 size-72 rounded-full bg-primary/20 blur-3xl animate-float-slow [animation-delay:-3s]" />
        <div className="absolute -top-40 right-1/4 size-72 rounded-full bg-primary/20 blur-3xl animate-float-slow [animation-delay:-6s]" />
      </div>

      <div className="modal-enter relative w-full max-w-md rounded-3xl border border-border bg-card px-8 pb-9 pt-12 shadow-elevated">
        {/* Pill del shortlink con anillos concéntricos */}
        <div className="relative mx-auto flex h-14 w-fit items-center animate-fade-up">
          <span aria-hidden="true" className="absolute -inset-2 rounded-full border border-primary/30 animate-ripple" />
          <span aria-hidden="true" className="absolute -inset-2 rounded-full border border-primary/20 animate-ripple [animation-delay:1.2s]" />
          <span className="relative inline-flex items-center gap-2.5 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground shadow-subtle">
            <span className="flex size-6 items-center justify-center rounded-full bg-primary">
              <Check className="size-3.5 text-primary-foreground" aria-hidden="true" />
            </span>
            compacto.to/x7k2
          </span>
        </div>

        <h1
          id="welcome-title"
          className="mt-6 text-center font-display text-3xl font-extrabold tracking-tight text-foreground animate-fade-up [animation-delay:0.25s]"
        >
          ¡Bienvenido a Compacto!
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-muted-foreground animate-fade-up [animation-delay:0.4s]">
          Tu enlace corto ya está listo para compartir.
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-fade-up [animation-delay:0.55s]"
        >
          <MousePointerClick className="size-5" aria-hidden="true" />
          ¡Listo, empecemos!
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
