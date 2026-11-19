import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope, PaginatedResponse } from "@/core/api/types/api";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import type { Payment, PaymentFilters, PaymentSummary, RecordPaymentPayload } from "@/features/payments/types";

export const paymentsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listPayments: build.query<PaginatedResponse<Payment>, PaymentFilters>({
      query: (params) => ({ url: ENDPOINTS.payments, params }),
      transformResponse: (res: ApiEnvelope<PaginatedResponse<Payment>>) => res.data,
      providesTags: (result) => [
        { type: TAGS.Payment, id: "LIST" },
        ...(result?.items ?? []).map((p) => ({ type: TAGS.Payment, id: p.id })),
      ],
    }),
    getPaymentSummary: build.query<PaymentSummary, void>({
      query: () => ENDPOINTS.paymentSummary,
      transformResponse: (res: ApiEnvelope<PaymentSummary>) => res.data,
      providesTags: [TAGS.PaymentSummary],
    }),
    recordPayment: build.mutation<Payment, RecordPaymentPayload>({
      query: (body) => ({ url: ENDPOINTS.payments, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<Payment>) => res.data,
      // A payment changes the ledger, the booking's schedule + balances, and the dashboard numbers.
      invalidatesTags: (_r, _e, { bookingId }) => [
        { type: TAGS.Payment, id: "LIST" },
        TAGS.PaymentSummary,
        TAGS.BookingStats,
        { type: TAGS.Booking, id: bookingId },
        { type: TAGS.Booking, id: "LIST" },
      ],
    }),
  }),
});

export const { useListPaymentsQuery, useGetPaymentSummaryQuery, useRecordPaymentMutation } = paymentsApi;
