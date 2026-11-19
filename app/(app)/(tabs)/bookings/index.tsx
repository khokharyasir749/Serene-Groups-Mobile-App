import { PermissionGate } from "@/core/components/PermissionGate";
import { AccountButton } from "@/core/components/AccountButton";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { StayDiscovery } from "@/features/home/components/StayDiscovery";
import { ConciergeCard } from "@/features/stays/components/ConciergeCard";
import { MyStays } from "@/features/stays/components/MyStays";

// Serene Booking: open to everyone. Signing in is asked only when someone reserves (see ReserveSheet).
export default function StayScreen() {
  return (
    <Screen title="Serene Booking" right={<AccountButton />}>
      {/* Any signed-in role can reserve, so any signed-in role sees its own reservations. */}
      <PermissionGate permission={[P.MY_STAYS, P.BOOKINGS_READ, P.PORTFOLIO_READ]}>
        <MyStays />
      </PermissionGate>
      <StayDiscovery />
      <ConciergeCard />
    </Screen>
  );
}

