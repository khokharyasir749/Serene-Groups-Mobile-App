import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useGetBookingQuery, useListBookingsQuery } from "@/core/api/endpoints/bookingsApi";
import { useRecordPaymentMutation } from "@/core/api/endpoints/paymentsApi";
import { useDebounce } from "@/core/hooks/useDebounce";
import { parseError } from "@/core/lib/errorParser";
import { todayISO } from "@/core/lib/plan";
import { toast } from "@/core/stores/uiStore";
import { recordPaymentSchema, type RecordPaymentValues } from "../schemas/payment.schema";

export function useRecordPaymentForm(initialBookingId?: string) {
  const form = useForm<RecordPaymentValues>({
    resolver: zodResolver(recordPaymentSchema),
    defaultValues: { bookingId: initialBookingId ?? "", amount: "", method: "bank_transfer", receiptRef: "", paidAt: todayISO(), note: "" },
  });
  const [search, setSearch] = useState("");
  const q = useDebounce(search.trim());
  const bookingId = form.watch("bookingId");

  const { data: candidates } = useListBookingsQuery({ page: 1, limit: 5, search: q || undefined }, { skip: !!bookingId });
  const { data: booking } = useGetBookingQuery(bookingId, { skip: !bookingId });
  const [record, { isLoading }] = useRecordPaymentMutation();

  const submit = form.handleSubmit(async (v) => {
    const amount = Math.round(Number(v.amount.replace(/,/g, "")));
    if (booking && amount > booking.outstanding) {
      form.setError("amount", { message: "Amount exceeds the outstanding balance" });
      return;
    }
    try {
      const p = await record({ bookingId: v.bookingId, amount, method: v.method, receiptRef: v.receiptRef.trim(), paidAt: v.paidAt, note: v.note || undefined }).unwrap();
      toast(`Payment recorded · ${p.receiptRef ?? ""}`, "success");
      router.replace({ pathname: "/booking/[id]", params: { id: v.bookingId } });
    } catch (e) {
      toast(parseError(e), "danger");
    }
  });

  return {
    form,
    booking,
    candidates: candidates?.items ?? [],
    search,
    setSearch,
    pickBooking: (id: string) => form.setValue("bookingId", id, { shouldValidate: true }),
    clearBooking: () => form.setValue("bookingId", ""),
    payNextDue: () => booking?.nextDue && form.setValue("amount", String(booking.nextDue.amount)),
    isLoading,
    submit,
  };
}
