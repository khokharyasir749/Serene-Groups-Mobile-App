import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope } from "@/core/api/types/api";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import type { UnitAvailability } from "@/features/bookings/types";

/** Endpoints anyone can call without signing in. */
export const publicApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAvailability: build.query<UnitAvailability[], void>({
      query: () => ENDPOINTS.availability,
      transformResponse: (res: ApiEnvelope<UnitAvailability[]>) => res.data,
      providesTags: [TAGS.Availability],
    }),
  }),
});

export const { useGetAvailabilityQuery } = publicApi;
