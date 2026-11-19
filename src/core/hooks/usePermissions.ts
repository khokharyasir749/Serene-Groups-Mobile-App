import { useCallback } from "react";
import { useAuthStore } from "@/core/stores/authStore";

export function usePermissions() {
  const permissions = useAuthStore((s) => s.permissions);
  const has = useCallback((key: string) => permissions.includes(key), [permissions]);
  const hasAny = useCallback((keys: readonly string[]) => keys.some((k) => permissions.includes(k)), [permissions]);
  return { permissions, has, hasAny };
}
