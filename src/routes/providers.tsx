import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Contrast, Link2, Mail, MessageSquare, Moon, PenLine, Plus, Search, ServerCog, ShieldCheck, Sun, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/providers")({
  head: () => ({ meta: [
    { title: "Proveedores · Compacto" },
    { name: "description", content: "Gestiona los proveedores de Email y SMS que envían tus campañas y códigos OTP en Compacto." },
    { property: "og:title", content: "Proveedores · Compacto" },
    { property: "og:description", content: "Tus proveedores de envío por Email y SMS en un solo lugar." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ProvidersPage,
});

type Theme = "light" | "dark" | "contraste";
type Channel = "email" | "sms";
type Provider = { id: number; name: string; channel: Channel; description: string };
const INITIAL: Provider[] = [
  { id: 1, name: "Mailpit", channel: "email", description: "Local SMTP (Mailpit) para prueba de campañas email" },
  { id: 2, name: "fakesms", channel: "sms", description: "Prueba OTP local" },
  { id: 3, name: "smtp", channel: "email", description: "Prueba OTP local: SMTP hacia Mailpit" },
];
const CH = { email: { label: "Email", Icon: Mail }, sms: { label: "SMS", Icon: MessageSquare } } as const;

function ProviderDialog({ initial, names, onClose, onSave }: { initial: Provider | null; names: string[]; onClose: () => void; onSave: (p: Omit<Provider, "id">) => void }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [channel, setChannel] = useState<Channel>(initial?.channel ?? "email");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState("");
  useEffect(() => { const k = (e: KeyboardEvent) => e.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (n.length < 2) return setError("El nombre debe tener al menos 2 caracteres.");
    if (names.some(x => x.toLowerCase() === n.toLowerCase() && x !== initial?.name)) return setError("Ya existe un proveedor con ese nombre.");
    onSave({ name: n, channel, description: description.trim() });
  };
  return <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={onClose}>
    <form role="dialog" aria-modal="true" aria-labelledby="pv-title" onSubmit={submit} onClick={e => e.stopPropagation()} className="modal-enter w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elevated">
      <div className="mb-5 flex items-start justify-between gap-3"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-accent text-primary"><ServerCog className="size-5" /></span><h2 id="pv-title" className="font-display text-xl font-semibold">{initial ? "Editar proveedor" : "Nuevo proveedor"}</h2></div><Button type="button" variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar" onClick={onClose}><X /></Button></div>
      <label className="text-sm font-medium" htmlFor="pv-name">Nombre</label>
      <Input id="pv-name" autoFocus value={name} onChange={e => { setName(e.target.value); setError(""); }} className="mt-2 text-foreground" placeholder="Ej. Mailpit" aria-invalid={!!error} />
      <fieldset className="mt-5"><legend className="text-sm font-medium">Canal</legend><div className="mt-2 grid grid-cols-2 gap-2">{(Object.keys(CH) as Channel[]).map(c => { const { label, Icon } = CH[c]; return <button type="button" key={c} aria-pressed={channel === c} onClick={() => setChannel(c)} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${channel === c ? "border-primary bg-accent text-primary" : "border-border text-foreground hover:bg-muted"}`}><Icon className="size-4" />{label}</button>; })}</div></fieldset>
      <label className="mt-5 block text-sm font-medium" htmlFor="pv-desc">Descripción <span className="font-normal text-muted-foreground">(opcional)</span></label>
      <textarea id="pv-desc" value={description} onChange={e => setDescription(e.target.value)} rows={3} maxLength={160} className="mt-2 w-full resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-subtle focus-visible:border-primary focus-visible:outline-none" placeholder="¿Para qué usas este proveedor?" />
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-6 flex justify-end gap-2"><Button type="button" variant="ghost" className="rounded-full text-foreground" onClick={onClose}>Cancelar</Button><Button type="submit" variant="premium" className="rounded-full px-6">{initial ? "Guardar cambios" : "Añadir proveedor"}</Button></div>
    </form>
  </div>;
}

function ProvidersPage() {
  const [items, setItems] = useState(INITIAL);
  const [theme, setTheme] = useState<Theme>("light");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | Channel>("all");
  const [editing, setEditing] = useState<Provider | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<Provider | null>(null);
  const [notice, setNotice] = useState("");
  useEffect(() => { try { const s = localStorage.getItem("compacto-theme"); if (s === "dark" || s === "contraste") setTheme(s); } catch { /* */ } }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const changeTheme = (v: Theme) => { setTheme(v); try { localStorage.setItem("compacto-theme", v); } catch { /* */ } };
  const filtered = useMemo(() => { const q = search.toLowerCase().trim(); return items.filter(p => (filter === "all" || p.channel === filter) && (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))); }, [items, search, filter]);

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#providers-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3"><Button asChild variant="ghost" className="hidden rounded-full sm:inline-flex"><Link to="/"><ArrowLeft /> Enlaces</Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">{([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([v, Icon, label]) => <Button key={v} variant={theme === v ? "default" : "ghost"} size="icon" className="size-8 rounded-full" onClick={() => changeTheme(v)} aria-label={label} title={label} aria-pressed={theme === v}><Icon /></Button>)}</div>
      </div>
    </header>
    <main id="providers-content" className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-primary"><ServerCog className="size-4" /> Envíos</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Proveedores</h1><p className="mt-3 text-sm text-muted-foreground sm:text-base">Los servicios que entregan tus correos y SMS.</p></div>
        <Button variant="premium" className="h-12 rounded-full px-6" onClick={() => setEditing(null)}><Plus /> Añadir proveedor</Button>
      </div>
      <div className="my-9 grid grid-cols-3 border-y border-border bg-card/60 py-6">
        {[{ label: "Proveedores", value: items.length, Icon: ServerCog }, { label: "Email", value: items.filter(p => p.channel === "email").length, Icon: Mail }, { label: "SMS", value: items.filter(p => p.channel === "sms").length, Icon: MessageSquare }].map(({ label, value, Icon }, i) => <div key={label} className={`min-w-0 px-3 sm:px-6 ${i ? "border-l border-border" : ""}`}><p className="mb-3 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm"><Icon className="hidden size-4 text-primary sm:block" />{label}</p><p className="font-display text-3xl font-semibold">{value}</p></div>)}
      </div>
      {notice && <div role="status" className="mb-5 flex items-center justify-between gap-3 rounded-lg border border-primary/20 bg-accent px-4 py-3 text-sm text-accent-foreground"><span>{notice}</span><Button size="icon" variant="ghost" onClick={() => setNotice("")} aria-label="Cerrar aviso"><X /></Button></div>}
      <section aria-labelledby="pv-list">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4"><h2 id="pv-list" className="font-display text-lg font-semibold">Tus proveedores</h2>
            <div className="flex gap-1" role="group" aria-label="Filtrar por canal">{([["all", "Todos"], ["email", "Email"], ["sms", "SMS"]] as const).map(([v, l]) => <Button key={v} variant={filter === v ? "secondary" : "ghost"} size="sm" className={`rounded-full px-4 ${filter === v ? "text-primary" : "text-muted-foreground"}`} aria-pressed={filter === v} onClick={() => setFilter(v)}>{l}</Button>)}</div></div>
          <div className="relative w-full sm:w-80"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input value={search} onChange={e => setSearch(e.target.value)} aria-label="Buscar proveedor" placeholder="Buscar proveedor…" className="h-10 rounded-full bg-card pl-10 text-foreground" /></div>
        </div>
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle">
          <table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{["Proveedor", "Canal", "Descripción", "Opciones"].map(l => <th key={l} scope="col" className="px-5 py-4 font-medium last:text-right">{l}</th>)}</tr></thead>
            <tbody>{filtered.map(p => { const { label, Icon } = CH[p.channel]; return <tr key={p.id} className="border-b border-border transition-colors last:border-0 hover:bg-muted/40">
              <td className="px-5 py-5"><div className="flex items-center gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary"><Icon className="size-5" /></span><p className="font-mono font-medium">{p.name}</p></div></td>
              <td className="px-5 py-5"><span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground"><Icon className="size-3.5" />{label}</span></td>
              <td className="px-5 py-5 text-muted-foreground">{p.description || "—"}</td>
              <td className="px-5 py-5 text-right"><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground" aria-label={`Editar ${p.name}`} title="Editar" onClick={() => setEditing(p)}><PenLine /></Button><Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" aria-label={`Eliminar ${p.name}`} title="Eliminar" onClick={() => setDeleting(p)}><Trash2 /></Button></td>
            </tr>; })}</tbody>
          </table>
          {!filtered.length && <div className="flex flex-col items-center px-5 py-14 text-center"><ServerCog className="mb-4 size-7 text-muted-foreground" /><p className="font-display text-lg font-semibold">{items.length ? "Ningún proveedor coincide" : "Aún no tienes proveedores"}</p>{items.length ? <Button variant="link" onClick={() => { setSearch(""); setFilter("all"); }}>Ver todos</Button> : <Button variant="link" onClick={() => setEditing(null)}>Añadir el primero</Button>}</div>}
        </div>
        <p className="py-5 text-xs text-muted-foreground">{filtered.length} de {items.length} proveedores</p>
      </section>
      <p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 shrink-0" />Datos de demostración · Los cambios no se guardan ni envían mensajes.</p>
    </main>
    {editing !== undefined && <ProviderDialog initial={editing} names={items.map(p => p.name)} onClose={() => setEditing(undefined)} onSave={data => { if (editing) { setItems(c => c.map(p => p.id === editing.id ? { ...p, ...data } : p)); setNotice(`${data.name} actualizado.`); } else { setItems(c => [...c, { id: Date.now(), ...data }]); setNotice(`${data.name} añadido a la vista previa.`); } setEditing(undefined); }} />}
    {deleting && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/40 p-4 backdrop-blur-sm" onClick={() => setDeleting(null)}><div role="alertdialog" aria-modal="true" aria-labelledby="del-t" onClick={e => e.stopPropagation()} className="modal-enter w-full max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-elevated"><span className="mx-auto grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive"><Trash2 /></span><h2 id="del-t" className="mt-4 font-display text-xl font-semibold">¿Eliminar {deleting.name}?</h2><p className="mt-2 text-sm text-muted-foreground">Los envíos que usen este proveedor dejarán de funcionar.</p><div className="mt-6 flex justify-center gap-2"><Button variant="ghost" autoFocus className="rounded-full text-foreground" onClick={() => setDeleting(null)}>Cancelar</Button><Button variant="destructive" className="rounded-full px-6" onClick={() => { setItems(c => c.filter(p => p.id !== deleting.id)); setNotice(`${deleting.name} eliminado.`); setDeleting(null); }}>Eliminar</Button></div></div></div>}
  </div>;
}
