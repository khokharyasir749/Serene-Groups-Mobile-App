import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope } from "@/core/api/types/api";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import type { Portfolio } from "@/features/portfolio/types";

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyPortfolio: build.query<Portfolio, void>({
      query: () => ENDPOINTS.portfolio,
      transformResponse: (res: ApiEnvelope<Portfolio>) => res.data,
      providesTags: [TAGS.Portfolio],
    }),
  }),
});

export const { useGetMyPortfolioQuery } = portfolioApi;
