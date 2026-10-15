import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight, CalendarClock, CheckCircle2, Contrast, Database, History, Info, KeyRound, Link2, Moon, ShieldCheck, Sun, Trash2, UserRoundCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RETENTION_POLICY, RETENTION_RUNS, RETENTION_TOTALS } from "@/lib/data-retention";

export const Route = createFileRoute("/data-retention")({
  head: () => ({ meta: [
    { title: "Retención de datos · Compacto" },
    { name: "description", content: "Consulta los plazos de conservación de tu plan, el resumen de datos eliminados y anonimizados y el historial de retención en Compacto." },
    { property: "og:title", content: "Retención de datos · Compacto" },
    { property: "og:description", content: "La política de tu plan y el historial de conservación de tus datos, con claridad." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: DataRetentionPage,
});

type Theme = "light" | "dark" | "contraste";
const number = new Intl.NumberFormat("es-CO");
const formatDate = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });

function DataRetentionPage() {
  const [theme, setTheme] = useState<Theme>("light");
  useEffect(() => {
    const stored = localStorage.getItem("compacto-theme");
    if (stored === "dark" || stored === "contraste") setTheme(stored);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("hc", theme === "contraste");
  }, [theme]);
  const changeTheme = (value: Theme) => { setTheme(value); localStorage.setItem("compacto-theme", value); };

  return <div className="min-h-screen dot-grid text-foreground">
    <a href="#retention-content" className="skip-link">Saltar al contenido</a>
    <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 sm:px-6">
      <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent"><Link to="/"><span className="grid size-8 place-items-center rounded-lg bg-ink text-ink-foreground"><Link2 className="size-4" /></span><span className="font-display text-lg font-bold">Compacto</span></Link></Button>
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" className="rounded-full"><Link to="/"><ArrowLeft /><span className="hidden sm:inline">Enlaces</span><span className="sr-only sm:hidden">Volver a Enlaces</span></Link></Button>
        <div role="group" aria-label="Tema" className="flex rounded-full border border-border bg-card p-1 shadow-subtle">
          {([["light", Sun, "Claro"], ["dark", Moon, "Oscuro"], ["contraste", Contrast, "Alto contraste"]] as const).map(([value, Icon, label]) => <Button key={value} variant={theme === value ? "default" : "ghost"} size="icon" className="size-8 rounded-full" aria-label={label} title={label} aria-pressed={theme === value} onClick={() => changeTheme(value)}><Icon /></Button>)}
        </div>
      </div>
    </header>

    <main id="retention-content" className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 sm:pt-12">
      <div className="animate-fade-up flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl"><p className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><ShieldCheck className="size-4" /> PRIVACIDAD Y CONSERVACIÓN</p><h1 className="font-display text-3xl font-semibold sm:text-5xl">Retención de datos</h1><p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">Cuánto tiempo se conservan tus datos y qué se ha eliminado o anonimizado en tu cuenta.</p></div>
        <Button asChild variant="premium" className="h-11 rounded-full px-5"><Link to="/pricing">Gestionar plan<ArrowUpRight /></Link></Button>
      </div>
      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><ShieldCheck className="mt-0.5 size-4 shrink-0" />Solo se muestran cantidades. Compacto nunca almacena ni expone contenido eliminado.</p>

      <section aria-labelledby="policy-heading" className="mt-10 border-t border-border pt-7">
        <div className="mb-6 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary"><CalendarClock className="size-5" /></span><div><h2 id="policy-heading" className="font-display text-xl font-semibold">Tu política de conservación</h2><p className="mt-1 text-sm text-muted-foreground">Los datos más antiguos se eliminan o anonimizan automáticamente.</p></div></div>
        <div className="mb-6 grid gap-6 border-y border-primary/20 bg-accent/60 px-5 py-6 sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-10 sm:px-6">
          <div><span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-card px-3 py-1 text-xs font-semibold text-primary"><CheckCircle2 className="size-3.5" /> Plan Prime</span><p className="mt-3 font-display text-xl font-medium">Tu horizonte de conservación</p><p className="mt-1 text-sm text-muted-foreground">Aplica a las cinco categorías de tu cuenta.</p></div>
          <div><p className="font-display text-4xl font-semibold text-primary">2 años</p><p className="mt-2 text-xs text-muted-foreground">Plazo de conservación</p></div>
          <div className="border-t border-primary/20 pt-4 sm:border-l sm:border-t-0 sm:pl-8 sm:pt-0"><p className="font-display text-3xl font-semibold">7 días</p><p className="mt-2 text-xs text-muted-foreground">De gracia, incluidos en el plazo</p></div>
        </div>
        <div className="border-y border-border bg-card shadow-subtle">
          <div className="hidden grid-cols-[minmax(0,1fr)_170px_170px] gap-5 border-b border-border bg-muted/70 px-6 py-3 text-xs font-medium text-muted-foreground md:grid"><span>Categoría de datos</span><span>Tratamiento</span><span className="text-right">Conservación</span></div>
          {RETENTION_POLICY.map(({ id, name, Icon, description, treatment }) => <div key={id} className="grid gap-3 border-b border-border px-4 py-5 last:border-0 sm:px-6 md:grid-cols-[minmax(0,1fr)_170px_170px] md:items-center md:gap-5">
            <div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border bg-background text-primary"><Icon className="size-5" /></span><div className="min-w-0"><h3 className="text-sm font-semibold">{name}</h3><p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{description}</p></div></div>
            <span className={`ml-13 w-fit rounded-full border px-2.5 py-1 text-xs md:ml-0 ${id === "campaigns" ? "border-primary/20 bg-accent text-primary" : "border-border bg-muted text-muted-foreground"}`}>{treatment}</span>
            <p className="ml-13 text-sm font-medium md:ml-0 md:text-right">2 años<span className="ml-2 text-xs font-normal text-muted-foreground md:ml-0 md:mt-1 md:block">Incluye 7 días de gracia</span></p>
          </div>)}
        </div>
      </section>

      <section aria-labelledby="summary-heading" className="mt-12">
        <div className="mb-6 flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary"><Database className="size-5" /></span><div><h2 id="summary-heading" className="font-display text-xl font-semibold">Resumen de tu cuenta</h2><p className="mt-1 text-sm text-muted-foreground">Cantidades acumuladas por la política de retención.</p></div></div>
        <div className="mb-7 grid gap-3 sm:grid-cols-3">
          {([{ label: "Registros eliminados", value: RETENTION_TOTALS.deleted, Icon: Trash2, detail: "Eventos, clics y registros OTP" }, { label: "Contactos anonimizados", value: RETENTION_TOTALS.anonymized, Icon: UserRoundCheck, detail: "Referencia de destinatario conservada" }, { label: "Tokens eliminados", value: RETENTION_TOTALS.tokens, Icon: KeyRound, detail: "Asociados a datos de campañas" }]).map(({ label, value, Icon, detail }) => <div key={label} className="rounded-lg border border-border bg-card p-5 shadow-subtle"><p className="flex items-center justify-between gap-3 text-sm text-muted-foreground">{label}<Icon className="size-4 shrink-0 text-primary" /></p><p className="mt-4 font-display text-4xl font-semibold tabular-nums">{number.format(value)}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{detail}</p></div>)}
        </div>
        <h3 className="mb-4 text-sm font-semibold">Desglose por categoría</h3>
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle" tabIndex={0} role="region" aria-label="Desglose de retención por categoría">
          <table className="w-full min-w-[660px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr><th scope="col" className="px-5 py-4 font-medium">Categoría</th>{["Eliminados", "Anonimizados", "Tokens eliminados"].map(label => <th key={label} scope="col" className="px-5 py-4 text-right font-medium">{label}</th>)}</tr></thead><tbody>{RETENTION_POLICY.map(({ id, name, Icon, deleted, anonymized, tokens }) => <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/40"><th scope="row" className="px-5 py-5 font-medium"><span className="flex items-center gap-3"><Icon className="size-4 shrink-0 text-muted-foreground" />{name}</span></th>{[deleted, anonymized, tokens].map((value, i) => <td key={i} className={`px-5 py-5 text-right font-mono tabular-nums ${value ? "text-foreground" : "text-muted-foreground"}`}>{number.format(value)}</td>)}</tr>)}</tbody><tfoot className="border-t border-border bg-muted/50 font-semibold"><tr><th scope="row" className="px-5 py-4">Total acumulado</th>{[RETENTION_TOTALS.deleted, RETENTION_TOTALS.anonymized, RETENTION_TOTALS.tokens].map((value, i) => <td key={i} className="px-5 py-4 text-right font-mono tabular-nums">{number.format(value)}</td>)}</tr></tfoot></table>
        </div>
      </section>

      <section aria-labelledby="history-heading" className="mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div className="flex items-start gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border bg-card text-primary"><History className="size-5" /></span><div><h2 id="history-heading" className="font-display text-xl font-semibold">Historial de ejecuciones</h2><p className="mt-1 text-sm text-muted-foreground">Últimas ejecuciones, de la más reciente a la más antigua.</p></div></div><span className="text-xs text-muted-foreground">3 ejecuciones</span></div>
        <div className="overflow-x-auto border-y border-border bg-card shadow-subtle" tabIndex={0} role="region" aria-label="Historial de ejecuciones de retención">
          <table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-border bg-muted/70 text-xs text-muted-foreground"><tr>{["Fecha", "Tipo", "Eliminados", "Anonimizados", "Tokens eliminados"].map((label, i) => <th key={label} scope="col" className={`px-5 py-4 font-medium ${i > 1 ? "text-right" : ""}`}>{label}</th>)}</tr></thead><tbody>{RETENTION_RUNS.map(run => <tr key={run.date} className="border-b border-border last:border-0 hover:bg-muted/40"><th scope="row" className="px-5 py-5 font-normal"><p className="font-medium">{formatDate(run.date)}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{run.time}</p></th><td className="px-5 py-5"><span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${run.simulation ? "border-border bg-muted text-muted-foreground" : "border-success/20 bg-success/10 text-success"}`}>{run.simulation ? <Info className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}{run.simulation ? "Simulación" : "Real"}</span></td>{[run.deleted, run.anonymized, run.tokens].map((value, i) => <td key={i} className={`px-5 py-5 text-right font-mono tabular-nums ${value ? "text-foreground" : "text-muted-foreground"}`}>{number.format(value)}</td>)}</tr>)}</tbody></table>
        </div>
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground"><Info className="mt-0.5 size-4 shrink-0" />Las simulaciones no eliminan ni anonimizan datos.</p>
      </section>
      <p className="mt-10 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">Datos de demostración basados en tus capturas · Esta vista no consulta tu cuenta ni ejecuta procesos de eliminación.</p>
    </main>
  </div>;
}