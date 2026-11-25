import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { useGetBookingStatsQuery } from "@/core/api/endpoints/bookingsApi";
import { useGetPaymentSummaryQuery } from "@/core/api/endpoints/paymentsApi";
import { PermissionGate } from "@/core/components/PermissionGate";
import { P } from "@/core/constants/api";
import { usePermissions } from "@/core/hooks/usePermissions";
import { AltitudeStory } from "./AltitudeStory";
import { CommandCard } from "./CommandCard";
import { EntryGrid } from "./EntryGrid";
import { ExploreScreen } from "./ExploreScreen";
import { ForYou } from "./ForYou";
import { GroupFooter } from "./GroupFooter";
import { Reveal } from "./pageScroll";
import { ProjectStage } from "./ProjectStage";
import { SeasonMosaic } from "./SeasonMosaic";
import { SharePlanner } from "./SharePlanner";
import { SuiteGallery } from "./SuiteGallery";

/** Serene Group — the public front door: a stay search over the resort, every way in, then the group told in chapters. */
export function HubPage() {
  const { has } = usePermissions();
  const staff = has(P.BOOKINGS_READ);
  const ledger = has(P.PAYMENTS_READ);
  const stats = useGetBookingStatsQuery(undefined, { skip: !staff });
  const pay = useGetPaymentSummaryQuery(undefined, { skip: !ledger });
  const scrollRef = useRef<ScrollViewInstance>(null);
  // Only staff have live figures on this page, so only they can pull to refresh.
  const refresh = () => {
    if (staff) void stats.refetch();
    if (ledger) void pay.refetch();
  };

  return (
    <ExploreScreen scrollRef={scrollRef} onRefresh={staff || ledger ? refresh : undefined} refreshing={stats.isFetching || pay.isFetching}>
      <ForYou />
      <EntryGrid />
      <PermissionGate permission={P.BOOKINGS_READ}>
        <CommandCard stats={stats.data} payments={pay.data} />
      </PermissionGate>
      <ProjectStage />
      <AltitudeStory />
      <Reveal>
        <SuiteGallery />
      </Reveal>
      <Reveal>
        <SeasonMosaic />
      </Reveal>
      <Reveal>
        <SharePlanner />
      </Reveal>
      <GroupFooter />
    </ExploreScreen>
  );
}
