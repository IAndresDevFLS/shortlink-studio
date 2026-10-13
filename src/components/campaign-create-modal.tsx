import { useState, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Layers, Link2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CampaignDraft = { name: string; destination: string; domain: string; count: number };

export function CampaignCreateModal({ open, onOpenChange, available, onCreate }: {
  open: boolean; onOpenChange: (open: boolean) => void; available: number; onCreate: (draft: CampaignDraft) => void;
}) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [domain, setDomain] = useState("cpt.cx");
  const [count, setCount] = useState("100");
  const [error, setError] = useState("");
  const quantity = Number(count);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) { setError("Escribe el nombre de la campaña."); return; }
    try { const url = new URL(destination); if (!["http:", "https:"].includes(url.protocol)) throw new Error(); }
    catch { setError("Introduce una URL válida que comience por https:// o http://."); return; }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > available) { setError(`Elige entre 1 y ${available} enlaces.`); return; }
    onCreate({ name: name.trim(), destination: destination.trim(), domain, count: quantity });
    onOpenChange(false);
  };
  const reset = () => { setName(""); setDestination(""); setDomain("cpt.cx"); setCount(String(Math.min(100, available))); setError(""); };
  return <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm" />
      <Dialog.Content onOpenAutoFocus={reset} className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-card text-card-foreground shadow-elevated focus:outline-none">
        <header className="flex items-start justify-between border-b border-border p-6 sm:p-7">
          <div><span className="mb-4 grid size-11 place-items-center rounded-xl bg-accent text-primary"><Layers className="size-5" /></span>
            <Dialog.Title className="font-display text-2xl font-semibold">Nueva campaña</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-muted-foreground">Un destino. Múltiples enlaces.</Dialog.Description></div>
          <Dialog.Close asChild><Button size="icon" variant="ghost" className="rounded-full" aria-label="Cerrar modal"><X /></Button></Dialog.Close>
        </header>
        <form onSubmit={submit} noValidate>
          <div className="space-y-5 p-6 sm:p-7">
            <div className="space-y-2"><Label htmlFor="campaign-name">Nombre de la campaña</Label><Input id="campaign-name" value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder="Ej. Lanzamiento de octubre" required className="rounded-lg" /></div>
            <div className="space-y-2"><Label htmlFor="campaign-url">URL de destino</Label><Input id="campaign-url" value={destination} onChange={e => setDestination(e.target.value)} type="url" placeholder="https://tumarca.com/campaña" required className="rounded-lg" /></div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="campaign-domain">Dominio</Label><Select value={domain} onValueChange={setDomain}><SelectTrigger id="campaign-domain" className="h-12 w-full rounded-lg bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cpt.cx">cpt.cx</SelectItem><SelectItem value="go.compacto.app">go.compacto.app</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="campaign-count">Número de shortlinks</Label><Input id="campaign-count" type="number" min={1} max={available} step={1} value={count} onChange={e => setCount(e.target.value)} className="rounded-lg font-mono" /></div>
            </div>
            <div className="flex items-start gap-3 border-l-2 border-primary pl-4"><Link2 className="mt-1 size-5 shrink-0 text-primary" /><div><p className="text-sm font-medium">{Number.isInteger(quantity) && quantity > 0 ? quantity.toLocaleString("es-CO") : "—"} enlaces por generar</p><p className="mt-1 text-xs text-muted-foreground">{available.toLocaleString("es-CO")} disponibles en tu plan</p></div></div>
            {error && <p role="alert" className="flex items-start gap-2 text-sm text-destructive"><AlertCircle className="size-4 shrink-0" />{error}</p>}
            <p className="text-xs text-muted-foreground">Vista previa · Los enlaces generados no redirigen al destino.</p>
          </div>
          <footer className="flex flex-wrap justify-end gap-3 border-t border-border bg-muted/40 px-6 py-5 sm:px-7"><Dialog.Close asChild><Button variant="outline" className="h-11 rounded-full px-5">Cancelar</Button></Dialog.Close><Button type="submit" variant="premium" className="h-11 rounded-full px-5" disabled={available === 0}>Crear y generar <ArrowRight /></Button></footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}