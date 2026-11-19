import { z } from "zod";
import type { PaymentMethod } from "../types";

export const PAYMENT_METHODS: readonly PaymentMethod[] = ["bank_transfer", "cash", "cheque", "online"];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  bank_transfer: "Bank transfer",
  cash: "Cash",
  cheque: "Cheque",
  online: "Online",
};

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");

export const recordPaymentSchema = z.object({
  bookingId: z.string().min(1, "Choose a booking"),
  amount: z
    .string()
    .trim()
    .refine((v) => Number(v.replace(/,/g, "")) > 0, "Enter an amount in PKR"),
  method: z.enum(["bank_transfer", "cash", "cheque", "online"]),
  receiptRef: z.string().trim().min(3, "Enter the receipt reference"),
  paidAt: isoDate,
  note: z.string().optional(),
});

export type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;
