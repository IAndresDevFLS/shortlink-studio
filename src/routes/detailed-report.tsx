import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BarChart3, CalendarDays, ChevronLeft, ChevronRight, Clock3, Contrast, Copy, Download, Globe, Link2, LockKeyhole, Monitor, Moon, MousePointer2, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Smartphone, Sun, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClickTimeline, DeviceRing } from "@/components/detailed-report-charts";
import { DEFAULT_REPORT_FILTERS, REPORT_LINKS, getReportEvents, rankEvents, reportSeries, type ReportFilters } from "@/lib/detailed-report";

export const Route = createFileRoute("/detailed-report")({
  validateSearch: (search: Record<string, unknown>): { link?: string | undefined } => ({ link: typeof search['link'] === "string" && REPORT_LINKS.some(link => link.slug === search['link']) ? search['link'] : undefined }),
  head: () => ({ meta: [
    { title: "Reporte detallado de clics · Compacto" },
    { name: "description", content: "Analiza cada shortlink por fecha, dispositivo, ubicación y navegador con el reporte detallado de Compacto." },
    { property: "og:title", content: "Reporte detallado de clics · Compacto" },
    { property: "og:description", content: "Evolución, audiencia y registro de clics por enlace y período." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: DetailedReportPage,
});

const dateLabel = (value: string) => new Date(value.length === 10 ? value + "T00:00:00Z" : value + "Z").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const timeLabel = (value: string) => value.slice(11, 16);

function DetailedReportPage() {
  const { link: requestedLink } = Route.useSearch();
  const [theme, setTheme] = useState<"light" | "dark" | "contraste">("light");
  const [draft, setDraft] = useState<ReportFilters>({ ...DEFAULT_REPORT_FILTERS, link: requestedLink ?? DEFAULT_REPORT_FILTERS.link });
  const [applied, setApplied] = useState(draft);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { const saved = localStorage.getItem("compacto-theme"); if (saved === "dark" || saved === "contraste") setTheme(saved); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const link = REPORT_LINKS.find(item => item.slug === applied.link) ?? REPORT_LINKS[0];
  const events = getReportEvents(applied);
  const devices = rankEvents(events, "device");
  const countries = rankEvents(events, "country");
  const filtered = events.filter(event => `${event.date} ${event.ip} ${event.device} ${event.country} ${event.city} ${event.browser} ${event.os}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const latest = events[0];
  const percent = (count: number) => events.length ? `${Math.round(count / events.length * 100)}%` : "—";
  const change = (values: Partial<ReportFilters>) => { setDraft(current => ({ ...current, ...values })); setError(""); };
  const filter = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.start || !draft.end || draft.start > draft.end) { setError("Selecciona un rango válido: la fecha de inicio debe ser anterior o igual a la fecha de fin."); return; }
    if ((Date.parse(draft.end) - Date.parse(draft.start)) / 86400000 > 3660) { setError("Selecciona un período de hasta diez años."); return; }
    setApplied({ ...draft }); setPage(1); setQuery(""); setNotice(""); setError("");
  };
  const reset = () => { const values = { ...DEFAULT_REPORT_FILTERS, link: requestedLink ?? DEFAULT_REPORT_FILTERS.link }; setDraft(values); setApplied(values); setQuery(""); setPage(1); setError(""); setNotice(""); };
  const copy = async () => { if (!link) return; try { await navigator.clipboard.writeText(`https://${link.domain}/${link.slug}`); setNotice("Shortlink copiado."); } catch { setNotice("No se pudo copiar el shortlink."); } };
  const exportCSV = () => {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const csv = "\uFEFF" + ["Fecha,IPv4,Dispositivo,País,Ciudad,Navegador,Sistema operativo", ...filtered.map(event => [event.date, event.ip, event.device, event.country, event.city, event.browser, event.os].map(quote).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `reporte-detallado-${applied.link}-demo.csv`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(`${filtered.length} registros exportados.`);
  };
  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#detailed-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 text-foreground hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button><div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => { setTheme(value); localStorage.setItem("compacto-theme", value); }}><Icon /></Button>)}</div></div>
    </header>
    <main id="detailed-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><BarChart3 className="size-4" /> Analítica por shortlink</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Reporte detallado</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">Cada clic, en perspectiva.</p></div><span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4 text-primary" />{dateLabel(applied.start)} — {dateLabel(applied.end)}</span></div>
      <section aria-label="Filtros del reporte" className="mt-9 border-y border-border bg-card/80 px-4 py-5 sm:px-6 sm:py-6">
        <form onSubmit={filter} noValidate><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
          <div className="min-w-0 space-y-2 sm:col-span-2 lg:col-span-1"><Label htmlFor="report-link">Shortlink</Label><Select value={draft.link} onValueChange={value => change({ link: value })}><SelectTrigger id="report-link" className="h-12 w-full min-w-0 rounded-lg bg-background [&>span]:truncate"><SelectValue /></SelectTrigger><SelectContent>{REPORT_LINKS.map(item => <SelectItem key={item.slug} value={item.slug}>{item.title}</SelectItem>)}</SelectContent></Select></div>
          <div className="min-w-0 space-y-2"><Label htmlFor="report-start">Fecha de inicio</Label><Input id="report-start" type="date" value={draft.start} onChange={event => change({ start: event.target.value })} aria-invalid={!!error} aria-describedby={error ? "report-error" : undefined} className="w-full min-w-0 rounded-lg" /></div>
          <div className="min-w-0 space-y-2"><Label htmlFor="report-end">Fecha de fin</Label><Input id="report-end" type="date" value={draft.end} onChange={event => change({ end: event.target.value })} aria-invalid={!!error} aria-describedby={error ? "report-error" : undefined} className="w-full min-w-0 rounded-lg" /></div>
          <div className="flex items-end gap-2"><Button type="submit" variant="premium" className="h-12 rounded-full px-5"><SlidersHorizontal /> Filtrar</Button><Button type="button" variant="outline" size="icon" className="size-12 rounded-full" aria-label="Restablecer filtros" title="Restablecer filtros" onClick={reset}><RotateCcw /></Button></div>
        </div>{error && <p role="alert" id="report-error" className="mt-4 text-sm text-destructive">{error}</p>}</form>
      </section>
      {link && <section aria-label="Detalles del shortlink" className="flex flex-wrap justify-between gap-5 border-b border-border py-6">
        <div className="min-w-0 basis-full lg:flex-1 lg:basis-0"><h2 className="font-display text-xl font-semibold">{link.title}</h2><p className="mt-2 break-all text-xs text-muted-foreground">{link.destination}</p><div className="mt-4 flex flex-wrap items-center gap-2"><span className="flex items-center gap-2 font-mono text-sm text-primary"><Link2 className="size-4" />{link.domain}/{link.slug}</span><Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground" title="Copiar shortlink" aria-label="Copiar shortlink" onClick={copy}><Copy /></Button></div></div>
        <div className="flex flex-wrap items-center gap-4 text-xs"><span className="flex items-center gap-2 text-muted-foreground"><LockKeyhole className="size-4" />{link.protected ? "Con contraseña" : "Sin contraseña"}</span>{link.tags.map(tag => <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-3 py-1 text-accent-foreground"><Tag className="size-3" />{tag}</span>)}</div>
      </section>}
      <section aria-label="Resumen del reporte" className="grid grid-cols-2 gap-x-5 gap-y-7 py-8 lg:grid-cols-4">{[
        { label: "Clics totales", value: String(events.length), detail: "En el período seleccionado", icon: MousePointer2 },
        { label: "Último clic", value: latest ? dateLabel(latest.date) : "—", detail: latest ? `${timeLabel(latest.date)} · IP: ${latest.ip}` : "Sin actividad", icon: Clock3 },
        { label: "País principal", value: countries[0]?.name ?? "—", detail: countries[0] ? `${percent(countries[0].count)} del tráfico` : "Sin actividad", icon: Globe },
        { label: "Dispositivo principal", value: devices[0]?.name ?? "—", detail: devices[0] ? `${percent(devices[0].count)} de los clics` : "Sin actividad", icon: Smartphone },
      ].map(metric => <div key={metric.label} className="min-w-0 border-l-2 border-border pl-4"><p className="flex items-start gap-2 text-xs text-muted-foreground"><metric.icon className="size-4 shrink-0 text-primary" />{metric.label}</p><p className={`mt-3 break-words font-display font-semibold ${metric.label === "Último clic" ? "text-xl" : "text-3xl"} ${metric.label === "Clics totales" ? "text-primary" : "text-foreground"}`}>{metric.value}</p><p className="mt-2 text-xs text-muted-foreground">{metric.detail}</p></div>)}</section>
      <section aria-labelledby="click-evolution" className="border-y border-border bg-card/70 py-6 sm:py-7"><div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6"><h2 id="click-evolution" className="font-display text-xl font-semibold">Clics en el tiempo</h2><span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-primary" /> Clics diarios</span></div>{events.length ? <ClickTimeline data={reportSeries(applied, events)} /> : <div className="py-20 text-center"><BarChart3 className="mx-auto mb-3 size-7 text-muted-foreground" /><h3 className="font-display text-lg font-semibold">Sin clics en este período</h3><p className="mt-2 text-sm text-muted-foreground">Prueba con otro enlace o rango de fechas.</p></div>}</section>
      <section aria-label="Audiencia del shortlink" className="grid gap-8 border-b border-border py-8 lg:grid-cols-2">
        <div className="min-w-0 lg:border-r lg:border-border lg:pr-8"><h2 className="font-display text-xl font-semibold">Distribución por dispositivo</h2><div className="mt-5 flex flex-wrap items-center justify-center gap-6 sm:flex-nowrap"><DeviceRing rows={devices} total={events.length} /><div className="w-full min-w-0 space-y-4">{devices.length ? devices.map((row, index) => <div key={row.name} className="flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2"><span className={`size-2.5 shrink-0 rounded-sm ${["bg-primary", "bg-chart-3", "bg-chart-4"][index % 3]}`} />{row.name}</span><span className="whitespace-nowrap font-mono text-xs">{row.count} <span className="text-muted-foreground">· {percent(row.count)}</span></span></div>) : <p className="text-sm text-muted-foreground">Sin datos de dispositivos</p>}</div></div></div>
        <Ranking title="Navegador y sistema operativo" rows={rankEvents(events.map(event => ({ ...event, browser: `${event.browser} / ${event.os}` })), "browser").slice(0, 4)} total={events.length} />
      </section>
      <section aria-label="Rankings de audiencia" className="grid gap-8 border-b border-border py-8 md:grid-cols-3"><Ranking title="Ranking por país" rows={countries.slice(0, 5)} total={events.length} /><Ranking title="Ranking por ciudad" rows={rankEvents(events, "city").slice(0, 5)} total={events.length} /><Ranking title="Sistema operativo" rows={rankEvents(events, "os")} total={events.length} /></section>
      <section aria-labelledby="event-log" className="mt-9"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><div><h2 id="event-log" className="font-display text-xl font-semibold">Registro detallado <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{events.length}</span></h2><p className="mt-1 text-xs text-muted-foreground">Fechas y horas en UTC</p></div><div className="flex w-full gap-2 sm:w-auto"><div className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input aria-label="Buscar en el registro" placeholder="País, ciudad, navegador…" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} className="rounded-full bg-card pl-10" /></div><Button variant="outline" className="h-12 rounded-full px-4" onClick={exportCSV} disabled={!filtered.length}><Download /> CSV</Button></div></div>
        {notice && <p role="status" className="mb-4 text-sm text-primary">{notice}</p>}
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle"><table className="w-full min-w-[950px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{["Fecha / hora", "IPv4", "Dispositivo", "País", "Ciudad", "Navegador", "Sistema operativo"].map(label => <th key={label} scope="col" className="px-5 py-4 font-medium">{label}</th>)}</tr></thead><tbody>{visible.map(event => <tr key={event.id} className="border-b border-border last:border-0 hover:bg-muted/40"><td className="whitespace-nowrap px-5 py-4"><p>{dateLabel(event.date)}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{timeLabel(event.date)}</p></td><td className="px-5 py-4 font-mono text-xs text-muted-foreground">{event.ip}</td><td className="px-5 py-4"><span className="flex items-center gap-2">{event.device === "Escritorio" ? <Monitor className="size-3.5 text-muted-foreground" /> : <Smartphone className="size-3.5 text-muted-foreground" />}{event.device}</span></td><td className="px-5 py-4 font-mono text-xs">{event.country}</td><td className="px-5 py-4">{event.city}</td><td className="px-5 py-4 text-xs">{event.browser}</td><td className="px-5 py-4 text-xs">{event.os}</td></tr>)}</tbody></table>{!filtered.length && <div className="py-12 text-center"><Search className="mx-auto mb-3 size-6 text-muted-foreground" /><p className="font-display text-lg font-medium">Sin registros para mostrar</p></div>}</div>
        <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground"><span>{filtered.length ? `${(currentPage - 1) * 10 + 1}–${Math.min(currentPage * 10, filtered.length)}` : "0"} de {filtered.length} registros</span><nav aria-label="Paginación del registro" className="flex items-center gap-3"><Button variant="outline" size="icon" className="rounded-full" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><span aria-live="polite">{currentPage} / {pages}</span><Button variant="outline" size="icon" className="rounded-full" aria-label="Página siguiente" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></nav></footer>
      </section>
      <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · No representan tráfico real. Las direcciones IP no están disponibles.</p>
    </main>
  </div>;
}

function Ranking({ title, rows, total }: { title: string; rows: { name: string; count: number }[]; total: number }) {
  const max = rows[0]?.count ?? 1;
  return <div className="min-w-0"><h2 className="font-display text-lg font-semibold">{title}</h2><ol className="mt-5 space-y-4">{rows.map((row, index) => <li key={row.name}><div className="mb-2 flex items-start justify-between gap-3 text-sm"><span className="flex min-w-0 items-start gap-2"><span className="grid size-5 shrink-0 place-items-center rounded bg-secondary font-mono text-[10px] text-muted-foreground">{index + 1}</span><span className="break-words">{row.name}</span></span><span className="shrink-0 font-mono text-xs">{row.count} <span className="text-muted-foreground">· {total ? Math.round(row.count / total * 100) : 0}%</span></span></div><div className="h-1.5 overflow-hidden rounded-full bg-secondary"><svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-full w-full text-primary" aria-hidden="true"><rect width={row.count / max * 100} height="6" rx="1" fill="currentColor" /></svg></div></li>)}</ol>{!rows.length && <p className="mt-5 text-sm text-muted-foreground">Sin actividad en el período</p>}</div>;
}