import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Contrast, Copy, Download, Globe, Layers, Link2, Moon, MousePointer2, Search, ShieldCheck, Sun, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCampaignReport, validateCampaignReportSearch } from "@/lib/campaign-report";

export const Route = createFileRoute("/campaign-report/$campaignId")({
  validateSearch: validateCampaignReportSearch,
  head: ({ params }) => ({ meta: [
    { title: `Reporte de ${params.campaignId === "bbc" ? "BBC Noticias" : params.campaignId === "ebay" ? "Ebay TV" : "campaña"} · Compacto` },
    { name: "description", content: "Consulta los enlaces generados, clics, conversiones y detalle de tu campaña en Compacto." },
    { property: "og:title", content: "Reporte de campaña · Compacto" },
    { property: "og:description", content: "Resultados y detalle por enlace de tu campaña en Compacto." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CampaignReportPage,
});

function CampaignReportPage() {
  const { campaignId } = Route.useParams();
  const searchParams = Route.useSearch();
  const campaign = getCampaignReport(campaignId, searchParams);
  const [theme, setTheme] = useState<"light" | "dark" | "contraste">("light");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");
  useEffect(() => { const value = localStorage.getItem("compacto-theme"); if (value === "dark" || value === "contraste") setTheme(value); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const filtered = campaign?.links.filter(link => `${link.slug} ${link.id}`.toLowerCase().includes(search.trim().toLowerCase())) ?? [];
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 10, currentPage * 10);
  const exportCSV = () => {
    if (!campaign) return;
    const csv = ["slug,id,clics,conversiones,tasa", ...filtered.map(link => `${link.slug},${link.id},${link.clicks},${link.conversions},`)].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `reporte-${campaignId}-demo.csv`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice(`${filtered.length} enlaces exportados en CSV de demostración.`);
  };
  const copy = async (slug: string) => {
    if (!campaign) return;
    try { await navigator.clipboard.writeText(`https://${campaign.domain}/${slug}`); setNotice("Enlace de demostración copiado."); }
    catch { setNotice("No se pudo copiar el enlace. Inténtalo de nuevo."); }
  };

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#report-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => { setTheme(value); localStorage.setItem("compacto-theme", value); }}><Icon /></Button>)}</div>
    </header>
    <main id="report-content" className="mx-auto max-w-7xl px-4 pb-16 pt-4 sm:px-6 sm:pt-7">
      <Button asChild variant="ghost" className="mb-7 rounded-full px-0 text-muted-foreground hover:bg-transparent"><Link to="/campaigns"><ArrowLeft /> Volver a campañas</Link></Button>
      {!campaign ? <section className="py-16 text-center"><Layers className="mx-auto mb-4 size-9 text-muted-foreground" /><h1 className="font-display text-3xl font-semibold">Campaña no disponible</h1><p className="mt-3 text-sm text-muted-foreground">No encontramos esta campaña en la vista previa.</p><Button asChild variant="link" className="mt-5"><Link to="/campaigns">Ver campañas <ArrowUpRight /></Link></Button></section> : <>
        <div className="animate-fade-up flex flex-wrap items-start justify-between gap-5">
          <div className="min-w-0 flex-1"><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><Layers className="size-4" /> Reporte de campaña</p><h1 className="break-words font-display text-4xl font-semibold sm:text-5xl">{campaign.name}</h1><div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-1.5 font-mono text-xs text-primary"><Globe className="size-3.5" />{campaign.domain}</span><span className="hidden text-border sm:block">/</span><span className="max-w-full truncate text-xs" title={campaign.destination}>{campaign.destination}</span></div></div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-3 py-1.5 text-xs font-medium text-success"><CheckCircle2 className="size-3.5" /> Lista</span>
        </div>
        <section aria-label="Resumen de campaña" className="my-9 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Enlaces generados", value: campaign.count, detail: `${campaign.count} de ${campaign.count} preparados`, icon: Link2, color: "text-foreground", surface: "bg-secondary" },
            { label: "Clics", value: 0, detail: `0 de ${campaign.count} enlaces recibieron clics`, icon: MousePointer2, color: "text-foreground", surface: "bg-secondary" },
            { label: "Conversiones", value: 0, detail: `0 de ${campaign.count} enlaces con conversión`, icon: Target, color: "text-primary", surface: "bg-accent" },
          ].map(metric => <article key={metric.label} className="rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="text-sm font-medium text-muted-foreground">{metric.label}</h2><span className={`grid size-9 place-items-center rounded-lg ${metric.surface} ${metric.color}`}><metric.icon className="size-4" /></span></div><p className={`mt-3 font-display text-4xl font-semibold ${metric.color}`}>{metric.value}</p><p className="mt-3 text-xs text-muted-foreground">{metric.detail}</p></article>)}
        </section>
        <section aria-label="Análisis de conversiones" className="grid gap-8 border-y border-border bg-card/60 py-7 sm:py-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="px-5 sm:px-7 lg:border-r lg:border-border"><div className="flex items-center justify-between"><h2 className="font-display text-lg font-semibold">Tasa de conversión</h2><Target className="size-4 text-primary" /></div>
            <div className="relative mx-auto mt-6 aspect-[240/175] w-full max-w-[280px]"><svg viewBox="0 0 240 175" role="img" aria-label={`0 por ciento: 0 de ${campaign.count} enlaces con conversión`} className="h-full w-full"><path d="M 50 145 A 85 85 0 1 1 190 145" fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round" className="text-border" /><circle cx="50" cy="145" r="5" fill="currentColor" className="text-primary" /><text x="120" y="108" textAnchor="middle" fill="currentColor" className="fill-foreground font-display text-4xl font-semibold">0%</text><text x="120" y="133" textAnchor="middle" fill="currentColor" className="fill-muted-foreground font-sans text-[10px]">enlaces con conversión</text></svg></div>
            <p className="text-center text-xs text-muted-foreground">0 de {campaign.count} enlaces generados</p>
          </div>
          <div className="px-5 sm:px-7"><h2 className="font-display text-lg font-semibold">Embudo de campaña</h2><div className="mt-7 space-y-5">{[
            { label: "Generados", value: campaign.count, icon: Link2, color: "bg-foreground", text: "text-background" },
            { label: "Con clics", value: 0, icon: MousePointer2, color: "bg-chart-3", text: "text-primary-foreground" },
            { label: "Con conversión", value: 0, icon: Target, color: "bg-primary", text: "text-primary-foreground" },
          ].map((stage, index) => <div key={stage.label}><div className="mb-2 flex items-center justify-between text-sm"><span className="flex items-center gap-2 text-muted-foreground"><stage.icon className="size-4" />{stage.label}</span><span className="font-mono font-semibold">{stage.value}</span></div><div className="h-9 overflow-hidden rounded-md border border-border bg-secondary/70">{stage.value > 0 ? <div className={`grid h-full place-items-center font-mono text-xs ${stage.color} ${stage.text}`}>100%</div> : <div className="flex h-full items-center px-3 text-xs text-muted-foreground">Sin actividad</div>}</div>{index < 2 && <ArrowDown className="mx-auto mt-3 size-3 text-muted-foreground" />}</div>)}</div></div>
        </section>
        <section aria-labelledby="link-detail" className="mt-10">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="link-detail" className="font-display text-xl font-semibold">Detalle por enlace <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{campaign.count}</span></h2><div className="flex w-full flex-wrap gap-3 sm:w-auto"><div className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input aria-label="Buscar enlace" placeholder="Buscar enlace o ID…" value={search} onChange={event => { setSearch(event.target.value); setPage(1); }} className="rounded-full bg-card pl-10" /></div><Button variant="outline" className="h-12 rounded-full px-4" onClick={exportCSV} disabled={!filtered.length}><Download /> CSV</Button></div></div>
          {notice && <p role="status" className="mb-4 text-sm text-primary">{notice}</p>}
          <div className="relative overflow-x-auto border-y border-border bg-card shadow-subtle"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr><th scope="col" className="px-5 py-4 font-medium">Enlace / ID</th>{["Clics", "Conversiones", "Tasa", ""].map((label, index) => <th scope="col" key={index} className="px-5 py-4 text-right font-medium">{label || <span className="sr-only">Opciones</span>}</th>)}</tr></thead><tbody>{visible.map(link => <tr key={link.id} className="border-b border-border last:border-0 hover:bg-muted/40"><td className="px-5 py-4"><p className="font-mono font-medium text-primary">{link.slug}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{link.id}</p></td><td className="px-5 py-4 text-right font-mono">{link.clicks}</td><td className="px-5 py-4 text-right font-mono">{link.conversions}</td><td className="px-5 py-4 text-right font-mono text-muted-foreground"><span title="La tasa por clic no está disponible sin clics">—</span></td><td className="px-5 py-4 text-right"><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" aria-label={`Copiar ${link.slug}`} title="Copiar enlace" onClick={() => copy(link.slug)}><Copy /></Button></td></tr>)}</tbody></table>{!filtered.length && <div className="py-12 text-center"><Search className="mx-auto mb-3 size-6 text-muted-foreground" /><p className="font-display text-lg font-medium">No encontramos ese enlace</p><Button variant="link" className="mt-2" onClick={() => { setSearch(""); setPage(1); }}>Ver todos los enlaces</Button></div>}</div>
          <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground"><span>{filtered.length ? `${(currentPage - 1) * 10 + 1}–${Math.min(currentPage * 10, filtered.length)}` : "0"} de {filtered.length} enlaces</span><nav aria-label="Paginación de enlaces" className="flex items-center gap-3"><Button variant="outline" size="icon" className="rounded-full" aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft /></Button><span aria-live="polite">{currentPage} / {pages}</span><Button variant="outline" size="icon" className="rounded-full" aria-label="Página siguiente" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight /></Button></nav></footer>
          <p className="text-xs text-muted-foreground">Tasa por enlace: conversiones / clics. Sin clics, la tasa no está disponible.</p>
        </section>
        <p className="mt-8 flex items-start gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · No representan tráfico real ni conversiones verificadas.</p>
      </>}
    </main>
  </div>;
}