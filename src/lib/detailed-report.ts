export type ReportLink = { slug: string; domain: string; title: string; destination: string; protected: boolean; tags: string[] };
export type ClickEvent = { id: number; date: string; ip: string; device: string; country: string; city: string; browser: string; os: string };
export const REPORT_LINKS: ReportLink[] = [
  { slug: "N3U002uP", domain: "cpt.cx", title: "I was not going to let others die", destination: "https://www.bbc.com/news/articles/c639m98gd000", protected: false, tags: ["BBC"] },
  ...[
    ["verano26", "Colección verano 2026", "tienda-aurora.co/coleccion/verano-2026"],
    ["webinar-ia", "Webinar de inteligencia artificial", "eventos.compacto.co/webinar/ia-para-pymes"],
    ["menu-qr", "Menú Café Andino", "cafeandino.co/menu/bogota-chapinero"],
    ["catalogo", "Catálogo B2B", "drive.google.com/file/d/catalogo-b2b-2026.pdf"],
    ["ofertas-sep", "Ofertas de septiembre", "tienda-aurora.co/ofertas/septiembre"],
    ["app", "App Café Andino", "apps.apple.com/co/app/cafe-andino/id6450"],
    ["encuesta", "Encuesta de satisfacción", "forms.gle/satisfaccion-clientes-q3"],
    ["vacantes", "Vacantes de desarrollo", "empleos.compacto.co/vacantes/desarrollo"],
    ["manual", "Manual interno", "docs.compacto.co/manual-interno-v3"],
    ["black-friday", "Black Friday 2026", "tienda-aurora.co/black-friday-2026"],
    ["podcast-ep12", "Podcast · episodio 12", "open.spotify.com/episode/compacto-ep12"],
  ].map(([slug = "", title = "", destination = ""]) => ({ slug, title, destination: `https://${destination}`, domain: ["menu-qr", "app"].includes(slug) ? "go.cafeandino.co" : "cpt.cx", protected: ["catalogo", "manual"].includes(slug), tags: [slug === "catalogo" ? "ventas" : "contenido"] })),
];
export const DEFAULT_REPORT_FILTERS = { link: "N3U002uP", start: "2026-08-01", end: "2026-10-14" };
export type ReportFilters = typeof DEFAULT_REPORT_FILTERS;
const locations = Array.from({ length: 57 }, (_, index) => {
  if (index < 24) return ["CO", index < 11 ? "Medellín" : index < 18 ? "Bogotá" : "Cali"];
  if (index < 31) return ["MX", "Ciudad de México"];
  if (index < 37) return ["N/D", "N/D"];
  if (index < 43) return ["PE", "Lima"];
  if (index < 48) return ["ES", index < 46 ? "Barcelona" : "Madrid"];
  if (index < 53) return ["US", "Miami"];
  return ["AR", "Buenos Aires"];
});
export function getReportEvents(filters: ReportFilters): ClickEvent[] {
  if (filters.link === "black-friday") return [];
  const days = [13, 10, 4, 3, 9, 10, 6, 2];
  let id = 0;
  return days.flatMap((count, day) => Array.from({ length: count }, (_, index) => {
    const position = id++;
    const location = locations[position] ?? ["N/D", "N/D"];
    const device = position < 31 ? "Móvil" : position < 51 ? "Escritorio" : "Tableta";
    const os = position < 19 ? "Android" : position < 31 ? "iOS" : position < 49 ? "Windows" : position < 51 ? "Mac OS X" : "iOS";
    const browser = os === "iOS" ? `Mobile Safari ${position % 2 ? "26.0" : "26.1"}` : os === "Android" ? "Chrome Mobile 154.0.0" : "Chrome 154.0.0";
    return { id: position, date: `2026-10-${String(day + 1).padStart(2, "0")}T${day === 7 ? "11:36" : `${String(9 + index % 12).padStart(2, "0")}:${String(index * 7 % 60).padStart(2, "0")}`}:00`, ip: "N/D", device, country: location[0] ?? "N/D", city: location[1] ?? "N/D", browser, os };
  })).filter(event => event.date.slice(0, 10) >= filters.start && event.date.slice(0, 10) <= filters.end).sort((a, b) => b.date.localeCompare(a.date));
}
export function rankEvents(events: ClickEvent[], key: "device" | "country" | "city" | "os" | "browser") {
  const counts = new Map<string, number>();
  events.forEach(event => { const label = key === "city" && event.city !== "N/D" ? `${event.city}, ${event.country}` : event[key]; counts.set(label, (counts.get(label) ?? 0) + 1); });
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}
export function reportSeries(filters: ReportFilters, events: ClickEvent[]) {
  const start = Date.parse(filters.start + "T00:00:00Z");
  const length = Math.min(3660, Math.round((Date.parse(filters.end + "T00:00:00Z") - start) / 86400000) + 1);
  const counts = new Map<string, number>();
  events.forEach(event => { const day = event.date.slice(0, 10); counts.set(day, (counts.get(day) ?? 0) + 1); });
  return Array.from({ length: Math.max(0, length) }, (_, index) => { const date = new Date(start + index * 86400000).toISOString().slice(0, 10); return { date, clicks: counts.get(date) ?? 0 }; });
}