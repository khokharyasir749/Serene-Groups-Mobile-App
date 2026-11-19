import { Screen } from "@/core/components/Screen";
import { usePermissions } from "@/core/hooks/usePermissions";
import { P } from "@/core/constants/api";
import { StayDiscovery } from "@/features/home/components/StayDiscovery";
import { ConciergeCard } from "@/features/stays/components/ConciergeCard";
import { MyStays } from "@/features/stays/components/MyStays";
import { router } from "expo-router";
import { HeaderAction } from "@/core/components/FloatingHeader";

// Serene Booking: open to everyone. Signing in is asked only when someone reserves (see ReserveSheet).
export default function StayScreen() {
  const { has } = usePermissions();
  return (
    <Screen
      title="Serene Booking"
      right={has(P.BOOKINGS_READ) ? <HeaderAction label="Staff" onPress={() => router.push("/staff/bookings")} /> : undefined}
    >
      <MyStays />
      <StayDiscovery />
      <ConciergeCard />
    </Screen>
  );
}

