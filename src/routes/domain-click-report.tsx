import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, BarChart3, CalendarDays, ChevronLeft, ChevronRight, Contrast, Globe, Link2, Moon, MousePointerClick, Search, SlidersHorizontal, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/domain-click-report")({
  head: () => ({ meta: [
    { title: "Clics por dominio · Compacto" },
    { name: "description", content: "Consulta el reporte diario de clics por dominio y filtra por fechas en Compacto." },
    { property: "og:title", content: "Clics por dominio · Compacto" },
    { property: "og:description", content: "El rendimiento de tus dominios, fecha a fecha." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: DomainClickReport,
});

type Theme = "light" | "dark" | "contraste";
type Filters = { domain: string; start: string; end: string };
const INITIAL: Filters = { domain: "localhost", start: "2026-08-01", end: "2026-10-07" };
const RECORDS = [{ domain: "localhost", date: "2026-10-02", clicks: 30 }];
const number = new Intl.NumberFormat("es-CO");
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

function DomainClickReport() {
  const [theme, setTheme] = useState<Theme>("light");
  const [draft, setDraft] = useState(INITIAL);
  const [applied, setApplied] = useState(INITIAL);
  const [error, setError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem("compacto-theme");
    if (stored === "dark" || stored === "contraste") setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("hc", theme === "contraste");
  }, [theme]);
  const changeTheme = (value: Theme) => { setTheme(value); localStorage.setItem("compacto-theme", value); };
  const rows = RECORDS.filter(row => row.domain === applied.domain && row.date >= applied.start && row.date <= applied.end);
  const total = rows.reduce((sum, row) => sum + row.clicks, 0);
  const peak = rows.reduce((max, row) => Math.max(max, row.clicks), 0);
  const apply = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.start || !draft.end) { setError("Selecciona ambas fechas."); return; }
    if (draft.start > draft.end) { setError("La fecha de inicio no puede ser posterior a la fecha de fin."); return; }
    setError(""); setApplied({ ...draft }); setHasApplied(true);
  };

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#report-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-5" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/domains"><ArrowLeft /> Dominios</Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([['light', Sun, 'Claro'], ['dark', Moon, 'Oscuro'], ['contraste', Contrast, 'Alto contraste']] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => changeTheme(value)}><Icon /></Button>)}
        </div>
      </div>
    </header>

    <main id="report-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><BarChart3 className="size-4" /> Analítica de dominios</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Clics por dominio</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">El pulso de tus enlaces, día a día.</p></div>
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 font-mono text-sm text-primary"><Globe className="size-4" />{applied.domain}</span>
      </div>

      <form onSubmit={apply} className="mt-9 border-y border-border bg-card/60 py-6">
        <div className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_auto]">
          <div className="space-y-2"><label htmlFor="report-domain" className="flex items-center gap-2 text-sm font-medium"><Globe className="size-4 text-muted-foreground" />Dominio</label><select id="report-domain" value={draft.domain} onChange={event => setDraft({ ...draft, domain: event.target.value })} className="h-12 w-full rounded-lg border border-input bg-background px-3 text-sm shadow-subtle outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50"><option value="localhost">localhost</option><option value="cpt.cx">cpt.cx</option></select></div>
          <div className="space-y-2"><label htmlFor="report-start" className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="size-4 text-muted-foreground" />Fecha de inicio</label><Input id="report-start" type="date" required value={draft.start} onChange={event => setDraft({ ...draft, start: event.target.value })} aria-invalid={!!error} aria-describedby={error ? "report-error" : undefined} className="h-12 min-w-0 rounded-lg bg-background shadow-subtle" /></div>
          <div className="space-y-2"><label htmlFor="report-end" className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="size-4 text-muted-foreground" />Fecha de fin</label><Input id="report-end" type="date" required value={draft.end} onChange={event => setDraft({ ...draft, end: event.target.value })} aria-invalid={!!error} aria-describedby={error ? "report-error" : undefined} className="h-12 min-w-0 rounded-lg bg-background shadow-subtle" /></div>
          <Button type="submit" variant="premium" className="h-12 rounded-full px-7"><SlidersHorizontal />Filtrar</Button>
        </div>
        {error && <p id="report-error" role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      </form>

      <div className="grid grid-cols-3 border-b border-border py-7">
        {[{ label: "Clics totales", value: total, Icon: MousePointerClick }, { label: "Días con actividad", value: rows.length, Icon: CalendarDays }, { label: "Máximo diario", value: peak, Icon: BarChart3 }].map(({ label, value, Icon }, index) => <div key={label} className={`min-w-0 px-3 sm:px-6 ${index ? "border-l border-border" : ""}`}><p className="mb-3 flex items-start gap-2 text-xs text-muted-foreground sm:text-sm"><Icon className="hidden size-4 shrink-0 text-primary sm:block" />{label}</p><p className="font-display text-3xl font-semibold sm:text-4xl">{number.format(value)}</p></div>)}
      </div>

      <section aria-labelledby="daily-title" className="mt-9">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3"><div><h2 id="daily-title" className="font-display text-xl font-semibold">Detalle diario <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{rows.length} {rows.length === 1 ? "registro" : "registros"}</span></h2><p className="mt-2 text-sm text-muted-foreground">{dateLabel(applied.start)} — {dateLabel(applied.end)}</p></div><span className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-primary" />{applied.domain}</span></div>
        <div className="overflow-hidden border-y border-border bg-card shadow-subtle">
          <table className="w-full text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr><th scope="col" className="px-4 py-4 font-medium sm:px-6">Fecha</th><th scope="col" className="px-4 py-4 text-right font-medium sm:px-6">Total de clics</th></tr></thead>
            <tbody>{rows.map(row => <tr key={row.date} className="border-b border-border transition-colors hover:bg-muted/40"><td className="px-4 py-6 sm:px-6"><div className="flex items-center gap-3"><span className="hidden size-10 place-items-center rounded-lg border border-border bg-background text-primary sm:grid"><CalendarDays className="size-4" /></span><time dateTime={row.date}>{dateLabel(row.date)}</time></div></td><td className="px-4 py-6 text-right font-mono text-base font-semibold sm:px-6">{number.format(row.clicks)}</td></tr>)}</tbody>
            {!!rows.length && <tfoot className="bg-muted/40"><tr><th scope="row" className="px-4 py-4 text-sm font-medium sm:px-6">Total del período</th><td className="px-4 py-4 text-right font-mono font-semibold text-primary sm:px-6">{number.format(total)}</td></tr></tfoot>}
          </table>
          {!rows.length && <div className="flex flex-col items-center px-4 py-14 text-center"><Search className="mb-4 size-7 text-muted-foreground" /><h3 className="font-display text-lg font-semibold">Sin clics en este período</h3><p className="mt-2 text-sm text-muted-foreground">{applied.domain} · {dateLabel(applied.start)} — {dateLabel(applied.end)}</p><Button variant="link" className="mt-3" onClick={() => { setDraft(INITIAL); setApplied(INITIAL); setError(""); }}>Restablecer filtros</Button></div>}
        </div>
        <footer className="flex items-center justify-between gap-3 py-5 text-xs text-muted-foreground"><p>{rows.length} {rows.length === 1 ? "registro" : "registros"}</p><div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="size-8 rounded-full" disabled aria-label="Página anterior"><ChevronLeft /></Button><span className="grid size-8 place-items-center rounded-full bg-accent font-medium text-primary">1</span><Button variant="ghost" size="icon" className="size-8 rounded-full" disabled aria-label="Página siguiente"><ChevronRight /></Button></div></footer>
      </section>
      <p className="mt-5 text-xs text-muted-foreground">Datos de demostración · No representa tráfico real.</p>
      <span role="status" className="sr-only">{hasApplied ? `Filtros aplicados: ${rows.length} registros, ${total} clics.` : ""}</span>
    </main>
  </div>;
}