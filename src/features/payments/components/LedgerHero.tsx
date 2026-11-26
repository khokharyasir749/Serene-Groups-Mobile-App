import { formatPKRCompact } from "@/core/lib/formatPKR";
import { MoneyHero, PageHero } from "@/features/home/components/PageHero";
import type { PaymentSummary } from "../types";

/** The whole book at a glance, for staff. */
export function LedgerHero({ height, summary }: { height: number; summary: PaymentSummary | undefined }) {
  const book = summary ? summary.collected + summary.outstanding : 0;
  const rate = summary && book > 0 ? summary.collected / book : 0;
  return (
    <PageHero height={height}>
      <MoneyHero
        label="Total collected"
        value={formatPKRCompact(summary?.collected)}
        done={rate}
        note={summary ? `${Math.round(rate * 100)}% of the book` : " "}
        figures={[
          { label: "Outstanding", value: formatPKRCompact(summary?.outstanding) },
          { label: summary ? `Overdue (${summary.overdueCount})` : "Overdue", value: formatPKRCompact(summary?.overdueAmount), alert: Boolean(summary?.overdueCount) },
          { label: "This week", value: formatPKRCompact(summary?.dueThisWeekAmount) },
        ]}
      />
    </PageHero>
  );
}
