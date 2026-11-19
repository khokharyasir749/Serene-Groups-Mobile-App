import { z } from "zod";
import { CUSTOM_PLAN_ID, MAX_UNITS_PER_BOOKING, PROJECT_SLUGS } from "@/core/constants/serene";

/** Form values are strings (TextInput); `toBookingPayload` converts them to the server shape. */
export const bookingFormSchema = z
  .object({
    customerName: z.string().trim().min(2, "Enter the customer's full name"),
    phone: z
      .string()
      .trim()
      .regex(/^(\+92|0)3\d{2}[- ]?\d{7}$/, "Enter a valid mobile number, e.g. 0300-1234567"),
    cnic: z
      .string()
      .trim()
      .regex(/^\d{5}-?\d{7}-?\d$/, "CNIC must be 13 digits"),
    project: z.enum(PROJECT_SLUGS),
    planId: z.string().min(1, "Choose a plan"),
    unitType: z.string().min(1, "Choose a unit type"),
    units: z
      .string()
      .regex(/^\d+$/, "Enter a whole number")
      .refine((v) => Number(v) >= 1 && Number(v) <= MAX_UNITS_PER_BOOKING, `Between 1 and ${MAX_UNITS_PER_BOOKING} units`),
    customTotal: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.planId !== CUSTOM_PLAN_ID) return;
    const amount = Number((v.customTotal ?? "").replace(/,/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      ctx.addIssue({ code: "custom", path: ["customTotal"], message: "Enter the total price in PKR" });
    }
  });

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
