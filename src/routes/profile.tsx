import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Check, Contrast, Globe2, Info, Link2, Moon, Save, Sun, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [
    { title: "Mi perfil · Compacto" },
    { name: "description", content: "Tu información personal y zona horaria, reunidas en tu perfil de Compacto." },
    { property: "og:title", content: "Mi perfil · Compacto" },
    { property: "og:description", content: "Consulta y ajusta tu nombre, apellido y zona horaria en Compacto." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ProfilePage,
});

type Theme = "light" | "dark" | "contraste";
const initialProfile = { firstName: "Andres", lastName: "Jaramillo", timezone: "America/Bogota" };
const timezones = ["America/Bogota", "America/Mexico_City", "America/Lima", "America/Santiago", "America/Argentina/Buenos_Aires", "America/New_York", "Europe/Madrid", "UTC"];
function timezoneLabel(zone: string) {
  const offset = new Intl.DateTimeFormat("en", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(new Date()).find(part => part.type === "timeZoneName")?.value.replace("GMT", "UTC") ?? "UTC";
  return `(${offset}) ${zone === "America/Bogota" ? "America/Bogotá" : zone.replaceAll("_", " ")}`;
}

function ProfilePage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [profile, setProfile] = useState(initialProfile);
  const [savedProfile, setSavedProfile] = useState(initialProfile);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [status, setStatus] = useState("");
  const [cancelOpen, setCancelOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("compacto-theme");
      if (stored === "dark" || stored === "contraste") setTheme(stored);
    } catch { /* El tema sigue disponible sin almacenamiento. */ }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("hc", theme === "contraste");
  }, [theme]);
  const changeTheme = (value: Theme) => {
    setTheme(value);
    try { localStorage.setItem("compacto-theme", value); } catch { /* Preferencia temporal. */ }
  };
  const dirty = JSON.stringify(profile) !== JSON.stringify(savedProfile);
  const update = (field: keyof typeof profile, value: string) => {
    setProfile(previous => ({ ...previous, [field]: value }));
    setErrors(previous => ({ ...previous, [field]: undefined }));
    setStatus("");
  };
  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = {
      ...(!profile.firstName.trim() ? { firstName: "Ingresa tu nombre." } : {}),
      ...(!profile.lastName.trim() ? { lastName: "Ingresa tu apellido." } : {}),
    };
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const next = { ...profile, firstName: profile.firstName.trim(), lastName: profile.lastName.trim() };
    setProfile(next);
    setSavedProfile(next);
    setStatus("Cambios guardados en esta vista de demostración.");
  };

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#profile-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="rounded-full"><Link to="/"><ArrowLeft /><span className="hidden sm:inline">Enlaces</span><span className="sr-only sm:hidden">Volver a Enlaces</span></Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => changeTheme(value)}><Icon /></Button>)}
        </div>
      </div>
    </header>

    <main id="profile-content" className="mx-auto max-w-5xl px-4 pb-16 pt-7 sm:px-6 sm:pt-12">
      <div className="animate-fade-up mb-9 flex flex-wrap items-center justify-between gap-6">
        <div><p className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><UserRound className="size-4" /> TU CUENTA</p><h1 className="font-display text-4xl font-semibold sm:text-5xl">Mi perfil</h1><p className="mt-3 text-muted-foreground">Tu información, en un solo lugar.</p></div>
        <div className="flex min-w-0 items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-full border border-primary/20 bg-accent font-display text-2xl font-medium text-accent-foreground" aria-hidden="true">{savedProfile.firstName.charAt(0)}{savedProfile.lastName.charAt(0)}</span>
          <div className="min-w-0"><p className="break-words font-display text-xl font-medium">{savedProfile.firstName} {savedProfile.lastName}</p><p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Globe2 className="size-3.5" />{savedProfile.timezone.split("/").pop()?.replaceAll("_", " ").replace("Bogota", "Bogotá")}</p></div>
        </div>
      </div>

      <form noValidate onSubmit={save} className="border-t border-border">
        <section aria-labelledby="personal-heading" className="grid gap-6 py-8 md:grid-cols-[250px_1fr] md:gap-12">
          <div><h2 id="personal-heading" className="flex items-center gap-2 font-display text-xl font-medium"><UserRound className="size-4 text-primary" /> Información personal</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">El nombre asociado a tu cuenta.</p></div>
          <div className="grid gap-5 sm:grid-cols-2">
            {([["firstName", "Nombre", "given-name"], ["lastName", "Apellido", "family-name"]] as const).map(([field, label, autocomplete]) => <div key={field}><label htmlFor={field} className="mb-2 block text-sm font-medium">{label}</label><Input id={field} autoComplete={autocomplete} value={profile[field]} onChange={event => update(field, event.target.value)} maxLength={80} required aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `${field}-error` : undefined} className="h-12 rounded-lg bg-card px-4 text-foreground shadow-subtle" />{errors[field] && <p role="alert" id={`${field}-error`} className="mt-2 text-sm text-destructive">{errors[field]}</p>}</div>)}
          </div>
        </section>

        <section aria-labelledby="timezone-heading" className="grid gap-6 border-t border-border py-8 md:grid-cols-[250px_1fr] md:gap-12">
          <div><h2 id="timezone-heading" className="flex items-center gap-2 font-display text-xl font-medium"><Globe2 className="size-4 text-primary" /> Zona horaria</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Tu referencia para fechas y horarios.</p></div>
          <div><label htmlFor="timezone" className="mb-2 block text-sm font-medium">Selecciona tu zona horaria</label><Select value={profile.timezone} onValueChange={value => update("timezone", value)}><SelectTrigger id="timezone" className="h-12 rounded-lg bg-card px-4 text-foreground shadow-subtle"><SelectValue /></SelectTrigger><SelectContent>{timezones.map(zone => <SelectItem key={zone} value={zone}>{timezoneLabel(zone)}</SelectItem>)}</SelectContent></Select><p className="mt-3 text-xs leading-relaxed text-muted-foreground">El desfase UTC corresponde al horario vigente de cada región.</p></div>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border py-5">
          <p role="status" className={`flex items-center gap-2 text-sm ${status ? "text-primary" : "text-muted-foreground"}`}>{status ? <Check className="size-4 shrink-0" /> : null}{status || (dirty ? "Tienes cambios sin guardar." : "Tu perfil está al día.")}</p>
          <Button type="submit" variant="premium" disabled={!dirty} className="h-11 rounded-full px-6"><Save /> Guardar cambios</Button>
        </div>
      </form>

      <section aria-labelledby="cancel-heading" className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t border-border py-7">
        <div><h2 id="cancel-heading" className="font-display text-lg font-medium">Cancelar cuenta</h2><p className="mt-2 text-sm text-muted-foreground">Una decisión importante. Confirma antes de continuar.</p></div>
        <Button variant="outline" className="h-10 rounded-full border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { setConfirmation(""); setCancelOpen(true); }}><Trash2 /> Cancelar cuenta</Button>
      </section>
      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" />Vista de demostración · Los cambios son temporales y no se cancela ninguna cuenta real.</p>
    </main>

    <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
      <AlertDialogContent className="max-w-[calc(100%-2rem)] rounded-lg border-border bg-card text-foreground sm:max-w-md">
        <div className="grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive"><Trash2 className="size-5" /></div>
        <AlertDialogHeader><AlertDialogTitle className="font-display text-2xl">¿Cancelar tu cuenta?</AlertDialogTitle><AlertDialogDescription>Esta es una demostración de la confirmación. No se eliminará tu cuenta ni ningún dato.</AlertDialogDescription></AlertDialogHeader>
        <div><label htmlFor="cancel-confirmation" className="mb-2 block text-sm font-medium">Escribe CANCELAR para confirmar</label><Input id="cancel-confirmation" value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" className="h-11 text-foreground" /></div>
        <AlertDialogFooter className="gap-2"><AlertDialogCancel className="rounded-full text-foreground">Conservar cuenta</AlertDialogCancel><Button variant="destructive" disabled={confirmation !== "CANCELAR"} className="rounded-full" onClick={() => { setCancelOpen(false); setStatus("Confirmación simulada. Tu cuenta permanece sin cambios."); }}><Trash2 /> Confirmar cancelación</Button></AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>;
}