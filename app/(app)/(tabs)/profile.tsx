import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { PermissionGate } from "@/core/components/PermissionGate";
import { P } from "@/core/constants/api";
import { ProfileHero, ProfileView } from "@/features/auth/components/ProfileView";
import { ExploreScreen } from "@/features/home/components/ExploreScreen";
import { GroupFooter } from "@/features/home/components/GroupFooter";

// Profile: everyone can open it. Signed out it offers sign-in; signed in it lists only what the role may use.
export default function ProfileScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  return (
    <ExploreScreen scrollRef={scrollRef} hero={(h) => <ProfileHero height={h} />} share={0.52}>
      <PermissionGate permission={P.DASHBOARD_READ} fallback={<ProfileView />}>
        <ProfileView />
      </PermissionGate>
      <GroupFooter />
    </ExploreScreen>
  );
}
