import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
const today = () => new Date().toISOString().slice(0, 10);

/** Availability enquiry — same shape as serene-group-web/_lib/bookingSchema.ts. */
export const stayEnquirySchema = z
  .object({
    checkIn: isoDate.refine((d) => d >= today(), "Check-in can't be in the past"),
    checkOut: isoDate,
    adults: z.number().int().min(1).max(4),
  })
  .refine((v) => v.checkOut > v.checkIn, { path: ["checkOut"], message: "Check-out must be after check-in" });

export type StayEnquiry = z.infer<typeof stayEnquirySchema>;
