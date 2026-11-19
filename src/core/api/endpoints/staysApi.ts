import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope } from "@/core/api/types/api";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import type { ReservePayload, Stay } from "@/features/stays/types";

export const staysApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listMyStays: build.query<Stay[], void>({
      query: () => ENDPOINTS.myStays,
      transformResponse: (res: ApiEnvelope<Stay[]>) => res.data,
      providesTags: [TAGS.Stay],
    }),
    reserveStay: build.mutation<Stay, ReservePayload>({
      query: (body) => ({ url: ENDPOINTS.stays, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<Stay>) => res.data,
      invalidatesTags: [TAGS.Stay, TAGS.Availability],
    }),
  }),
});

export const { useListMyStaysQuery, useReserveStayMutation } = staysApi;
