import {
  CalendarClock,
  Check,
  FlaskConical,
  Link2,
  LockKeyhole,
  MoveRight,
  PencilLine,
  Smartphone,
  Tag,
  Waypoints,
  X,
} from "lucide-react";
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

type EditSection = "general" | "destinos" | "canales" | "ab" | "dispositivo" | "agenda";

const SECTIONS: Array<{ id: EditSection; label: string; icon: typeof Link2 }> = [
  { id: "general", label: "General", icon: Link2 },
  { id: "destinos", label: "Destinos dinámicos", icon: MoveRight },
  { id: "canales", label: "Canales", icon: Waypoints },
  { id: "ab", label: "A/B", icon: FlaskConical },
  { id: "dispositivo", label: "Dispositivo/Ubicación", icon: Smartphone },
  { id: "agenda", label: "Agenda", icon: CalendarClock },
];

interface EditModalProps {
  open: boolean;
  url: string;
  onClose: () => void;
}

export function EditModal({ open, url, onClose }: EditModalProps) {
  const [section, setSection] = useState<EditSection>("general");

  const moveSection = (current: EditSection, direction: 1 | -1) => {
    const currentIndex = SECTIONS.findIndex(({ id }) => id === current);
    const nextIndex = (currentIndex + direction + SECTIONS.length) % SECTIONS.length;
    const nextSection = SECTIONS[nextIndex];
    if (!nextSection) return;
    setSection(nextSection.id);
    document.getElementById(`tab-${nextSection.id}`)?.focus();
  };

  useEffect(() => {
    if (!open) return;
    setSection("general");
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

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
        aria-labelledby="edit-title"
        className="modal-enter relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
      >
        <header className="flex items-center justify-between border-b border-border px-6 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span
              className="flex size-11 items-center justify-center rounded-xl bg-accent text-primary"
              aria-hidden="true"
            >
              <PencilLine className="size-5" />
            </span>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Shortlinks
              </p>
              <h2 id="edit-title" className="font-display text-2xl font-bold text-foreground">
                Editar enlace
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

        <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
          <nav
            aria-label="Secciones de edición"
            className="shrink-0 border-b border-border bg-secondary/40 px-3 py-3 sm:w-56 sm:border-b-0 sm:border-r sm:px-3 sm:py-5"
          >
            <p className="hidden px-3 pb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:block">
              Configuración
            </p>
            <div
              role="tablist"
              aria-orientation="vertical"
              className="flex gap-1 overflow-x-auto sm:flex-col sm:overflow-visible"
            >
              {SECTIONS.map(({ id, label, icon: Icon }) => {
                const active = section === id;
                return (
                  <Button
                    key={id}
                    type="button"
                    role="tab"
                    variant="ghost"
                    aria-selected={active}
                    aria-controls={`panel-${id}`}
                    id={`tab-${id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => setSection(id)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                        event.preventDefault();
                        moveSection(id, 1);
                      }
                      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                        event.preventDefault();
                        moveSection(id, -1);
                      }
                    }}
                    className={`h-11 shrink-0 justify-start gap-3 rounded-lg px-3 text-sm font-semibold sm:w-full ${
                      active
                        ? "bg-accent text-primary shadow-subtle hover:bg-accent hover:text-primary"
                        : "text-muted-foreground hover:bg-background hover:text-foreground"
                    }`}
                  >
                    <span
                      className={`flex size-7 shrink-0 items-center justify-center rounded-md ${
                        active ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="whitespace-nowrap">{label}</span>
                  </Button>
                );
              })}
            </div>
          </nav>

          <div className="min-h-0 min-w-0 flex-1 overflow-y-auto">
            {section === "general" && <GeneralPanel url={url} onClose={onClose} />}
            {section === "destinos" && <DynamicPanel url={url} />}
            {section !== "general" && section !== "destinos" && (
              <div
                role="tabpanel"
                id={`panel-${section}`}
                aria-labelledby={`tab-${section}`}
                className="flex flex-col items-center gap-3 px-6 py-16 text-center sm:px-8"
              >
                <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary" aria-hidden="true">
                  <PencilLine className="size-5" />
                </span>
                <p className="font-display text-lg font-semibold text-foreground">Sección en construcción</p>
                <p className="max-w-sm text-sm text-muted-foreground">
                  Diseñaremos esta sección a continuación, una por una.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function GeneralPanel({ url, onClose }: { url: string; onClose: () => void }) {
  const [tags, setTags] = useState<string[]>(["Marketing", "Q3"]);
  const [tagDraft, setTagDraft] = useState("");
  const [saved, setSaved] = useState(false);

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
    <form
      role="tabpanel"
      id="panel-general"
      aria-labelledby="tab-general"
      onSubmit={handleSubmit}
      className="space-y-6 px-6 py-6 sm:px-8 sm:py-8"
    >
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
  );
}

function DynamicPanel({ url }: { url: string }) {
  const [destination, setDestination] = useState(
    "https://www.xataka.com/magnet/corea-sur-encadena-racha-25-meses-aumentar"
  );
  const [savedDestination, setSavedDestination] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = destination.trim();
    setSavedDestination(value || null);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form
      role="tabpanel"
      id="panel-destinos"
      aria-labelledby="tab-destinos"
      onSubmit={handleSubmit}
      className="space-y-6 px-6 py-6 sm:px-8 sm:py-8"
    >
      <fieldset className="space-y-5 rounded-xl border border-border bg-secondary/60 p-4 sm:p-6">
        <legend className="px-2">
          <span className="inline-flex items-center gap-2 font-display text-sm font-semibold text-foreground">
            <MoveRight className="size-4 text-primary" aria-hidden="true" /> Destino dinámico
          </span>
        </legend>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Sustituye temporalmente la URL de destino sin cambiar el enlace corto. Ideal para
          campañas que rotan contenido.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1 space-y-2">
            <Label htmlFor="dynamic-url" className="sr-only">
              URL de destino dinámico
            </Label>
            <Input
              id="dynamic-url"
              name="dynamicUrl"
              type="url"
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
              placeholder="https://dominio.com/nuevo-destino"
              className="font-mono text-sm"
            />
          </div>
          <Button type="submit" variant="premium" className="h-12 shrink-0 rounded-full px-6">
            Guardar destino <Check className="size-4" />
          </Button>
        </div>
        <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground">
          {savedDestination ? (
            <>
              <span className="inline-flex size-2 rounded-full bg-primary" aria-hidden="true" />
              <span>
                Destino dinámico activo:{" "}
                <span className="font-mono font-medium text-foreground">{savedDestination}</span>
              </span>
            </>
          ) : (
            <>
              <span className="inline-flex size-2 rounded-full bg-muted-foreground/40" aria-hidden="true" />
              <span>
                Sin destino dinámico: el enlace usa su URL de destino{" "}
                <span className="font-mono font-medium text-foreground">{url}</span>.
              </span>
            </>
          )}
        </p>
        {saved ? (
          <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
            <Check className="size-4" /> Destino actualizado
          </p>
        ) : null}
      </fieldset>
    </form>
  );
}
