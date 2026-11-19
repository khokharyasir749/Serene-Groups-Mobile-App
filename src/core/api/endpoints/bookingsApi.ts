import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope, PaginatedResponse } from "@/core/api/types/api";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import type {
  Booking,
  BookingFilters,
  BookingListItem,
  BookingStats,
  BookingStatus,
  CreateBookingPayload,
} from "@/features/bookings/types";

const LIST = { type: TAGS.Booking, id: "LIST" } as const;

export const bookingsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listBookings: build.query<PaginatedResponse<BookingListItem>, BookingFilters>({
      query: (params) => ({ url: ENDPOINTS.bookings, params }),
      transformResponse: (res: ApiEnvelope<PaginatedResponse<BookingListItem>>) => res.data,
      providesTags: (result) => [LIST, ...(result?.items ?? []).map((b) => ({ type: TAGS.Booking, id: b.id }))],
    }),
    getBooking: build.query<Booking, string>({
      query: (id) => ENDPOINTS.booking(id),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      providesTags: (_r, _e, id) => [{ type: TAGS.Booking, id }],
    }),
    createBooking: build.mutation<Booking, CreateBookingPayload>({
      query: (body) => ({ url: ENDPOINTS.bookings, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      invalidatesTags: [LIST, TAGS.BookingStats, TAGS.PaymentSummary],
    }),
    updateBookingStatus: build.mutation<Booking, { id: string; status: BookingStatus }>({
      query: ({ id, status }) => ({ url: ENDPOINTS.booking(id), method: "PATCH", body: { status } }),
      transformResponse: (res: ApiEnvelope<Booking>) => res.data,
      invalidatesTags: (_r, _e, { id }) => [{ type: TAGS.Booking, id }, LIST, TAGS.BookingStats, TAGS.PaymentSummary],
    }),
    getBookingStats: build.query<BookingStats, void>({
      query: () => ENDPOINTS.bookingStats,
      transformResponse: (res: ApiEnvelope<BookingStats>) => res.data,
      providesTags: [TAGS.BookingStats],
    }),
  }),
});

export const {
  useListBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingStatusMutation,
  useGetBookingStatsQuery,
} = bookingsApi;
