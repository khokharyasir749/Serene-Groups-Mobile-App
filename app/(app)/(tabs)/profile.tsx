import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { ProfileView } from "@/features/auth/components/ProfileView";

// Profile: everyone can open it. Signed out it offers sign-in; signed in it lists only what the role may use.
export default function ProfileScreen() {
  return (
    <Screen brand>
      <PermissionGate permission={P.DASHBOARD_READ} fallback={<ProfileView />}>
        <ProfileView />
      </PermissionGate>
    </Screen>
  );
}
