import { Pill } from "@/core/components/Pill";
import type { UnitAvailability } from "../types";

/** "12 of 37 left" — turns red at sold out, amber when nearly gone. */
export function UnitAvailabilityBadge({ room }: { room: Pick<UnitAvailability, "units" | "available"> }) {
  const { available, units } = room;
  const tone = available <= 0 ? "danger" : available <= Math.ceil(units / 5) ? "warning" : "success";
  return <Pill label={available <= 0 ? "Sold out" : `${available} of ${units} left`} tone={tone} />;
}
