import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Link2,
  LogIn,
  Moon,
  Sun,
  UserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Bienvenido | Compacto" },
      { name: "description", content: "Accede a Compacto y toma el control de tus enlaces cortos." },
      { property: "og:title", content: "Bienvenido | Compacto" },
      { property: "og:description", content: "Accede a Compacto y toma el control de tus enlaces cortos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("compacto-theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const go = () => navigate({ to: "/" });
  const goLogin = () => navigate({ to: "/login" });

  return (
    <div className="technical-grid flex min-h-screen flex-col">
      <a href="#auth-panel" className="skip-link">
        Ir al contenido
      </a>

      {/* Barra superior: idioma y tema */}
      <header className="flex items-center justify-end gap-3 px-6 py-5 md:px-12">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Cambiar idioma"
          >
            Español
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={toggleDark}
          aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-subtle transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        >
          {dark ? (
            <Sun className="size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-5" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Tarjeta principal */}
      <main className="flex flex-1 items-center justify-center px-4 pb-10 md:px-12">
        <div className="modal-enter grid w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:grid-cols-[1.15fr_1fr]">
          {/* Panel izquierdo oscuro */}
          <section
            className="relative flex min-w-0 flex-col justify-between gap-16 overflow-hidden bg-ink p-8 sm:p-10 md:p-12"
            aria-hidden="false"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute -right-20 top-16 size-64 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-primary/10 blur-2xl" />
              <div className="absolute -bottom-10 right-10 size-40 rounded-full border border-primary/25" />
            </div>

            <div className="relative flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Link2 className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink-foreground">
                Compacto
              </span>
            </div>

            <div className="relative">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-foreground md:text-[2.75rem] md:leading-[1.1]">
                Bienvenido
              </h1>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-ink-foreground/70">
                Inicia sesión con tu cuenta existente o crea una cuenta nueva.
              </p>
            </div>
          </section>

          {/* Panel derecho: acceso */}
          <section
            id="auth-panel"
            className="flex flex-col justify-center px-8 py-12 md:px-12"
          >
            <h2 className="text-center font-display text-3xl font-bold tracking-tight text-foreground">
              Comienza
            </h2>
            <p className="mt-2 text-center text-base text-muted-foreground">
              Elige cómo quieres continuar.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={goLogin}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <LogIn className="size-5" aria-hidden="true" />
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={go}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-input bg-background px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <UserRound className="size-5 text-muted-foreground" aria-hidden="true" />
                Crear cuenta
              </button>
            </div>

            <p className="mt-8 text-center text-sm leading-relaxed text-muted-foreground">
              Al continuar, aceptas nuestros{" "}
              <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                Términos de servicio
              </a>{" "}
              y nuestra{" "}
              <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                Política de privacidad
              </a>
              .
            </p>
          </section>
        </div>

      </main>

      {/* Ayuda bajo la tarjeta */}
      <footer className="px-6 pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
            Contactar soporte
          </a>
        </p>
      </footer>
    </div>
  );
}
