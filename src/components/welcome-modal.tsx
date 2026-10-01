import { useEffect, useRef } from "react";
import { ArrowRight, MousePointerClick } from "lucide-react";

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

const CURVE = "M10 118 C 70 108, 110 92, 150 72 S 240 34, 288 16";
const DOTS: Array<[number, number]> = [
  [10, 118],
  [70, 101],
  [130, 80],
  [190, 55],
  [250, 32],
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
        <h1
          id="welcome-title"
          className="text-center font-display text-3xl font-extrabold tracking-tight text-foreground animate-fade-up"
        >
          ¡Bienvenido a Compacto!
        </h1>
        <p className="mx-auto mt-3 max-w-xs text-center text-sm leading-relaxed text-muted-foreground animate-fade-up [animation-delay:0.15s]">
          Todo lo que necesitas para crecer, en un solo lugar.
        </p>

        {/* Curva de crecimiento */}
        <div className="relative mx-auto mt-7 h-36 w-full max-w-[18rem] animate-fade-up [animation-delay:0.3s]">
          <svg
            aria-hidden="true"
            viewBox="0 0 300 140"
            className="absolute inset-0 size-full"
            fill="none"
          >
            <defs>
              <linearGradient id="welcome-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.18" />
                <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${CURVE} L288 140 L10 140 Z`} fill="url(#welcome-area)" />
            <path
              d={CURVE}
              stroke="var(--primary)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="520"
              className="animate-draw"
            />
            {DOTS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="var(--primary)" />
            ))}
          </svg>

          {/* Punto final pulsante */}
          <div className="absolute right-[1%] top-6 flex size-10 -translate-y-1 items-center justify-center">
            <span aria-hidden="true" className="absolute size-8 rounded-full bg-primary/25 animate-ripple" />
            <span aria-hidden="true" className="absolute size-8 rounded-full bg-primary/25 animate-ripple [animation-delay:1.2s]" />
            <span className="relative size-3 rounded-full bg-primary" />
          </div>

          {/* Chip +1 clic */}
          <span
            className="absolute right-0 top-0 inline-flex items-center rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground animate-fade-up [animation-delay:1.9s]"
          >
            +1 clic
          </span>
        </div>

        <button
          ref={buttonRef}
          type="button"
          onClick={onClose}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring animate-fade-up [animation-delay:2.1s]"
        >
          <MousePointerClick className="size-5" aria-hidden="true" />
          ¡Listo, empecemos!
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
