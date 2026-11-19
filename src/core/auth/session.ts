// Session lifecycle: boot hydration, single-flight refresh, logout cleanup, forced-logout redirect.
// Together with baseApi.ts this is the only place allowed to touch the network transport.
import { router } from "expo-router";
import { DEVICE_HEADER, ENDPOINTS, PLATFORM_HEADER } from "@/core/constants/api";
import { MOCK_ENABLED, mockFetch } from "@/core/api/mockServer";
import type { ApiEnvelope, AuthPayload } from "@/core/api/types/api";
import { clearRefreshToken, getDeviceId, getRefreshToken, setRefreshToken } from "@/core/auth/secureStore";
import { useAuthStore } from "@/core/stores/authStore";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api/v1").replace(/\/$/, "");
export const isMockMode = MOCK_ENABLED;

/** The one transport function. Swaps to the in-memory mock server in dev when mock mode is on. */
export const transportFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> =>
  MOCK_ENABLED ? mockFetch(input, init) : fetch(input, init);

export type RefreshResult = { ok: true } | { ok: false; message: string; network: boolean };

const SESSION_EXPIRED = "Your session has expired. Please sign in again.";
const clearHooks: Array<() => void> = [];

/** Lets the Redux store reset its RTK Query cache whenever the session is cleared. */
export const onSessionCleared = (fn: () => void) => {
  clearHooks.push(fn);
};

export async function establishSession(payload: AuthPayload) {
  await setRefreshToken(payload.refreshToken);
  useAuthStore.getState().setSession({
    accessToken: payload.accessToken,
    user: payload.user,
    permissions: payload.permissions,
  });
}

let inflight: Promise<RefreshResult> | null = null;

/** Single-flight: concurrent 401s all await the same refresh call. */
export function refreshSession(): Promise<RefreshResult> {
  if (!inflight) {
    inflight = doRefresh().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}

async function doRefresh(): Promise<RefreshResult> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return { ok: false, message: SESSION_EXPIRED, network: false };
  try {
    const res = await transportFetch(`${API_URL}${ENDPOINTS.refresh}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        [DEVICE_HEADER]: await getDeviceId(),
        [PLATFORM_HEADER]: "mobile",
      },
      body: JSON.stringify({ refreshToken }),
    });
    const body = (await res.json().catch(() => null)) as ApiEnvelope<AuthPayload> | null;
    if (!res.ok || !body?.data) {
      return { ok: false, message: body?.message || SESSION_EXPIRED, network: false };
    }
    await establishSession(body.data);
    return { ok: true };
  } catch {
    return { ok: false, message: "Can't reach the server. Check your connection.", network: true };
  }
}

/** App boot: trade the stored refresh token for a fresh access token. Never throws. */
export async function hydrateSession() {
  const store = useAuthStore.getState();
  if (store.hydrated) return;
  const result = await refreshSession();
  if (!result.ok && !result.network && (await getRefreshToken())) {
    // Server rejected the stored token: it's dead, drop it and show why.
    await clearRefreshToken();
    useAuthStore.getState().setLogoutReason(result.message);
  } else if (!result.ok && result.network) {
    useAuthStore.getState().setLogoutReason(result.message);
  }
  useAuthStore.getState().setHydrated(true);
}

/** Wipes SecureStore + Zustand + the RTK cache. */
export async function clearSession(reason: string | null = null) {
  await clearRefreshToken();
  useAuthStore.getState().reset(reason);
  clearHooks.forEach((fn) => fn());
}

/** Server-forced logout (refresh failed): clear everything and return to the public app with the server's message. */
export async function forceLogout(message: string) {
  await clearSession(message);
  try {
    router.replace("/");
  } catch {
    // Router not mounted yet; the (app) layout guard will redirect.
  }
}
