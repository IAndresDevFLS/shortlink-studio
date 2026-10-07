import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, Check, Copy, KeyRound, LoaderCircle, ShieldCheck, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const permissions = [
  { id: "read", label: "Lectura", description: "Consultar enlaces, dominios y estadísticas." },
  { id: "write", label: "Escritura", description: "Crear y actualizar enlaces desde la API." },
] as const;

function ModalFrame({ children, open, onOpenChange, locked = false }: {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locked?: boolean;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(value) => { if (!locked) onOpenChange(value); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-elevated focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95">
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function ApiKeyCreateModal({ open, onOpenChange, onCreate }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (name: string, permissions: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState<string[]>(["read"]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!open) { setName(""); setSelected(["read"]); setError(""); } }, [open]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const clean = name.trim();
    if (clean.length < 3) { setError("Escribe un nombre de al menos 3 caracteres."); return; }
    if (!selected.length) { setError("Selecciona al menos un permiso."); return; }
    setBusy(true);
    window.setTimeout(() => { onCreate(clean, selected); setBusy(false); }, 450);
  };

  return (
    <ModalFrame open={open} onOpenChange={onOpenChange} locked={busy}>
      <header className="flex items-start justify-between border-b border-border p-6 sm:p-7">
        <div>
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-primary"><KeyRound className="size-5" /></span>
          <DialogPrimitive.Title className="font-display text-2xl font-semibold">Crear API Key</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">Identifica la clave y define su alcance.</DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar" disabled={busy}><X /></Button></DialogPrimitive.Close>
      </header>
      <form onSubmit={submit} noValidate>
        <div className="space-y-6 p-6 sm:p-7">
          <div className="space-y-2">
            <Label htmlFor="api-key-name">Nombre de la clave</Label>
            <Input id="api-key-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} placeholder="Integración de producción" autoFocus autoComplete="off" disabled={busy} aria-invalid={Boolean(error)} className="h-12 rounded-lg" />
          </div>
          <fieldset>
            <legend className="mb-3 text-sm font-medium">Permisos</legend>
            <div className="grid gap-2">
              {permissions.map((permission) => {
                const checked = selected.includes(permission.id);
                return <label key={permission.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 transition-colors hover:bg-muted/50">
                  <Checkbox checked={checked} onCheckedChange={(value) => { setError(""); setSelected((current) => value ? [...current, permission.id] : current.filter((item) => item !== permission.id)); }} aria-label={`Permiso de ${permission.label.toLowerCase()}`} />
                  <span><span className="block text-sm font-medium">{permission.label}</span><span className="mt-1 block text-xs text-muted-foreground">{permission.description}</span></span>
                </label>;
              })}
            </div>
          </fieldset>
          {error && <div role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertTriangle className="mt-0.5 size-4 shrink-0" />{error}</div>}
        </div>
        <footer className="flex justify-end gap-3 border-t border-border bg-muted/40 px-6 py-5 sm:px-7">
          <DialogPrimitive.Close asChild><Button variant="outline" className="h-11 rounded-full px-5" disabled={busy}>Cancelar</Button></DialogPrimitive.Close>
          <Button type="submit" variant="premium" className="h-11 rounded-full px-5" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <KeyRound />}{busy ? "Creando…" : "Crear clave"}</Button>
        </footer>
      </form>
    </ModalFrame>
  );
}

export function ApiKeyRevealModal({ open, onOpenChange, apiKey }: { open: boolean; onOpenChange: (open: boolean) => void; apiKey: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => { if (!open) setCopied(false); }, [open]);
  const copy = async () => { try { await navigator.clipboard.writeText(apiKey); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } };
  return (
    <ModalFrame open={open} onOpenChange={onOpenChange}>
      <header className="flex items-start justify-between border-b border-border p-6 sm:p-7">
        <div>
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-primary"><ShieldCheck className="size-5" /></span>
          <DialogPrimitive.Title className="font-display text-2xl font-semibold">Tu clave está lista</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">Cópiala ahora. No volveremos a mostrarla.</DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar"><X /></Button></DialogPrimitive.Close>
      </header>
      <div className="space-y-5 p-6 sm:p-7">
        <div className="rounded-xl border border-primary/25 bg-accent p-4">
          <p className="mb-3 text-xs font-medium uppercase text-accent-foreground">API Key</p>
          <div className="flex items-center gap-3"><code className="min-w-0 flex-1 break-all font-mono text-sm text-foreground">{apiKey}</code><Button type="button" variant="outline" size="icon" className="shrink-0 rounded-full bg-card" onClick={copy} aria-label="Copiar API Key">{copied ? <Check className="text-success" /> : <Copy />}</Button></div>
        </div>
        <div className="flex items-start gap-2 text-sm text-muted-foreground"><AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning" /><p>Guárdala en un lugar seguro. Si la pierdes, tendrás que crear otra.</p></div>
      </div>
      <footer className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-5 sm:px-7">
        <span role="status" className="text-xs text-success">{copied ? "Clave copiada" : ""}</span>
        <Button variant="premium" className="h-11 rounded-full px-6" onClick={() => onOpenChange(false)}>Listo</Button>
      </footer>
    </ModalFrame>
  );
}

export function ApiKeyDeleteModal({ open, onOpenChange, name, onDelete }: { open: boolean; onOpenChange: (open: boolean) => void; name: string; onDelete: () => void }) {
  const [busy, setBusy] = useState(false);
  const remove = () => { setBusy(true); window.setTimeout(() => { onDelete(); setBusy(false); onOpenChange(false); }, 400); };
  return (
    <ModalFrame open={open} onOpenChange={onOpenChange} locked={busy}>
      <header className="flex items-start justify-between border-b border-border p-6 sm:p-7">
        <div>
          <span className="mb-4 grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive"><Trash2 className="size-5" /></span>
          <DialogPrimitive.Title className="font-display text-2xl font-semibold">Eliminar API Key</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">Esta acción no se puede deshacer.</DialogPrimitive.Description>
        </div>
        <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar" disabled={busy}><X /></Button></DialogPrimitive.Close>
      </header>
      <div className="p-6 sm:p-7"><p className="text-sm leading-relaxed">La integración que usa <strong className="font-semibold text-foreground">{name}</strong> dejará de funcionar inmediatamente.</p></div>
      <footer className="flex justify-end gap-3 border-t border-border bg-muted/40 px-6 py-5 sm:px-7">
        <DialogPrimitive.Close asChild><Button variant="outline" className="h-11 rounded-full px-5" disabled={busy}>Cancelar</Button></DialogPrimitive.Close>
        <Button variant="destructive" className="h-11 rounded-full px-5" onClick={remove} disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <Trash2 />}{busy ? "Eliminando…" : "Eliminar clave"}</Button>
      </footer>
    </ModalFrame>
  );
}