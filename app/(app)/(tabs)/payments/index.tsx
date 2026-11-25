import { useRef } from "react";
import type { ScrollViewInstance } from "react-native";
import { useGetPaymentSummaryQuery } from "@/core/api/endpoints/paymentsApi";
import { Screen } from "@/core/components/Screen";
import { SectionHeader } from "@/core/components/SectionHeader";
import { P } from "@/core/constants/api";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";
import { InvestorGate } from "@/features/portfolio/components/InvestorGate";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";
import { WealthCalculator } from "@/features/payments/components/WealthCalculator";
import { InvestorReasons } from "@/features/payments/components/InvestorReasons";
import { StaffTiles } from "@/features/payments/components/StaffTiles";
import { Anchor, ScrollTargets } from "@/features/home/components/scrollTarget";
import { LedgerSummary } from "@/features/payments/components/LedgerSummary";

// Serene Investors: sign-in is required up front. Investors see their own portfolio; staff get the ledger console.
export default function InvestorsScreen() {
  const { has } = usePermissions();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const staff = has(P.PAYMENTS_READ);
  const investor = has(P.PORTFOLIO_READ);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const { data: summary } = useGetPaymentSummaryQuery(undefined, { skip: !staff });

  const body =
    !authed || (!staff && !investor) ? (
      <InvestorGate signedInAsOther={authed} />
    ) : staff ? (
      <>
        <SectionHeader eyebrow="Serene Investors" title="The ledger," soft="at a glance." />
        <StaffTiles />
        <LedgerSummary summary={summary} />
      </>
    ) : (
      <PortfolioView />
    );
  return (
    <ScrollTargets scrollRef={scrollRef}>
      <Screen brand scrollRef={scrollRef}>
        {body}
        {staff ? (
          <Anchor id="calculator">
            <WealthCalculator />
          </Anchor>
        ) : null}
        {!authed || (!staff && !investor) ? (
          <Anchor id="reasons">
            <InvestorReasons />
          </Anchor>
        ) : null}
      </Screen>
    </ScrollTargets>
  );
}
