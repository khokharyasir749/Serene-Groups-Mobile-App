import { useState } from "react";
import { Redirect, router } from "expo-router";
import { useGetPaymentSummaryQuery, useListPaymentsQuery } from "@/core/api/endpoints/paymentsApi";
import { DataList } from "@/core/components/DataList";
import { Pager } from "@/core/components/Pager";
import { PermissionGate } from "@/core/components/PermissionGate";
import { HeaderAction } from "@/core/components/FloatingHeader";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { parseError } from "@/core/lib/errorParser";
import { LedgerBanner } from "@/features/payments/components/LedgerBanner";
import { PaymentFilterBar } from "@/features/payments/components/PaymentFilterBar";
import { ReceiptSheet } from "@/features/payments/components/ReceiptSheet";
import type { Payment } from "@/features/payments/types";
import { PaymentRow } from "@/features/payments/components/PaymentRow";
import { usePaymentFilters } from "@/features/payments/hooks/usePaymentFilters";
import { useAuthStore } from "@/core/stores/authStore";

// Staff ledger: every payment, with filters and record-payment. Not part of the visitor or investor flow.
function StaffLedger() {
  const f = usePaymentFilters();
  const { data, isLoading, isFetching, error, refetch } = useListPaymentsQuery(f.args);
  const { data: summary } = useGetPaymentSummaryQuery();
  const [receipt, setReceipt] = useState<Payment | null>(null);
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
          data={data?.items}
          keyExtractor={(p) => p.id}
          renderItem={(p) => <PaymentRow payment={p} onPress={() => setReceipt(p)} />}
          loading={isLoading}
          error={error ? parseError(error) : null}
          onRetry={refetch}
          refreshing={isFetching && !isLoading}
          onRefresh={refetch}
          emptyTitle="No payments yet"
          header={
            <>
              <LedgerBanner summary={summary} />
              <PaymentFilterBar f={f} />
            </>
          }
          footer={data ? <Pager page={data.page} totalPages={data.totalPages} total={data.total} onChange={f.setPage} /> : null}
        />
      </PermissionGate>
      <ReceiptSheet payment={receipt} onClose={() => setReceipt(null)} onOpenBooking={(id) => router.push({ pathname: "/booking/[id]", params: { id } })} />
    </Screen>
  );
}


// Staff consoles are signed-in only: signed-out visitors go to sign-in and come straight back here.
export default function StaffLedgerRoute() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  if (!authed) return <Redirect href={{ pathname: "/login", params: { next: "/staff/ledger" } }} />;
  return <StaffLedger />;
}
