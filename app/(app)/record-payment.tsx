import { router, useLocalSearchParams } from "expo-router";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { RecordPaymentForm } from "@/features/payments/components/RecordPaymentForm";

export default function RecordPaymentScreen() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  return (
    <Screen title="Record payment" onBack={() => (router.canGoBack() ? router.back() : router.replace("/"))}>
      <PermissionGate permission={P.PAYMENTS_RECORD} fallback="screen">
        <RecordPaymentForm bookingId={bookingId} />
      </PermissionGate>
    </Screen>
  );
}
