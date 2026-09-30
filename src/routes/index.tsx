import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Globe,
  Lightbulb,
  Link2,
  MousePointerClick,
  PencilLine,
  Plus,
  QrCode,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { WelcomeModal, hasSeenWelcome, markWelcomeSeen } from "@/components/welcome-modal";

import { CreateModal } from "@/components/create-modal";
import { DeleteModal } from "@/components/delete-modal";
import { EditModal } from "@/components/edit-modal";
import { QrModal } from "@/components/qr-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | Compacto" },
      { name: "description", content: "Métricas y rendimiento de tus shortlinks en un solo lugar." },
      { property: "og:title", content: "Dashboard | Compacto" },
      { property: "og:description", content: "Métricas y rendimiento de tus shortlinks en un solo lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardPage,
});

// ---------- Datos de demostración ----------

interface Shortlink {
  id: string;
  name: string;
  destination: string;
  shortUrl: string;
  tags: string[];
  daysLeft: number | null;
  expired: boolean;
  clicks: number;
  createdAt: string; // YYYY-MM-DD
}

const TODAY = "2026-09-28";

const LINKS: Shortlink[] = [
  { id: "l01", name: "No hay soberanía con el plato vacío", destination: "https://www.bbc.com/mundo", shortUrl: "cpt.cx/y2NmW6En", tags: [], daysLeft: 0, expired: true, clicks: 3, createdAt: "2026-09-26" },
  { id: "l02", name: "Lanzamiento Beta", destination: "https://compacto.app/beta", shortUrl: "cpto.co/launch", tags: ["Producto"], daysLeft: 21, expired: false, clicks: 1204, createdAt: "2026-09-22" },
  { id: "l03", name: "BBC News", destination: "https://www.bbc.com/news", shortUrl: "cpt.cx/BbCn3Ws", tags: ["bulk:6a451e"], daysLeft: 0, expired: true, clicks: 0, createdAt: "2026-09-20" },
  { id: "l04", name: "Bio Instagram", destination: "https://linktr.ee/compacto", shortUrl: "cpto.co/bio-IG", tags: ["Social"], daysLeft: 12, expired: false, clicks: 892, createdAt: "2026-09-19" },
  { id: "l05", name: "Webinar Septiembre", destination: "https://zoom.us/j/9823", shortUrl: "cpt.cx/wbnr9", tags: ["Eventos"], daysLeft: 30, expired: false, clicks: 467, createdAt: "2026-09-16" },
  { id: "l06", name: "Black Friday", destination: "https://shop.com/promo-2026", shortUrl: "cpto.co/bf-2026", tags: ["Campañas"], daysLeft: 45, expired: false, clicks: 2103, createdAt: "2026-09-13" },
  { id: "l07", name: "BBC News", destination: "https://www.bbc.com/news", shortUrl: "cpt.cx/BbCn7Kd", tags: ["bulk:6a451e"], daysLeft: 0, expired: true, clicks: 0, createdAt: "2026-09-10" },
  { id: "l08", name: "Newsletter #42", destination: "https://mailchi.mp/42", shortUrl: "cpto.co/nl-42", tags: ["Email"], daysLeft: 8, expired: false, clicks: 331, createdAt: "2026-09-05" },
  { id: "l09", name: "BBC News", destination: "https://www.bbc.com/news", shortUrl: "cpt.cx/BbCn9Qm", tags: ["bulk:6a451e"], daysLeft: 0, expired: true, clicks: 0, createdAt: "2026-09-03" },
  { id: "l10", name: "Demo onboarding", destination: "https://figma.com/proto/demo", shortUrl: "cpt.cx/demo01", tags: ["Onboarding"], daysLeft: 0, expired: true, clicks: 56, createdAt: "2026-09-01" },
  { id: "l11", name: "BBC News", destination: "https://www.bbc.com/news", shortUrl: "cpt.cx/BbCn2Xr", tags: ["bulk:6a451e"], daysLeft: 0, expired: true, clicks: 0, createdAt: "2026-08-28" },
  { id: "l12", name: "Pricing anual", destination: "https://compacto.app/pricing", shortUrl: "cpto.co/pricing", tags: ["Producto"], daysLeft: 60, expired: false, clicks: 745, createdAt: "2026-08-25" },
  { id: "l13", name: "BBC News", destination: "https://www.bbc.com/news", shortUrl: "cpt.cx/BbCn5Tz", tags: ["bulk:6a451e"], daysLeft: 0, expired: true, clicks: 0, createdAt: "2026-08-21" },
  { id: "l14", name: "Encuesta CSAT", destination: "https://typeform.com/csat", shortUrl: "cpt.cx/csat", tags: ["Research"], daysLeft: 15, expired: false, clicks: 128, createdAt: "2026-08-14" },
];

const RANGE_LABELS = [
  { key: "today", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
] as const;

type RangeKey = (typeof RANGE_LABELS)[number]["key"] | "custom";

function cutoffDate(key: RangeKey, customStart: string, customEnd: string) {
  if (key === "today") return TODAY;
  if (key === "custom") return customStart || "0000-01-01";
  const days = key === "7d" ? 7 : 30;
  const date = new Date(`${TODAY}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

const formatNumber = (value: number) => value.toLocaleString("es-CO");

// ---------- Gráfica de actividad ----------

type ChartMode = "day" | "week" | "month";

const TREND_DATA: Record<ChartMode, { values: number[]; labels: string[]; step: number }> = {
  day: {
    values: [0, 0, 1, 2, 2, 4, 3, 5, 4, 6, 8, 7, 9, 11, 9, 7, 8, 10, 9, 12, 14, 11, 7, 4],
    labels: ["00", "03", "06", "09", "12", "15", "18", "21"],
    step: 3,
  },
  week: {
    values: [12, 18, 9, 22, 31, 17, 14],
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    step: 1,
  },
  month: {
    values: [4, 6, 5, 8, 7, 9, 8, 11, 10, 8, 12, 14, 11, 9, 13, 16, 12, 10, 14, 17, 15, 13, 18, 16, 14, 19, 17, 21, 18, 22],
    labels: ["1", "7", "14", "21", "28"],
    step: 6,
  },
};

function areaPaths(values: number[], width = 100, height = 32) {
  const max = Math.max(...values, 1);
  const step = width / (values.length - 1);
  const points = values.map((value, index) => [
    index * step,
    height - 2 - (value / max) * (height - 6),
  ] as const);
  const line = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area };
}

// ---------- Página ----------

function DashboardPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<Shortlink>(LINKS[0]!);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  useEffect(() => {
    if (!hasSeenWelcome()) setWelcomeOpen(true);
  }, []);

  const closeWelcome = () => {
    markWelcomeSeen();
    setWelcomeOpen(false);
  };

  const [range, setRange] = useState<RangeKey>("30d");
  const [customStart, setCustomStart] = useState("2026-08-01");
  const [customEnd, setCustomEnd] = useState(TODAY);
  const [showCustom, setShowCustom] = useState(false);

  const [chartMode, setChartMode] = useState<ChartMode>("week");
  const [chartLink, setChartLink] = useState("todos");

  const [search, setSearch] = useState("");
  const [tablePage, setTablePage] = useState(0);
  const [barsPage, setBarsPage] = useState(0);
  const [barsAsc, setBarsAsc] = useState(false);

  const openEdit = (link: Shortlink) => {
    setActiveLink(link);
    setEditOpen(true);
  };
  const openQr = (link: Shortlink) => {
    setActiveLink(link);
    setQrOpen(true);
  };
  const openDelete = (link: Shortlink) => {
    setActiveLink(link);
    setDeleteOpen(true);
  };

  const cutoff = cutoffDate(range, customStart, customEnd);
  const endBound = range === "custom" ? customEnd || "9999-12-31" : TODAY;

  const filtered = useMemo(
    () => LINKS.filter((link) => link.createdAt >= cutoff && link.createdAt <= endBound),
    [cutoff, endBound],
  );

  const active = filtered.filter((link) => !link.expired).length;
  const expired = filtered.length - active;
  const totalClicks = filtered.reduce((sum, link) => sum + link.clicks, 0);
  const domains = new Set(filtered.map((link) => link.shortUrl.split("/")[0])).size;
  const activePct = filtered.length ? Math.round((active / filtered.length) * 100) : 0;
  const expiredPct = filtered.length ? Math.round((expired / filtered.length) * 100) : 0;

  // Gráfica de actividad
  const trend = TREND_DATA[chartMode];
  const linkIndex = chartLink === "todos" ? 0 : LINKS.findIndex((link) => link.id === chartLink);
  const factor = 1 + ((linkIndex < 0 ? 0 : linkIndex) % 5) * 0.2;
  const trendValues = trend.values.map((value) => Math.round(value * factor));
  const paths = areaPaths(trendValues);

  // Ranking por clics (barras + Top 5)
  const ranked = useMemo(() => [...filtered].sort((a, b) => b.clicks - a.clicks), [filtered]);
  const top5 = ranked.slice(0, 5);

  const BAR_PAGE_SIZE = 7;
  const sortedBars = useMemo(
    () => (barsAsc ? [...filtered].sort((a, b) => a.clicks - b.clicks) : ranked),
    [filtered, ranked, barsAsc],
  );
  const barsPages = Math.max(1, Math.ceil(sortedBars.length / BAR_PAGE_SIZE));
  const safeBarsPage = Math.min(barsPage, barsPages - 1);
  const barsSlice = sortedBars.slice(safeBarsPage * BAR_PAGE_SIZE, safeBarsPage * BAR_PAGE_SIZE + BAR_PAGE_SIZE);
  const maxBar = Math.max(...barsSlice.map((link) => link.clicks), 1);

  // Tabla
  const query = search.trim().toLowerCase();
  const tableRows = useMemo(
    () =>
      filtered.filter((link) =>
        !query ||
        link.name.toLowerCase().includes(query) ||
        link.destination.toLowerCase().includes(query) ||
        link.shortUrl.toLowerCase().includes(query) ||
        link.tags.some((tag) => tag.toLowerCase().includes(query)),
      ),
    [filtered, query],
  );
  const TABLE_PAGE_SIZE = 8;
  const tablePages = Math.max(1, Math.ceil(tableRows.length / TABLE_PAGE_SIZE));
  const safeTablePage = Math.min(tablePage, tablePages - 1);
  const tableSlice = tableRows.slice(safeTablePage * TABLE_PAGE_SIZE, safeTablePage * TABLE_PAGE_SIZE + TABLE_PAGE_SIZE);
  const weekTrend = TREND_DATA.week.values.reduce((sum, value) => sum + value, 0);
  const weekMax = Math.max(...TREND_DATA.week.values);

  return (
    <main id="main" className="technical-grid min-h-dvh bg-background pb-12">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        {/* Cabecera editorial */}
        <header className="border-b border-border pb-6 pt-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase text-primary">
                <span className="size-2 rounded-full bg-primary" aria-hidden="true" />
                PLAN FREE ACTIVO
              </span>
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">Dashboard general</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  Una lectura clara del rendimiento de tus enlaces, desde la actividad general hasta cada destino.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-subtle" role="group" aria-label="Rango de fechas">
                  {RANGE_LABELS.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => { setRange(key); setShowCustom(false); }}
                      aria-pressed={range === key}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        range === key
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => { setShowCustom((value) => !value); setRange("custom"); }}
                    aria-pressed={showCustom}
                    aria-label="Rango personalizado"
                    className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      showCustom || range === "custom" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <CalendarDays className="size-5" />
                  </button>
                </div>
                <Button type="button" variant="premium" onClick={() => setCreateOpen(true)} className="h-11 rounded-full px-5 font-semibold">
                  <Plus className="size-4" /> Crear enlace
                </Button>
              </div>

              {showCustom && (
                <div className="modal-enter flex flex-wrap items-end gap-3 rounded-2xl bg-card p-4 text-foreground shadow-elevated">
                  <div className="space-y-1">
                    <label htmlFor="start-date" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Desde</label>
                    <Input id="start-date" type="date" value={customStart} onChange={(event) => setCustomStart(event.target.value)} className="h-10 rounded-xl" />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="end-date" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hasta</label>
                    <Input id="end-date" type="date" value={customEnd} onChange={(event) => setCustomEnd(event.target.value)} className="h-10 rounded-xl" />
                  </div>
                  <Button type="button" variant="premium" className="h-10 rounded-full px-5" onClick={() => { setRange("custom"); setShowCustom(false); }}>
                    <Check className="size-4" /> Aplicar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* KPIs */}
        <section aria-label="Métricas principales" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard icon={Link2} label="Shortlinks generados" value={formatNumber(filtered.length)} hint={range === "today" ? "hoy" : range === "7d" ? "últimos 7 días" : "en el rango"} />
          <KpiCard icon={MousePointerClick} label="Enlaces activos" value={formatNumber(active)} hint={`${activePct}% del total`} progress={activePct} />
          <KpiCard icon={Clock3} label="Enlaces expirados" value={formatNumber(expired)} hint={`${expiredPct}% del total`} progress={expiredPct} negative />
          <KpiCard icon={Globe} label="Dominios conectados" value={formatNumber(domains)} hint="cpt.cx · cpto.co" />
        </section>

        {/* Gráfica panorámica */}
        <section className="rounded-2xl border border-border bg-card p-5 shadow-subtle md:p-7">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-primary">Rendimiento</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">Actividad de clics</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{formatNumber(totalClicks)} clics acumulados en el rango seleccionado</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={chartLink} onValueChange={setChartLink}>
                    <SelectTrigger className="h-9 w-44 rounded-full bg-background text-sm" aria-label="Enlace de la tendencia">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los enlaces</SelectItem>
                      {LINKS.map((link) => (
                        <SelectItem key={link.id} value={link.id}>{link.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex rounded-full border border-border bg-secondary p-1" role="group" aria-label="Granularidad">
                    {(["day", "week", "month"] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setChartMode(mode)}
                        aria-pressed={chartMode === mode}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          chartMode === mode ? "bg-card text-primary shadow-subtle" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {mode === "day" ? "Día" : mode === "week" ? "Semana" : "Mes"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative h-72 w-full md:h-96">
                <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full text-primary" role="img" aria-label={`Clics por ${chartMode === "day" ? "hora" : chartMode === "week" ? "día" : "día del mes"}`}>
                  <defs>
                    <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[8, 16, 24, 32].map((y) => <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.3" vectorEffect="non-scaling-stroke" />)}
                  <path d={paths.area} fill="url(#area-fill)" />
                  <path d={paths.line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </svg>
                <div className="flex justify-between pt-3 text-[10px] font-medium text-muted-foreground">
                  {trend.labels.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>
              </div>
        </section>

        {/* Banda de lectura rápida */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <section className="rounded-2xl border border-border bg-card p-6 shadow-subtle lg:col-span-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-bold text-foreground">Clics por enlace</h2>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs" onClick={() => setBarsAsc((value) => !value)} aria-label={barsAsc ? "Ordenar descendente" : "Ordenar ascendente"}>
                    {barsAsc ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" />}
                    {barsAsc ? "Menos clics" : "Más clics"}
                  </Button>
                  <span className="text-xs text-muted-foreground">{safeBarsPage + 1}/{barsPages}</span>
                  <Button type="button" variant="outline" size="icon-lg" className="size-8" onClick={() => setBarsPage((page) => Math.max(0, page - 1))} disabled={safeBarsPage === 0} aria-label="Página anterior">
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon-lg" className="size-8" onClick={() => setBarsPage((page) => Math.min(barsPages - 1, page + 1))} disabled={safeBarsPage >= barsPages - 1} aria-label="Página siguiente">
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
              <ul className="space-y-3">
                {barsSlice.map((link) => (
                  <li key={link.id} className="flex items-center gap-3">
                    <span className="w-40 min-w-0 flex-1 truncate text-sm font-medium text-foreground sm:w-56">{link.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max(4, (link.clicks / maxBar) * 100)}%` }} />
                    </div>
                    <span className="w-14 text-right text-sm font-semibold tabular-nums text-foreground">{formatNumber(link.clicks)}</span>
                  </li>
                ))}
                {barsSlice.length === 0 && (
                  <li className="py-6 text-center text-sm text-muted-foreground">Sin datos en el rango seleccionado.</li>
                )}
              </ul>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-subtle lg:col-span-3">
              <h2 className="mb-4 font-display text-lg font-bold text-foreground">Top 5 enlaces</h2>
              <ol className="space-y-4">
                {top5.map((link, index) => (
                  <li key={link.id} className="flex items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground" aria-hidden="true">{index + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{link.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatNumber(link.clicks)} clics</p>
                    </div>
                  </li>
                ))}
                {top5.length === 0 && <li className="text-sm text-muted-foreground">Sin datos en el rango seleccionado.</li>}
              </ol>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6 shadow-subtle lg:col-span-3">
              <p className="text-xs font-bold uppercase text-primary">Tendencia semanal</p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">+{formatNumber(weekTrend)}</p>
              <p className="text-xs text-muted-foreground">clics esta semana</p>
              <div className="mt-6 flex h-24 items-end gap-2" aria-hidden="true">
                {TREND_DATA.week.values.map((value, index) => (
                  <div key={index} className={`flex-1 rounded-t-sm ${value === weekMax ? "bg-primary" : "bg-primary/20"}`} style={{ height: `${Math.max(15, (value / 31) * 100)}%` }} />
                ))}
              </div>
              <p className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
                <TrendingUp className="size-3.5" aria-hidden="true" /> Viernes es tu mejor día
              </p>
            </section>
        </div>

        {/* Tabla protagonista */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-subtle">
              <div className="flex flex-col gap-4 border-b border-border p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-primary">Gestión</p>
                  <h2 className="mt-1 font-display text-xl font-bold text-foreground">Shortlinks generados</h2>
                </div>
                <div className="relative md:w-72">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    type="search"
                    value={search}
                    onChange={(event) => { setSearch(event.target.value); setTablePage(0); }}
                    placeholder="Buscar enlaces..."
                    aria-label="Buscar enlaces"
                    className="h-10 rounded-full bg-background pl-10"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[960px] table-fixed text-left text-sm">
                  <caption className="sr-only">Listado de shortlinks generados con estado, clics y acciones</caption>
                  <thead className="bg-secondary text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th scope="col" className="w-[22%] px-6 py-4">Nombre</th>
                      <th scope="col" className="w-[17%] px-4 py-4">Enlace corto</th>
                      <th scope="col" className="w-[27%] px-4 py-4">Destino</th>
                      <th scope="col" className="w-[12%] px-4 py-4">Estado</th>
                      <th scope="col" className="w-[9%] px-4 py-4 text-right">Clics</th>
                      <th scope="col" className="w-[13%] px-4 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {tableSlice.map((link) => (
                      <tr key={link.id} className="transition-colors hover:bg-secondary/40">
                        <td className="px-5 py-4">
                          <p className="truncate font-medium text-foreground">{link.name}</p>
                          {link.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {link.tags.map((tag) => (
                                <span key={tag} className="inline-flex h-5 items-center rounded-full bg-secondary px-2 text-[10px] font-semibold text-secondary-foreground">{tag}</span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className="block truncate font-mono text-xs text-primary">{link.shortUrl}</span>
                        </td>
                        <td className="px-4 py-4"><span className="block truncate text-muted-foreground" title={link.destination}>{link.destination}</span></td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex h-6 items-center rounded-full px-2 text-[10px] font-bold ${link.expired ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"}`}>
                            {link.expired ? "EXPIRADO" : `${link.daysLeft} DÍAS`}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums text-foreground">{formatNumber(link.clicks)}</td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <Button type="button" variant="ghost" size="icon-lg" className="size-7 text-muted-foreground hover:text-primary" onClick={() => openEdit(link)} aria-label={`Editar ${link.name}`}>
                              <PencilLine className="size-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon-lg" className="size-7 text-muted-foreground hover:text-primary" onClick={() => openQr(link)} aria-label={`Ver código QR de ${link.name}`}>
                              <QrCode className="size-4" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon-lg" className="size-7 text-muted-foreground hover:text-destructive" onClick={() => openDelete(link)} aria-label={`Eliminar ${link.name}`}>
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {tableSlice.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">
                          Sin resultados{query ? ` para «${search.trim()}»` : ""}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-border bg-secondary/50 px-6 py-4">
                <p className="text-xs text-muted-foreground">
                  Mostrando {tableRows.length === 0 ? 0 : safeTablePage * TABLE_PAGE_SIZE + 1}–{Math.min((safeTablePage + 1) * TABLE_PAGE_SIZE, tableRows.length)} de {tableRows.length} enlaces
                </p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs" onClick={() => setTablePage((page) => Math.max(0, page - 1))} disabled={safeTablePage === 0}>Anterior</Button>
                  <Button type="button" variant="outline" size="sm" className="h-8 rounded-full px-4 text-xs" onClick={() => setTablePage((page) => Math.min(tablePages - 1, page + 1))} disabled={safeTablePage >= tablePages - 1}>Siguiente</Button>
                </div>
              </div>
        </section>

        {/* Información secundaria */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-subtle sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase text-primary">Tu plan</p>
              <h2 className="mt-1 font-display text-xl font-bold text-foreground">Free</h2>
              <p className="mt-1 text-xs text-muted-foreground">25 shortlinks · 1 dominio · métricas 30 días</p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="premium" className="h-10 rounded-full px-4 text-sm font-semibold">Cambiar plan</Button>
              <Button type="button" variant="ghost" className="h-10 rounded-full px-4 text-sm text-muted-foreground">Cancelar</Button>
            </div>
          </section>
          <section className="flex items-start gap-4 rounded-2xl border border-border bg-accent/50 p-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-primary shadow-subtle"><Lightbulb className="size-5" aria-hidden="true" /></span>
            <div>
              <h2 className="font-display text-sm font-bold text-foreground">Consejo Compacto</h2>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Los nombres personalizados reciben hasta <strong className="font-semibold text-foreground">40% más clics</strong>. Usa etiquetas para agrupar campañas.</p>
            </div>
          </section>
        </div>
      </div>

      <WelcomeModal open={welcomeOpen} onClose={closeWelcome} />
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditModal open={editOpen} url={`https://${activeLink.shortUrl}`} onClose={() => setEditOpen(false)} />
      <QrModal open={qrOpen} url={`https://${activeLink.shortUrl}`} onClose={() => setQrOpen(false)} />
      <DeleteModal open={deleteOpen} url={`https://${activeLink.shortUrl}`} onClose={() => setDeleteOpen(false)} />
    </main>
  );
}

// ---------- Tarjeta KPI ----------

function KpiCard({ icon: Icon, label, value, hint, progress, negative }: {
  icon: typeof Link2;
  label: string;
  value: string;
  hint: string;
  progress?: number;
  negative?: boolean;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-subtle transition-shadow hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground" aria-hidden="true">
          <Icon className="size-5" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <p className="font-display text-2xl font-bold tabular-nums text-foreground">{value}</p>
        {progress !== undefined && (
          <span className={`text-xs font-semibold ${negative ? "text-destructive" : "text-primary"}`}>{progress}%</span>
        )}
      </div>
      {progress !== undefined ? (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary" role="presentation">
          <div className={`h-full rounded-full ${negative ? "bg-destructive" : "bg-primary"}`} style={{ width: `${progress}%` }} />
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">{hint}</p>
      )}
    </article>
  );
}
