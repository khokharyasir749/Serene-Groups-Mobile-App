import { useRef } from "react";
import { StyleSheet, type ScrollViewInstance } from "react-native";
import { Text } from "@/core/components/Text";
import { useGetBookingStatsQuery } from "@/core/api/endpoints/bookingsApi";
import { useGetPaymentSummaryQuery } from "@/core/api/endpoints/paymentsApi";
import { useGetAvailabilityQuery } from "@/core/api/endpoints/publicApi";
import { FadeIn } from "@/core/components/FadeIn";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { fonts, groups, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { CommandCard } from "./CommandCard";
import { GroupFooter } from "./GroupFooter";
import { HeritageStrip } from "./HeritageStrip";
import { HeroShowcase } from "./HeroShowcase";
import { InvestTeaser } from "./InvestTeaser";
import { StoryCard } from "./StoryCard";
import { PillarRail } from "./PillarRail";
import { PropertyShowcase } from "./PropertyShowcase";
import { RoomShowcase } from "./RoomShowcase";
import { Anchor, ScrollTargets } from "./scrollTarget";

/** Serene Group — the public front door: four pillars up top, then compact, expandable detail. */
export function HubPage() {
  const { has } = usePermissions();
  const staff = has(P.BOOKINGS_READ);
  const stats = useGetBookingStatsQuery(undefined, { skip: !staff });
  const pay = useGetPaymentSummaryQuery(undefined, { skip: !has(P.PAYMENTS_READ) });
  const rooms = useGetAvailabilityQuery();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const refresh = () => {
    void rooms.refetch();
    if (staff) void stats.refetch();
    if (has(P.PAYMENTS_READ)) void pay.refetch();
  };

  return (
    <ScrollTargets scrollRef={scrollRef}>
      <Screen brand scrollRef={scrollRef} refreshing={rooms.isFetching} onRefresh={refresh}>
        <Anchor id="top">
        <FadeIn style={styles.welcome}>
          <Text style={styles.title}>
            {"One group.\n"}
            <Text style={styles.titleGold}>Every way in.</Text>
          </Text>
        </FadeIn>
        </Anchor>

        <PillarRail />
        <HeroShowcase />
        <HeritageStrip />

        <Anchor id="story">
          <StoryCard />
        </Anchor>

        <Anchor id="upcoming">
          <PropertyShowcase />
        </Anchor>

        <Anchor id="investors">
          <InvestTeaser />
        </Anchor>

        <RoomShowcase availability={rooms.data} />

        <PermissionGate permission={P.BOOKINGS_READ}>
          <CommandCard stats={stats.data} payments={pay.data} />
        </PermissionGate>
        <GroupFooter />
      </Screen>
    </ScrollTargets>
  );
}

const styles = StyleSheet.create({
  welcome: { gap: spacing.sm, marginBottom: -spacing.sm },
  titleGold: { color: groups.goldInk, fontFamily: fonts.displayItalic },
  title: { color: groups.pine, fontFamily: fonts.display, fontSize: 46, lineHeight: 50, letterSpacing: -0.6 },
});
