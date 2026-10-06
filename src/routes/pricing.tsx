import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Contrast, Link2, Moon, Sparkles, Sun } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Planes · Compacto" },
      { name: "description", content: "Planes Free, Plus y Prime de Compacto: elige el que mejor se ajuste a tus shortlinks." },
      { property: "og:title", content: "Planes · Compacto" },
      { property: "og:description", content: "Planes Free, Plus y Prime de Compacto: enlaces cortos con analítica clara." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pricing,
});

type Ciclo = "mensual" | "anual";

const PLANES = [
  {
    id: "free",
    nombre: "Free",
    precio: { mensual: "$0", anual: "$0" },
    detalle: { mensual: "para siempre", anual: "para siempre" },
    cta: "Comenzar gratis",
    destacado: false,
    features: [
      "Hasta 25 enlaces activos",
      "1 dominio conectado",
      "Historial de clics de 30 días",
      "Códigos QR ilimitados",
      "Protección con contraseña",
    ],
  },
  {
    id: "plus",
    nombre: "Plus",
    precio: { mensual: "$8/mes", anual: "$50/año" },
    detalle: { mensual: "facturado mensualmente", anual: "equivale a $4.17/mes" },
    cta: "Probar 14 días gratis",
    destacado: false,
    features: [
      "Hasta 100 enlaces activos",
      "3 dominios conectados",
      "Historial de clics de 12 meses",
      "Etiquetas y filtros avanzados",
      "Destinos dinámicos por canal",
      "Reportes de clics exportables",
    ],
  },
  {
    id: "prime",
    nombre: "Prime",
    precio: { mensual: "$15/mes", anual: "$150/año" },
    detalle: { mensual: "facturado mensualmente", anual: "equivale a $12.50/mes" },
    cta: "Suscribirme a Prime",
    destacado: true,
    features: [
      "Enlaces ilimitados",
      "Dominios ilimitados",
      "Historial de clics completo",
      "Pruebas A/B y agenda de campañas",
      "Audiencia: país, dispositivo y navegador",
      "Soporte prioritario",
    ],
  },
] as const;

function useTheme() {
  const [t, setT] = useState<"claro" | "oscuro" | "contraste">("claro");
  useEffect(() => {
    const s = localStorage.getItem("compacto-theme");
    if (s === "dark") setT("oscuro");
    if (s === "contraste") setT("contraste");
  }, []);
  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", t === "oscuro");
    el.classList.toggle("hc", t === "contraste");
    localStorage.setItem("compacto-theme", t === "oscuro" ? "dark" : t === "contraste" ? "contraste" : "light");
  }, [t]);
  return [t, setT] as const;
}

function Pricing() {
  const [theme, setTheme] = useTheme();
  const [ciclo, setCiclo] = useState<Ciclo>("anual");

  return (
    <div className="min-h-screen dot-grid">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-ring">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" aria-hidden /></span>
          <span className="font-display text-lg font-bold text-foreground">Compacto</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/" className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"><ArrowLeft className="size-3.5" aria-hidden />Volver</Link>
          <div role="radiogroup" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
            {([["claro", Sun, "Claro"], ["oscuro", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([k, I, l]) => (
              <button key={k} role="radio" aria-checked={theme === k} aria-label={l} title={l} onClick={() => setTheme(k)}
                className={`grid size-8 place-items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-ring ${theme === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><I className="size-4" aria-hidden /></button>
            ))}
          </div>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <section className="animate-fade-up pt-8 text-center sm:pt-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground shadow-subtle">Precios simples</p>
          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">Compacto Pricing</h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">Un plan para cada etapa. Empieza gratis y crece cuando tus enlaces lo pidan.</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <div role="group" aria-label="Periodicidad" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
              {(["mensual", "anual"] as const).map((c) => (
                <button key={c} aria-pressed={ciclo === c} onClick={() => setCiclo(c)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition focus-visible:outline-2 focus-visible:outline-ring ${ciclo === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>
              ))}
            </div>
            <span className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-subtle">USD</span>
          </div>
        </section>

        <section aria-label="Planes disponibles" className="mt-10 grid items-stretch gap-5 md:grid-cols-3">
          {PLANES.map((p, i) => (
            <article key={p.id} style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              aria-labelledby={`plan-${p.id}`}
              className={`animate-fade-up relative flex flex-col rounded-3xl bg-card p-6 shadow-subtle ${p.destacado ? "border-2 border-primary shadow-elevated" : "border border-border"}`}>
              {p.destacado && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-primary-foreground shadow-action"><Sparkles className="size-3" aria-hidden />Más popular</span>
              )}
              <h2 id={`plan-${p.id}`} className="font-display text-xl font-bold text-foreground">{p.nombre}</h2>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-4xl font-extrabold tabular-nums text-foreground">{p.precio[ciclo]}</span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{p.detalle[ciclo]}</p>
              <ul className="mt-5 flex-1 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-foreground">
                    <Check className={`mt-0.5 size-4 shrink-0 ${p.destacado ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${p.destacado ? "bg-brand-gradient text-primary-foreground shadow-action" : "border border-border text-foreground hover:bg-muted"}`}>
                {p.cta}
              </a>
            </article>
          ))}
        </section>

        <p className="mt-8 text-center text-xs text-muted-foreground">Todos los planes incluyen códigos QR, redirección 301 y cumplimiento de GDPR. Los precios están en dólares estadounidenses.</p>
      </main>
    </div>
  );
}
