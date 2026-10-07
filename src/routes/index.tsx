import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle, ArrowDownUp, ArrowDownRight, ArrowUpRight, BarChart3, CalendarClock, Check, ChevronLeft, ChevronRight,
  Contrast, Copy, Globe, Link2, Lock, MousePointerClick, Moon, Plus, QrCode, RotateCcw, Search, SlidersHorizontal,
  Sparkles, Star, Sun, Zap,
} from "lucide-react";
import { WelcomeModal, hasSeenWelcome, markWelcomeSeen } from "@/components/welcome-modal";
import { CreateModal } from "@/components/create-modal";
import { QrModal } from "@/components/qr-modal";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type Estado = "normal" | "carga" | "vacio" | "error";
type Plan = "pro" | "free";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { estado?: Estado; plan?: Plan } => {
    const e = s["estado"] as Estado | undefined; const p = s["plan"] as Plan | undefined;
    return { ...(e && ["carga", "vacio", "error"].includes(e) ? { estado: e } : {}), ...(p === "free" ? { plan: p } : {}) };
  },
  head: () => ({
    meta: [
      { title: "Dashboard general · Compacto" },
      { name: "description", content: "Pulso de tus enlaces cortos: clics, enlaces estrella, vencimientos y audiencia en un vistazo." },
      { property: "og:title", content: "Dashboard general · Compacto" },
      { property: "og:description", content: "Tus enlaces están trabajando para ti: clics y rendimiento de cada shortlink." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

/* ---------------- Datos de demostración ---------------- */
type L = { slug: string; dominio: string; destino: string; clics: number; creado: string; vence: string | null; tags: string[]; pass: boolean; fav: boolean };
const LINKS: L[] = [
  { slug: "verano26", dominio: "cpt.cx", destino: "tienda-aurora.co/coleccion/verano-2026?utm_source=ig", clics: 4820, creado: "2026-09-02", vence: "2026-10-05", tags: ["campaña"], pass: false, fav: true },
  { slug: "webinar-ia", dominio: "cpt.cx", destino: "eventos.compacto.co/webinar/ia-para-pymes", clics: 3115, creado: "2026-09-10", vence: "2026-10-03", tags: ["eventos"], pass: false, fav: false },
  { slug: "menu-qr", dominio: "go.cafeandino.co", destino: "cafeandino.co/menu/bogota-chapinero", clics: 2740, creado: "2026-08-14", vence: null, tags: ["qr"], pass: false, fav: true },
  { slug: "catalogo", dominio: "cpt.cx", destino: "drive.google.com/file/d/catalogo-b2b-2026.pdf", clics: 1980, creado: "2026-08-20", vence: "2026-12-31", tags: ["ventas"], pass: true, fav: false },
  { slug: "ofertas-sep", dominio: "cpt.cx", destino: "tienda-aurora.co/ofertas/septiembre", clics: 1530, creado: "2026-09-01", vence: "2026-09-30", tags: ["campaña"], pass: false, fav: false },
  { slug: "app", dominio: "go.cafeandino.co", destino: "apps.apple.com/co/app/cafe-andino/id6450", clics: 1210, creado: "2026-07-11", vence: null, tags: ["app"], pass: false, fav: false },
  { slug: "encuesta", dominio: "cpt.cx", destino: "forms.gle/satisfaccion-clientes-q3", clics: 860, creado: "2026-09-15", vence: "2026-10-01", tags: ["clientes"], pass: false, fav: false },
  { slug: "vacantes", dominio: "cpt.cx", destino: "empleos.compacto.co/vacantes/desarrollo", clics: 640, creado: "2026-09-18", vence: "2026-11-15", tags: ["rrhh"], pass: false, fav: false },
  { slug: "manual", dominio: "cpt.cx", destino: "docs.compacto.co/manual-interno-v3", clics: 410, creado: "2026-08-03", vence: "2026-09-20", tags: ["interno"], pass: true, fav: false },
  { slug: "black-friday", dominio: "cpt.cx", destino: "tienda-aurora.co/black-friday-2026", clics: 95, creado: "2026-09-26", vence: "2026-11-30", tags: ["campaña"], pass: false, fav: false },
  { slug: "podcast-ep12", dominio: "cpt.cx", destino: "open.spotify.com/episode/compacto-ep12", clics: 312, creado: "2026-09-08", vence: "2026-08-31", tags: ["contenido"], pass: false, fav: false },
];
const TODAY = new Date("2026-10-01T00:00:00Z");
const daysTo = (d: string | null) => (d ? Math.round((new Date(d + "T00:00:00Z").getTime() - TODAY.getTime()) / 864e5) : Infinity);
const statusOf = (l: L) => { const d = daysTo(l.vence); if (d < 0) return "Vencido"; if (l.pass) return "Protegido"; if (d <= 7) return "Por vencer"; return "Activo"; };
function rng(seed: number) { return () => ((seed = (seed * 9301 + 49297) % 233280) / 233280); }
const r = rng(11);
const DAYS = Array.from({ length: 30 }, (_, i) => ({ fecha: new Date(Date.UTC(2026, 8, 2 + i)), clics: Math.round(420 + i * 9 + r() * 160 - (i % 7 >= 5 ? 110 : 0)) }));
const linkSeries = (l: L) => { const g = rng(l.clics); return Array.from({ length: 14 }, (_, i) => Math.round((l.clics / 30) * (0.6 + g() * 0.8) * (1 + i / 30))); };
const TOTAL = DAYS.reduce((a, d) => a + d.clics, 0); const PREV = 14980;
const DOMINIOS = [{ n: "cpt.cx", ok: true }, { n: "go.cafeandino.co", ok: true }, { n: "links.aurora.co", ok: false }];
const PLAN = { nombre: "Pro", precio: "US$ 19/mes", dias: 18, limite: 500, usados: 214, historial: 90 };
const AUD = { paises: [["Colombia", 58], ["México", 17], ["España", 9], ["Perú", 7], ["Otros", 9]] as [string, number][], disp: [["Móvil", 71], ["Escritorio", 24], ["Tableta", 5]] as [string, number][], nav: [["Chrome", 54], ["Safari", 31], ["Edge", 8], ["Otros", 7]] as [string, number][] };
const nf = new Intl.NumberFormat("es-CO");
const fd = (d: string | null) => (d ? new Date(d + "T00:00:00Z").toLocaleDateString("es-CO", { day: "2-digit", month: "short", timeZone: "UTC" }) : "Sin vencimiento");

/* ---------------- Tema ---------------- */
type Theme = "claro" | "oscuro" | "contraste";
function useTheme() {
  const [t, setT] = useState<Theme>("claro");
  useEffect(() => { const s = localStorage.getItem("compacto-theme"); if (s === "dark") setT("oscuro"); if (s === "contraste") setT("contraste"); }, []);
  useEffect(() => {
    const el = document.documentElement; el.classList.toggle("dark", t === "oscuro"); el.classList.toggle("hc", t === "contraste");
    localStorage.setItem("compacto-theme", t === "oscuro" ? "dark" : t === "contraste" ? "contraste" : "light");
  }, [t]);
  return [t, setT] as const;
}

/* ---------------- Página ---------------- */
function Dashboard() {
  const { estado = "normal", plan = "pro" } = Route.useSearch();
  const [theme, setTheme] = useTheme();
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);
  const [sel, setSel] = useState(LINKS[0]!.slug);
  useEffect(() => { if (!hasSeenWelcome()) setWelcome(true); const id = setTimeout(() => setLoading(false), 700); return () => clearTimeout(id); }, []);
  const isLoading = estado === "carga" || loading; const err = estado === "error"; const free = plan === "free";
  const create = () => setCreateOpen(true);

  return (
    <div className="min-h-screen technical-grid">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-ring">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" aria-hidden /></span>
          <span className="font-display text-lg font-bold text-foreground">Compacto</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="rounded-full px-3"><Link to="/domains"><Globe /> <span className="hidden sm:inline">Dominios</span></Link></Button>
          <Link to="/otp-dashboard" className="hidden rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex">OTP</Link>
          <div role="radiogroup" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
            {([["claro", Sun, "Claro"], ["oscuro", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([k, I, l]) => (
              <button key={k} role="radio" aria-checked={theme === k} aria-label={l} title={l} onClick={() => setTheme(k)}
                className={`grid size-8 place-items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-ring ${theme === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}><I className="size-4" aria-hidden /></button>
            ))}
          </div>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-7xl space-y-5 px-4 pb-16 sm:px-6">
        <Hero loading={isLoading} empty={estado === "vacio"} onCreate={create} />
        <Filters free={free} />
        {estado === "vacio" ? <Empty onCreate={create} /> : (
          <>
            <Kpis loading={isLoading} />
            <ClicksPanel loading={isLoading} free={free} />
            <div className="grid gap-5 lg:grid-cols-12">
              <Card className="lg:col-span-5" title="Top 5 enlaces" desc="Elige uno para ver su tendencia." loading={isLoading} error={err}><Top5 sel={sel} onSel={setSel} /></Card>
              <Card className="lg:col-span-7" title={`Tendencia de cpt.cx/${sel}`} desc="Clics diarios de las últimas dos semanas." loading={isLoading}><LinkTrend slug={sel} /></Card>
              <Card className="lg:col-span-7" title="Clics por enlace" desc="Ordena y recorre todos tus enlaces." loading={isLoading}><ClicksByLink /></Card>
              <Card className="lg:col-span-5" title="Por vencer con tráfico" desc="Enlaces que vencen en 7 días y aún reciben visitas." loading={isLoading}><Expiring /></Card>
              <Card className="lg:col-span-8" title="Audiencia" desc="Países, dispositivos y navegadores de tus clics." loading={isLoading}>{free ? <Locked what="la audiencia y las conversiones" /> : <Audience />}</Card>
              <Card className="lg:col-span-4" title="Tu plan" desc={free ? "Plan Free" : `Plan ${PLAN.nombre} · ${PLAN.precio}`} loading={isLoading}><PlanCard free={free} /></Card>
              <Card className="lg:col-span-12" title="Enlaces recientes" desc="Busca, copia, genera el QR o abre el reporte." loading={isLoading}><Recent onQr={setQr} /></Card>
            </div>
          </>
        )}
        <nav aria-label="Estados de demostración" className="flex flex-wrap items-center gap-2 pt-4 text-xs text-muted-foreground">
          <span>Ver estado:</span>
          {([["Normal", {}], ["Carga", { estado: "carga" }], ["Vacío", { estado: "vacio" }], ["Error", { estado: "error" }], ["Plan Free", { plan: "free" }]] as const).map(([l, s]) => (
            <Link key={l} to="/" search={s} className="rounded-full border border-border px-3 py-1 hover:text-foreground">{l}</Link>
          ))}
        </nav>
      </main>
      <WelcomeModal open={welcome} onClose={() => { markWelcomeSeen(); setWelcome(false); }} />
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <QrModal open={!!qr} url={`https://${qr ?? ""}`} onClose={() => setQr(null)} />
    </div>
  );
}

/* ---------------- Héroe ---------------- */
function Hero({ loading, empty, onCreate }: { loading: boolean; empty: boolean; onCreate: () => void }) {
  const d = ((TOTAL - PREV) / PREV) * 100; const star = LINKS[0]!;
  return (
    <section aria-labelledby="pulso" className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground shadow-elevated sm:p-8">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden>
        <path id="ruta-links" d="M520 190 C 640 190, 660 70, 780 70 S 940 140, 1000 40" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" className="animate-route-dash" />
        <circle r="5" fill="currentColor" className="route-pulse"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#ruta-links" /></animateMotion></circle>
        <circle r="14" fill="currentColor" fillOpacity="0.15" className="route-pulse"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#ruta-links" /></animateMotion></circle>
      </svg>
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium opacity-90"><MousePointerClick className="size-4" aria-hidden />Pulso de enlaces · últimos 30 días</p>
          <h1 id="pulso" className="sr-only">Dashboard general</h1>
          {loading ? <Skeleton className="mt-3 h-16 w-60 bg-ink-foreground/20" /> : (
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-5xl font-extrabold tabular-nums sm:text-7xl">{empty ? "0" : nf.format(TOTAL)}</span>
              <span className="text-base opacity-90 sm:text-lg">clics en tus enlaces</span>
            </div>
          )}
          {!empty && !loading && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-foreground/15 px-2.5 py-1 font-semibold tabular-nums">{d >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}{d >= 0 ? "+" : ""}{d.toFixed(1)} %</span>
              <span className="opacity-90">vs. periodo anterior</span>
            </p>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:flex-col md:items-end">
          {!empty && <div className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-foreground/15 px-3 py-1.5 text-sm"><Star className="size-4" aria-hidden />Enlace estrella <code className="font-mono font-medium">cpt.cx/{star.slug}</code><span className="font-mono opacity-90">{nf.format(star.clics)}</span></div>}
          <button onClick={onCreate} className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-foreground px-5 py-2.5 text-sm font-semibold text-ink shadow-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink-foreground"><Plus className="size-4" aria-hidden />Crear enlace</button>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Filtros ---------------- */
function FilterControls({ free }: { free: boolean }) {
  const [preset, setPreset] = useState("30 d");
  const s = "h-10 rounded-full border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <>
      <div role="group" aria-label="Rango de fechas" className="flex rounded-full border border-border bg-muted p-1">
        {["Hoy", "7 d", "30 d", "Personalizado"].map((p) => <button key={p} aria-pressed={preset === p} onClick={() => setPreset(p)} className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-ring ${preset === p ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>)}
      </div>
      <label htmlFor="f-dom" className="sr-only">Dominio</label>
      <select id="f-dom" className={s}><option>Todos los dominios</option>{DOMINIOS.map((d) => <option key={d.n}>{d.n}</option>)}</select>
      <label htmlFor="f-tag" className="sr-only">Etiqueta</label>
      <select id="f-tag" className={s}><option>Todas las etiquetas</option>{[...new Set(LINKS.flatMap((l) => l.tags))].map((t) => <option key={t}>{t}</option>)}</select>
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground md:ml-auto"><CalendarClock className="size-3.5" aria-hidden />Historial: {free ? 30 : PLAN.historial} días</span>
      <button onClick={() => setPreset("30 d")} className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted-foreground hover:text-foreground"><RotateCcw className="size-4" aria-hidden />Restablecer</button>
    </>
  );
}
function Filters({ free }: { free: boolean }) {
  return (
    <div className="animate-fade-up sticky top-2 z-20 [animation-delay:0.1s]">
      <div className="hidden flex-wrap items-center gap-2 rounded-full border border-border bg-card p-2 shadow-elevated md:flex"><FilterControls free={free} /></div>
      <Sheet>
        <SheetTrigger className="flex w-full items-center justify-between rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-elevated md:hidden">
          <span className="flex items-center gap-2"><SlidersHorizontal className="size-4" aria-hidden />Filtros</span><span className="text-muted-foreground">30 d · Todos</span>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader><SheetTitle className="font-display">Filtros</SheetTitle></SheetHeader>
          <div className="flex flex-col gap-3 p-4 [&_select]:w-full"><FilterControls free={free} /></div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------------- KPI ---------------- */
function Kpis({ loading }: { loading: boolean }) {
  const porVencer = LINKS.filter((l) => { const d = daysTo(l.vence); return d >= 0 && d <= 7; }).length;
  const vencidos = LINKS.filter((l) => daysTo(l.vence) < 0).length;
  const items = [
    { l: "Enlaces creados", v: LINKS.length, I: Link2, sub: "+4 vs. periodo anterior", tone: "text-success" },
    { l: "Activos", v: LINKS.length - vencidos, I: Zap, sub: `${Math.round(((LINKS.length - vencidos) / LINKS.length) * 100)} % del total`, tone: "text-muted-foreground" },
    { l: "Por vencer", v: porVencer, I: CalendarClock, sub: `próximos 7 días · ${vencidos} vencidos`, tone: "text-muted-foreground" },
    { l: "Dominios conectados", v: DOMINIOS.filter((d) => d.ok).length, I: Globe, sub: `${DOMINIOS.filter((d) => !d.ok).length} pendiente de verificar`, tone: "text-muted-foreground" },
  ];
  return (
    <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it, i) => (
        <article key={it.l} style={{ animationDelay: `${0.15 + i * 0.06}s` }} className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-subtle">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground"><it.I className="size-4" aria-hidden />{it.l}</p>
          {loading ? <><Skeleton className="mt-3 h-8 w-16" /><Skeleton className="mt-2 h-3 w-3/4" /></> : <>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-foreground">{it.v}</p>
            <p className={`text-xs ${it.tone}`}>{it.sub}</p>
          </>}
        </article>
      ))}
    </section>
  );
}

/* ---------------- Tarjeta ---------------- */
function Card({ title, desc, children, className = "", loading, error }: { title: string; desc: string; children: ReactNode; className?: string; loading?: boolean; error?: boolean }) {
  const id = "c-" + title.replace(/\W+/g, "-").toLowerCase();
  const [retry, setRetry] = useState(false);
  return (
    <section aria-labelledby={id} aria-describedby={`${id}-d`} className={`animate-fade-up min-w-0 rounded-2xl border border-border bg-card p-5 shadow-subtle ${className}`}>
      <h2 id={id} className="font-display text-base font-bold text-foreground">{title}</h2>
      <p id={`${id}-d`} className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">
        {error && !retry ? (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <span className="flex items-center gap-2 font-medium text-destructive"><AlertTriangle className="size-4" aria-hidden />No pudimos cargar este módulo.</span>
            <button onClick={() => setRetry(true)} className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:bg-muted">Reintentar</button>
          </div>
        ) : loading ? <div className="space-y-2"><Skeleton className="h-36 w-full rounded-xl" /><Skeleton className="h-4 w-1/2" /></div> : children}
      </div>
    </section>
  );
}

/* ---------------- Gráficas ---------------- */
function Area({ values, labels, h = 200, label }: { values: number[]; labels?: string[]; h?: number; label: string }) {
  const W = 1000, max = Math.max(...values) * 1.12;
  const x = (i: number) => (values.length === 1 ? W / 2 : (i / (values.length - 1)) * W); const y = (v: number) => h - (v / max) * h;
  const line = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${h + (labels ? 24 : 4)}`} className="w-full" style={{ height: h }} preserveAspectRatio="none" role="img" aria-label={label}>
      <defs><linearGradient id={`g${h}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity="0.3" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75].map((t) => <line key={t} x1="0" x2={W} y1={h * t} y2={h * t} stroke="var(--border)" vectorEffect="non-scaling-stroke" />)}
      <path d={`${line} L${x(values.length - 1)},${h} L0,${h} Z`} fill={`url(#g${h})`} />
      <path d={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" pathLength={520} strokeDasharray="520" className="animate-draw" />
      {labels?.map((l, i) => (labels.length <= 6 || i % 5 === 0) && <text key={i} x={x(i)} y={h + 18} textAnchor="middle" className="fill-muted-foreground text-[11px]">{l}</text>)}
    </svg>
  );
}

function ClicksPanel({ loading, free }: { loading: boolean; free: boolean }) {
  const [g, setG] = useState<"Día" | "Semana" | "Mes">("Día");
  const s = useMemo(() => {
    if (g === "Día") return { v: DAYS.map((d) => d.clics), l: DAYS.map((d) => `${d.fecha.getUTCDate()}/9`) };
    if (g === "Semana") { const w = Array.from({ length: 5 }, (_, i) => DAYS.slice(i * 6, i * 6 + 6).reduce((a, d) => a + d.clics, 0)); return { v: w, l: w.map((_, i) => `Sem ${i + 1}`) }; }
    return free ? { v: [TOTAL], l: ["Sep"] } : { v: [11200, PREV, TOTAL], l: ["Jul", "Ago", "Sep"] };
  }, [g, free]);
  return (
    <section aria-labelledby="clics-t" className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-subtle">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 id="clics-t" className="font-display text-lg font-bold text-foreground">Clics en el tiempo</h2><p className="text-sm text-muted-foreground">Agregado de todos tus dominios.</p></div>
        <div role="group" aria-label="Agrupación" className="flex rounded-full border border-border bg-muted p-1">
          {(["Día", "Semana", "Mes"] as const).map((k) => <button key={k} aria-pressed={g === k} onClick={() => setG(k)} className={`rounded-full px-3 py-1 text-sm font-medium ${g === k ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground"}`}>{k}</button>)}
        </div>
      </div>
      <div className="mt-4">{loading ? <Skeleton className="h-52 w-full rounded-xl" /> : <Area key={g} values={s.v} labels={s.l} label={`Gráfica de área de clics agrupados por ${g.toLowerCase()}: ${nf.format(TOTAL)} en total.`} />}</div>
    </section>
  );
}

function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${22 - ((v - min) / (max - min || 1)) * 20}`).join(" ");
  return <svg viewBox="0 0 100 24" className="h-6 w-16 shrink-0 text-primary" preserveAspectRatio="none" aria-hidden><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" /></svg>;
}
function Top5({ sel, onSel }: { sel: string; onSel: (s: string) => void }) {
  return (
    <ol className="space-y-1">
      {[...LINKS].sort((a, b) => b.clics - a.clics).slice(0, 5).map((l, i) => (
        <li key={l.slug}>
          <button onClick={() => onSel(l.slug)} aria-pressed={sel === l.slug} className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition focus-visible:outline-2 focus-visible:outline-ring ${sel === l.slug ? "bg-accent" : "hover:bg-muted"}`}>
            <span className="w-4 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <span className="min-w-0 flex-1"><code className="block truncate font-mono text-sm font-medium text-foreground">{l.dominio}/{l.slug}</code><span className="block truncate text-xs text-muted-foreground">{l.destino}</span></span>
            <Spark data={linkSeries(l)} />
            <span className="w-12 text-right font-mono text-sm tabular-nums text-foreground">{nf.format(l.clics)}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
function LinkTrend({ slug }: { slug: string }) {
  const l = LINKS.find((x) => x.slug === slug)!; const v = linkSeries(l);
  return (
    <div>
      <div className="mb-2 flex gap-6 text-sm"><span><span className="text-muted-foreground">Total </span><b className="font-mono">{nf.format(l.clics)}</b></span><span><span className="text-muted-foreground">Promedio diario </span><b className="font-mono">{nf.format(Math.round(v.reduce((a, b) => a + b, 0) / v.length))}</b></span></div>
      <Area key={slug} values={v} h={150} label={`Gráfica de línea con los clics diarios de cpt.cx/${slug}.`} />
    </div>
  );
}
function ClicksByLink() {
  const [asc, setAsc] = useState(false); const [page, setPage] = useState(0); const size = 6;
  const sorted = [...LINKS].sort((a, b) => (asc ? a.clics - b.clics : b.clics - a.clics)); const max = Math.max(...LINKS.map((l) => l.clics));
  const pages = Math.ceil(sorted.length / size);
  return (
    <div>
      <ul className="space-y-2.5" aria-label="Barras horizontales de clics por enlace">
        {sorted.slice(page * size, page * size + size).map((l) => (
          <li key={l.slug} className="grid grid-cols-[minmax(0,7rem)_1fr_3.5rem] items-center gap-3 text-sm">
            <code className="truncate font-mono text-xs text-foreground">/{l.slug}</code>
            <div className="h-2.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(l.clics / max) * 100}%` }} /></div>
            <span className="text-right font-mono text-xs tabular-nums">{nf.format(l.clics)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <button onClick={() => setAsc(!asc)} className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1 hover:text-foreground"><ArrowDownUp className="size-3.5" aria-hidden />{asc ? "Menos clics" : "Más clics"}</button>
        <div className="flex items-center gap-1">
          <button aria-label="Página anterior" disabled={!page} onClick={() => setPage(page - 1)} className="grid size-7 place-items-center rounded-full border border-border disabled:opacity-40"><ChevronLeft className="size-4" /></button>
          <span className="px-2 font-mono">{page + 1}/{pages}</span>
          <button aria-label="Página siguiente" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className="grid size-7 place-items-center rounded-full border border-border disabled:opacity-40"><ChevronRight className="size-4" /></button>
        </div>
      </div>
    </div>
  );
}
function Expiring() {
  const [ext, setExt] = useState<string[]>([]);
  const list = LINKS.filter((l) => { const d = daysTo(l.vence); return d >= 0 && d <= 7; }).sort((a, b) => b.clics - a.clics);
  return (
    <ul className="space-y-2">
      {list.map((l) => (
        <li key={l.slug} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <div className="min-w-0 flex-1"><code className="block truncate font-mono text-sm text-foreground">cpt.cx/{l.slug}</code>
            <span className="text-xs text-muted-foreground">{ext.includes(l.slug) ? "Extendido 30 días" : `Vence en ${daysTo(l.vence)} d`} · <span className="font-mono">{nf.format(l.clics)}</span> clics</span></div>
          <button disabled={ext.includes(l.slug)} onClick={() => setExt([...ext, l.slug])} className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-primary hover:bg-accent disabled:text-muted-foreground">{ext.includes(l.slug) ? <Check className="size-4" /> : "Extender"}</button>
        </li>
      ))}
    </ul>
  );
}
function Audience() {
  const C = 2 * Math.PI * 40; let acc = 0; const op = [1, 0.55, 0.25];
  const Bars = ({ t, d }: { t: string; d: [string, number][] }) => (
    <div><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t}</h3>
      <ul className="space-y-2">{d.map(([n, v]) => <li key={n} className="text-sm"><div className="flex justify-between"><span>{n}</span><span className="font-mono text-xs">{v} %</span></div><div className="mt-1 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${v}%` }} /></div></li>)}</ul></div>
  );
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      <Bars t="Países" d={AUD.paises} />
      <div><h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Dispositivos</h3>
        <svg viewBox="0 0 100 100" className="mx-auto size-28" role="img" aria-label="Donut: móvil 71 %, escritorio 24 %, tableta 5 %">
          {AUD.disp.map(([n, v], i) => { const el = <circle key={n} cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeOpacity={op[i]} strokeWidth="16" strokeDasharray={`${(C * v) / 100 - 2} ${C}`} strokeDashoffset={(-C * acc) / 100} transform="rotate(-90 50 50)" />; acc += v; return el; })}
        </svg>
        <ul className="mt-2 space-y-1 text-xs">{AUD.disp.map(([n, v], i) => <li key={n} className="flex items-center gap-2"><span className="size-2.5 rounded-sm bg-primary" style={{ opacity: op[i] }} />{n}<span className="ml-auto font-mono">{v} %</span></li>)}</ul>
      </div>
      <Bars t="Navegadores" d={AUD.nav} />
    </div>
  );
}
function Locked({ what }: { what: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-dashed border-border bg-muted/50 p-6 text-center">
      <span className="mx-auto grid size-11 place-items-center rounded-xl bg-accent text-primary"><Lock className="size-5" aria-hidden /></span>
      <p className="mt-3 font-display font-bold text-foreground">Descubre quién hace clic</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">Desbloquea {what}: país, ciudad, dispositivo, navegador, canal y campaña de cada clic.</p>
      <Link to="/pricing" className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2 text-sm font-semibold text-primary-foreground shadow-action"><Sparkles className="size-4" aria-hidden />Mejorar plan</Link>
    </div>
  );
}
function PlanCard({ free }: { free: boolean }) {
  const lim = free ? 25 : PLAN.limite; const used = free ? 11 : PLAN.usados; const p = (used / lim) * 100;
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{free ? "Sin costo · historial de 30 días" : <>Renueva en <b className="text-foreground">{PLAN.dias} días</b> · historial de {PLAN.historial} días</>}</p>
      <div>
        <div className="flex justify-between text-sm"><span>Enlaces usados</span><span className="font-mono">{used} / {lim}</span></div>
        <div className="mt-1.5 h-2.5 rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(p)} aria-valuemin={0} aria-valuemax={100} aria-label="Uso de enlaces"><div className={`h-full rounded-full ${p > 80 ? "bg-warning" : "bg-primary"}`} style={{ width: `${p}%` }} /></div>
      </div>
      <Link to="/pricing" className={`inline-flex w-full justify-center rounded-full px-5 py-2.5 text-sm font-semibold ${free ? "bg-brand-gradient text-primary-foreground shadow-action" : "border border-border text-foreground hover:bg-muted"}`}>{free ? "Mejorar plan" : "Gestionar plan"}</Link>
    </div>
  );
}

const ST: Record<string, string> = { Activo: "bg-success/15 text-success", "Por vencer": "bg-warning/20 text-foreground", Vencido: "bg-destructive/15 text-destructive", Protegido: "bg-muted text-foreground" };
function Recent({ onQr }: { onQr: (u: string) => void }) {
  const [q, setQ] = useState(""); const [copied, setCopied] = useState("");
  const rows = [...LINKS].sort((a, b) => Number(b.fav) - Number(a.fav) || b.creado.localeCompare(a.creado)).filter((l) => (l.slug + l.destino).toLowerCase().includes(q.toLowerCase()));
  const copy = (u: string) => { navigator.clipboard?.writeText(`https://${u}`).catch(() => undefined); setCopied(u); setTimeout(() => setCopied(""), 1500); };
  return (
    <div>
      <label className="relative mb-3 block max-w-xs"><span className="sr-only">Buscar enlaces</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por slug o destino" className="h-10 min-h-0 w-full rounded-full border border-input pl-9 text-sm" /></label>
      <div className="-mx-5 overflow-x-auto px-5">
        <table className="w-full min-w-[820px] table-fixed text-sm">
          <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="w-[30%] pb-2 font-medium">Enlace</th><th className="w-[13%] pb-2 font-medium">Estado</th><th className="w-[10%] pb-2 text-right font-medium">Clics</th><th className="w-[13%] pb-2 pl-4 font-medium">Creado</th><th className="w-[16%] pb-2 font-medium">Vence</th><th className="w-[18%] pb-2 text-right font-medium">Acciones</th></tr></thead>
          <tbody>
            {rows.map((l) => { const u = `${l.dominio}/${l.slug}`; const s = statusOf(l); return (
              <tr key={l.slug} className="border-b border-border last:border-0">
                <td className="py-2.5 pr-3"><div className="flex items-center gap-1.5">{l.fav && <Star className="size-3.5 shrink-0 fill-primary text-primary" aria-label="Favorito" />}{l.pass && <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-label="Con contraseña" />}<code className="truncate font-mono text-sm font-medium">{u}</code></div><span className="block truncate text-xs text-muted-foreground">{l.destino}</span></td>
                <td><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ST[s]}`}>{s}</span></td>
                <td className="text-right font-mono tabular-nums">{nf.format(l.clics)}</td>
                <td className="pl-4 text-xs text-muted-foreground">{fd(l.creado)}</td>
                <td className="text-xs text-muted-foreground">{fd(l.vence)}</td>
                <td><div className="flex justify-end gap-1">
                  <button onClick={() => copy(u)} aria-label={`Copiar ${u}`} className="grid size-8 place-items-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring">{copied === u ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}</button>
                  <button onClick={() => onQr(u)} aria-label={`QR de ${u}`} className="grid size-8 place-items-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><QrCode className="size-4" /></button>
                  <a href="#" aria-label={`Reporte de ${u}`} className="grid size-8 place-items-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><BarChart3 className="size-4" /></a>
                </div></td>
              </tr>); })}
            {!rows.length && <tr><td colSpan={6} className="py-6 text-center text-muted-foreground">Sin resultados para “{q}”.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Empty({ onCreate }: { onCreate: () => void }) {
  return (
    <section className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-subtle">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-primary"><Link2 className="size-6" aria-hidden /></span>
      <h2 className="mt-4 font-display text-xl font-bold text-foreground">Crea tu primer enlace</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Acorta una URL y aquí verás cada clic que reciba.</p>
      <button onClick={onCreate} className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-action"><Plus className="size-4" aria-hidden />Crear enlace</button>
    </section>
  );
}
