export type CampaignReportSearch = {
  name?: string | undefined;
  destination?: string | undefined;
  domain?: string | undefined;
  count?: number | undefined;
};

export function validateCampaignReportSearch(search: Record<string, unknown>): CampaignReportSearch {
  return {
    name: typeof search['name'] === "string" ? search['name'].slice(0, 120) : undefined,
    destination: typeof search['destination'] === "string" ? search['destination'].slice(0, 2048) : undefined,
    domain: typeof search['domain'] === "string" ? search['domain'].slice(0, 253) : undefined,
    count: Number.isFinite(Number(search['count'])) && Number(search['count']) >= 1
      ? Math.min(250, Math.floor(Number(search['count']))) : undefined,
  };
}

export function getCampaignReport(id: string, search: CampaignReportSearch) {
  const known = id === "bbc" ? {
    name: "BBC Noticias", destination: "https://www.bbc.com/mundo/articles/cdjp03mxxdo", domain: "cpt.cx", count: 30,
  } : id === "ebay" ? {
    name: "Ebay TV", destination: "https://co.ebay.com/b/TVs/11071/bn_738302", domain: "cpt.cx", count: 50,
  } : undefined;
  if (!known && (!search.name || !search.destination || !search.domain || !search.count)) return null;
  const campaign = known ?? { name: search.name ?? "", destination: search.destination ?? "", domain: search.domain ?? "", count: search.count ?? 1 };
  const slugs = ["wZwfEAZG", "UcyMyp6Z", "qfKGkrXq", "ZhqONoHl", "5tNPgGhO", "dX1yucpX"];
  return {
    ...campaign,
    links: Array.from({ length: campaign.count }, (_, index) => ({
      slug: slugs[index] ?? `cpt${id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}${String(index + 1).padStart(3, "0")}`,
      id: `demo-${id}-${String(index + 1).padStart(3, "0")}`,
      clicks: 0,
      conversions: 0,
    })),
  };
}