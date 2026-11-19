import { useRef } from "react";
import { StyleSheet, View, type ScrollViewInstance } from "react-native";
import { router } from "expo-router";
import { useGetPaymentSummaryQuery } from "@/core/api/endpoints/paymentsApi";
import { Button } from "@/core/components/Button";
import { AccountButton } from "@/core/components/AccountButton";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";
import { InvestorGate } from "@/features/portfolio/components/InvestorGate";
import { PortfolioView } from "@/features/portfolio/components/PortfolioView";
import { WealthCalculator } from "@/features/payments/components/WealthCalculator";
import { LedgerBanner } from "@/features/payments/components/LedgerBanner";

// Serene Investors: sign-in is required up front. Investors see their own portfolio; staff get the ledger console.
export default function InvestorsScreen() {
  const { has } = usePermissions();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const staff = has(P.PAYMENTS_READ);
  const investor = has(P.PORTFOLIO_READ);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const calcY = useRef(0);
  const { data: summary } = useGetPaymentSummaryQuery(undefined, { skip: !staff });

  return (
    <Screen scrollRef={scrollRef} title="Serene Investors" right={<AccountButton />}>
      {!authed || (!staff && !investor) ? (
        <InvestorGate signedInAsOther={authed} />
      ) : staff ? (
        <View style={{ gap: spacing.lg }}>
          <LedgerBanner summary={summary} />
          <View style={styles.actions}>
            <View style={styles.flex}>
              <Button compact height={52} label="Staff Ledger" onPress={() => router.push("/staff/ledger")} />
            </View>
            <View style={styles.flex}>
              <Button compact height={52} variant="secondary" label="Plan Calculator" onPress={() => scrollRef.current?.scrollTo({ y: calcY.current + spacing.lg - 8, animated: true })} />
            </View>
          </View>
          <View onLayout={(e) => (calcY.current = e.nativeEvent.layout.y)}>
            <WealthCalculator />
          </View>
        </View>
      ) : (
        <PortfolioView />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({ actions: { flexDirection: "row", gap: spacing.sm }, flex: { flex: 1 } });
