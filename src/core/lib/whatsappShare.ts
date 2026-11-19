import { Linking } from "react-native";
import { CONTACT, GROUP, projectName } from "@/core/constants/serene";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import type { Booking } from "@/features/bookings/types";

/** Pakistani mobile ("0300 1234567" / "+92 300 …") → wa.me digits ("923001234567"). */
export function toWhatsAppDigits(phone: string | null | undefined): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92")) return digits;
  if (digits.startsWith("0")) return `92${digits.slice(1)}`;
  return digits.length ? digits : null;
}

export function bookingMessage(b: Booking): string {
  const next = b.nextDue
    ? `Next instalment: ${formatPKR(b.nextDue.amount)} due ${formatDate(b.nextDue.dueDate)}`
    : "All instalments cleared";
  return [
    `*${GROUP.name}* — Booking ${b.reference}`,
    `Project: ${projectName(b.project)} · ${b.unitLabel}${b.units > 1 ? ` × ${b.units}` : ""}`,
    `Total: ${formatPKR(b.totalPrice)}`,
    `Down payment: ${formatPKR(b.downPayment)}`,
    `Monthly: ${formatPKR(b.monthlyInstallment)} × ${b.months}`,
    `Paid so far: ${formatPKR(b.paidTotal)} · Outstanding: ${formatPKR(b.outstanding)}`,
    next,
    `Questions? ${GROUP.whatsapp}`,
  ].join("\n");
}

/** One tap: opens WhatsApp to the customer when their number is visible, otherwise the contact picker. */
export async function shareBookingOnWhatsApp(b: Booking): Promise<void> {
  const digits = toWhatsAppDigits(b.customer.phone);
  const text = encodeURIComponent(bookingMessage(b));
  await Linking.openURL(`https://wa.me/${digits ?? ""}?text=${text}`);
}

/** Opens the group WhatsApp line with a pre-filled enquiry (web whatsapp(text)). */
export const openWhatsApp = (text?: string) =>
  Linking.openURL(text ? `${CONTACT.whatsappHref}?text=${encodeURIComponent(text)}` : CONTACT.whatsappHref);
