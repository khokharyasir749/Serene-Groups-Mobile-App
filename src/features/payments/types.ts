import type { ProjectSlug } from "@/core/constants/serene";

export type InstallmentStatus = "paid" | "partial" | "due" | "overdue" | "upcoming";

export type Installment = {
  /** 0 = down payment, 1..N = monthly instalments. */
  no: number;
  label: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  status: InstallmentStatus;
};

export type PaymentKind = "down" | "installment";
export type PaymentMethod = "cash" | "bank_transfer" | "cheque" | "online";

export type Payment = {
  id: string;
  bookingId: string;
  reference: string;
  customerName: string;
  project: ProjectSlug;
  amount: number;
  method: PaymentMethod;
  receiptRef: string | null;
  paidAt: string;
  kind: PaymentKind;
  installmentNo: number | null;
};

export type DueInstallment = {
  bookingId: string;
  reference: string;
  customerName: string;
  project: ProjectSlug;
  no: number;
  label: string;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
};

export type PaymentSummary = {
  collected: number;
  outstanding: number;
  overdueAmount: number;
  overdueCount: number;
  dueThisWeekAmount: number;
  collectedByProject: { project: ProjectSlug; collected: number }[];
  dueInstallments: DueInstallment[];
};

export type PaymentFilters = {
  page: number;
  limit: number;
  search?: string;
  project?: ProjectSlug;
  kind?: PaymentKind;
  method?: PaymentMethod;
};

export type RecordPaymentPayload = {
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  receiptRef: string;
  paidAt: string;
  note?: string;
};

/** Result of the 30% down + 36 monthly instalments calculation. */
export type PlanBreakdown = {
  total: number;
  down: number;
  monthly: number;
  months: number;
  /** Final instalment absorbs rounding so down + all instalments === total. */
  lastMonthly: number;
  amounts: number[];
};
