import { PermissionGate } from "@/core/components/PermissionGate";
import { P } from "@/core/constants/api";
import { HubPage } from "@/features/home/components/HubPage";

// Serene Group master hub. Visible to every role; the live-pulse section inside is permission-gated.
export default function HubScreen() {
  return (
    <PermissionGate permission={P.DASHBOARD_READ} fallback={<HubPage />}>
      <HubPage />
    </PermissionGate>
  );
}
