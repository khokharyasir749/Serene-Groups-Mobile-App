import type { Tone } from "@/core/constants/theme";
import type { BookingStatus } from "../types";

export const BOOKING_STATUSES: readonly BookingStatus[] = ["pending", "confirmed", "completed", "cancelled"];

export const BOOKING_STATUS_META: Record<BookingStatus, { label: string; tone: Tone }> = {
  pending: { label: "Pending", tone: "warning" },
  confirmed: { label: "Confirmed", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};
