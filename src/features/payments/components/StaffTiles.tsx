import { router } from "expo-router";
import { QuickRow } from "@/core/components/QuickRow";
import type { Tile } from "@/core/components/TileRail";
import { P } from "@/core/constants/api";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useScrollTo } from "@/features/home/components/scrollTarget";

/** Staff ways in: only what the role may use. `calculator` scrolls when the page has one, otherwise opens it. */
export function StaffTiles({ inPage = true }: { inPage?: boolean }) {
  const { has } = usePermissions();
  const toCalculator = useScrollTo("calculator");
  const tiles: Tile[] = [];
  if (has(P.PAYMENTS_READ)) tiles.push({ label: "Ledger", icon: "receipt-text", go: () => router.push("/staff/ledger") });
  if (has(P.BOOKINGS_READ)) tiles.push({ label: "Bookings", icon: "clipboard-text", go: () => router.push("/staff/bookings") });
  if (has(P.PAYMENTS_RECORD)) tiles.push({ label: "Record", icon: "cash-plus", go: () => router.push("/record-payment") });
  if (has(P.BOOKINGS_CREATE)) tiles.push({ label: "New", icon: "calendar-plus", go: () => router.push("/new-booking") });
  tiles.push({ label: "Calculator", icon: "calculator", go: inPage ? toCalculator : () => router.push("/calculator") });
  return <QuickRow tiles={tiles} />;
}
