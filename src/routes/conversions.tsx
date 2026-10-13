import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Contrast, Download, FileText, Info, Link2, Moon, MousePointer2, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Sun, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DEFAULT_CONVERSION_FILTERS, conversionCSV, getConversionRows, type ConversionFilters, type ConversionSort } from "@/lib/conversions";

export const Route = createFileRoute("/conversions")({
  head: () => ({ meta: [
    { title: "Conversiones · Compacto" },
    { name: "description", content: "Consulta clics, conversiones y rendimiento por enlace con filtros por fecha en Compacto." },
    { property: "og:title", content: "Conversiones · Compacto" },
    { property: "og:description", content: "El resultado de tus enlaces: conversiones, tasas y reportes por período." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: ConversionsPage,
});

function ConversionsPage() {
  const [theme, setTheme] = useState<"light" | "dark" | "contraste">("light");
  const [draft, setDraft] = useState<ConversionFilters>(DEFAULT_CONVERSION_FILTERS);
  const [applied, setApplied] = useState<ConversionFilters>(DEFAULT_CONVERSION_FILTERS);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pdfBusy, setPdfBusy] = useState(false);
  useEffect(() => { const value = localStorage.getItem("compacto-theme"); if (value === "dark" || value === "contraste") setTheme(value); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const rows = getConversionRows(applied);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const conversions = rows.reduce((sum, row) => sum + row.conversions, 0);
  const globalRate = clicks ? conversions / clicks * 100 : null;
  const withoutConversions = rows.filter(row => row.conversions === 0).length;
  const pages = Math.max(1, Math.ceil(rows.length / 10));
  const visible = rows.slice((page - 1) * 10, page * 10);
  const dateLabel = (date: string) => new Date(date + "T00:00:00Z").toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  const change = (values: Partial<ConversionFilters>) => { setDraft(current => ({ ...current, ...values })); setError(""); };
  const filter = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.start || !draft.end) { setError("Selecciona las fechas de inicio y fin."); return; }
    if (draft.start > draft.end) { setError("La fecha de inicio no puede ser posterior a la fecha de fin."); return; }
    setApplied({ ...draft }); setPage(1); setNotice(""); setError("");
  };
  const reset = () => { setDraft(DEFAULT_CONVERSION_FILTERS); setApplied(DEFAULT_CONVERSION_FILTERS); setPage(1); setError(""); setNotice(""); };
  const exportCSV = () => {
    const url = URL.createObjectURL(new Blob([conversionCSV(rows)], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `conversiones-${applied.start}-${applied.end}-demo.csv`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice(`${rows.length} enlaces exportados en CSV.`);
  };
  const exportPDF = async () => {
    setPdfBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ orientation: "landscape" });
      pdf.setFont("helvetica", "bold"); pdf.setFontSize(20); pdf.text("Compacto / Conversiones", 14, 20);
      pdf.setFont("helvetica", "normal"); pdf.setFontSize(10);
      pdf.text(`Datos de demostracion | ${applied.start} - ${applied.end}`, 14, 29);
      pdf.text(`Clics: ${clicks}   Conversiones: ${conversions}   Tasa: ${globalRate === null ? "No disponible" : globalRate.toFixed(1) + "%"}   Sin conversiones: ${withoutConversions}`, 14, 38);
      if (applied.search) pdf.text(`Busqueda: ${applied.search}`, 14, 46);
      let y = 58;
      const headers = () => { pdf.setFont("helvetica", "bold"); pdf.text("Enlace", 14, y); pdf.text("Clics", 162, y); pdf.text("Conversiones", 184, y); pdf.text("Tasa", 222, y); pdf.text("Ultima conversion", 244, y); pdf.setFont("helvetica", "normal"); y += 10; };
      headers();
      rows.forEach(row => {
        if (y > 184) { pdf.addPage(); y = 20; headers(); }
        pdf.text(`${row.domain}/${row.slug}`, 14, y);
        pdf.text(String(row.clicks), 162, y); pdf.text(String(row.conversions), 184, y);
        pdf.text(row.rate === null ? "-" : row.rate.toFixed(1) + "%", 222, y); pdf.text(row.latest ?? "-", 244, y);
        pdf.setFontSize(8); pdf.text(pdf.splitTextToSize(row.title, 138), 14, y + 5); pdf.setFontSize(10); y += 18;
      });
      pdf.save(`conversiones-${applied.start}-${applied.end}-demo.pdf`); setNotice(`${rows.length} enlaces exportados en PDF.`);
    } catch { setNotice("No se pudo preparar el PDF. Inténtalo de nuevo."); }
    finally { setPdfBusy(false); }
  };

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#conversions-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button><div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => { setTheme(value); localStorage.setItem("compacto-theme", value); }}><Icon /></Button>)}</div></div>
    </header>
    <main id="conversions-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-5"><div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><Target className="size-4" /> Rendimiento de enlaces</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Conversiones</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">De cada clic a un resultado.</p></div><span className="flex items-center gap-2 text-xs text-muted-foreground"><CalendarDays className="size-4 text-primary" />{dateLabel(applied.start)} — {dateLabel(applied.end)}</span></div>
      <section aria-label="Filtros de conversiones" className="mt-9 border-y border-border bg-card/80 py-5 sm:py-6">
        <form onSubmit={filter} noValidate className="space-y-4 px-4 sm:px-6"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1.5fr_1fr]">
          <div className="space-y-2"><Label htmlFor="conversion-start">Fecha de inicio</Label><Input id="conversion-start" type="date" value={draft.start} onChange={event => change({ start: event.target.value })} aria-invalid={Boolean(error)} aria-describedby={error ? "filter-error" : undefined} className="w-full min-w-0 rounded-lg bg-background" /></div>
          <div className="space-y-2"><Label htmlFor="conversion-end">Fecha de fin</Label><Input id="conversion-end" type="date" value={draft.end} onChange={event => change({ end: event.target.value })} aria-invalid={Boolean(error)} aria-describedby={error ? "filter-error" : undefined} className="w-full min-w-0 rounded-lg bg-background" /></div>
          <div className="space-y-2"><Label htmlFor="conversion-search">Buscar enlace</Label><div className="relative"><Search className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input id="conversion-search" value={draft.search} onChange={event => change({ search: event.target.value })} placeholder="Título, dominio o shortlink…" className="rounded-lg bg-background pl-10" /></div></div>
          <div className="space-y-2"><Label htmlFor="conversion-sort">Ordenar por</Label><Select value={draft.sort} onValueChange={value => change({ sort: value as ConversionSort })}><SelectTrigger id="conversion-sort" className="h-12 w-full rounded-lg bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="conversions">Conversiones</SelectItem><SelectItem value="clicks">Clics</SelectItem><SelectItem value="rate">Tasa de conversión</SelectItem><SelectItem value="latest">Última conversión</SelectItem></SelectContent></Select></div>
        </div><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex gap-2"><Button type="submit" variant="premium" className="h-11 rounded-full px-5"><SlidersHorizontal /> Filtrar</Button><Button type="button" variant="outline" size="icon" className="size-11 rounded-full" aria-label="Restablecer filtros" title="Restablecer filtros" onClick={reset}><RotateCcw /></Button></div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" className="h-11 rounded-full px-4" onClick={exportCSV} disabled={!rows.length}><Download /> Exportar CSV</Button><Button type="button" variant="outline" className="h-11 rounded-full px-4" onClick={exportPDF} disabled={!rows.length || pdfBusy}><FileText />{pdfBusy ? "Preparando PDF…" : "Exportar PDF"}</Button></div></div>{error && <p id="filter-error" role="alert" className="text-sm text-destructive">{error}</p>}</form>
      </section>
      <section aria-label="Resumen de conversiones" className="grid grid-cols-2 gap-x-6 gap-y-7 py-8 lg:grid-cols-4">{[
        { label: "Clics totales", value: clicks, icon: MousePointer2, accent: false },
        { label: "Conversiones totales", value: conversions, icon: CheckCircle2, accent: true },
        { label: "Tasa global", value: globalRate === null ? "—" : `${globalRate.toFixed(1)}%`, icon: TrendingUp, accent: true },
        { label: "Sin conversiones", value: withoutConversions, icon: Link2, accent: false },
      ].map(metric => <div key={metric.label} className="min-w-0 border-l-2 border-border pl-4"><p className="flex items-start gap-2 text-xs text-muted-foreground"><metric.icon className="size-4 shrink-0 text-primary" />{metric.label}</p><p className={`mt-3 font-display text-3xl font-semibold ${metric.accent ? "text-primary" : "text-foreground"}`}>{metric.value}</p></div>)}</section>
      {rows.length > 0 && conversions === 0 && <div role="status" className="mb-7 flex items-start gap-3 rounded-lg border border-primary/20 bg-accent px-4 py-4 text-sm text-accent-foreground"><Info className="mt-0.5 size-4 shrink-0" /><span>{clicks ? "No hay conversiones registradas en este período." : "No hay clics ni conversiones registrados en este período."}</span></div>}
      {notice && <p role="status" className="mb-5 text-sm text-primary">{notice}</p>}
      <section aria-labelledby="conversion-detail"><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 id="conversion-detail" className="font-display text-xl font-semibold">Resultados por enlace <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{rows.length}</span></h2><span className="text-xs text-muted-foreground">{({ conversions: "Conversiones", clicks: "Clics", rate: "Tasa de conversión", latest: "Última conversión" })[applied.sort]} · mayor a menor</span></div>
        <div className="relative overflow-x-auto border-y border-border bg-card shadow-subtle"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr><th scope="col" className="px-5 py-4 font-medium">Enlace</th>{["Clics", "Conversiones", "Tasa de conversión", "Última conversión"].map(label => <th scope="col" key={label} className="whitespace-nowrap px-5 py-4 text-right font-medium">{label}</th>)}</tr></thead><tbody>{visible.map(row => <tr key={row.slug} className="border-b border-border last:border-0 hover:bg-muted/40"><td className="w-[42%] px-5 py-5"><p className="max-w-sm font-medium leading-relaxed">{row.title}</p><p className="mt-1.5 font-mono text-xs text-primary">{row.domain}/{row.slug}</p></td><td className="px-5 py-5 text-right font-mono">{row.clicks}</td><td className="px-5 py-5 text-right font-mono">{row.conversions}</td><td className="px-5 py-5"><div className="ml-auto w-28"><p className="text-right font-mono text-xs">{row.rate === null ? <span className="text-muted-foreground" title="Sin clics, la tasa no está disponible">—</span> : `${row.rate.toFixed(1)}%`}</p><div className="mt-2 h-1.5 rounded-full bg-secondary" role={row.rate === null ? undefined : "meter"} aria-label={row.rate === null ? undefined : `Tasa de ${row.slug}`} aria-valuenow={row.rate ?? undefined} aria-valuemin={0} aria-valuemax={100} /></div></td><td className="whitespace-nowrap px-5 py-5 text-right text-xs text-muted-foreground">{row.latest ? dateLabel(row.latest) : "—"}</td></tr>)}</tbody></table>{!rows.length && <div className="px-5 py-16 text-center"><Search className="mx-auto mb-4 size-7 text-muted-foreground" /><h3 className="font-display text-xl font-semibold">Sin resultados</h3><p className="mt-2 text-sm text-muted-foreground">No encontramos enlaces con estos filtros.</p><Button variant="link" className="mt-3" onClick={reset}>Restablecer filtros <ArrowUpRight /></Button></div>}</div>
        <footer className="flex flex-wrap items-center justify-between gap-4 py-5 text-xs text-muted-foreground"><span>{rows.length ? `${(page - 1) * 10 + 1}–${Math.min(page * 10, rows.length)}` : "0"} de {rows.length} enlaces</span><nav aria-label="Paginación de conversiones" className="flex items-center gap-3"><Button variant="outline" size="icon" className="rounded-full" aria-label="Página anterior" disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft /></Button><span aria-live="polite">{page} / {pages}</span><Button variant="outline" size="icon" className="rounded-full" aria-label="Página siguiente" disabled={page === pages} onClick={() => setPage(page + 1)}><ChevronRight /></Button></nav></footer>
      </section>
      <p className="mt-6 flex items-start gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · No representan actividad real. La tasa se calcula sobre clics; sin clics, no está disponible.</p>
    </main>
  </div>;
}