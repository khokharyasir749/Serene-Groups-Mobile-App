import type { ProjectSlug } from "@/core/constants/serene";
import type { Installment } from "@/features/payments/types";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type BookingCustomer = {
  name: string;
  /** null when the server masks it for this role. */
  phone: string | null;
  cnic: string | null;
};

export type BookingListItem = {
  id: string;
  reference: string;
  project: ProjectSlug;
  unitType: string;
  unitLabel: string;
  units: number;
  planId: string;
  customer: BookingCustomer;
  status: BookingStatus;
  totalPrice: number;
  downPayment: number;
  monthlyInstallment: number;
  months: number;
  paidTotal: number;
  outstanding: number;
  overdueCount: number;
  nextDue: { no: number; dueDate: string; amount: number } | null;
  createdAt: string;
  startDate: string;
  notes: string | null;
};

export type Booking = BookingListItem & { installments: Installment[] };

export type BookingFilters = {
  page: number;
  limit: number;
  search?: string;
  project?: ProjectSlug;
  status?: BookingStatus;
};

export type CreateBookingPayload = {
  customerName: string;
  phone: string;
  cnic: string;
  project: ProjectSlug;
  unitType: string;
  planId: string;
  units: number;
  totalPrice: number;
};

export type UnitAvailability = { slug: string; name: string; units: number; booked: number; available: number };

export type BookingStats = {
  totals: { bookings: number; active: number; pending: number; cancelled: number; contractValue: number };
  byProject: { project: ProjectSlug; bookings: number; value: number }[];
  inventory: {
    project: ProjectSlug;
    totalUnits: number;
    bookedUnits: number;
    availableUnits: number;
    rooms: UnitAvailability[];
  };
};
