import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Contrast, Copy, KeyRound, Link2, Moon, Plus, Search, ShieldCheck, Sun, Trash2, X } from "lucide-react";
import { ApiKeyCreateModal, ApiKeyDeleteModal, ApiKeyRevealModal } from "@/components/api-key-modals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/api-keys")({
  head: () => ({ meta: [
    { title: "API Keys · Compacto" },
    { name: "description", content: "Crea y administra las claves de acceso para tus integraciones con Compacto." },
    { property: "og:title", content: "API Keys · Compacto" },
    { property: "og:description", content: "Controla las claves y permisos de tus integraciones en Compacto." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ApiKeysPage,
});

type ApiKey = { id: number; name: string; prefix: string; created: string; lastUsed: string; permissions: string[] };
type Theme = "light" | "dark" | "contraste";

const INITIAL_KEYS: ApiKey[] = [
  { id: 1, name: "Producción", prefix: "cmp_live_••••8K4M", created: "2026-09-18", lastUsed: "Hoy, 09:24", permissions: ["Lectura", "Escritura"] },
  { id: 2, name: "Analítica interna", prefix: "cmp_live_••••2Q7P", created: "2026-08-04", lastUsed: "2 oct 2026", permissions: ["Lectura"] },
];

function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [revealOpen, setRevealOpen] = useState(false);
  const [deleteKey, setDeleteKey] = useState<ApiKey | null>(null);
  const [generatedKey, setGeneratedKey] = useState("");
  const [copied, setCopied] = useState("");
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("compacto-theme");
    if (stored === "dark" || stored === "contraste") setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("hc", theme === "contraste");
    localStorage.setItem("compacto-theme", theme);
  }, [theme]);

  const filtered = useMemo(() => keys.filter((key) => key.name.toLowerCase().includes(search.trim().toLowerCase())), [keys, search]);
  const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
  const copyPrefix = async (key: ApiKey) => {
    try { await navigator.clipboard.writeText(key.prefix); setCopied(key.id.toString()); window.setTimeout(() => setCopied(""), 1800); }
    catch { setNotice("No se pudo copiar el identificador."); }
  };
  const createKey = (name: string, permissions: string[]) => {
    const id = Date.now();
    const suffix = id.toString(36).slice(-4).toUpperCase();
    setGeneratedKey(`cmp_live_${id.toString(36)}_${suffix}k9N2xP4m`);
    setKeys((current) => [{ id, name, prefix: `cmp_live_••••${suffix}`, created: new Date().toISOString().slice(0, 10), lastUsed: "Nunca", permissions: permissions.map((permission) => permission === "read" ? "Lectura" : "Escritura") }, ...current]);
    setCreateOpen(false);
    setRevealOpen(true);
  };

  return (
    <div className="min-h-screen dot-grid text-foreground">
      <a href="#api-keys-content" className="skip-link">Saltar al contenido</a>
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
        <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button>
          <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
            {([['light', Sun, 'Claro'], ['dark', Moon, 'Oscuro'], ['contraste', Contrast, 'Alto contraste']] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? 'default' : 'ghost'} size="icon" className="size-8 rounded-full" onClick={() => setTheme(value)} aria-label={label} title={label} aria-pressed={theme === value}><Icon /></Button>)}
          </div>
        </div>
      </header>

      <main id="api-keys-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
        <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
          <div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><KeyRound className="size-4" /> Desarrolladores</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">API Keys</h1><p className="mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">Acceso seguro para tus integraciones.</p></div>
          <Button variant="premium" className="h-12 rounded-full px-6" onClick={() => setCreateOpen(true)}><Plus /> Crear API Key</Button>
        </div>

        <div className="my-9 grid grid-cols-2 border-y border-border bg-card/60 py-6 sm:grid-cols-3">
          {[{ label: "Claves activas", value: keys.length, Icon: KeyRound }, { label: "Con escritura", value: keys.filter((key) => key.permissions.includes("Escritura")).length, Icon: ShieldCheck }, { label: "Último acceso", value: "Hoy", Icon: Check }].map(({ label, value, Icon }, index) => <div key={label} className={`min-w-0 px-3 sm:px-6 ${index ? "border-l border-border" : ""} ${index === 2 ? "hidden sm:block" : ""}`}><p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"><Icon className="hidden size-4 text-primary sm:block" />{label}</p><p className="font-display text-3xl font-semibold">{value}</p></div>)}
        </div>

        {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground"><span>{notice}</span><Button size="icon" variant="ghost" onClick={() => setNotice("")} aria-label="Cerrar aviso"><X /></Button></div>}

        <section aria-labelledby="api-key-list">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 id="api-key-list" className="font-display text-lg font-semibold">Tus API Keys <span className="ml-2 font-sans text-sm font-normal text-muted-foreground">{keys.length}</span></h2>
            <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Buscar API Key" placeholder="Buscar por nombre…" className="h-10 rounded-full bg-card pl-10 pr-10" />{search && <Button variant="ghost" size="icon" className="absolute right-1 top-1 size-8 rounded-full" aria-label="Limpiar búsqueda" onClick={() => setSearch("")}><X /></Button>}</div>
          </div>
          <div className="overflow-x-auto border-y border-border bg-card shadow-subtle">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{["Nombre", "Permisos", "Creada", "Último uso", "Acciones"].map((label) => <th key={label} scope="col" className="px-5 py-4 font-medium last:text-right">{label}</th>)}</tr></thead>
              <tbody>{filtered.map((key) => <tr key={key.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40">
                <td className="px-5 py-6"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary"><KeyRound className="size-5" /></span><div><p className="font-medium">{key.name}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{key.prefix}</p></div></div></td>
                <td className="px-5 py-6"><div className="flex flex-wrap gap-1.5">{key.permissions.map((permission) => <span key={permission} className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground">{permission}</span>)}</div></td>
                <td className="px-5 py-6 text-muted-foreground">{formatDate(key.created)}</td><td className="px-5 py-6 text-muted-foreground">{key.lastUsed}</td>
                <td className="px-5 py-6"><div className="flex justify-end gap-1"><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" onClick={() => copyPrefix(key)} aria-label={`Copiar identificador de ${key.name}`} title="Copiar identificador">{copied === key.id.toString() ? <Check className="text-success" /> : <Copy />}</Button><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" onClick={() => setDeleteKey(key)} aria-label={`Eliminar ${key.name}`} title="Eliminar"><Trash2 /></Button></div></td>
              </tr>)}</tbody>
            </table>
            {!filtered.length && <div className="flex flex-col items-center px-5 py-14 text-center"><KeyRound className="mb-4 size-8 text-muted-foreground" /><p className="font-display text-lg font-semibold">{keys.length ? "No hay claves que coincidan" : "Aún no tienes API Keys"}</p><p className="mt-1 text-sm text-muted-foreground">{keys.length ? "Prueba con otro nombre." : "Crea una para conectar tu primera integración."}</p>{keys.length ? <Button variant="link" className="mt-2" onClick={() => setSearch("")}>Ver todas</Button> : <Button variant="premium" className="mt-5 rounded-full" onClick={() => setCreateOpen(true)}><Plus /> Crear API Key</Button>}</div>}
          </div>
        </section>
        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · Las claves de esta vista no conceden acceso real.</p>
      </main>

      <ApiKeyCreateModal open={createOpen} onOpenChange={setCreateOpen} onCreate={createKey} />
      <ApiKeyRevealModal open={revealOpen} onOpenChange={setRevealOpen} apiKey={generatedKey} />
      <ApiKeyDeleteModal open={Boolean(deleteKey)} onOpenChange={(open) => { if (!open) setDeleteKey(null); }} name={deleteKey?.name ?? "esta clave"} onDelete={() => { if (!deleteKey) return; setKeys((current) => current.filter((key) => key.id !== deleteKey.id)); setNotice(`${deleteKey.name} fue eliminada de la vista previa.`); }} />
      <span className="sr-only" role="status">{copied ? "Identificador copiado" : ""}</span>
    </div>
  );
}