import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Recuperar contraseña | Compacto" },
      { name: "description", content: "Recupera el acceso a tu cuenta de Compacto con un enlace de restablecimiento." },
      { property: "og:title", content: "Recuperar contraseña | Compacto" },
      { property: "og:description", content: "Recupera el acceso a tu cuenta de Compacto con un enlace de restablecimiento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ForgotPasswordPage,
});

/** Anillo orbital: el mismo motivo del login, girando en silencio de fondo. */
function OrbitRing() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 animate-spin-slow sm:size-[46rem] lg:size-[54rem]"
    >
      <svg viewBox="0 0 800 800" fill="none" className="size-full">
        <circle
          cx="400"
          cy="400"
          r="396"
          stroke="var(--color-primary)"
          strokeOpacity="0.35"
          strokeWidth="2"
        />
        <circle cx="568" cy="39" r="9" fill="var(--color-primary)" fillOpacity="0.85" />
        <circle cx="8" cy="331" r="7" fill="var(--color-primary)" fillOpacity="0.7" />
        <circle cx="760" cy="568" r="10" fill="var(--color-primary)" fillOpacity="0.9" />
        <circle cx="640" cy="112" r="4" fill="var(--color-primary)" fillOpacity="0.45" />
        <circle cx="120" cy="590" r="4" fill="var(--color-primary)" fillOpacity="0.45" />
      </svg>
    </div>
  );
}

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [captcha, setCaptcha] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");

  const goLogin = () => navigate({ to: "/login" });

  return (
    <div className="dot-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <a href="#forgot-form" className="skip-link">
        Ir al contenido
      </a>

      <OrbitRing />

      <main
        id="forgot-form"
        className="modal-enter relative z-10 w-full max-w-md rounded-3xl border border-border bg-card px-6 py-10 shadow-elevated sm:px-10"
      >
        {sent ? (
          /* Estado de confirmación */
          <div className="text-center">
            <div className="flex justify-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <CheckCircle2 className="size-7" aria-hidden="true" />
              </span>
            </div>
            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-foreground">
              Revisa tu correo
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Si <span className="font-semibold text-foreground">{email}</span> está
              registrado, te enviamos un enlace para elegir una nueva contraseña.
            </p>
            <button
              type="button"
              onClick={goLogin}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Volver a iniciar sesión
            </button>
          </div>
        ) : (
          <>
            {/* Icono de acceso */}
            <div className="flex justify-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
                <KeyRound className="size-7" aria-hidden="true" />
              </span>
            </div>

            <h1 className="mt-6 text-center font-display text-3xl font-extrabold tracking-tight text-foreground">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="mt-2 text-center text-base leading-relaxed text-muted-foreground">
              Escribe tu correo y te enviaremos un enlace para elegir una nueva.
            </p>

            <form
              className="mt-8 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <label className="relative block">
                <span className="sr-only">Correo electrónico</span>
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full pl-12"
                />
              </label>

              {/* Captcha de prueba */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <label
                  htmlFor="forgot-captcha"
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <Checkbox
                    id="forgot-captcha"
                    checked={captcha}
                    onCheckedChange={(v) => setCaptcha(v === true)}
                  />
                  No soy un robot
                </label>
                <span className="flex flex-col items-center gap-0.5 text-muted-foreground">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                  <span className="text-[10px] leading-none">Captcha de prueba</span>
                </span>
              </div>

              <button
                type="submit"
                disabled={!captcha}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Enviar enlace
                <ArrowRight
                  className="size-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </form>

            <button
              type="button"
              onClick={goLogin}
              className="mt-6 flex w-full items-center justify-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              Volver a iniciar sesión
            </button>
          </>
        )}
      </main>
    </div>
  );
}
