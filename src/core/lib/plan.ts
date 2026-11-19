// Pure plan maths: 30% down + 36 monthly instalments = 100% of the total, to the rupee.
import { PLAN_RULES } from "@/core/constants/serene";
import type { PlanBreakdown } from "@/features/payments/types";

export function buildPlan(total: number): PlanBreakdown {
  const { downPercent, months } = PLAN_RULES;
  const safe = Math.max(0, Math.round(total));
  const down = Math.round((safe * downPercent) / 100);
  const remaining = safe - down;
  const monthly = Math.round(remaining / months);
  const lastMonthly = remaining - monthly * (months - 1);
  const amounts = [down, ...Array.from({ length: months }, (_, i) => (i === months - 1 ? lastMonthly : monthly))];
  return { total: safe, down, monthly, months, lastMonthly, amounts };
}

export const planSum = (plan: PlanBreakdown) => plan.amounts.reduce((a, b) => a + b, 0);

/** ISO date `n` months after `iso`, clamping the day (31 Jan + 1 month = 28/29 Feb). */
export function addMonthsISO(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const target = new Date(y, m - 1 + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(d, last));
  return toISO(target);
}

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const todayISO = () => toISO(new Date());
