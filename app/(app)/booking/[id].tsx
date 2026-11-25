import { Alert, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router, useLocalSearchParams } from "expo-router";
import { useGetBookingQuery, useUpdateBookingStatusMutation } from "@/core/api/endpoints/bookingsApi";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { EmptyState } from "@/core/components/EmptyState";
import { FadeIn } from "@/core/components/FadeIn";
import { PermissionGate } from "@/core/components/PermissionGate";
import { Screen } from "@/core/components/Screen";
import { P } from "@/core/constants/api";
import { colors, font, letter, spacing } from "@/core/constants/theme";
import { parseError } from "@/core/lib/errorParser";
import { shareBookingOnWhatsApp } from "@/core/lib/whatsappShare";
import { toast } from "@/core/stores/uiStore";
import { BookingSummaryCard } from "@/features/bookings/components/BookingSummaryCard";
import { InstallmentScheduleList } from "@/features/payments/components/InstallmentScheduleList";

export default function BookingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: b, isLoading, isFetching, error, refetch } = useGetBookingQuery(id);
  const [updateStatus, { isLoading: cancelling }] = useUpdateBookingStatusMutation();
  const back = () => (router.canGoBack() ? router.back() : router.replace("/"));

  const share = () => {
    if (b) shareBookingOnWhatsApp(b).catch(() => toast("WhatsApp isn't available on this device", "danger"));
  };
  const cancel = () =>
    Alert.alert("Cancel booking", "This stops the instalment schedule. Continue?", [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel booking",
        style: "destructive",
        onPress: () => updateStatus({ id, status: "cancelled" }).unwrap().then(() => toast("Booking cancelled")).catch((e) => toast(parseError(e), "danger")),
      },
    ]);

  return (
    <Screen title="Booking" onBack={back} refreshing={isFetching && !isLoading} onRefresh={refetch}>
      <PermissionGate permission={[P.BOOKINGS_READ, P.PORTFOLIO_READ]} fallback="screen">
        {b ? (
          <FadeIn style={styles.stack}>
            <BookingSummaryCard booking={b} />
            <View style={styles.actions}>
              <Button variant="gold" label="Share on WhatsApp" onPress={share} />
              <PermissionGate permission={P.PAYMENTS_RECORD}>
                {b.status !== "cancelled" && b.outstanding > 0 ? (
                  <Button label="Record payment" variant="secondary" onPress={() => router.push({ pathname: "/record-payment", params: { bookingId: b.id } })} />
                ) : null}
              </PermissionGate>
              <PermissionGate permission={P.BOOKINGS_UPDATE}>
                {b.status !== "cancelled" ? <Button label="Cancel booking" variant="danger" onPress={cancel} loading={cancelling} /> : null}
              </PermissionGate>
            </View>
            <Card>
              <Text style={styles.eyebrow}>INSTALMENT TIMELINE</Text>
              <InstallmentScheduleList installments={b.installments} />
            </Card>
          </FadeIn>
        ) : error ? (
          <EmptyState icon="cloud-offline-outline" title="Couldn't load booking" message={parseError(error)} actionLabel="Retry" onAction={refetch} />
        ) : (
          <EmptyState title={isLoading ? "Loading…" : "Booking not found"} />
        )}
      </PermissionGate>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.lg },
  actions: { gap: spacing.md },
  eyebrow: { color: colors.goldText, fontSize: font.xs, fontWeight: "700", letterSpacing: letter.eyebrow, marginBottom: spacing.md },
});
