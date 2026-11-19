/** "PKR 26,680,000"; null/undefined (server-masked) renders "—". */
export function formatPKR(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return `PKR ${Math.round(value).toLocaleString("en-US")}`;
}

/** The way people here say it: "2.25 lakh", "2.67 crore". Under a lakh stays exact. */
export function spokenPKR(n: number): string {
  const two = (x: number) => String(Number(x.toFixed(2)));
  if (n >= 10_000_000) return `${two(n / 10_000_000)} crore`;
  if (n >= 100_000) return `${two(n / 100_000)} lakh`;
  return Math.round(n).toLocaleString("en-US");
}

/** Compact form for KPI tiles: "PKR 26.7M". */
export function formatPKRCompact(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `PKR ${(value / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `PKR ${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `PKR ${(value / 1_000).toFixed(0)}K`;
  return `PKR ${Math.round(value)}`;
}
