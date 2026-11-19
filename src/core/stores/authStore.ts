import { create } from "zustand";
import type { AuthUser } from "@/core/api/types/api";

type AuthState = {
  /** Short-lived access token — memory only. */
  accessToken: string | null;
  user: AuthUser | null;
  permissions: string[];
  /** Server's message when the session was force-ended; shown on the login screen. */
  logoutReason: string | null;
  hydrated: boolean;
  setSession: (s: { accessToken: string; user: AuthUser; permissions: string[] }) => void;
  setProfile: (s: { user: AuthUser; permissions: string[] }) => void;
  setLogoutReason: (reason: string | null) => void;
  setHydrated: (v: boolean) => void;
  reset: (reason?: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  permissions: [],
  logoutReason: null,
  hydrated: false,
  setSession: ({ accessToken, user, permissions }) => set({ accessToken, user, permissions, logoutReason: null }),
  setProfile: ({ user, permissions }) => set({ user, permissions }),
  setLogoutReason: (logoutReason) => set({ logoutReason }),
  setHydrated: (hydrated) => set({ hydrated }),
  reset: (reason = null) => set({ accessToken: null, user: null, permissions: [], logoutReason: reason }),
}));
