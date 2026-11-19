import type { ReactNode } from "react";
import { usePermissions } from "@/core/hooks/usePermissions";
import { EmptyState } from "./EmptyState";

type Props = {
  /** One permission key, or several — holding ANY of them is enough. */
  permission: string | readonly string[];
  children: ReactNode;
  /** Rendered when the permission is missing. Omit to render nothing (actions) or pass `"screen"` for a full notice. */
  fallback?: ReactNode | "screen";
};

export function PermissionGate({ permission, children, fallback = null }: Props) {
  const { has, hasAny } = usePermissions();
  const allowed = typeof permission === "string" ? has(permission) : hasAny(permission);
  if (allowed) return <>{children}</>;
  if (fallback === "screen") {
    return <EmptyState icon="lock-closed-outline" title="No access" message="Your role doesn't include permission to view this." />;
  }
  return <>{fallback}</>;
}
