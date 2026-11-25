import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { Anchor, ScrollTargets } from "@/features/home/components/scrollTarget";
import { StayAmenities, StayIntro, StayRooms } from "@/features/home/components/StayDiscovery";
import { ConciergeCard } from "@/features/stays/components/ConciergeCard";
import { MyStays } from "@/features/stays/components/MyStays";

// Serene Booking: open to everyone. Signing in is asked only when someone reserves (see ReserveSheet).
export default function StayScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);
  return (
    <ScrollTargets scrollRef={scrollRef}>
      <Screen brand scrollRef={scrollRef}>
        <StayIntro />
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
        <ConciergeCard />
      </Screen>
    </ScrollTargets>
  );
}
