import { useState, type FormEvent } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertCircle, ArrowRight, Globe, Link2, LoaderCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DomainCreateModal({ open, onOpenChange, domains, onCreate }: {
  open: boolean; onOpenChange: (open: boolean) => void; domains: string[]; onCreate: (domain: string) => void;
}) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const domain = name.trim().toLowerCase();
    if (domain.length > 253 || !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(domain)) {
      setError("Introduce un dominio válido, sin https://, rutas ni espacios."); return;
    }
    if (domains.includes(domain)) { setError("Este dominio ya está en tu lista."); return; }
    setError(""); setBusy(true);
    window.setTimeout(() => { onCreate(domain); setBusy(false); setName(""); onOpenChange(false); }, 450);
  };
  return <DialogPrimitive.Root open={open} onOpenChange={(value) => { if (busy) return; setError(""); setName(""); onOpenChange(value); }}>
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
      <DialogPrimitive.Content className="modal-enter fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-elevated focus:outline-none">
        <header className="flex items-start justify-between border-b border-border p-6 sm:p-7">
          <div><span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-primary"><Globe className="size-5" /></span>
            <DialogPrimitive.Title className="font-display text-2xl font-semibold">Nuevo dominio</DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">Un nombre propio para tus enlaces.</DialogPrimitive.Description></div>
          <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" className="rounded-full" aria-label="Cerrar modal" disabled={busy}><X /></Button></DialogPrimitive.Close>
        </header>
        <form onSubmit={submit} noValidate>
          <div className="space-y-5 p-6 sm:p-7">
            <div className="space-y-2"><Label htmlFor="domain-name">Nombre del dominio</Label>
              <Input id="domain-name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="links.tumarca.com" autoComplete="off" autoCapitalize="none" spellCheck={false} disabled={busy} aria-invalid={Boolean(error)} aria-describedby={error ? "domain-error" : "domain-hint"} className="h-12 rounded-lg font-mono text-sm" />
              <p id="domain-hint" className="text-xs text-muted-foreground">Solo el dominio o subdominio, sin https://.</p>
            </div>
            {error && <div id="domain-error" role="alert" className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{error}</div>}
            <div className="flex items-center gap-3 border-l-2 border-primary pl-3 text-sm"><Link2 className="size-4 shrink-0 text-primary" /><span className="min-w-0 break-all font-mono"><span className="text-muted-foreground">{name.trim() || "links.tumarca.com"}</span><span className="text-primary">/tu-enlace</span></span></div>
            <p className="text-xs leading-relaxed text-muted-foreground">Vista previa: el dominio quedará pendiente, sin conectar ni verificar su DNS.</p>
          </div>
          <footer className="flex justify-end gap-3 border-t border-border bg-muted/40 px-6 py-5 sm:px-7">
            <DialogPrimitive.Close asChild><Button variant="outline" className="h-11 rounded-full px-5" disabled={busy}>Cancelar</Button></DialogPrimitive.Close>
            <Button type="submit" variant="premium" className="h-11 rounded-full px-5" disabled={busy}>{busy ? <LoaderCircle className="animate-spin" /> : <ArrowRight />} {busy ? "Creando…" : "Crear dominio"}</Button>
          </footer>
        </form>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  </DialogPrimitive.Root>;
}