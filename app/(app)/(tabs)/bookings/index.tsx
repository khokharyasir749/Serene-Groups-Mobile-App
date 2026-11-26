import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { PermissionGate } from "@/core/components/PermissionGate";
import { P } from "@/core/constants/api";
import { ExploreScreen } from "@/features/home/components/ExploreScreen";
import { GroupFooter } from "@/features/home/components/GroupFooter";
import { Anchor } from "@/features/home/components/scrollTarget";
import { StayAmenities, StayHero, StayRooms, StayShortcuts } from "@/features/home/components/StayDiscovery";
import { MyStays } from "@/features/stays/components/MyStays";

// Stay: open to everyone. Signing in is asked only when someone reserves (see ReserveSheet).
export default function StayScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  return (
    <ExploreScreen scrollRef={scrollRef} hero={(h) => <StayHero height={h} />} share={0.71}>
      <StayShortcuts />
      {/* Any signed-in role can reserve, so any signed-in role sees its own reservations. */}
      <PermissionGate permission={[P.MY_STAYS, P.BOOKINGS_READ, P.PORTFOLIO_READ]}>
        <MyStays />
      </PermissionGate>
      <Anchor id="suites">
        <StayRooms />
      </Anchor>
      <Anchor id="amenities">
        <StayAmenities />
      </Anchor>
      <GroupFooter />
    </ExploreScreen>
  );
}
