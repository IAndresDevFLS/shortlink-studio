export type OtpChannel = "email" | "sms" | "whatsapp";
export type OtpStatus = "verified" | "expired" | "pending";
export type OtpRecord = { reference: string; channel: OtpChannel; created: string; sent: string; verified: string | null; expires: string; status: OtpStatus };
export const CHANNELS: { value: OtpChannel; label: string }[] = [
  { value: "email", label: "Email" }, { value: "sms", label: "SMS" }, { value: "whatsapp", label: "WhatsApp" },
];
export const DEFAULT_OTP_FILTERS = { channel: "email" as OtpChannel, start: "2026-11-01", end: "2026-11-08" };
export type OtpFilters = typeof DEFAULT_OTP_FILTERS;

const refs = ["13022868-23ea-419b-87a8-ceca445ede8e", "f59cf43c-a65f-4067-94ee-8a9a0b762904", "707068f7-d34e-4c10-88f8-a95dd283de54", "7eeb483f-9d73-4154-8e8c-6db6dff9b717", "89d66029-1e20-437f-b3c7-3c67d1469d4e", "dbbe63b1-a63a-4d16-9dc1-2c78831f3f8b", "f286a257-79e7-4a6d-afba-7d4e95a676fd", "cec8cb7c-a7d4-4828-8fd2-7ef307b895f2", "22a7e1aa-5f9f-42d8-b2e7-b2a60a58ac60", "91c84794-68d5-4832-bace-96895558bfc0"];
const pad = (n: number) => String(n).padStart(2, "0");
const iso = (base: number) => { const d = new Date(base); return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`; };
const hex = (seed: number) => { let s = seed * 9301 + 49297; return Array.from({ length: 32 }, () => { s = (s * 9301 + 49297) % 233280; return "0123456789abcdef"[s % 16]; }).join(""); };
const uuid = (seed: number) => { const h = hex(seed); return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`; };

const counts: Record<OtpChannel, number> = { email: 24, sms: 15, whatsapp: 9 };
export const OTP_RECORDS: OtpRecord[] = (Object.keys(counts) as OtpChannel[]).flatMap((channel, ci) =>
  Array.from({ length: counts[channel] }, (_, i) => {
    const seed = ci * 100 + i;
    const created = Date.UTC(2026, 10, 4 - Math.floor(i / 8) + (ci ? 2 : 0), 14 - (i % 8), 9 - i, 16 - i % 7) ;
    const status: OtpStatus = channel === "email" && i < 8 ? (["verified", "expired", "expired", "verified", "verified", "expired", "expired", "verified"] as const)[i]! : i % 9 === 4 ? "pending" : i % 3 === 0 ? "expired" : "verified";
    return {
      reference: channel === "email" && i < refs.length ? refs[i]! : uuid(seed + 7), channel,
      created: iso(created), sent: iso(created + 1000 + (i % 5) * 1000),
      verified: status === "verified" ? iso(created + 6000 + (i % 4) * 3000) : null,
      expires: iso(created + (status === "expired" && i % 2 ? 3000 : 300000)), status,
    };
  })).sort((a, b) => b.created.localeCompare(a.created));

export function getOtpRecords(f: OtpFilters) {
  return OTP_RECORDS.filter(r => r.channel === f.channel && r.created.slice(0, 10) >= f.start && r.created.slice(0, 10) <= f.end);
}
export function otpSummary(rows: OtpRecord[]) {
  const verified = rows.filter(r => r.status === "verified");
  const expired = rows.filter(r => r.status === "expired").length;
  const pending = rows.filter(r => r.status === "pending").length;
  const secs = verified.map(r => (Date.parse(r.verified! + "Z") - Date.parse(r.sent + "Z")) / 1000);
  return { total: rows.length, verified: verified.length, expired, pending, rate: rows.length ? Math.round(verified.length / rows.length * 100) : 0, avgSeconds: secs.length ? Math.round(secs.reduce((a, b) => a + b, 0) / secs.length) : 0 };
}
export function otpCSV(rows: OtpRecord[]) {
  const label = { verified: "Verificado", expired: "Expirado", pending: "Pendiente" };
  return "\uFEFF" + [["Referencia", "Creado", "Enviado", "Verificado", "Expira", "Estado", "Canal"], ...rows.map(r => [r.reference, r.created, r.sent, r.verified ?? "", r.expires, label[r.status], r.channel])].map(l => l.join(",")).join("\n");
}
