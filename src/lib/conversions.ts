export type ConversionSort = "conversions" | "clicks" | "rate" | "latest";
export type ConversionFilters = { start: string; end: string; search: string; sort: ConversionSort };
export const DEFAULT_CONVERSION_FILTERS: ConversionFilters = { start: "2026-09-12", end: "2026-10-12", search: "", sort: "conversions" };
const SLUGS = ["qTNYzSne", "iqGrD7KG", "lyYeM67H", "rZKoOgiF", "mZ8JrDs0"];
const TITLES = ["Con éxito culminó una nueva edición de Rock al Parque", "Agenda cultural de Bogotá", "Noticias y novedades de la semana", "Descubre nuestros próximos eventos"];
export const CONVERSION_LINKS = Array.from({ length: 20 }, (_, index) => ({
  slug: SLUGS[index] ?? `cultura${String(index + 1).padStart(2, "0")}`,
  title: TITLES[index < 5 ? 0 : 1 + (index % 3)] ?? "Agenda cultural",
  domain: "cpt.cx",
  events: index < 4 ? [{ date: ["2026-10-09", "2026-10-10", "2026-10-11", "2026-09-20"][index] ?? "2026-10-09", clicks: [8, 4, 3, 1][index] ?? 0, conversions: 0 }] : [],
}));

export function getConversionRows(filters: ConversionFilters) {
  return CONVERSION_LINKS.filter(link => `${link.title} ${link.domain}/${link.slug}`.toLowerCase().includes(filters.search.trim().toLowerCase())).map(link => {
    const events = link.events.filter(event => event.date >= filters.start && event.date <= filters.end);
    const clicks = events.reduce((total, event) => total + event.clicks, 0);
    const conversions = events.reduce((total, event) => total + event.conversions, 0);
    const latest = events.filter(event => event.conversions > 0).map(event => event.date).sort().at(-1) ?? null;
    return { ...link, clicks, conversions, rate: clicks ? conversions / clicks * 100 : null, latest };
  }).sort((a, b) => {
    if (filters.sort === "clicks") return b.clicks - a.clicks || a.slug.localeCompare(b.slug);
    if (filters.sort === "rate") return (b.rate ?? -1) - (a.rate ?? -1) || b.clicks - a.clicks;
    if (filters.sort === "latest") return (b.latest ?? "").localeCompare(a.latest ?? "") || b.clicks - a.clicks;
    return b.conversions - a.conversions || b.clicks - a.clicks;
  });
}

export function conversionCSV(rows: ReturnType<typeof getConversionRows>) {
  const escape = (value: string) => `"${value.replace(/"/g, '""')}"`;
  return "\uFEFF" + ["Enlace,Título,Clics,Conversiones,Tasa (%),Última conversión", ...rows.map(row => [escape(`${row.domain}/${row.slug}`), escape(row.title), row.clicks, row.conversions, row.rate === null ? "" : row.rate.toFixed(1), row.latest ?? ""].join(","))].join("\r\n");
}