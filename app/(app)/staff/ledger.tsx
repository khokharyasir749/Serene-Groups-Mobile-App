import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Text } from "@/core/components/Text";
import { Redirect, router } from "expo-router";
import { useGetPaymentSummaryQuery, useListPaymentsQuery } from "@/core/api/endpoints/paymentsApi";
import { DataList } from "@/core/components/DataList";
import { Pager } from "@/core/components/Pager";
import { PermissionGate } from "@/core/components/PermissionGate";
import { HeaderAction } from "@/core/components/FloatingHeader";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { colors, fonts, letter, spacing } from "@/core/constants/theme";
import { parseError } from "@/core/lib/errorParser";
import { LedgerEntry } from "@/features/payments/components/LedgerEntry";
import { LedgerSummary } from "@/features/payments/components/LedgerSummary";
import { PaymentFilterBar } from "@/features/payments/components/PaymentFilterBar";
import { ReceiptSheet } from "@/features/payments/components/ReceiptSheet";
import type { Payment } from "@/features/payments/types";
import { usePaymentFilters } from "@/features/payments/hooks/usePaymentFilters";
import { useAuthStore } from "@/core/stores/authStore";

// Staff ledger: every payment, with filters and record-payment. Not part of the visitor or investor flow.
function StaffLedger() {
  const f = usePaymentFilters();
  const { data, isLoading, isFetching, error, refetch } = useListPaymentsQuery(f.args);
  const { data: summary } = useGetPaymentSummaryQuery();
  const [receipt, setReceipt] = useState<Payment | null>(null);
  // Month headings are inserted wherever the month changes (the list is newest first).
  const rows = useMemo(() => {
    let last = "";
    return (data?.items ?? []).map((p) => {
      const month = new Date(p.paidAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" }).toUpperCase();
      const heading = month !== last ? month : null;
      last = month;
      return { p, heading };
    });
  }, [data]);
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return (
    <Screen
      scroll={false}
      title="Staff · Ledger"
      onBack={back}
      right={
        <PermissionGate permission={P.PAYMENTS_RECORD}>
          <HeaderAction primary label="+ Record" onPress={() => router.push("/record-payment")} />
        </PermissionGate>
      }
    >
      <PermissionGate permission={P.PAYMENTS_READ} fallback="screen">
        <DataList
          data={data ? rows : undefined}
          keyExtractor={(r) => r.p.id}
          renderItem={(r) => (
            <>
              {r.heading ? <Text style={styles.month}>{r.heading}</Text> : null}
              <LedgerEntry payment={r.p} onPress={() => setReceipt(r.p)} />
            </>
          )}
          loading={isLoading}
          error={error ? parseError(error) : null}
          onRetry={refetch}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          emptyTitle="No payments yet"
          header={
            <>
              <LedgerSummary summary={summary} />
              <PaymentFilterBar f={f} />
              <Text style={styles.count}>{data ? `${data.total} RECEIPT${data.total === 1 ? "" : "S"}` : "RECEIPTS"}</Text>
            </>
          }
          footer={data ? <Pager page={data.page} totalPages={data.totalPages} total={data.total} onChange={f.setPage} /> : null}
        />
      </PermissionGate>
      <ReceiptSheet payment={receipt} onClose={() => setReceipt(null)} onOpenBooking={(id) => router.push({ pathname: "/booking/[id]", params: { id } })} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  month: { color: colors.pineBrand, fontFamily: fonts.uiBold, fontSize: 11, letterSpacing: letter.eyebrow, marginTop: spacing.md, marginBottom: spacing.sm },
  count: { color: colors.muted, fontFamily: fonts.uiBold, fontSize: 10, letterSpacing: letter.eyebrow },
});

// Staff consoles are signed-in only: signed-out visitors go to sign-in and come straight back here.
export default function StaffLedgerRoute() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  if (!authed) return <Redirect href={{ pathname: "/login", params: { next: "/staff/ledger" } }} />;
  return <StaffLedger />;
}
