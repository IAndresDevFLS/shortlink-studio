import { Activity, Fingerprint, Link2, MousePointerClick, Users } from "lucide-react";

// Reference data for the presentation preview; no account data is read or removed.
export const RETENTION_POLICY = [
  { id: "tracking", name: "Eventos de seguimiento", Icon: Activity, treatment: "Eliminación", description: "Los eventos antiguos se eliminan automáticamente.", deleted: 1880, anonymized: 0, tokens: 0 },
  { id: "clicks", name: "Clics", Icon: MousePointerClick, treatment: "Eliminación", description: "Los registros de clics antiguos se eliminan.", deleted: 860, anonymized: 0, tokens: 0 },
  { id: "otp", name: "OTP", Icon: Fingerprint, treatment: "Eliminación", description: "Los registros OTP antiguos se eliminan.", deleted: 120, anonymized: 0, tokens: 0 },
  { id: "campaigns", name: "Datos de campañas", Icon: Users, treatment: "Anonimización", description: "Se anonimizan tus contactos, conservando su referencia de destinatario.", deleted: 0, anonymized: 87, tokens: 15 },
  { id: "expired", name: "Enlaces vencidos", Icon: Link2, treatment: "Eliminación", description: "Se eliminan los enlaces vencidos junto con su configuración.", deleted: 0, anonymized: 0, tokens: 0 },
];

export const RETENTION_RUNS = [
  { date: "2026-07-06", time: "06:15", simulation: true, deleted: 0, anonymized: 0, tokens: 0 },
  { date: "2026-07-05", time: "09:15", simulation: false, deleted: 2100, anonymized: 87, tokens: 15 },
  { date: "2026-06-28", time: "09:15", simulation: false, deleted: 760, anonymized: 0, tokens: 0 },
];

export const RETENTION_TOTALS = RETENTION_POLICY.reduce((total, item) => ({
  deleted: total.deleted + item.deleted,
  anonymized: total.anonymized + item.anonymized,
  tokens: total.tokens + item.tokens,
}), { deleted: 0, anonymized: 0, tokens: 0 });