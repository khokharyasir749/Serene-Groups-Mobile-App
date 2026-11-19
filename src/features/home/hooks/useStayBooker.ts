import { useState } from "react";
import { formatDate } from "@/core/lib/formatDate";
import { toISO } from "@/core/lib/plan";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { stayEnquirySchema } from "../schemas/stay.schema";

const plusDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

const ARRIVAL_IN_DAYS = 14;
const NIGHTS = 2;

/** Check in / check out / guests → a pre-filled WhatsApp enquiry (what the web does until Serene Booking is live). */
export function useStayBooker() {
  const [checkIn, setCheckIn] = useState(plusDays(ARRIVAL_IN_DAYS));
  const [checkOut, setCheckOut] = useState(plusDays(ARRIVAL_IN_DAYS + NIGHTS));
  const [adults, setAdults] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const parsed = stayEnquirySchema.safeParse({ checkIn, checkOut, adults });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your dates");
      return;
    }
    setError(null);
    const v = parsed.data;
    const plural = v.adults > 1 ? "s" : "";
    void openWhatsApp(
      `Hello Serene Heights, I'd like to book a hotel apartment in Nathia Gali from ${formatDate(v.checkIn)} to ${formatDate(v.checkOut)} for ${v.adults} adult${plural}. Is it available?`,
    );
  };

  return { checkIn, setCheckIn, checkOut, setCheckOut, adults, setAdults, error, submit };
}
