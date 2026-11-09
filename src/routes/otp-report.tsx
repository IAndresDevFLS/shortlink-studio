import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Contrast, Download, KeyRound, Link2, Moon, RotateCcw, Search, ShieldCheck, SlidersHorizontal, Sun, Timer, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CHANNELS, DEFAULT_OTP_FILTERS, getOtpRecords, otpCSV, otpSummary, type OtpFilters, type OtpStatus } from "@/lib/otp-report";

export const Route = createFileRoute("/otp-report")({
  head: () => ({ meta: [
    { title: "Reporte OTP · Compacto" },
    { name: "description", content: "Consulta los códigos OTP enviados por canal y fecha: verificados, expirados y tiempos de verificación." },
    { property: "og:title", content: "Reporte OTP · Compacto" },
    { property: "og:description", content: "Cada código OTP, de su envío a su verificación." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: OtpReport,
});

type Theme = "light" | "dark" | "contraste";
const PAGE = 10;
const STATUS: Record<OtpStatus, { label: string; cls: string; Icon: typeof CheckCircle2 }> = {
  verified: { label: "Verificado", cls: "bg-success/12 text-success border-success/30", Icon: CheckCircle2 },
  expired: { label: "Expirado", cls: "bg-muted text-muted-foreground border-border", Icon: XCircle },
  pending: { label: "Pendiente", cls: "bg-warning/15 text-foreground border-warning/40", Icon: Clock3 },
};
const fmt = (v: string | null) => v ? new Date(v + "Z").toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" }) : "—";
const field = "w-full rounded-xl border border-input bg-background px-4 text-foreground shadow-subtle";

function OtpReport() {
  const [theme, setTheme] = useState<Theme>("light");
  const [draft, setDraft] = useState<OtpFilters>(DEFAULT_OTP_FILTERS);
  const [applied, setApplied] = useState<OtpFilters>(DEFAULT_OTP_FILTERS);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OtpStatus>("all");
  const [page, setPage] = useState(1);
  useEffect(() => { const s = localStorage.getItem("compacto-theme"); if (s === "dark" || s === "contraste") setTheme(s); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const changeTheme = (v: Theme) => { setTheme(v); localStorage.setItem("compacto-theme", v); };

  const rows = useMemo(() => getOtpRecords(applied), [applied]);
  const sum = otpSummary(rows);
  const visible = rows.filter(r => (status === "all" || r.status === status) && r.reference.includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(visible.length / PAGE));
  const current = Math.min(page, pages);
  const slice = visible.slice((current - 1) * PAGE, current * PAGE);
  const channelLabel = CHANNELS.find(c => c.value === applied.channel)?.label;

  const apply = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.start || !draft.end) return setError("Selecciona ambas fechas.");
    if (draft.start > draft.end) return setError("La fecha de inicio no puede ser posterior a la fecha de fin.");
    setError(""); setApplied({ ...draft }); setPage(1);
  };
  const reset = () => { setDraft(DEFAULT_OTP_FILTERS); setApplied(DEFAULT_OTP_FILTERS); setError(""); setQuery(""); setStatus("all"); setPage(1); };
  const exportCsv = () => { const url = URL.createObjectURL(new Blob([otpCSV(visible)], { type: "text/csv;charset=utf-8" })); const a = document.createElement("a"); a.href = url; a.download = `otp-${applied.channel}-${applied.start}-${applied.end}.csv`; a.click(); URL.revokeObjectURL(url); };

  const kpis = [
    { label: "Códigos enviados", value: sum.total, Icon: KeyRound, note: `Canal ${channelLabel}` },
    { label: "Verificados", value: sum.verified, Icon: ShieldCheck, note: `${sum.rate}% de éxito` },
    { label: "Expirados", value: sum.expired, Icon: XCircle, note: sum.pending ? `${sum.pending} pendientes` : "Sin pendientes" },
    { label: "Tiempo medio", value: `${sum.avgSeconds} s`, Icon: Timer, note: "Del envío a la verificación" },
  ];
  const segments = (["verified", "expired", "pending"] as const).map(k => ({ k, n: k === "verified" ? sum.verified : k === "expired" ? sum.expired : sum.pending }));

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#otp-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-5" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([v, Icon, label]) => <Button key={v} variant={theme === v ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === v} onClick={() => changeTheme(v)}><Icon /></Button>)}
        </div>
      </div>
    </header>

    <main id="otp-content" className="mx-auto max-w-7xl space-y-6 px-4 pb-16 sm:px-6">
      <section className="animate-fade-up">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground"><ShieldCheck className="size-3.5" /> Reporte OTP</span>
        <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Verificaciones por código</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Sigue cada código desde su envío hasta su verificación o expiración.</p>
      </section>

      <form onSubmit={apply} className="rounded-2xl border border-border bg-card p-5 shadow-subtle" aria-label="Filtros del reporte">
        <div className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
          <label className="space-y-1.5 text-sm font-medium">Canal
            <select value={draft.channel} onChange={e => setDraft({ ...draft, channel: e.target.value as OtpFilters["channel"] })} className={`${field} h-12`}>
              {CHANNELS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label className="space-y-1.5 text-sm font-medium">Fecha de inicio<Input type="date" value={draft.start} onChange={e => setDraft({ ...draft, start: e.target.value })} className="text-foreground" /></label>
          <label className="space-y-1.5 text-sm font-medium">Fecha de fin<Input type="date" value={draft.end} onChange={e => setDraft({ ...draft, end: e.target.value })} className="text-foreground" /></label>
          <div className="flex gap-2">
            <Button type="submit" className="h-12 flex-1 rounded-full bg-brand-gradient px-6 shadow-action"><SlidersHorizontal /> Filtrar</Button>
            <Button type="button" variant="outline" className="h-12 rounded-full text-foreground" onClick={reset} aria-label="Restablecer filtros"><RotateCcw /></Button>
          </div>
        </div>
        {error && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{error}</p>}
      </form>

      <section aria-label="Resumen" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, Icon, note }) => <article key={label} className="rounded-2xl border border-border bg-card p-5 shadow-subtle">
          <div className="flex items-center justify-between text-sm text-muted-foreground">{label}<span className="grid size-9 place-items-center rounded-full bg-accent text-accent-foreground"><Icon className="size-4" /></span></div>
          <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{note}</p>
        </article>)}
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-subtle" aria-label="Distribución por estado">
        <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="font-display text-lg font-semibold">Distribución por estado</h2><p className="text-sm text-muted-foreground">Tasa de verificación <strong className="font-mono text-foreground">{sum.rate}%</strong></p></div>
        <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-muted" role="img" aria-label={`${sum.verified} verificados, ${sum.expired} expirados, ${sum.pending} pendientes`}>
          {sum.total > 0 && segments.map(s => <div key={s.k} style={{ width: `${s.n / sum.total * 100}%` }} className={s.k === "verified" ? "bg-success" : s.k === "expired" ? "bg-muted-foreground/40" : "bg-warning"} />)}
        </div>
        <ul className="mt-3 flex flex-wrap gap-4 text-sm">{segments.map(s => <li key={s.k} className="flex items-center gap-2"><span className={`size-2.5 rounded-full ${s.k === "verified" ? "bg-success" : s.k === "expired" ? "bg-muted-foreground/40" : "bg-warning"}`} />{STATUS[s.k].label} <span className="font-mono text-muted-foreground">{s.n}</span></li>)}</ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-subtle" aria-labelledby="otp-table">
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div><h2 id="otp-table" className="font-display text-lg font-semibold">Registro de códigos</h2><p className="text-sm text-muted-foreground">{visible.length} de {sum.total} registros</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <div role="group" aria-label="Filtrar por estado" className="flex rounded-full border border-border bg-background p-1">
              {(["all", "verified", "expired", "pending"] as const).map(s => <button key={s} type="button" aria-pressed={status === s} onClick={() => { setStatus(s); setPage(1); }} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{s === "all" ? "Todos" : STATUS[s].label}</button>)}
            </div>
            <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Buscar referencia" placeholder="Buscar referencia" value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} className="h-10 min-h-10 w-56 pl-9 text-foreground" /></div>
            <Button variant="outline" className="rounded-full text-foreground" onClick={exportCsv} disabled={!visible.length}><Download /> CSV</Button>
          </div>
        </div>
        {slice.length ? <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground"><tr>{["Referencia", "Creado", "Enviado", "Verificado", "Expira", "Estado", "Canal"].map(h => <th key={h} scope="col" className="px-5 py-3 font-semibold">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-border">{slice.map(r => { const S = STATUS[r.status]; return <tr key={r.reference} className="hover:bg-muted/40">
            <td className="px-5 py-3.5 font-mono text-xs">{r.reference}</td>
            <td className="px-5 py-3.5 whitespace-nowrap">{fmt(r.created)}</td>
            <td className="px-5 py-3.5 whitespace-nowrap">{fmt(r.sent)}</td>
            <td className="px-5 py-3.5 whitespace-nowrap">{fmt(r.verified)}</td>
            <td className="px-5 py-3.5 whitespace-nowrap text-muted-foreground">{fmt(r.expires)}</td>
            <td className="px-5 py-3.5"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${S.cls}`}><S.Icon className="size-3.5" />{S.label}</span></td>
            <td className="px-5 py-3.5">{CHANNELS.find(c => c.value === r.channel)?.label}</td>
          </tr>; })}</tbody>
        </table></div> : <div className="grid place-items-center gap-2 px-5 py-16 text-center"><KeyRound className="size-8 text-muted-foreground" /><p className="font-display text-lg font-semibold">Sin códigos en este período</p><p className="text-sm text-muted-foreground">Prueba otro canal, estado o rango de fechas.</p></div>}
        <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm text-muted-foreground">
          <span>Página {current} de {pages}</span>
          <div className="flex gap-2"><Button variant="outline" size="icon" className="rounded-full text-foreground" aria-label="Página anterior" disabled={current === 1} onClick={() => setPage(current - 1)}><ChevronLeft /></Button><Button variant="outline" size="icon" className="rounded-full text-foreground" aria-label="Página siguiente" disabled={current === pages} onClick={() => setPage(current + 1)}><ChevronRight /></Button></div>
        </div>
      </section>
      <p className="text-center text-xs text-muted-foreground">Datos de demostración · No representan códigos reales enviados.</p>
    </main>
  </div>;
}
