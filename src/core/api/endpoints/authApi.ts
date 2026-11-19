import { baseApi } from "@/core/api/baseApi";
import type { ApiEnvelope, AuthPayload, MePayload } from "@/core/api/types/api";
import { clearSession, establishSession } from "@/core/auth/session";
import { ENDPOINTS, TAGS } from "@/core/constants/api";
import { useAuthStore } from "@/core/stores/authStore";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<AuthPayload, { email: string; password: string }>({
      query: (body) => ({ url: ENDPOINTS.login, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<AuthPayload>) => res.data,
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        await establishSession(data);
      },
    }),
    requestOtp: build.mutation<null, { phone: string }>({
      query: (body) => ({ url: ENDPOINTS.otpRequest, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<null>) => res.data,
    }),
    verifyOtp: build.mutation<AuthPayload, { phone: string; code: string; name?: string }>({
      query: (body) => ({ url: ENDPOINTS.otpVerify, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<AuthPayload>) => res.data,
      async onQueryStarted(_arg, { queryFulfilled }) {
        const { data } = await queryFulfilled;
        await establishSession(data);
      },
    }),
    refresh: build.mutation<AuthPayload, { refreshToken: string }>({
      query: (body) => ({ url: ENDPOINTS.refresh, method: "POST", body }),
      transformResponse: (res: ApiEnvelope<AuthPayload>) => res.data,
    }),
    logout: build.mutation<null, void>({
      query: () => ({ url: ENDPOINTS.logout, method: "POST" }),
      transformResponse: (res: ApiEnvelope<null>) => res.data,
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          // Local sign-out must succeed even if the server call fails.
          await clearSession();
        }
      },
    }),
    me: build.query<MePayload, void>({
      query: () => ENDPOINTS.me,
      transformResponse: (res: ApiEnvelope<MePayload>) => res.data,
      providesTags: [TAGS.Auth],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          useAuthStore.getState().setProfile(data);
        } catch {
          // 401s are handled by baseApi's refresh flow.
        }
      },
    }),
  }),
});

export const { useRequestOtpMutation, useVerifyOtpMutation, useLoginMutation, useRefreshMutation, useLogoutMutation, useMeQuery } = authApi;
