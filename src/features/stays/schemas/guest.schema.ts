import { z } from "zod";

export const guestDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+92|0)3\d{2}[- ]?\d{7}$/, "Enter a valid mobile number, e.g. 0300-1234567"),
});

export const otpCodeSchema = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code");
