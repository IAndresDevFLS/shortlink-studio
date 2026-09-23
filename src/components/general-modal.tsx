import { Check, Link2, LockKeyhole, PencilLine, Tag, X } from "lucide-react";
import { useEffect, useState, type FormEvent, type KeyboardEvent } from "react";

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

interface GeneralModalProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function GeneralModal({ open, url, onClose }: GeneralModalProps) {
  const [tags, setTags] = useState<string[]>(["Marketing", "Q3"]);
  const [tagDraft, setTagDraft] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

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
    setSaved(true);
    window.setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="general-title"
        className="modal-enter relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border bg-card shadow-elevated"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"
              aria-hidden="true"
            >
              <PencilLine className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Editar shortlink
              </p>
              <h2 id="general-title" className="font-display text-2xl font-bold text-foreground">
                General
              </h2>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-lg"
            aria-label="Cerrar modal"
            onClick={onClose}
          >
            <X className="size-5" />
          </Button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/60 px-4 py-3">
            <Link2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Enlace corto
              </p>
              <p className="truncate font-mono text-sm font-semibold text-foreground">{url}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="general-name">Nombre</Label>
              <Input id="general-name" name="name" defaultValue="Campaña de septiembre" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="general-url">URL de destino</Label>
              <Input
                id="general-url"
                name="url"
                type="url"
                defaultValue="https://compacto.app/campanas/septiembre"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="general-domain">Dominio personalizado</Label>
              <Select name="domain" defaultValue="cpto.co" required>
                <SelectTrigger id="general-domain" className="h-12 rounded-xl bg-background px-4 text-base">
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
            <Label htmlFor="general-tags">
              Etiquetas <span className="font-normal text-muted-foreground">(opcional)</span>
            </Label>
            <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 shadow-subtle transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/20">
              <Tag className="size-4 text-primary" aria-hidden="true" />
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-7 items-center gap-1 rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                    className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label={`Eliminar etiqueta ${tag}`}
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              <input
                id="general-tags"
                value={tagDraft}
                onChange={(event) => setTagDraft(event.target.value)}
                onBlur={addTag}
                onKeyDown={handleTagKeyDown}
                placeholder="Añadir etiqueta..."
                className="min-w-32 flex-1 bg-transparent px-1 py-1 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <fieldset className="space-y-4 rounded-xl border border-border bg-secondary/60 p-4 sm:p-5">
            <legend className="px-2">
              <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-foreground">
                <LockKeyhole className="size-4 text-primary" aria-hidden="true" /> Protección con contraseña
              </span>
            </legend>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Deja los campos vacíos para mantener la protección actual.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="general-username">Usuario</Label>
                <Input id="general-username" name="username" autoComplete="username" placeholder="Nombre de usuario" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="general-password">Nueva contraseña</Label>
                <Input
                  id="general-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="general-confirm-password">Confirmar contraseña</Label>
                <Input
                  id="general-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repite la contraseña"
                  minLength={8}
                />
              </div>
            </div>
          </fieldset>

          <footer className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p role="status" className="min-h-5 text-sm font-medium text-primary">
              {saved ? (
                <span className="inline-flex items-center gap-2">
                  <Check className="size-4" /> Cambios guardados
                </span>
              ) : null}
            </p>
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button type="button" variant="ghost" className="h-11 rounded-full px-5" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="premium" className="h-11 rounded-full px-6">
                Guardar cambios <Check className="size-4" />
              </Button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  );
}
