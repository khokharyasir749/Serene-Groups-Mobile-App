import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { useGetPaymentSummaryQuery } from "@/core/api/endpoints/paymentsApi";
import { P } from "@/core/constants/api";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";
import { ExploreScreen } from "@/features/home/components/ExploreScreen";
import { GroupFooter } from "@/features/home/components/GroupFooter";
import { Anchor } from "@/features/home/components/scrollTarget";
import { SharePlanner } from "@/features/home/components/SharePlanner";
import { InvestorReasons } from "@/features/payments/components/InvestorReasons";
import { LedgerHero } from "@/features/payments/components/LedgerHero";
import { StaffTiles } from "@/features/payments/components/StaffTiles";
import { WealthCalculator } from "@/features/payments/components/WealthCalculator";
import { InvestorGate, InvestorGateHero } from "@/features/portfolio/components/InvestorGate";
import { PortfolioHero, PortfolioView } from "@/features/portfolio/components/PortfolioView";

// Serene Investors: sign-in is required for a portfolio. Investors see their own; staff get the ledger console.
export default function InvestorsScreen() {
  const { has } = usePermissions();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const staff = has(P.PAYMENTS_READ);
  const investor = !staff && has(P.PORTFOLIO_READ);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { data: summary } = useGetPaymentSummaryQuery(undefined, { skip: !staff });

  if (staff)
    return (
      <ExploreScreen scrollRef={scrollRef} hero={(h) => <LedgerHero height={h} summary={summary} />} share={0.62}>
        <StaffTiles />
        <Anchor id="calculator">
          <WealthCalculator />
        </Anchor>
        <GroupFooter />
      </ExploreScreen>
    );
  if (investor)
    return (
      <ExploreScreen scrollRef={scrollRef} hero={(h) => <PortfolioHero height={h} />} share={0.62}>
        <PortfolioView />
        <GroupFooter />
      </ExploreScreen>
    );
  return (
    <ExploreScreen scrollRef={scrollRef} hero={(h) => <InvestorGateHero height={h} />} share={0.71}>
      <InvestorGate signedInAsOther={authed} />
      <SharePlanner onInvest />
      <Anchor id="reasons">
        <InvestorReasons />
      </Anchor>
      <GroupFooter />
    </ExploreScreen>
  );
}
