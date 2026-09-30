import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Link2,
  Lock,
  Mail,
} from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Iniciar sesión | Compacto" },
      { name: "description", content: "Inicia sesión en Compacto para gestionar tus enlaces cortos." },
      { property: "og:title", content: "Iniciar sesión | Compacto" },
      { property: "og:description", content: "Inicia sesión en Compacto para gestionar tus enlaces cortos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29v-3.1H1.27a12 12 0 0 0 0 10.78l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.27 6.61l4.01 3.1C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

/** Anillo orbital: se dibuja una vez y gira completo con sus puntos. */
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
        {/* Puntos sobre la órbita (giran junto con el anillo) */}
        <circle cx="568" cy="39" r="9" fill="var(--color-primary)" fillOpacity="0.85" />
        <circle cx="8" cy="331" r="7" fill="var(--color-primary)" fillOpacity="0.7" />
        <circle cx="760" cy="568" r="10" fill="var(--color-primary)" fillOpacity="0.9" />
        <circle cx="640" cy="112" r="4" fill="var(--color-primary)" fillOpacity="0.45" />
        <circle cx="120" cy="590" r="4" fill="var(--color-primary)" fillOpacity="0.45" />
      </svg>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [keepSession, setKeepSession] = useState(false);

  const go = () => navigate({ to: "/" });

  return (
    <div className="dot-grid relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <a href="#login-form" className="skip-link">
        Ir al contenido
      </a>

      <OrbitRing />

      {/* Tarjeta de acceso */}
      <main
        id="login-form"
        className="modal-enter relative z-10 w-full max-w-md rounded-3xl border border-border bg-card px-6 py-10 shadow-elevated sm:px-10"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-primary-foreground shadow-action">
            <Link2 className="size-7" aria-hidden="true" />
          </span>
        </div>

        <h1 className="mt-6 text-center font-display text-3xl font-extrabold tracking-tight text-foreground">
          Bienvenido de nuevo.
        </h1>
        <p className="mt-2 text-center text-base text-muted-foreground">
          Inicia sesión para continuar
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            go();
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
              className="w-full rounded-full pl-12"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Contraseña</span>
            <Lock
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Contraseña"
              className="w-full rounded-full pl-12 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
            >
              {showPassword ? (
                <Eye className="size-5" aria-hidden="true" />
              ) : (
                <EyeOff className="size-5" aria-hidden="true" />
              )}
            </button>
          </label>

          <div className="flex items-center justify-end">
            <a
              href="#"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={keepSession}
              onChange={(e) => setKeepSession(e.target.checked)}
              className="size-4 shrink-0 cursor-pointer appearance-none rounded border border-input bg-background shadow-subtle checked:border-primary checked:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              style={{
                backgroundImage: keepSession
                  ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M3.5 8.5 6.5 11.5 12.5 4.5' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")"
                  : undefined,
                backgroundSize: "100% 100%",
              }}
            />
            Mantener la sesión activa
          </label>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Iniciar sesión
            <ArrowRight
              className="size-5 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </form>

        {/* Divisor */}
        <div className="my-6 flex items-center gap-4" aria-hidden="true">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">o</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Proveedores */}
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Github className="size-5" aria-hidden="true" />
            Continuar con GitHub
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-full border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <GoogleIcon />
            Continuar con Google
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <a
            href="/auth"
            className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            Crear cuenta
          </a>
        </p>
      </main>
    </div>
  );
}
