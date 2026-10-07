import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BarChart3, Check, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Contrast, Copy, Globe, Link2, Moon, Plus, Search, ShieldCheck, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DomainCreateModal } from "@/components/domain-create-modal";

export const Route = createFileRoute("/domains")({
  head: () => ({ meta: [
    { title: "Dominios · Compacto" },
    { name: "description", content: "Organiza los dominios de tus enlaces cortos y consulta su estado en Compacto." },
    { property: "og:title", content: "Dominios · Compacto" },
    { property: "og:description", content: "Tus dominios, su estado y sus enlaces en un solo lugar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: DomainsPage,
});
type Domain = { name: string; shared: boolean; created: string; links: number; active: boolean };
const INITIAL: Domain[] = [{ name: "cpt.cx", shared: true, created: "2026-05-26", links: 1, active: true }];
type Theme = "light" | "dark" | "contraste";

function DomainsPage() {
  const [domains, setDomains] = useState(INITIAL);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => { const stored = localStorage.getItem("compacto-theme"); if (stored === "dark" || stored === "contraste") setTheme(stored); }, []);
  const changeTheme = (value: Theme) => {
    setTheme(value); localStorage.setItem("compacto-theme", value);
    document.documentElement.classList.toggle("dark", value === "dark"); document.documentElement.classList.toggle("hc", value === "contraste");
  };
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const filtered = useMemo(() => domains.filter((d) => d.name.includes(search.toLowerCase().trim()) && (filter === "all" || (filter === "active" ? d.active : !d.active))), [domains, search, filter]);
  const copy = async (name: string) => { try { await navigator.clipboard.writeText(name); setCopied(name); window.setTimeout(() => setCopied(""), 1800); } catch { setNotice("No se pudo copiar el dominio. Inténtalo de nuevo."); } };
  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#domains-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([['light', Sun, 'Claro'], ['dark', Moon, 'Oscuro'], ['contraste', Contrast, 'Alto contraste']] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? 'default' : 'ghost'} size="icon" className="size-8 rounded-full" onClick={() => changeTheme(value)} aria-label={label} title={label} aria-pressed={theme === value}><Icon /></Button>)}</div>
      </div>
    </header>
    <main id="domains-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><Globe className="size-4" /> Espacio de trabajo</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Dominios</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">Tu marca, en cada enlace.</p></div>
        <div className="flex flex-wrap gap-3"><Button asChild variant="outline" className="h-12 rounded-full px-6"><Link to="/domain-click-report"><BarChart3 /> Reporte de clics</Link></Button><Button variant="premium" className="h-12 rounded-full px-6" onClick={() => setOpen(true)}><Plus /> Nuevo dominio</Button></div>
      </div>
      <div className="my-9 grid grid-cols-3 border-y border-border bg-card/60 py-6">
        {[{ label: 'Dominios', value: domains.length, Icon: Globe }, { label: 'Activos', value: domains.filter(d => d.active).length, Icon: ShieldCheck }, { label: 'Enlaces creados', value: domains.reduce((sum, d) => sum + d.links, 0), Icon: Link2 }].map(({ label, value, Icon }, i) => <div key={label} className={`min-w-0 px-3 sm:px-6 ${i ? 'border-l border-border' : ''}`}><p className="mb-3 flex items-start gap-2 text-xs text-muted-foreground sm:text-sm"><Icon className="hidden size-4 shrink-0 text-primary sm:block" />{label}</p><p className="font-display text-3xl font-semibold">{value.toLocaleString('es-CO')}</p></div>)}
      </div>
      {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground"><span>{notice}</span><Button size="icon" variant="ghost" onClick={() => setNotice("")} aria-label="Cerrar aviso"><X /></Button></div>}
      <section aria-labelledby="domain-list">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4"><h2 id="domain-list" className="font-display text-lg font-semibold">Tus dominios <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{domains.length}</span></h2>
          <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} aria-label="Buscar dominio" placeholder="Buscar dominio…" className="h-10 rounded-full bg-card pl-10 pr-10" />{search && <Button variant="ghost" size="icon" className="absolute right-1 top-1 size-8 rounded-full" aria-label="Limpiar búsqueda" onClick={() => setSearch("")}><X /></Button>}</div>
        </div>
        <div className="mb-4 flex gap-1" role="group" aria-label="Filtrar dominios">{([['all', 'Todos'], ['active', 'Activos'], ['pending', 'Pendientes']] as const).map(([value, label]) => <Button key={value} variant={filter === value ? 'secondary' : 'ghost'} size="sm" className={`rounded-full px-4 ${filter === value ? 'text-primary' : 'text-muted-foreground'}`} aria-pressed={filter === value} onClick={() => setFilter(value)}>{label}</Button>)}</div>
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle">
          <table className="w-full min-w-[730px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{['Dominio', 'Estado', 'Fecha de creación', 'Enlaces creados', 'Opciones'].map(label => <th key={label} scope="col" className="px-5 py-4 font-medium last:text-right">{label}</th>)}</tr></thead>
            <tbody>{filtered.map(d => <tr key={d.name} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40"><td className="px-5 py-6"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary"><Globe className="size-5" /></span><div><p className="font-mono font-medium">{d.name}</p><p className="mt-1 text-xs text-muted-foreground">{d.shared ? 'Compartido' : 'Personalizado'}</p></div></div></td>
              <td className="px-5 py-6"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${d.active ? 'border-success/20 bg-success/10 text-success' : 'border-warning/30 bg-warning/10 text-foreground'}`}>{d.active ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}{d.active ? 'Activo' : 'Pendiente'}</span></td>
              <td className="px-5 py-6 text-muted-foreground">{new Date(`${d.created}T00:00:00Z`).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })}</td><td className="px-5 py-6 font-mono">{d.links}</td>
              <td className="px-5 py-6 text-right"><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={() => copy(d.name)} aria-label={`Copiar ${d.name}`} title={`Copiar ${d.name}`}>{copied === d.name ? <Check className="text-success" /> : <Copy />}</Button></td></tr>)}</tbody>
          </table>
          {!filtered.length && <div className="flex flex-col items-center px-5 py-14 text-center"><Search className="mb-4 size-7 text-muted-foreground" /><p className="font-display text-lg font-semibold">No hay dominios {search ? 'que coincidan' : 'en este estado'}</p><Button variant="link" className="mt-2" onClick={() => { setSearch(''); setFilter('all'); }}>Ver todos los dominios</Button></div>}
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted-foreground"><p>{filtered.length} de {domains.length} {domains.length === 1 ? 'dominio' : 'dominios'}</p><div className="flex items-center gap-2"><Button variant="ghost" size="icon" className="size-8 rounded-full" disabled aria-label="Página anterior"><ChevronLeft /></Button><span className="grid size-8 place-items-center rounded-full bg-accent font-medium text-primary">1</span><Button variant="ghost" size="icon" className="size-8 rounded-full" disabled aria-label="Página siguiente"><ChevronRight /></Button></div></footer>
      </section>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · Los dominios añadidos no se guardan ni se conectan.</p>
    </main>
    <DomainCreateModal open={open} onOpenChange={setOpen} domains={domains.map(d => d.name)} onCreate={name => { setDomains(current => [...current, { name, shared: false, active: false, links: 0, created: new Date().toISOString().slice(0, 10) }]); setSearch(''); setFilter('all'); setNotice(`${name} añadido a la vista previa. Pendiente de conexión DNS.`); }} />
    <span className="sr-only" role="status">{copied ? 'Dominio copiado' : ''}</span>
  </div>;
}