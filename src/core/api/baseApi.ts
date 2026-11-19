import { createApi, fetchBaseQuery, retry, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { DEVICE_HEADER, ENDPOINTS, PLATFORM_HEADER, TAG_TYPES } from "@/core/constants/api";
import { API_URL, forceLogout, refreshSession, transportFetch } from "@/core/auth/session";
import { getDeviceId } from "@/core/auth/secureStore";
import { useAuthStore } from "@/core/stores/authStore";

const rawQuery = fetchBaseQuery({
  baseUrl: API_URL,
  fetchFn: (req) => transportFetch(req),
  prepareHeaders: async (headers) => {
    const token = useAuthStore.getState().accessToken;
    if (token) headers.set("authorization", `Bearer ${token}`);
    headers.set(DEVICE_HEADER, await getDeviceId());
    headers.set(PLATFORM_HEADER, "mobile");
    return headers;
  },
});

const RETRYABLE = [429, 503];

/** Retries 429 / 503 with exponential backoff; every other error is returned immediately. */
const retryingQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = retry(
  async (args, api, extra) => {
    const result = await rawQuery(args, api, extra);
    if (result.error && !RETRYABLE.includes(result.error.status as number)) retry.fail(result.error);
    return result;
  },
  { maxRetries: 2 },
);

const AUTH_PATHS: string[] = [ENDPOINTS.login, ENDPOINTS.refresh, ENDPOINTS.otpRequest, ENDPOINTS.otpVerify];
const urlOf = (args: string | FetchArgs) => (typeof args === "string" ? args : args.url);

/** On 401: one shared refresh, then replay. If refresh fails → wipe + redirect with the server's message. */
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extra) => {
  let result = await retryingQuery(args, api, extra);
  if (result.error?.status === 401 && !AUTH_PATHS.includes(urlOf(args))) {
    const refreshed = await refreshSession();
    if (refreshed.ok) {
      result = await retryingQuery(args, api, extra);
    } else if (!refreshed.network) {
      const serverMessage = (result.error.data as { message?: string } | undefined)?.message;
      await forceLogout(refreshed.message || serverMessage || "Your session has ended. Please sign in again.");
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [...TAG_TYPES],
  endpoints: () => ({}),
});
