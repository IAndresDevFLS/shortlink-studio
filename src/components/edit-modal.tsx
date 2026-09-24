import {
  CalendarClock,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe2,
  FlaskConical,
  Instagram,
  Link2,
  Linkedin,
  LockKeyhole,
  Mail,
  MessageCircle,
  MessageSquareText,
  MoveRight,
  PencilLine,
  Plus,
  Smartphone,
  Tag,
  Trash2,
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
  const currentIndex = SECTIONS.findIndex(({ id }) => id === section);
  const currentSection = SECTIONS[currentIndex] ?? SECTIONS[0];

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
        className="modal-enter relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated"
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

        <div className="border-b border-border bg-secondary/40 px-5 py-4 sm:px-8 sm:py-5">
          <nav
            aria-label="Secciones de edición"
            className="hidden sm:block"
          >
            <div
              role="tablist"
              aria-label="Pasos de edición"
              className="grid grid-cols-6"
            >
              {SECTIONS.map(({ id, label, icon: Icon }, index) => {
                const active = section === id;
                const completed = index < currentIndex;
                return (
                  <div key={id} className="relative flex min-w-0 flex-col items-center">
                    {index > 0 ? (
                      <span
                        aria-hidden="true"
                        className={`absolute right-1/2 top-5 h-px w-full ${index <= currentIndex ? "bg-primary" : "bg-border"}`}
                      />
                    ) : null}
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls={`panel-${id}`}
                      id={`tab-${id}`}
                      tabIndex={active ? 0 : -1}
                      onClick={() => setSection(id)}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowRight") {
                          event.preventDefault();
                          moveSection(id, 1);
                        }
                        if (event.key === "ArrowLeft") {
                          event.preventDefault();
                          moveSection(id, -1);
                        }
                      }}
                      className="relative z-10 flex min-w-0 flex-col items-center gap-2 rounded-lg px-1 text-center text-xs font-semibold text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <span
                        className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
                          active
                            ? "border-primary bg-primary text-primary-foreground shadow-action"
                            : completed
                              ? "border-primary bg-accent text-primary"
                              : "border-border bg-card text-muted-foreground"
                        }`}
                        aria-hidden="true"
                      >
                        {completed ? <Check className="size-4" /> : <Icon className="size-4" />}
                      </span>
                      <span className={active ? "text-primary" : ""}>{label}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </nav>

          <div className="sm:hidden">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {currentSection ? (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <currentSection.icon className="size-4" aria-hidden="true" />
                  </span>
                ) : null}
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Paso {currentIndex + 1} de {SECTIONS.length}</p>
                  <p className="truncate font-display text-base font-semibold text-foreground">{currentSection?.label}</p>
                </div>
              </div>
              <span className="font-mono text-sm font-semibold text-primary">{Math.round(((currentIndex + 1) / SECTIONS.length) * 100)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
              <div
                className="h-full rounded-full bg-primary transition-[width]"
                style={{ width: `${((currentIndex + 1) / SECTIONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
            {section === "general" && <GeneralPanel url={url} onClose={onClose} />}
            {section === "destinos" && <DynamicPanel url={url} />}
            {section === "canales" && <ChannelsPanel />}
            {section !== "general" && section !== "destinos" && section !== "canales" && (
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

        <div className="flex items-center justify-between border-t border-border bg-card px-5 py-3 sm:px-8">
          <Button
            type="button"
            variant="ghost"
            className="h-10 rounded-full px-4"
            disabled={currentIndex === 0}
            onClick={() => moveSection(section, -1)}
          >
            <ChevronLeft className="size-4" /> Anterior
          </Button>
          <span className="hidden text-xs font-medium text-muted-foreground sm:block">
            Paso {currentIndex + 1} de {SECTIONS.length}
          </span>
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-full px-4"
            disabled={currentIndex === SECTIONS.length - 1}
            onClick={() => moveSection(section, 1)}
          >
            Siguiente <ChevronRight className="size-4" />
          </Button>
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

type ChannelId = "email" | "sms" | "whatsapp" | "instagram" | "linkedin" | "otro";

const CHANNELS: Array<{
  id: ChannelId;
  label: string;
  icon: typeof Mail;
}> = [
  { id: "email", label: "Email", icon: Mail },
  { id: "sms", label: "SMS", icon: MessageSquareText },
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin },
  { id: "otro", label: "Otro canal", icon: Globe2 },
];

interface ChannelRoute {
  id: number;
  channel: ChannelId;
  url: string;
}

function ChannelsPanel() {
  const [channel, setChannel] = useState<ChannelId | "">("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState<ChannelRoute[]>([]);
  const [nextId, setNextId] = useState(1);

  const addRoute = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const url = destination.trim();
    if (!channel || !url) return;
    setRoutes((current) => [...current, { id: nextId, channel, url }]);
    setNextId((current) => current + 1);
    setChannel("");
    setDestination("");
  };

  return (
    <div
      role="tabpanel"
      id="panel-canales"
      aria-labelledby="tab-canales"
      className="space-y-6 px-6 py-6 sm:px-8 sm:py-8"
    >
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Waypoints className="size-4 text-primary" aria-hidden="true" />
          <h3 className="font-display text-base font-semibold text-foreground">Rutas por canal</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Envía cada canal a un destino específico sin cambiar tu enlace corto.
        </p>
      </div>

      <form
        onSubmit={addRoute}
        className="grid gap-3 rounded-xl border border-border bg-secondary/60 p-3 shadow-subtle sm:grid-cols-[11rem_1fr_auto] sm:items-end"
      >
        <div className="space-y-2">
          <Label htmlFor="channel-type">Canal</Label>
          <Select value={channel} onValueChange={(value) => setChannel(value as ChannelId)}>
            <SelectTrigger id="channel-type" className="h-12 rounded-lg bg-background">
              <SelectValue placeholder="Seleccionar" />
            </SelectTrigger>
            <SelectContent>
              {CHANNELS.map(({ id, label, icon: Icon }) => (
                <SelectItem key={id} value={id}>
                  <span className="flex items-center gap-2">
                    <Icon className="size-4 text-primary" aria-hidden="true" />
                    {label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="channel-url">URL de destino</Label>
          <Input
            id="channel-url"
            type="url"
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="https://dominio.com/destino"
            className="font-mono text-sm"
            required
          />
        </div>
        <Button
          type="submit"
          variant="premium"
          className="h-12 rounded-full px-5"
          disabled={!channel || !destination.trim()}
        >
          <Plus className="size-4" /> Añadir
        </Button>
      </form>

      {routes.length === 0 ? (
        <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-secondary/30 px-6 py-8 text-center">
          <span className="mb-3 flex size-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-subtle">
            <Waypoints className="size-5" aria-hidden="true" />
          </span>
          <p className="font-display text-sm font-semibold text-foreground">
            No hay rutas específicas configuradas
          </p>
          <p className="mt-1 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Todos los clics usarán el destino predeterminado configurado en General.
          </p>
        </div>
      ) : (
        <div className="space-y-3" aria-live="polite">
          <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted-foreground">
            <span>Canales activos</span>
            <span>{routes.length} {routes.length === 1 ? "ruta" : "rutas"}</span>
          </div>
          {routes.map((route) => {
            const config = CHANNELS.find(({ id }) => id === route.channel);
            if (!config) return null;
            const Icon = config.icon;
            return (
              <div
                key={route.id}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-subtle transition-colors hover:border-primary/30"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground">{config.label}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{route.url}</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => setRoutes((current) => current.filter(({ id }) => id !== route.id))}
                  aria-label={`Eliminar ruta de ${config.label}`}
                  title={`Eliminar ruta de ${config.label}`}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
