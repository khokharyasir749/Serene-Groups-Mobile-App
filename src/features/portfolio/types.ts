import type { BookingListItem } from "@/features/bookings/types";
import type { Payment } from "@/features/payments/types";

export type PortfolioTotals = {
  invested: number;
  paid: number;
  outstanding: number;
  overdueCount: number;
  nextDue: { no: number; dueDate: string; amount: number } | null;
};

/** An investor's own holdings — the server scopes this to the signed-in account. */
export type Portfolio = {
  investor: { name: string };
  holdings: BookingListItem[];
  payments: Payment[];
  totals: PortfolioTotals;
};
