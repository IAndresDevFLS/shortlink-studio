import { useEffect, useRef } from "react";
import { ArrowRight, Link2, MousePointerClick } from "lucide-react";

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

const CHIPS = [
  { slug: "cmp.to/eq7", className: "left-1/2 top-0 -translate-x-1/2", delay: "0.35s" },
  { slug: "cmp.to/ah3", className: "left-2 top-8", delay: "0.45s" },
  { slug: "cmp.to/m2f", className: "right-2 top-8", delay: "0.55s" },
  { slug: "cmp.to/x9k", className: "bottom-9 left-0", delay: "0.65s" },
  { slug: "cmp.to/b8n", className: "bottom-9 right-0", delay: "0.75s" },
];

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
      <div className="modal-enter relative w-full max-w-md rounded-3xl border border-border bg-card px-8 pb-9 pt-10 shadow-elevated">
        {/* Explosión de enlaces: pastillas que salen del logo */}
        <div className="relative mx-auto h-44 w-full max-w-xs animate-fade-up">
          <svg
            aria-hidden="true"
            viewBox="0 0 300 176"
            className="absolute inset-0 size-full"
            fill="none"
          >
            {[
              "M150 88 L150 18",
              "M150 88 L48 44",
              "M150 88 L252 44",
              "M150 88 L40 132",
              "M150 88 L260 132",
            ].map((d) => (
              <path
                key={d}
                d={d}
                stroke="var(--primary)"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
            ))}
          </svg>

          {/* Logo central */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="flex size-16 items-center justify-center rounded-2xl bg-primary shadow-action">
              <Link2 className="size-8 text-primary-foreground" aria-hidden="true" />
            </span>
          </div>

          {/* Pastillas de shortlinks */}
          {CHIPS.map(({ slug, className, delay }) => (
            <span
              key={slug}
              className={`absolute inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-foreground shadow-subtle animate-fade-up ${className}`}
              style={{ animationDelay: delay }}
            >
              <Link2 className="size-3 text-primary" aria-hidden="true" />
              {slug}
            </span>
          ))}
        </div>

        <h1
          id="welcome-title"
          className="mt-4 text-center font-display text-3xl font-extrabold tracking-tight text-foreground animate-fade-up [animation-delay:0.85s]"
        >
          ¡Bienvenido a Compacto!
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-muted-foreground animate-fade-up [animation-delay:0.95s]">
          Acorta, comparte y lleva tus ideas más lejos.
        </p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-fade-up [animation-delay:1.05s]"
        >
          <MousePointerClick className="size-5" aria-hidden="true" />
          ¡Listo, empecemos!
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
