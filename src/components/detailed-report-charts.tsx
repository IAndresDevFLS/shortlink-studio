import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { reportSeries } from "@/lib/detailed-report";

export function ClickTimeline({ data }: { data: ReturnType<typeof reportSeries> }) {
  return <div className="h-72 w-full min-w-0 sm:h-80" role="img" aria-label={`Evolución diaria: ${data.reduce((sum, day) => sum + day.clicks, 0)} clics en ${data.length} días`}>
    <ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 15, right: 12, left: -25, bottom: 5 }}>
      <CartesianGrid stroke="var(--border)" strokeDasharray="4 5" vertical={false} />
      <XAxis dataKey="date" tickFormatter={date => `${date.slice(8, 10)}/${date.slice(5, 7)}`} minTickGap={55} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
      <YAxis allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
      <Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="rounded-lg border border-border bg-popover px-4 py-3 text-sm text-popover-foreground shadow-elevated"><p className="text-xs text-muted-foreground">{String(label)}</p><p className="mt-1 font-mono font-semibold">{String(payload[0]?.value ?? 0)} clics</p></div> : null} />
      <Area type="linear" dataKey="clicks" stroke="var(--primary)" strokeWidth={2.5} fill="var(--primary)" fillOpacity={0.09} isAnimationActive={false} />
    </AreaChart></ResponsiveContainer>
  </div>;
}

export function DeviceRing({ rows, total }: { rows: { name: string; count: number }[]; total: number }) {
  const circumference = 2 * Math.PI * 66;
  let offset = 0;
  return <svg viewBox="0 0 180 180" role="img" aria-label={`${total} clics por dispositivo`} className="size-40 shrink-0">
    <circle cx="90" cy="90" r="66" fill="none" stroke="var(--border)" strokeWidth="15" />
    {rows.map((row, index) => { const length = total ? row.count / total * circumference : 0; const start = offset; offset += length; return <circle key={row.name} cx="90" cy="90" r="66" fill="none" stroke="currentColor" strokeWidth="15" strokeDasharray={`${Math.max(0, length - 3)} ${circumference}`} strokeDashoffset={-start} transform="rotate(-90 90 90)" className={["text-primary", "text-chart-3", "text-chart-4"][index % 3]} />; })}
    <text x="90" y="88" textAnchor="middle" className="fill-foreground font-display text-3xl font-semibold">{total}</text><text x="90" y="109" textAnchor="middle" className="fill-muted-foreground font-sans text-xs">clics</text>
  </svg>;
}