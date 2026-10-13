import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { strToU8, zipSync } from "fflate";
import { ArrowLeft, ArrowUpRight, BarChart3, CheckCircle2, Contrast, Download, Layers, Link2, Minus, Moon, Plus, Search, ShieldCheck, Sun, Trash2, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CampaignCreateModal, type CampaignDraft } from "@/components/campaign-create-modal";

export const Route = createFileRoute("/campaigns")({
  head: () => ({ meta: [
    { title: "Campañas · Compacto" },
    { name: "description", content: "Organiza tus campañas y genera lotes de enlaces cortos con la identidad de Compacto." },
    { property: "og:title", content: "Campañas · Compacto" },
    { property: "og:description", content: "Tus campañas, enlaces y descargas en un solo lugar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }), component: CampaignsPage,
});
type Campaign = CampaignDraft & { id: string; parts: number };
const INITIAL: Campaign[] = [
  { id: "bbc", name: "BBC Noticias", destination: "https://www.bbc.com/mundo/articles/cdjp03mxxdo", domain: "cpt.cx", count: 30, parts: 3 },
  { id: "ebay", name: "Ebay TV", destination: "https://co.ebay.com/b/TVs/11071/bn_738302", domain: "cpt.cx", count: 50, parts: 2 },
];
type Theme = "light" | "dark" | "contraste";

function CampaignsPage() {
  const [campaigns, setCampaigns] = useState(INITIAL);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const [remove, setRemove] = useState<Campaign | null>(null);
  const [report, setReport] = useState<Campaign | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { const value = localStorage.getItem("compacto-theme"); if (value === "dark" || value === "contraste") setTheme(value); }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const used = 23 + campaigns.filter(c => !INITIAL.some(i => i.id === c.id)).reduce((sum, c) => sum + c.count, 0);
  const available = Math.max(0, 250 - used);
  const total = campaigns.reduce((sum, c) => sum + c.count, 0);
  const filtered = campaigns.filter(c => `${c.name} ${c.destination} ${c.domain}`.toLowerCase().includes(search.trim().toLowerCase()));
  const updateParts = (campaign: Campaign, delta: number) => setCampaigns(current => current.map(c => c.id === campaign.id ? { ...c, parts: Math.min(c.count, Math.max(1, c.parts + delta)) } : c));
  const download = (campaign: Campaign) => {
    try {
      const files: Record<string, Uint8Array> = {};
      const slug = campaign.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase();
      for (let part = 0; part < campaign.parts; part++) {
        const rows = Array.from({ length: campaign.count }, (_, i) => i).filter(i => i % campaign.parts === part).map(i => `"https://${campaign.domain}/demo-${campaign.id}-${i + 1}","${campaign.destination.replace(/"/g, '""')}"`);
        files[`${slug}-${part + 1}.csv`] = strToU8(`shortlink,destino\r\n${rows.join("\r\n")}`);
      }
      const data = zipSync(files);
      const href = URL.createObjectURL(new Blob([new Uint8Array(data)], { type: "application/zip" }));
      const anchor = document.createElement("a"); anchor.href = href; anchor.download = `${slug}-demo.zip`; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      setNotice(`ZIP descargado: ${campaign.parts} ${campaign.parts === 1 ? "archivo" : "archivos"} con enlaces de demostración.`);
    } catch { setNotice("No se pudo preparar la descarga. Inténtalo de nuevo."); }
  };
  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#campaigns-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button><div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => { setTheme(value); localStorage.setItem("compacto-theme", value); }}><Icon /></Button>)}</div></div>
    </header>
    <main id="campaigns-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6"><div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><Layers className="size-4" /> Espacio de trabajo</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Campañas</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">Un destino, cientos de conexiones.</p></div><Button variant="premium" className="h-12 rounded-full px-6" onClick={() => setOpen(true)} disabled={!available}><Plus /> Nueva campaña</Button></div>
      <section aria-label="Uso del plan" className="my-9 border-y border-border bg-card/70 py-6">
        <div className="flex flex-col gap-6 px-4 sm:flex-row sm:items-center sm:px-6"><div className="flex items-center gap-3 sm:w-44 sm:shrink-0"><span className="grid size-11 place-items-center rounded-xl bg-accent text-primary"><Zap className="size-5" /></span><div><p className="text-xs text-muted-foreground">Plan actual</p><p className="font-display text-2xl font-semibold">Plus</p></div></div><div className="min-w-0 flex-1"><div className="mb-3 flex flex-wrap justify-between gap-2 text-sm"><p><span className="font-mono font-semibold">{used}</span><span className="text-muted-foreground"> / 250 usados</span></p><p className="font-medium text-primary">{available} disponibles</p></div><div role="progressbar" aria-label="Enlaces usados del plan" aria-valuenow={used} aria-valuemin={0} aria-valuemax={250} className="h-2 overflow-hidden rounded-full bg-secondary"><svg viewBox="0 0 250 8" preserveAspectRatio="none" className="h-full w-full text-primary"><rect width={used} height="8" rx="4" fill="currentColor" /></svg></div></div><Button asChild variant="link" className="self-start px-0 sm:ml-4 sm:self-center"><Link to="/pricing">Ver planes <ArrowUpRight /></Link></Button></div>
      </section>
      <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm"><p className="flex items-center gap-2"><Layers className="size-4 text-primary" /><span className="font-mono font-semibold">{campaigns.length}</span><span className="text-muted-foreground">campañas</span></p><p className="flex items-center gap-2"><Link2 className="size-4 text-primary" /><span className="font-mono font-semibold">{total}</span><span className="text-muted-foreground">enlaces generados</span></p><p className="flex items-center gap-2"><CheckCircle2 className="size-4 text-success" /><span className="text-muted-foreground">Todo listo para descargar</span></p></div>
      {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground"><span>{notice}</span><Button size="icon" variant="ghost" aria-label="Cerrar aviso" onClick={() => setNotice("")}><X /></Button></div>}
      <section aria-labelledby="campaign-list"><div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="campaign-list" className="font-display text-lg font-semibold">Tus campañas <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{campaigns.length}</span></h2><div className="relative w-full sm:w-80"><Search className="absolute left-3 top-4 size-4 text-muted-foreground" /><Input aria-label="Buscar campaña" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar campaña…" className="rounded-full bg-card pl-10" /></div></div>
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle"><table className="w-full min-w-[820px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{["Campaña", "Generados", "Estado", "Descarga y opciones"].map(label => <th scope="col" key={label} className="px-5 py-4 font-medium last:text-right">{label}</th>)}</tr></thead><tbody>{filtered.map(c => <tr key={c.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"><td className="max-w-sm px-5 py-6"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary"><Layers className="size-5" /></span><div className="min-w-0"><p className="font-display text-base font-semibold">{c.name}</p><p className="mt-1 font-mono text-xs text-primary">{c.domain}</p><p className="mt-1 truncate text-xs text-muted-foreground" title={c.destination}>{c.destination}</p></div></div></td><td className="whitespace-nowrap px-5 py-6 font-mono font-medium">{c.count} <span className="text-muted-foreground">/ {c.count}</span></td><td className="px-5 py-6"><span className="inline-flex items-center gap-1.5 rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-xs font-medium text-success"><CheckCircle2 className="size-3.5" /> Lista</span></td><td className="px-5 py-6"><div className="flex items-center justify-end gap-3"><Button variant="outline" size="icon" className="rounded-full" aria-label={`Reporte de ${c.name}`} title="Ver reporte" onClick={() => setReport(c)}><BarChart3 /></Button><div><p className="mb-1 text-center text-xs text-muted-foreground">Archivos CSV</p><div className="flex h-10 items-center rounded-full border border-border bg-background"><Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label={`Menos archivos para ${c.name}`} disabled={c.parts <= 1} onClick={() => updateParts(c, -1)}><Minus /></Button><span className="w-7 text-center font-mono" aria-live="polite">{c.parts}</span><Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label={`Más archivos para ${c.name}`} disabled={c.parts >= c.count} onClick={() => updateParts(c, 1)}><Plus /></Button></div></div><Button variant="outline" className="h-10 rounded-full px-4" aria-label={`Descargar ZIP de ${c.name}`} onClick={() => download(c)}><Download /> ZIP</Button><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" aria-label={`Eliminar ${c.name}`} title="Eliminar campaña" onClick={() => setRemove(c)}><Trash2 /></Button></div></td></tr>)}</tbody></table>
          {!filtered.length && <div className="flex flex-col items-center px-5 py-14 text-center"><Layers className="mb-4 size-7 text-muted-foreground" /><p className="font-display text-lg font-semibold">{search ? "No encontramos esa campaña" : "Tu próxima campaña empieza aquí"}</p><Button variant="link" className="mt-2" onClick={() => search ? setSearch("") : setOpen(true)}>{search ? "Ver todas las campañas" : "Nueva campaña"}</Button></div>}</div>
        <footer className="py-5 text-xs text-muted-foreground">{filtered.length} de {campaigns.length} campañas</footer>
      </section>
      <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · Las campañas no se guardan y sus enlaces no redirigen.</p>
    </main>
    <CampaignCreateModal open={open} onOpenChange={setOpen} available={available} onCreate={draft => { setCampaigns(current => [...current, { ...draft, id: crypto.randomUUID(), parts: 1 }]); setSearch(""); setNotice(`${draft.name}: ${draft.count} enlaces de demostración generados.`); }} />
    <Dialog.Root open={Boolean(remove || report)} onOpenChange={value => { if (!value) { setRemove(null); setReport(null); } }}><Dialog.Portal><Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" /><Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-elevated"><div className="mb-5 flex justify-between"><span className={`grid size-11 place-items-center rounded-xl ${remove ? "bg-destructive/10 text-destructive" : "bg-accent text-primary"}`}>{remove ? <Trash2 className="size-5" /> : <BarChart3 className="size-5" />}</span><Dialog.Close asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar modal"><X /></Button></Dialog.Close></div><Dialog.Title className="font-display text-2xl font-semibold">{remove ? "Eliminar campaña" : "Reporte de campaña"}</Dialog.Title><Dialog.Description className="mt-3 break-words text-sm text-muted-foreground">{remove ? `¿Eliminar «${remove.name}» de esta vista previa? Esta acción no se puede deshacer.` : `${report?.name} · Vista previa sin tráfico real registrado.`}</Dialog.Description>{report && <div className="my-6 grid grid-cols-2 gap-4 border-y border-border py-5"><div><p className="text-xs text-muted-foreground">Enlaces generados</p><p className="mt-2 font-mono text-2xl">{report.count}</p></div><div><p className="text-xs text-muted-foreground">Clics registrados</p><p className="mt-2 font-mono text-2xl">—</p></div></div>}<footer className="mt-6 flex justify-end gap-3"><Dialog.Close asChild><Button variant="outline" className="h-11 rounded-full px-5">{remove ? "Cancelar" : "Cerrar"}</Button></Dialog.Close>{remove && <Button variant="destructive" className="h-11 rounded-full px-5" onClick={() => { setCampaigns(current => current.filter(c => c.id !== remove.id)); setNotice(`${remove.name} eliminada de la vista previa.`); setRemove(null); }}><Trash2 /> Eliminar</Button>}</footer></Dialog.Content></Dialog.Portal></Dialog.Root>
  </div>;
}