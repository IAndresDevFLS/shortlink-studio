import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  Copy,
  Link2,
  Mail,
  MessageCircle,
  Moon,
  Network,
  Share2,
  Sun,
  Twitter,
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

const MODULES = [
  {
    icon: Link2,
    title: "Crear",
    description: "Convierte cualquier contenido en un enlace corto y confiable.",
    footer: "chip" as const,
  },
  {
    icon: Share2,
    title: "Distribuir",
    description: "Comparte en todos tus canales.",
    footer: "social" as const,
  },
  {
    icon: BarChart3,
    title: "Medir",
    description: "Conoce el impacto en tiempo real.",
    footer: "metric" as const,
  },
];

function Connector() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 60"
      fill="none"
      className="hidden h-14 w-9 shrink-0 md:block"
    >
      <path
        d="M2 6 C 18 6, 22 54, 38 54"
        stroke="var(--color-primary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="0.5 7"
      />
      <circle cx="2" cy="6" r="3" className="fill-primary" />
      <circle cx="38" cy="54" r="3" className="fill-primary" />
    </svg>
  );
}

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

  return (
    <div className="technical-grid flex min-h-screen flex-col">
      <a href="#auth-panel" className="skip-link">
        Ir al contenido
      </a>

      {/* Barra superior */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <a href="/auth" className="flex items-center gap-2" aria-label="Compacto, inicio">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Link2 className="size-5" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Compacto
          </span>
        </a>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
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
        </div>
      </header>

      {/* Tarjeta principal */}
      <main className="flex flex-1 items-center justify-center px-4 pb-10 md:px-12">
        <div className="modal-enter grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:grid-cols-[1.15fr_1fr]">
          {/* Panel izquierdo: escena técnica */}
          <section
            className="relative flex min-w-0 flex-col justify-between gap-10 bg-accent p-6 sm:p-8 md:p-12"
            aria-hidden="false"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -right-24 -top-24 size-72 rounded-full border border-primary/15" />
              <div className="absolute -bottom-32 -left-20 size-96 rounded-full border border-primary/15" />
              <span className="absolute right-24 top-28 size-2 rounded-full bg-primary/40" />
              <span className="absolute bottom-36 left-16 size-2 rounded-full bg-primary/30" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Link2 className="size-5" aria-hidden="true" />
                </span>
                <span className="font-display text-xl font-bold tracking-tight text-foreground">
                  Compacto
                </span>
              </div>
              <h1 className="mt-10 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-foreground md:text-5xl">
                Una ruta simple
                <br />
                <span className="text-primary">para cada enlace</span>
              </h1>
              <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">
                Crea, distribuye y mide tus enlaces en un solo lugar. Menos pasos,
                más resultados.
              </p>
            </div>

            {/* Módulos conectados */}
            <div
              className="relative flex flex-col items-stretch gap-3 sm:gap-1 md:flex-row md:gap-2"
              role="list"
            >
              {MODULES.map((mod, i) => (
                <div key={mod.title} className="contents">
                  <article
                    role="listitem"
                    className="flex min-w-0 flex-1 flex-row items-start gap-3 rounded-2xl border border-border bg-card p-4 shadow-subtle md:flex-col md:items-stretch md:gap-0"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                      <mod.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="flex min-w-0 flex-1 flex-col">
                    <h2 className="font-display text-base font-bold text-foreground md:mt-3">
                      {mod.title}
                    </h2>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                      {mod.description}
                    </p>
                    {mod.footer === "chip" && (
                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1.5 font-mono text-[11px] font-medium text-primary">
                        compa.to/7H3k9
                        <Copy className="size-3" aria-hidden="true" />
                      </span>
                    )}
                    {mod.footer === "social" && (
                      <span className="mt-3 flex items-center gap-1.5 text-primary">
                        <MessageCircle className="size-4" aria-label="WhatsApp" />
                        <Network className="size-4" aria-label="LinkedIn" />
                        <Twitter className="size-4" aria-label="X" />
                        <Mail className="size-4" aria-label="Email" />
                      </span>
                    )}
                    {mod.footer === "metric" && (
                      <span className="mt-3 inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 rounded-lg bg-accent px-2.5 py-1.5 text-[11px] font-semibold text-foreground">
                        1,204 clics
                        <span className="inline-flex items-center gap-0.5 font-semibold text-primary">
                          +12%
                          <ArrowRight className="size-3 rotate-[-35deg]" aria-hidden="true" />
                        </span>
                      </span>
                    )}
                    </div>
                  </article>
                  {i < MODULES.length - 1 && <Connector />}
                </div>
              ))}
            </div>

            <p className="relative flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Enlaces que impulsan
              <span aria-hidden="true" className="h-px w-16 bg-primary/50" />
              <span className="sr-only">lo que sigue</span>
            </p>
          </section>

          {/* Panel derecho: acceso */}
          <section
            id="auth-panel"
            className="flex flex-col justify-center px-8 py-12 md:px-14"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Bienvenido a Compacto
            </h2>
            <p className="mt-2 text-base text-muted-foreground">
              Elige cómo quieres continuar.
            </p>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={go}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Iniciar sesión
                <ArrowRight
                  className="size-5 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
              <button
                type="button"
                onClick={go}
                className="group flex w-full items-center justify-center gap-2 rounded-full border border-input bg-background px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Crear cuenta
                <ArrowRight
                  className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </button>
            </div>

            <p className="mt-6 text-center text-sm leading-relaxed text-muted-foreground">
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

            <div className="mt-8 border-t border-border pt-6 text-center">
              <p className="text-sm text-muted-foreground">
                ¿Necesitas ayuda?{" "}
                <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Contactar soporte.
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
