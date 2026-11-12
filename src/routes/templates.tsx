import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Contrast, Info, LayoutTemplate, Link2, Moon, PenLine, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [
    { title: "Plantillas · Compacto" },
    { name: "description", content: "Explora tus plantillas de correo OTP en Compacto, una carta a la vez." },
    { property: "og:title", content: "Plantillas · Compacto" },
    { property: "og:description", content: "Elige y edita tus plantillas de correo OTP en Compacto." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: TemplatesPage,
});

type Theme = "light" | "dark" | "contraste";
type Style = "minimal" | "modern" | "bold" | "soft";
const templates: { name: string; description: string; style: Style }[] = [
  { name: "OTP Minimal", description: "Plantilla sencilla para códigos de verificación", style: "minimal" },
  { name: "OTP Modern", description: "Encabezado con gradiente, código en píldora y sombras sutiles", style: "modern" },
  { name: "OTP Marca", description: "Banda esmeralda superior y código en tipografía grande", style: "bold" },
  { name: "OTP Suave", description: "Tonos claros, bordes redondeados y lectura tranquila", style: "soft" },
];

function EmailPreview({ style }: { style: Style }) {
  const code = { minimal: "rounded-md border-2 border-dashed border-primary/40 text-primary", modern: "rounded-full border border-primary/30 bg-accent text-primary", bold: "rounded-lg bg-primary text-primary-foreground text-3xl", soft: "rounded-2xl bg-muted text-foreground" }[style];
  return <div className={`overflow-hidden rounded-xl border border-border bg-background text-left ${style === "soft" ? "rounded-3xl" : ""}`}>
    {style === "modern" && <div className="h-1.5 bg-gradient-primary" />}
    {style === "bold" && <div className="bg-gradient-primary px-5 py-3 font-display text-sm font-semibold text-primary-foreground">Compacto</div>}
    <div className="p-5">
      <p className="font-display text-lg font-semibold">One-Time Password (OTP)</p>
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">Usa el siguiente código para completar tu verificación:</p>
      <p className={`my-4 py-3 text-center font-mono text-2xl font-semibold tracking-[0.3em] ${code}`}>123456</p>
      <p className="text-xs leading-relaxed text-muted-foreground">Este código vence en [X] minutos. No lo compartas con nadie.</p>
      <p className="mt-3 text-[10px] text-muted-foreground/80">Si no solicitaste este código, ignora este correo.</p>
    </div>
  </div>;
}

function TemplatesPage() {
  const [theme, setTheme] = useState<Theme>("light");
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const touch = useRef<number | null>(null);
  const n = templates.length;
  useEffect(() => { try { const s = localStorage.getItem("compacto-theme"); if (s === "dark" || s === "contraste") setTheme(s); } catch { /* sin almacenamiento */ } }, []);
  useEffect(() => { document.documentElement.classList.toggle("dark", theme === "dark"); document.documentElement.classList.toggle("hc", theme === "contraste"); }, [theme]);
  const changeTheme = (v: Theme) => { setTheme(v); try { localStorage.setItem("compacto-theme", v); } catch { /* temporal */ } };
  const go = (step: number) => { setDir(step); setActive(a => (a + step + n) % n); };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  const cardStyle = (i: number): CSSProperties => {
    let off = i - active; if (off > n / 2) off -= n; if (off < -n / 2) off += n;
    const abs = Math.abs(off);
    return {
      transform: `translateX(${off * 62}%) translateZ(${-abs * 180}px) rotateY(${-off * 28}deg) scale(${1 - abs * 0.12})`,
      opacity: abs > 1 ? 0 : 1 - abs * 0.45,
      zIndex: 10 - abs,
      filter: abs ? "blur(1.5px) saturate(0.6)" : "none",
      pointerEvents: abs > 1 ? "none" : "auto",
    };
  };
  const current = templates[active] ?? templates[0]!;

  return <div className="min-h-screen dot-grid overflow-x-hidden text-foreground">
    <a href="#templates-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="rounded-full"><Link to="/"><ArrowLeft /><span className="hidden sm:inline">Enlaces</span><span className="sr-only sm:hidden">Volver a Enlaces</span></Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([v, Icon, label]) => <Button key={v} variant={theme === v ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === v} onClick={() => changeTheme(v)}><Icon /></Button>)}
        </div>
      </div>
    </header>

    <main id="templates-content" className="mx-auto max-w-6xl px-4 pb-16 pt-6 text-center sm:px-6">
      <p className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-primary"><LayoutTemplate className="size-4" /> PLANTILLAS OTP</p>
      <h1 className="font-display text-4xl font-semibold sm:text-5xl">Elige tu plantilla</h1>
      <p className="mt-3 text-muted-foreground">Desliza entre tus plantillas y edita la que quieras usar.</p>

      <section aria-roledescription="carrusel" aria-label="Plantillas" className="relative mt-10">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative mx-auto h-[470px] max-w-sm [perspective:1400px]"
          onTouchStart={e => { touch.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touch.current === null) return; const d = e.changedTouches[0].clientX - touch.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); touch.current = null; }}>
          <div className="relative h-full [transform-style:preserve-3d]">
            {templates.map((t, i) => {
              const isActive = i === active;
              return <article key={t.name} aria-hidden={!isActive} aria-label={`${t.name}, ${i + 1} de ${n}`}
                onClick={() => !isActive && go(i > active ? 1 : -1)}
                style={cardStyle(i)}
                className={`absolute inset-0 rounded-2xl border bg-card p-4 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${isActive ? "border-primary/50 shadow-[0_30px_60px_-20px_color-mix(in_oklab,var(--primary)_45%,transparent)]" : "cursor-pointer border-border shadow-subtle"}`}>
                <EmailPreview style={t.style} />
                <div className="mt-4 flex items-center justify-between gap-3 px-1 text-left">
                  <div className="min-w-0"><p className="font-display text-lg font-semibold">{t.name}</p><p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{t.description}</p></div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </div>
              </article>;
            })}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-5">
          <Button variant="outline" size="icon" className="size-12 rounded-full text-foreground shadow-subtle" aria-label="Plantilla anterior" onClick={() => go(-1)}><ChevronLeft /></Button>
          <Button variant="premium" className="h-12 rounded-full px-7" onClick={() => alert(`Edición de "${current.name}" (demostración)`)}><PenLine /> Editar {current.name}</Button>
          <Button variant="outline" size="icon" className="size-12 rounded-full text-foreground shadow-subtle" aria-label="Plantilla siguiente" onClick={() => go(1)}><ChevronRight /></Button>
        </div>
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Seleccionar plantilla">
          {templates.map((t, i) => <button key={t.name} role="tab" aria-selected={i === active} aria-label={t.name} onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }} className={`h-2 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-primary" : "w-2 bg-border hover:bg-muted-foreground"}`} />)}
        </div>
        <p className="sr-only" aria-live="polite">{current.name}, plantilla {active + 1} de {n}</p>
        <p className="mt-4 text-xs text-muted-foreground">Usa ← → del teclado o desliza en el móvil · {dir > 0 ? "" : ""}{active + 1} / {n}</p>
      </section>

      <p className="mx-auto mt-10 flex max-w-md items-start justify-center gap-2 text-xs text-muted-foreground"><Info className="mt-0.5 size-3.5 shrink-0" />Vista de demostración · OTP Marca y OTP Suave son ejemplos añadidos.</p>
    </main>
  </div>;
}
