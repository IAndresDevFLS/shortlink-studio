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
            {/* Ruta de señal: la metáfora de Compacto en movimiento */}
            <svg
              className="absolute inset-0 h-full w-full text-white"
              viewBox="0 0 448 320"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
            >
              <path
                d="M-10 300 C 110 260, 60 130, 200 100 S 400 60, 460 10"
                stroke="currentColor"
                strokeOpacity="0.25"
                strokeWidth="1.5"
                strokeDasharray="3 9"
                strokeLinecap="round"
                className="animate-route-dash"
              />
              <circle r="3.5" fill="currentColor" fillOpacity="0.7" className="route-pulse">
                <animateMotion
                  dur="5.5s"
                  repeatCount="indefinite"
                  path="M-10 300 C 110 260, 60 130, 200 100 S 400 60, 460 10"
                />
              </circle>
              <circle r="9" fill="currentColor" fillOpacity="0.15" className="route-pulse">
                <animateMotion
                  dur="5.5s"
                  repeatCount="indefinite"
                  path="M-10 300 C 110 260, 60 130, 200 100 S 400 60, 460 10"
                />
              </circle>
              <circle cx="460" cy="10" r="3.5" fill="currentColor" fillOpacity="0.6" />
            </svg>
          </div>

          <div className="relative mx-auto flex size-16 items-center justify-center rounded-2xl bg-card text-primary shadow-elevated animate-fade-up">
            <Link2 className="size-8" aria-hidden="true" />
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
