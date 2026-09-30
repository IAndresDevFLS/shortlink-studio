import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Link2,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Crear cuenta | Compacto" },
      { name: "description", content: "Crea tu cuenta de Compacto y empieza a crear, distribuir y medir tus enlaces cortos." },
      { property: "og:title", content: "Crear cuenta | Compacto" },
      { property: "og:description", content: "Crea tu cuenta de Compacto y empieza a crear, distribuir y medir tus enlaces cortos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

type RuleKey = "len" | "max" | "upper" | "lower" | "digit" | "symbol";

const RULES: { key: RuleKey; label: string; test: (v: string) => boolean }[] = [
  { key: "len", label: "Al menos 8 caracteres", test: (v) => v.length >= 8 },
  { key: "max", label: "Menos de 70 caracteres", test: (v) => v.length > 0 && v.length < 70 },
  { key: "upper", label: "Una letra mayúscula", test: (v) => /[A-Z]/.test(v) },
  { key: "lower", label: "Una letra minúscula", test: (v) => /[a-z]/.test(v) },
  { key: "digit", label: "Un número", test: (v) => /\d/.test(v) },
  { key: "symbol", label: "Un símbolo", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function RegisterPage() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [terms, setTerms] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("compacto-theme", next ? "dark" : "light");
    } catch {
      /* almacenamiento no disponible */
    }
  };

  const ruleState = useMemo(() => {
    const map = new Map<RuleKey, boolean>();
    for (const rule of RULES) map.set(rule.key, rule.test(password));
    return map;
  }, [password]);

  const allValid = RULES.every((r) => r.test(password));

  const goLogin = () => navigate({ to: "/login" });
  const go = () => navigate({ to: "/" });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    go();
  };

  return (
    <div className="technical-grid flex min-h-screen flex-col">
      <a href="#register-panel" className="skip-link">
        Ir al contenido
      </a>

      {/* Barra superior: idioma y tema */}
      <header className="flex items-center justify-end gap-3 px-6 py-5 md:px-12">
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            aria-label="Cambiar idioma"
          >
            Español
            <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Español</DropdownMenuItem>
            <DropdownMenuItem>English</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button
          type="button"
          onClick={toggleDark}
          aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}
          className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-subtle transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
        >
          {dark ? (
            <Sun className="size-5" aria-hidden="true" />
          ) : (
            <Moon className="size-5" aria-hidden="true" />
          )}
        </button>
      </header>

      {/* Tarjeta principal */}
      <main className="flex flex-1 items-center justify-center px-4 pb-10 md:px-12">
        <div className="modal-enter grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-elevated lg:grid-cols-[1fr_1.35fr]">
          {/* Panel izquierdo verde de marca */}
          <section className="relative flex min-w-0 flex-col justify-between gap-16 overflow-hidden bg-ink p-8 sm:p-10 md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden"
            >
              <div className="absolute -right-20 top-16 size-64 rounded-full bg-primary/30 blur-3xl animate-float-slow" />
              <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-primary/15 blur-3xl animate-float-slow [animation-delay:-4.5s]" />
              {/* Ruta de señal: guiño a los shortlinks */}
              <svg
                className="absolute inset-0 h-full w-full text-white"
                viewBox="0 0 480 480"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
              >
                <path
                  d="M60 445 C 190 405, 120 245, 250 190 S 435 125, 448 40"
                  stroke="currentColor"
                  strokeOpacity="0.25"
                  strokeWidth="1.5"
                  strokeDasharray="3 9"
                  strokeLinecap="round"
                  className="animate-route-dash"
                />
                <circle r="3.5" fill="currentColor" fillOpacity="0.7" className="route-pulse">
                  <animateMotion
                    dur="7s"
                    repeatCount="indefinite"
                    path="M60 445 C 190 405, 120 245, 250 190 S 435 125, 448 40"
                  />
                </circle>
                <circle r="9" fill="currentColor" fillOpacity="0.15" className="route-pulse">
                  <animateMotion
                    dur="7s"
                    repeatCount="indefinite"
                    path="M60 445 C 190 405, 120 245, 250 190 S 435 125, 448 40"
                  />
                </circle>
                <circle cx="448" cy="40" r="3.5" fill="currentColor" fillOpacity="0.6" />
                <circle cx="60" cy="445" r="3.5" fill="currentColor" fillOpacity="0.4" />
              </svg>
            </div>

            <div className="relative flex items-center gap-2 animate-fade-up">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-action">
                <Link2 className="size-5" aria-hidden="true" />
              </span>
              <span className="font-display text-xl font-bold tracking-tight text-ink-foreground">
                Compacto
              </span>
            </div>

            <div className="relative">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink-foreground md:text-[2.75rem] md:leading-[1.1] animate-fade-up [animation-delay:0.15s]">
                Bienvenido.
              </h1>
              <p className="mt-4 max-w-xs text-base leading-relaxed text-ink-foreground/70 animate-fade-up [animation-delay:0.3s]">
                Empecemos a poner tus enlaces en marcha.
              </p>
            </div>
          </section>

          {/* Panel derecho: formulario de registro */}
          <section
            id="register-panel"
            className="flex flex-col justify-center px-6 py-10 sm:px-10 md:px-12"
          >
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground animate-fade-up [animation-delay:0.35s]">
              Crea tu cuenta
            </h2>
            <p className="mt-2 text-base text-muted-foreground animate-fade-up [animation-delay:0.45s]">
              Completa tus datos para empezar.
            </p>

            <form
              onSubmit={onSubmit}
              className="mt-7 space-y-5 animate-fade-up [animation-delay:0.55s]"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="first-name">Nombre</Label>
                  <Input id="first-name" name="firstName" autoComplete="given-name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Apellido</Label>
                  <Input id="last-name" name="lastName" autoComplete="family-name" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">
                  Empresa{" "}
                  <span className="font-normal text-muted-foreground">(opcional)</span>
                </Label>
                <Input id="company" name="company" autoComplete="organization" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="tu@empresa.com"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-confirm">Confirmar contraseña</Label>
                  <Input
                    id="password-confirm"
                    name="passwordConfirm"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Reglas de contraseña */}
              <ul className="grid gap-x-6 gap-y-1.5 rounded-xl border border-border bg-background p-4 sm:grid-cols-2">
                {RULES.map((rule) => {
                  const ok = ruleState.get(rule.key) ?? false;
                  return (
                    <li
                      key={rule.key}
                      className={`flex items-center gap-2 text-[13px] leading-tight transition-colors ${
                        ok ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                          ok
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border"
                        }`}
                        aria-hidden="true"
                      >
                        {ok && <Check className="size-2.5" strokeWidth={3} />}
                      </span>
                      <span className="sr-only">{ok ? "Cumple:" : "Pendiente:"}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="culture">Idioma</Label>
                  <Select defaultValue="es-CO">
                    <SelectTrigger id="culture" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es-CO">Español (Colombia)</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona horaria</Label>
                  <Select defaultValue="America/Bogota">
                    <SelectTrigger id="timezone" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Bogota">America/Bogotá</SelectItem>
                      <SelectItem value="America/Mexico_City">America/Ciudad de México</SelectItem>
                      <SelectItem value="America/Lima">America/Lima</SelectItem>
                      <SelectItem value="America/Santiago">America/Santiago</SelectItem>
                      <SelectItem value="America/New_York">America/Nueva York</SelectItem>
                      <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Captcha de prueba */}
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
                <label
                  htmlFor="captcha"
                  className="flex cursor-pointer items-center gap-3 text-sm text-foreground"
                >
                  <Checkbox
                    id="captcha"
                    checked={captcha}
                    onCheckedChange={(v) => setCaptcha(v === true)}
                  />
                  No soy un robot
                </label>
                <span className="flex flex-col items-center gap-0.5 text-muted-foreground">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                  <span className="text-[10px] leading-none">Captcha de prueba</span>
                </span>
              </div>

              <label
                htmlFor="terms"
                className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted-foreground"
              >
                <Checkbox
                  id="terms"
                  checked={terms}
                  onCheckedChange={(v) => setTerms(v === true)}
                  className="mt-0.5"
                  required
                />
                <span>
                  Acepto los{" "}
                  <a
                    href="#"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Términos de servicio
                  </a>{" "}
                  y la{" "}
                  <a
                    href="#"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Política de privacidad
                  </a>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={!allValid || !captcha || !terms}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-action transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <UserRound className="size-5" aria-hidden="true" />
                Crear cuenta
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>

              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={goLogin}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          </section>
        </div>
      </main>

      {/* Ayuda bajo la tarjeta */}
      <footer className="px-6 pb-8 text-center">
        <p className="text-sm text-muted-foreground">
          ¿Necesitas ayuda?{" "}
          <a href="#" className="font-semibold text-primary underline-offset-4 hover:underline">
            Contactar soporte
          </a>
        </p>
      </footer>
    </div>
  );
}
