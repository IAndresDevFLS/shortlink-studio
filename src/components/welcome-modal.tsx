import { useEffect, useRef } from "react";
import { ArrowRight, BarChart3, Link2, MousePointerClick, Rocket } from "lucide-react";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
    >
      <div className="modal-enter relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
        {/* Panel esmeralda */}
        <section className="relative overflow-hidden bg-ink px-8 pb-9 pt-10 text-center">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-10 size-48 rounded-full bg-primary/40 blur-3xl animate-float-slow" />
            <div className="absolute -bottom-20 -left-14 size-56 rounded-full bg-primary/25 blur-3xl animate-float-slow [animation-delay:-4.5s]" />
          </div>

          {/* Icono con ondas de señal */}
          <div className="relative mx-auto flex size-16 items-center justify-center animate-fade-up">
            <span aria-hidden="true" className="absolute inset-0 rounded-2xl border border-white/40 animate-ripple" />
            <span aria-hidden="true" className="absolute inset-0 rounded-2xl border border-white/25 animate-ripple [animation-delay:1.2s]" />
            <span className="relative flex size-16 items-center justify-center rounded-2xl bg-card text-primary shadow-elevated">
              <Link2 className="size-8" aria-hidden="true" />
            </span>
          </div>

          <h1
            id="welcome-title"
            className="relative mt-6 font-display text-3xl font-extrabold tracking-tight text-ink-foreground animate-fade-up [animation-delay:0.15s]"
          >
            ¡Bienvenido a Compacto!
          </h1>
          <p className="relative mx-auto mt-3 max-w-xs text-sm leading-relaxed text-ink-foreground/80 animate-fade-up [animation-delay:0.3s]">
            Tu cuenta está lista. Explora el panel y configura tu perfil cuando quieras.
          </p>

          {/* Compresión de enlace: la esencia de Compacto en movimiento */}
          <div
            aria-hidden="true"
            className="relative mx-auto mt-6 h-12 w-full max-w-[17rem] rounded-full border border-white/15 bg-white/10 animate-fade-up [animation-delay:0.4s]"
          >
            <span className="absolute inset-0 flex items-center overflow-hidden px-5 text-[11px] tracking-tight text-white/60 animate-url-out">
              https://tu-tienda.com/coleccion/verano-2026?utm=ig
            </span>
            <span className="absolute inset-0 flex items-center justify-center animate-url-in">
              <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-bold text-primary shadow-elevated">
                <Link2 className="size-4" aria-hidden="true" />
                compacto.to/x7k2
                <Check className="size-4" aria-hidden="true" />
              </span>
            </span>
            <span className="absolute -right-1 -top-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold text-ink-foreground shadow-subtle animate-click-pop">
              <BarChart3 className="size-3" aria-hidden="true" />
              +1 clic
            </span>
          </div>
        </section>

        {/* Acciones */}
        <section className="px-8 pb-8 pt-7 text-center">
          <div className="flex items-center justify-center gap-2 animate-fade-up [animation-delay:0.45s]">
            {[
              { icon: Link2, label: "Crear" },
              { icon: Rocket, label: "Distribuir" },
              { icon: BarChart3, label: "Medir" },
            ].map(({ icon: Icon, label }, index) => (
              <div key={label} className="flex items-center gap-2">
                {index > 0 && <span className="h-px w-4 bg-border" aria-hidden="true" />}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
                  <Icon className="size-3.5" aria-hidden="true" />
                  {label}
                </span>
              </div>
            ))}
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-fade-up [animation-delay:0.55s]"
          >
            <MousePointerClick className="size-5" aria-hidden="true" />
            ¡Listo, empecemos!
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
        </section>
      </div>
    </div>
  );
}
