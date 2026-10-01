import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, BookOpen, CheckCircle2, Contrast,
  Lightbulb, Link2, Mail, MessageSquare, Moon, Phone, RotateCcw, Send, ShieldCheck, SlidersHorizontal,
  Sparkles, Sun, XCircle, Zap,
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

type Estado = "normal" | "carga" | "vacio" | "error" | "sinplan";

export const Route = createFileRoute("/otp-dashboard")({
  validateSearch: (s: Record<string, unknown>): { estado?: Estado } => {
    const e = s["estado"] as Estado | undefined;
    return e && ["normal", "carga", "vacio", "error", "sinplan"].includes(e) ? { estado: e } : {};
  },
  head: () => ({
    meta: [
      { title: "Dashboard OTP · Compacto" },
      { name: "description", content: "Pulso de tus verificaciones OTP: entrega, verificación, latencias y SLA en tiempo real." },
      { property: "og:title", content: "Dashboard OTP · Compacto" },
      { property: "og:description", content: "Monitorea generación, entrega y verificación de tus códigos OTP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OtpDashboard,
});

/* ---------------- Datos de demostración ---------------- */
const CHANNELS = ["SMS", "Email", "WhatsApp"] as const;
const PROVIDERS = ["Twilio", "Infobip", "SendGrid"] as const;
function rng(seed: number) { return () => ((seed = (seed * 9301 + 49297) % 233280) / 233280); }
const r = rng(7);
const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.UTC(2026, 8, 2 + i));
  const base = 380 + i * 6 + Math.round(r() * 90) - (d.getUTCDay() % 6 === 0 ? 120 : 0);
  const enviados = Math.round(base * (0.965 + r() * 0.025));
  const verificados = Math.round(enviados * (0.86 + r() * 0.06));
  return { fecha: d, generados: base, enviados, verificados, fallidos: base - enviados + Math.round((enviados - verificados) * 0.35) };
});
const PREV = { generados: 11240, enviados: 10870, verificados: 9310, fallidos: 1120 };
const sum = (k: keyof (typeof DAYS)[number]) => DAYS.reduce((a, d) => a + (d[k] as number), 0);
const TOT = { generados: sum("generados"), enviados: sum("enviados"), verificados: sum("verificados"), fallidos: sum("fallidos") };
const CHANNEL_SPLIT = [{ n: "SMS", v: 0.52 }, { n: "WhatsApp", v: 0.31 }, { n: "Email", v: 0.17 }];
const HEAT = Array.from({ length: 7 }, (_, d) => Array.from({ length: 24 }, (_, h) => {
  const work = h >= 8 && h <= 20 ? 1 : 0.15; const wk = d >= 5 ? 0.5 : 1;
  return Math.round((work * wk * (0.6 + r() * 0.4) + (h === 10 || h === 18 ? 0.3 : 0)) * 100);
}));
const PROVIDER_PERF = [
  { n: "Twilio", canal: "SMS", entrega: 97.8, lat: 1.9 },
  { n: "Infobip", canal: "WhatsApp", entrega: 98.6, lat: 1.4 },
  { n: "SendGrid", canal: "Email", entrega: 95.1, lat: 3.8 },
];
const TEMPLATES = [
  { k: "login_2fa", uso: 6210, ver: 91.2 }, { k: "registro_cuenta", uso: 3480, ver: 86.4 },
  { k: "cambio_password", uso: 1920, ver: 88.7 }, { k: "confirmar_pago", uso: 1105, ver: 93.5 },
];
const RECENT = [
  { id: "otp_8f2k1", dest: "+57 ***4521", canal: "SMS", estado: "Verificado", creado: "10:31:02", enviado: "10:31:04", ver: "10:31:39", exp: "10:36:02" },
  { id: "otp_8f2j9", dest: "j***@mail.com", canal: "Email", estado: "Enviado", creado: "10:30:47", enviado: "10:30:51", ver: "—", exp: "10:40:47" },
  { id: "otp_8f2j4", dest: "+57 ***0098", canal: "WhatsApp", estado: "Verificado", creado: "10:29:55", enviado: "10:29:56", ver: "10:30:12", exp: "10:34:55" },
  { id: "otp_8f2h7", dest: "+52 ***7712", canal: "SMS", estado: "Fallido", creado: "10:28:10", enviado: "—", ver: "—", exp: "10:33:10" },
  { id: "otp_8f2g3", dest: "m***@empresa.co", canal: "Email", estado: "Expirado", creado: "10:12:40", enviado: "10:12:44", ver: "—", exp: "10:22:40" },
];
const PLAN = { nombre: "Prime", cupo: 5000, usados: 3870, dia: 28, diasMes: 30 };

const nf = new Intl.NumberFormat("es-CO");
const pct = (a: number, b: number) => (b ? (a / b) * 100 : 0);
const delta = (a: number, b: number) => ((a - b) / b) * 100;

/* ---------------- Tema ---------------- */
type Theme = "claro" | "oscuro" | "contraste";
function useTheme() {
  const [t, setT] = useState<Theme>("claro");
  useEffect(() => { const s = localStorage.getItem("compacto-theme"); if (s === "dark") setT("oscuro"); if (s === "contraste") setT("contraste"); }, []);
  useEffect(() => {
    const el = document.documentElement;
    el.classList.toggle("dark", t === "oscuro"); el.classList.toggle("hc", t === "contraste");
    localStorage.setItem("compacto-theme", t === "oscuro" ? "dark" : t === "contraste" ? "contraste" : "light");
  }, [t]);
  return [t, setT] as const;
}

/* ---------------- Página ---------------- */
function OtpDashboard() {
  const { estado = "normal" } = Route.useSearch();
  const [theme, setTheme] = useTheme();
  const [loading, setLoading] = useState(true);
  useEffect(() => { const id = setTimeout(() => setLoading(false), 700); return () => clearTimeout(id); }, []);
  const isLoading = estado === "carga" || loading;

  return (
    <div className="min-h-screen technical-grid">
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 rounded-full focus-visible:outline-2 focus-visible:outline-ring">
          <span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" aria-hidden /></span>
          <span className="font-display text-lg font-bold text-foreground">Compacto</span>
          <span className="ml-1 rounded-full border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground">OTP</span>
        </Link>
        <div role="radiogroup" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([["claro", Sun, "Claro"], ["oscuro", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([k, I, l]) => (
            <button key={k} role="radio" aria-checked={theme === k} aria-label={l} title={l} onClick={() => setTheme(k)}
              className={`grid size-8 place-items-center rounded-full transition focus-visible:outline-2 focus-visible:outline-ring ${theme === k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <I className="size-4" aria-hidden />
            </button>
          ))}
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-7xl space-y-5 px-4 pb-16 sm:px-6">
        {estado === "sinplan" ? <Upsell /> : (
          <>
            <Hero loading={isLoading} empty={estado === "vacio"} />
            <Filters />
            {estado === "vacio" ? <EmptyState /> : (
              <>
                <KpiBand loading={isLoading} />
                <TrendPanel loading={isLoading} />
                <div className="grid gap-5 lg:grid-cols-12">
                  <Card className="lg:col-span-7" title="Embudo de verificación" desc="Dónde se pierden los códigos entre cada paso." loading={isLoading} error={estado === "error"}><Funnel /></Card>
                  <Card className="lg:col-span-5" title="Uso del plan mensual" desc={`Plan ${PLAN.nombre}: ${nf.format(PLAN.cupo)} OTP al mes.`} loading={isLoading}><PlanUsage /></Card>
                  <Card className="lg:col-span-8" title="Calidad del servicio (SLA)" desc="Objetivo: entrega ≥ 97 %, verificación ≥ 85 %, latencias < 5 s." loading={isLoading}><Sla /></Card>
                  <Card className="lg:col-span-4" title="Distribución por canal" desc="Participación de cada canal en los envíos." loading={isLoading}><Donut /></Card>
                  <Card className="lg:col-span-7" title="Resultado diario al 100 %" desc="Proporción de verificados, pendientes y fallidos por día." loading={isLoading}><Stacked /></Card>
                  <Card className="lg:col-span-5" title="Rendimiento por proveedor" desc="Compara entrega y latencia media." loading={isLoading}><Providers /></Card>
                  <Card className="lg:col-span-8" title="Mapa de calor de envíos" desc="Día de la semana × hora (America/Bogotá)." loading={isLoading}><Heatmap /></Card>
                  <Card className="lg:col-span-4" title="Top plantillas" desc="Uso y tasa de verificación por clave." loading={isLoading}><Templates /></Card>
                  <Card className="lg:col-span-12" title="Actividad reciente" desc="Últimos códigos generados, con destinatario enmascarado." loading={isLoading}><Recent /></Card>
                </div>
                <Tip />
              </>
            )}
          </>
        )}
        <nav aria-label="Estados de demostración" className="flex flex-wrap items-center gap-2 pt-4 text-xs text-muted-foreground">
          <span>Ver estado:</span>
          {(["normal", "carga", "vacio", "error", "sinplan"] as const).map((e) => (
            <Link key={e} to="/otp-dashboard" search={e === "normal" ? {} : { estado: e }}
              className={`rounded-full border px-3 py-1 ${estado === e ? "border-primary text-primary" : "border-border hover:text-foreground"}`}>
              {{ normal: "Normal", carga: "Carga", vacio: "Vacío", error: "Error", sinplan: "Plan sin OTP" }[e]}
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}

/* ---------------- Héroe ---------------- */
function Hero({ loading, empty }: { loading: boolean; empty: boolean }) {
  const rate = pct(TOT.verificados, TOT.enviados);
  const d = delta(TOT.verificados, PREV.verificados);
  const ok = !empty && rate >= 85;
  return (
    <section aria-labelledby="pulso" className="animate-fade-up relative overflow-hidden rounded-3xl bg-ink p-6 text-ink-foreground shadow-elevated sm:p-8">
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full md:block" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden>
        <path id="ruta-otp" d="M560 170 C 680 170, 700 60, 820 60 S 960 120, 1000 90" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="6 8" className="animate-route-dash" />
        <circle r="5" fill="currentColor" className="route-pulse"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#ruta-otp" /></animateMotion></circle>
        <circle r="14" fill="currentColor" fillOpacity="0.15" className="route-pulse"><animateMotion dur="5s" repeatCount="indefinite"><mpath href="#ruta-otp" /></animateMotion></circle>
      </svg>
      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium opacity-90"><Activity className="size-4" aria-hidden /> Pulso OTP · últimos 30 días</p>
          <h1 id="pulso" className="sr-only">Dashboard OTP</h1>
          {loading ? <Skeleton className="mt-3 h-16 w-64 bg-ink-foreground/20" /> : (
            <div className="mt-2 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-display text-5xl font-extrabold tabular-nums sm:text-7xl">{empty ? "0" : nf.format(TOT.verificados)}</span>
              <span className="text-base opacity-90 sm:text-lg">verificaciones exitosas</span>
            </div>
          )}
          {!empty && !loading && (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-foreground/15 px-2.5 py-1 font-semibold tabular-nums">
                {d >= 0 ? <ArrowUpRight className="size-3.5" aria-hidden /> : <ArrowDownRight className="size-3.5" aria-hidden />}{d >= 0 ? "+" : ""}{d.toFixed(1)} %
              </span>
              <span className="opacity-90">vs. periodo anterior · tasa de verificación <b className="tabular-nums">{rate.toFixed(1)} %</b></span>
            </p>
          )}
        </div>
        <div role="status" className="inline-flex w-fit items-center gap-2 rounded-full bg-ink-foreground px-4 py-2 text-sm font-semibold text-ink">
          <span className={`size-2.5 rounded-full ${ok ? "bg-success" : "bg-warning"}`} aria-hidden />
          {empty ? "Sin actividad" : ok ? "Operando normal" : "Degradado"}
          <span className="font-mono text-xs font-normal opacity-80">SLA 99,2 %</span>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Filtros ---------------- */
function FilterControls() {
  const [preset, setPreset] = useState("30 d");
  const sel = "h-10 rounded-full border border-input bg-card px-4 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <>
      <div role="group" aria-label="Rango de fechas" className="flex rounded-full border border-border bg-muted p-1">
        {["Hoy", "7 d", "30 d", "Personalizado"].map((p) => (
          <button key={p} aria-pressed={preset === p} onClick={() => setPreset(p)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-ring ${preset === p ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
        ))}
      </div>
      <label className="sr-only" htmlFor="f-canal">Canal</label>
      <select id="f-canal" className={sel}><option>Todos los canales</option>{CHANNELS.map((c) => <option key={c}>{c}</option>)}</select>
      <label className="sr-only" htmlFor="f-prov">Proveedor</label>
      <select id="f-prov" className={sel}><option>Todos los proveedores</option>{PROVIDERS.map((c) => <option key={c}>{c}</option>)}</select>
      <div className="flex gap-2 md:ml-auto">
        <button onClick={() => setPreset("30 d")} className="inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"><RotateCcw className="size-4" aria-hidden />Restablecer</button>
        <button className="h-10 rounded-full bg-brand-gradient px-5 text-sm font-semibold text-primary-foreground shadow-action focus-visible:outline-2 focus-visible:outline-ring">Aplicar</button>
      </div>
    </>
  );
}
function Filters() {
  return (
    <div className="animate-fade-up sticky top-2 z-20 [animation-delay:0.1s]">
      <div className="hidden flex-wrap items-center gap-2 rounded-full border border-border bg-card p-2 shadow-elevated md:flex"><FilterControls /></div>
      <Sheet>
        <SheetTrigger className="flex w-full items-center justify-between rounded-full border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-elevated md:hidden">
          <span className="flex items-center gap-2"><SlidersHorizontal className="size-4" aria-hidden />Filtros</span>
          <span className="text-muted-foreground">30 d · Todos</span>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader><SheetTitle className="font-display">Filtros</SheetTitle></SheetHeader>
          <div className="flex flex-col gap-3 p-4 [&_select]:w-full"><FilterControls /></div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------------- KPI ---------------- */
function Spark({ data }: { data: number[] }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(" ");
  return <svg viewBox="0 0 100 30" className="h-8 w-full text-primary" preserveAspectRatio="none" aria-hidden><polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke" pathLength={520} className="animate-draw" strokeDasharray="520" /></svg>;
}
function KpiBand({ loading }: { loading: boolean }) {
  const items = [
    { l: "Generados", v: TOT.generados, p: PREV.generados, k: "generados" as const, I: Zap, sub: "códigos creados" },
    { l: "Enviados", v: TOT.enviados, p: PREV.enviados, k: "enviados" as const, I: Send, sub: `${pct(TOT.enviados, TOT.generados).toFixed(1)} % de entrega` },
    { l: "Verificados", v: TOT.verificados, p: PREV.verificados, k: "verificados" as const, I: CheckCircle2, sub: `${pct(TOT.verificados, TOT.enviados).toFixed(1)} % de verificación` },
    { l: "Fallidos", v: TOT.fallidos, p: PREV.fallidos, k: "fallidos" as const, I: XCircle, sub: "rebote o timeout", bad: true },
  ];
  return (
    <section aria-label="Indicadores clave" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it, i) => {
        const d = delta(it.v, it.p); const good = it.bad ? d <= 0 : d >= 0;
        return (
          <article key={it.l} style={{ animationDelay: `${0.15 + i * 0.06}s` }} className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-subtle">
            <div className="flex flex-wrap items-center justify-between gap-x-2 text-sm text-muted-foreground"><span className="flex items-center gap-1.5"><it.I className="size-4" aria-hidden />{it.l}</span>
              {!loading && <span className={`whitespace-nowrap font-mono text-[11px] font-medium ${good ? "text-success" : "text-destructive"}`}>{d >= 0 ? "+" : ""}{d.toFixed(1)} %</span>}</div>
            {loading ? <><Skeleton className="mt-3 h-8 w-24" /><Skeleton className="mt-3 h-8 w-full" /></> : <>
              <p className="mt-2 font-display text-2xl font-bold tabular-nums text-foreground sm:text-3xl">{nf.format(it.v)}</p>
              <p className="text-xs text-muted-foreground">{it.sub}</p>
              <Spark data={DAYS.map((x) => x[it.k])} />
            </>}
          </article>
        );
      })}
    </section>
  );
}

/* ---------------- Tarjeta ---------------- */
function Card({ title, desc, children, className = "", loading, error }: { title: string; desc: string; children: ReactNode; className?: string; loading?: boolean; error?: boolean }) {
  const id = title.replace(/\W+/g, "-").toLowerCase();
  return (
    <section aria-labelledby={id} aria-describedby={`${id}-d`} className={`animate-fade-up min-w-0 rounded-2xl border border-border bg-card p-5 shadow-subtle ${className}`}>
      <h2 id={id} className="font-display text-base font-bold text-foreground">{title}</h2>
      <p id={`${id}-d`} className="mt-0.5 text-sm text-muted-foreground">{desc}</p>
      <div className="mt-4">
        {error ? (
          <div role="alert" className="flex flex-col items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm">
            <span className="flex items-center gap-2 font-medium text-destructive"><AlertTriangle className="size-4" aria-hidden />No pudimos cargar este módulo.</span>
            <button className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:bg-muted">Reintentar</button>
          </div>
        ) : loading ? <div className="space-y-2"><Skeleton className="h-36 w-full rounded-xl" /><Skeleton className="h-4 w-1/2" /></div> : children}
      </div>
    </section>
  );
}

/* ---------------- Gráficas ---------------- */
function TrendPanel({ loading }: { loading: boolean }) {
  const [g, setG] = useState<"Día" | "Semana" | "Mes">("Día");
  const series = useMemo(() => {
    if (g === "Día") return DAYS.map((d) => ({ l: `${d.fecha.getUTCDate()}/9`, a: d.generados, b: d.verificados }));
    if (g === "Semana") return Array.from({ length: 5 }, (_, w) => { const s = DAYS.slice(w * 6, w * 6 + 6); return { l: `Sem ${w + 1}`, a: s.reduce((x, d) => x + d.generados, 0), b: s.reduce((x, d) => x + d.verificados, 0) }; });
    return [{ l: "Jul", a: 10120, b: 8400 }, { l: "Ago", a: PREV.generados, b: PREV.verificados }, { l: "Sep", a: TOT.generados, b: TOT.verificados }];
  }, [g]);
  const W = 1000, H = 220, max = Math.max(...series.map((s) => s.a)) * 1.1;
  const x = (i: number) => (series.length === 1 ? W / 2 : (i / (series.length - 1)) * W);
  const y = (v: number) => H - (v / max) * H;
  const line = (k: "a" | "b") => series.map((s, i) => `${i ? "L" : "M"}${x(i)},${y(s[k])}`).join(" ");
  return (
    <section aria-labelledby="tend" className="animate-fade-up rounded-2xl border border-border bg-card p-5 shadow-subtle">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 id="tend" className="font-display text-lg font-bold text-foreground">Tendencia de volumen OTP</h2>
          <p className="text-sm text-muted-foreground">Generados frente a verificados en el periodo.</p></div>
        <div role="group" aria-label="Agrupación" className="flex rounded-full border border-border bg-muted p-1">
          {(["Día", "Semana", "Mes"] as const).map((k) => <button key={k} aria-pressed={g === k} onClick={() => setG(k)} className={`rounded-full px-3 py-1 text-sm font-medium ${g === k ? "bg-card text-foreground shadow-subtle" : "text-muted-foreground"}`}>{k}</button>)}
        </div>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-muted-foreground" />Generados</span>
        <span className="flex items-center gap-1.5"><span className="h-1 w-4 rounded bg-primary" />Verificados</span>
      </div>
      {loading ? <Skeleton className="mt-3 h-56 w-full rounded-xl" /> : (
        <svg key={g} viewBox={`0 0 ${W} ${H + 24}`} className="mt-3 h-56 w-full" preserveAspectRatio="none" role="img" aria-label={`Gráfica de área: ${nf.format(TOT.generados)} generados y ${nf.format(TOT.verificados)} verificados agrupados por ${g.toLowerCase()}.`}>
          <defs><linearGradient id="ar" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--primary)" stopOpacity="0.3" /><stop offset="1" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs>
          {[0.25, 0.5, 0.75].map((t) => <line key={t} x1="0" x2={W} y1={H * t} y2={H * t} stroke="var(--border)" vectorEffect="non-scaling-stroke" />)}
          <path d={`${line("b")} L${x(series.length - 1)},${H} L${x(0)},${H} Z`} fill="url(#ar)" />
          <path d={line("a")} fill="none" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
          <path d={line("b")} fill="none" stroke="var(--primary)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" pathLength={520} strokeDasharray="520" className="animate-draw" />
          {series.map((s, i) => (series.length <= 6 || i % 5 === 0) && <text key={i} x={x(i)} y={H + 18} textAnchor="middle" className="fill-muted-foreground text-[11px]">{s.l}</text>)}
        </svg>
      )}
    </section>
  );
}

function Funnel() {
  const steps = [{ l: "Generados", v: TOT.generados }, { l: "Enviados", v: TOT.enviados }, { l: "Verificados", v: TOT.verificados }];
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={s.l}>
          <div className="flex justify-between text-sm"><span className="font-medium text-foreground">{s.l}</span><span className="font-mono tabular-nums text-foreground">{nf.format(s.v)} <span className="text-muted-foreground">· {pct(s.v, TOT.generados).toFixed(1)} %</span></span></div>
          <div className="mt-1 h-7 rounded-lg bg-muted"><div className="h-full rounded-lg bg-primary transition-all" style={{ width: `${pct(s.v, TOT.generados)}%`, opacity: 1 - i * 0.2 }} /></div>
          {i < 2 && <p className="mt-1 text-xs text-destructive">−{nf.format(s.v - steps[i + 1]!.v)} ({(100 - pct(steps[i + 1]!.v, s.v)).toFixed(1)} %) {i === 0 ? "no entregados" : "sin verificar · incluye expirados"}</p>}
        </li>
      ))}
    </ol>
  );
}

function PlanUsage() {
  const used = pct(PLAN.usados, PLAN.cupo); const proj = Math.round((PLAN.usados / PLAN.dia) * PLAN.diasMes); const near = proj > PLAN.cupo * 0.9;
  return (
    <div>
      <p className="font-display text-3xl font-bold tabular-nums text-foreground">{nf.format(PLAN.usados)} <span className="text-base font-medium text-muted-foreground">/ {nf.format(PLAN.cupo)}</span></p>
      <div className="relative mt-3 h-3 rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(used)} aria-valuemin={0} aria-valuemax={100} aria-label="Cupo usado">
        <div className="h-full rounded-full bg-primary" style={{ width: `${used}%` }} />
        <div className="absolute top-[-4px] h-5 w-0.5 bg-warning" style={{ left: `${Math.min(pct(proj, PLAN.cupo), 100)}%` }} title="Proyección" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">Proyección a fin de mes: <b className="font-mono text-foreground">{nf.format(proj)}</b></p>
      {near && <p className="mt-3 flex items-start gap-2 rounded-xl bg-warning/15 p-3 text-sm text-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />Estás cerca del límite: al ritmo actual usarás el {pct(proj, PLAN.cupo).toFixed(0)} % del cupo.</p>}
    </div>
  );
}

function Radial({ v, max, label, value }: { v: number; max: number; label: string; value: string }) {
  const C = 2 * Math.PI * 34; const f = Math.min(v / max, 1);
  return (
    <figure className="flex flex-col items-center text-center">
      <svg viewBox="0 0 80 80" className="size-24" role="img" aria-label={`${label}: ${value}`}>
        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--muted)" strokeWidth="7" />
        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" strokeDasharray={`${C * f} ${C}`} transform="rotate(-90 40 40)" />
        <text x="40" y="45" textAnchor="middle" className="fill-foreground font-mono text-[13px] font-medium">{value}</text>
      </svg>
      <figcaption className="mt-1 text-xs text-muted-foreground">{label}</figcaption>
    </figure>
  );
}
function Sla() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Radial v={pct(TOT.enviados, TOT.generados)} max={100} label="Tasa de entrega" value={`${pct(TOT.enviados, TOT.generados).toFixed(1)}%`} />
        <Radial v={pct(TOT.verificados, TOT.enviados)} max={100} label="Tasa de verificación" value={`${pct(TOT.verificados, TOT.enviados).toFixed(1)}%`} />
        <Radial v={5 - 2.1} max={5} label="Generación → envío" value="2,1 s" />
        <Radial v={60 - 24} max={60} label="Envío → verificación" value="24 s" />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs sm:grid-cols-4">
        {[["Envío p50", "1,6 s"], ["Envío p95", "4,3 s"], ["Verif. p50", "18 s"], ["Verif. p95", "71 s"]].map(([a, b]) => (
          <div key={a} className="flex justify-between gap-2 rounded-lg bg-muted px-2.5 py-1.5"><dt className="text-muted-foreground">{a}</dt><dd className="font-mono text-foreground">{b}</dd></div>
        ))}
      </dl>
    </div>
  );
}

function Donut() {
  const C = 2 * Math.PI * 40; let acc = 0; const op = [1, 0.6, 0.3];
  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 100 100" className="size-32 shrink-0" role="img" aria-label="Donut: SMS 52 %, WhatsApp 31 %, Email 17 %">
        {CHANNEL_SPLIT.map((c, i) => { const el = <circle key={c.n} cx="50" cy="50" r="40" fill="none" stroke="var(--primary)" strokeOpacity={op[i]} strokeWidth="16" strokeDasharray={`${C * c.v - 2} ${C}`} strokeDashoffset={-C * acc} transform="rotate(-90 50 50)" />; acc += c.v; return el; })}
        <text x="50" y="54" textAnchor="middle" className="fill-foreground font-display text-[13px] font-bold">{nf.format(TOT.enviados)}</text>
      </svg>
      <ul className="space-y-2 text-sm">
        {CHANNEL_SPLIT.map((c, i) => {
          const I = c.n === "SMS" ? Phone : c.n === "Email" ? Mail : MessageSquare;
          return <li key={c.n} className="flex items-center gap-2"><span className="size-3 rounded-sm bg-primary" style={{ opacity: op[i] }} /><I className="size-4 text-muted-foreground" aria-hidden /><span className="text-foreground">{c.n}</span><span className="ml-auto font-mono text-muted-foreground">{Math.round(c.v * 100)} %</span></li>;
        })}
      </ul>
    </div>
  );
}

function Stacked() {
  const last = DAYS.slice(-14);
  return (
    <div>
      <div className="flex h-40 items-end gap-1" role="img" aria-label="Barras apiladas al 100 % de los últimos 14 días">
        {last.map((d, i) => {
          const v = pct(d.verificados, d.generados), f = pct(d.fallidos, d.generados);
          return <div key={i} className="flex h-full flex-1 flex-col overflow-hidden rounded-md" title={`${d.fecha.getUTCDate()}/9: ${v.toFixed(0)} % verificados`}>
            <div className="bg-destructive/70" style={{ height: `${f}%` }} /><div className="flex-1 bg-muted" /><div className="bg-primary" style={{ height: `${v}%` }} />
          </div>;
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-primary" />Verificados</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-muted ring-1 ring-border" />Pendientes</span>
        <span className="flex items-center gap-1.5"><span className="size-3 rounded-sm bg-destructive/70" />Fallidos</span>
      </div>
    </div>
  );
}

function Providers() {
  return (
    <ul className="space-y-4">
      {PROVIDER_PERF.map((p) => (
        <li key={p.n}>
          <div className="flex justify-between text-sm"><span className="font-medium text-foreground">{p.n} <span className="text-xs text-muted-foreground">· {p.canal}</span></span><span className="font-mono text-xs text-muted-foreground">{p.lat.toFixed(1).replace(".", ",")} s</span></div>
          <div className="mt-1.5 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-muted"><div className={`h-full rounded-full ${p.entrega >= 97 ? "bg-primary" : "bg-warning"}`} style={{ width: `${(p.entrega - 90) * 10}%` }} /></div><span className="w-12 text-right font-mono text-xs text-foreground">{p.entrega.toFixed(1)}%</span></div>
        </li>
      ))}
    </ul>
  );
}

function Heatmap() {
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]" role="img" aria-label="Mapa de calor: mayor volumen entre semana a las 10:00 y 18:00">
        {HEAT.map((row, d) => (
          <div key={d} className="flex items-center gap-[3px] py-[1.5px]">
            <span className="w-9 text-xs text-muted-foreground">{days[d]}</span>
            {row.map((v, h) => <span key={h} className="h-4 flex-1 rounded-[3px] bg-heat-0" title={`${days[d]} ${h}:00 · ${v}`}><span className="block h-full rounded-[3px] bg-primary" style={{ opacity: v / 130 }} /></span>)}
          </div>
        ))}
        <div className="ml-9 flex justify-between pl-1 font-mono text-[10px] text-muted-foreground"><span>00</span><span>06</span><span>12</span><span>18</span><span>23</span></div>
      </div>
    </div>
  );
}

function Templates() {
  return (
    <ol className="divide-y divide-border">
      {TEMPLATES.map((t) => (
        <li key={t.k} className="flex items-center justify-between gap-2 py-2.5 text-sm">
          <code className="truncate font-mono text-xs text-foreground">{t.k}</code>
          <span className="shrink-0 text-xs text-muted-foreground"><span className="font-mono">{nf.format(t.uso)}</span> · <b className="font-mono text-success">{t.ver.toFixed(1)}%</b></span>
        </li>
      ))}
    </ol>
  );
}

const STATE_STYLE: Record<string, string> = { Verificado: "bg-success/15 text-success", Enviado: "bg-muted text-foreground", Fallido: "bg-destructive/15 text-destructive", Expirado: "bg-warning/20 text-foreground" };
function Recent() {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[760px] text-sm">
        <thead><tr className="border-b border-border text-left text-xs text-muted-foreground">{["ID", "Destinatario", "Canal", "Estado", "Creado", "Enviado", "Verificado", "Expira", ""].map((h) => <th key={h} className="pb-2 font-medium">{h}</th>)}</tr></thead>
        <tbody className="font-mono text-xs">
          {RECENT.map((x) => (
            <tr key={x.id} className="border-b border-border last:border-0">
              <td className="py-2.5 text-muted-foreground">{x.id}</td><td className="text-foreground">{x.dest}</td><td className="font-sans">{x.canal}</td>
              <td><span className={`rounded-full px-2 py-0.5 font-sans text-xs font-medium ${STATE_STYLE[x.estado]}`}>{x.estado}</span></td>
              <td>{x.creado}</td><td>{x.enviado}</td><td>{x.ver}</td><td>{x.exp}</td>
              <td className="text-right"><a href="#" className="font-sans font-medium text-primary hover:underline">Ver detalle</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Tip() {
  return (
    <aside className="flex items-start gap-3 rounded-2xl border border-border bg-accent p-4 text-sm text-accent-foreground">
      <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
      <p><b className="font-display">Consejo Compacto:</b> SendGrid entrega 3 puntos por debajo del resto y tarda el doble. Activa WhatsApp como respaldo en <code className="font-mono">registro_cuenta</code> para recuperar verificaciones.</p>
    </aside>
  );
}

function EmptyState() {
  return (
    <section className="animate-fade-up flex flex-col items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-subtle">
      <span className="grid size-14 place-items-center rounded-2xl bg-accent text-primary"><Send className="size-6" aria-hidden /></span>
      <h2 className="mt-4 font-display text-xl font-bold text-foreground">Aún no hay envíos en este periodo</h2>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">Integra la API y verás aquí el pulso de tus verificaciones en tiempo real.</p>
      <a href="#" className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-gradient px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-action"><BookOpen className="size-4" aria-hidden />Envía tu primer OTP</a>
    </section>
  );
}

function Upsell() {
  return (
    <section className="animate-fade-up overflow-hidden rounded-3xl border border-border bg-card shadow-elevated md:grid md:grid-cols-2">
      <div className="bg-ink p-8 text-ink-foreground">
        <ShieldCheck className="size-10" aria-hidden />
        <h1 className="mt-4 font-display text-3xl font-extrabold">Verificación OTP no disponible en tu plan</h1>
        <p className="mt-2 opacity-90">Protege inicios de sesión y pagos con códigos por SMS, WhatsApp o Email.</p>
      </div>
      <div className="flex flex-col justify-center gap-4 p-8">
        <ul className="space-y-2 text-sm text-foreground">
          {["Plus: 500 OTP al mes", "Prime: 5.000 OTP al mes", "SLA, latencias y embudo en tiempo real"].map((t) => <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary" aria-hidden />{t}</li>)}
        </ul>
        <a href="#" className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-gradient px-6 py-3 text-sm font-semibold text-primary-foreground shadow-action"><Sparkles className="size-4" aria-hidden />Mejorar plan</a>
      </div>
    </section>
  );
}
