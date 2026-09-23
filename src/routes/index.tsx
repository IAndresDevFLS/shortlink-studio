import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, LockKeyhole, PencilLine, Plus, QrCode, Tag, Trash2, X } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

import { DeleteModal } from "@/components/delete-modal";
import { GeneralModal } from "@/components/general-modal";
import { QrModal } from "@/components/qr-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crear shortlink | Compacto" },
      { name: "description", content: "Crea y protege un nuevo enlace corto en Compacto." },
      { property: "og:title", content: "Crear shortlink | Compacto" },
      { property: "og:description", content: "Crea y protege un nuevo enlace corto en Compacto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [tags, setTags] = useState<string[]>(["Marketing"]);
  const [tagDraft, setTagDraft] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);
  const shortlinkUrl = "https://cpto.co/UcyMyp6Z";

  const addTag = () => {
    const value = tagDraft.trim();
    if (value && !tags.includes(value)) setTags((current) => [...current, value]);
    setTagDraft("");
  };

  const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main id="main-content" className="technical-grid flex min-h-screen items-center justify-center p-4 sm:p-8">
      <a href="#main-content" className="skip-link">Saltar al contenido principal</a>
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortlink-title"
        className="modal-enter w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary" aria-hidden="true">
              <Plus className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Shortlinks</p>
              <h1 id="shortlink-title" className="font-display text-2xl font-bold text-foreground">Crear enlace corto</h1>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon-lg" aria-label="Cerrar modal">
            <X className="size-5" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" placeholder="Ej. Campaña de septiembre" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="url">URL de destino</Label>
              <Input id="url" name="url" type="url" placeholder="https://dominio.com" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="domain">Dominio personalizado</Label>
              <Select name="domain" required>
                <SelectTrigger id="domain" className="h-12 rounded-xl bg-background px-4 text-base">
                  <SelectValue placeholder="Selecciona un dominio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cpto.co">cpto.co</SelectItem>
                  <SelectItem value="go.compacto.app">go.compacto.app</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas <span className="font-normal text-muted-foreground">(opcional)</span></Label>
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 shadow-subtle transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
              <Tag className="size-4 text-primary" aria-hidden="true" />
              {tags.map((tag) => (
                <span key={tag} className="inline-flex h-7 items-center gap-1 rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground">
                  {tag}
                  <button type="button" onClick={() => setTags((current) => current.filter((item) => item !== tag))} className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`Eliminar etiqueta ${tag}`}>
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input id="tags" value={tagDraft} onChange={(event) => setTagDraft(event.target.value)} onBlur={addTag} onKeyDown={handleTagKeyDown} placeholder="Añadir etiqueta..." className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground" />
            </div>
          </div>

          <fieldset className="space-y-4 rounded-xl border border-border bg-secondary/60 p-4 sm:p-5">
            <legend className="px-2">
              <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <LockKeyhole className="size-4 text-primary" aria-hidden="true" /> Protección con contraseña
              </span>
            </legend>
            <p className="text-sm leading-relaxed text-muted-foreground">Solicita credenciales antes de redirigir al destino.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="username">Usuario</Label>
                <Input id="username" name="username" autoComplete="username" placeholder="Nombre de usuario" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" name="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" minLength={8} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar contraseña</Label>
                <Input id="confirm-password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Repite la contraseña" minLength={8} />
              </div>
            </div>
          </fieldset>

          <footer className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p role="status" className="min-h-5 text-sm font-medium text-primary">
              {submitted ? <span className="inline-flex items-center gap-2"><Check className="size-4" /> Enlace listo para crear</span> : null}
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => setQrOpen(true)}>
                <QrCode className="size-4" /> Ver código QR
              </Button>
              <Button type="button" variant="outline" className="h-11 rounded-full px-5 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="size-4" /> Eliminar
              </Button>
              <Button type="button" variant="ghost" className="h-11 rounded-full px-5">Cancelar</Button>
              <Button type="submit" variant="premium" className="h-11 rounded-full px-6">
                Crear enlace <ArrowRight className="size-4" />
              </Button>
            </div>
          </footer>
        </form>
      </section>

      <QrModal open={qrOpen} url={shortlinkUrl} onClose={() => setQrOpen(false)} />
      <DeleteModal open={deleteOpen} url={shortlinkUrl} onClose={() => setDeleteOpen(false)} />
    </main>
  );
}
