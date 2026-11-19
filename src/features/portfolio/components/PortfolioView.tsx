import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { useGetMyPortfolioQuery } from "@/core/api/endpoints/portfolioApi";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { EmptyState } from "@/core/components/EmptyState";
import { SectionHeader } from "@/core/components/SectionHeader";
import { colors, dark, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import { parseError } from "@/core/lib/errorParser";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import { PaymentRow } from "@/features/payments/components/PaymentRow";

/** An investor's own portfolio: totals, holdings (each opens its instalment timeline) and recent receipts. */
export function PortfolioView() {
  const { data, error, isLoading, refetch } = useGetMyPortfolioQuery();
  if (error) return <EmptyState icon="cloud-offline-outline" title="Couldn't load your portfolio" message={parseError(error)} actionLabel="Retry" onAction={refetch} />;
  if (isLoading || !data) return <EmptyState title="Loading your portfolio…" />;
  const t = data.totals;

  return (
    <View style={styles.stack}>
      <SectionHeader eyebrow="Serene Investors" title="Your" soft="portfolio." />
      <Card variant="emerald" style={styles.card}>
        <Text style={styles.eyebrow}>TOTAL INVESTED</Text>
        <Text style={styles.big} numberOfLines={1} adjustsFontSizeToFit>
          {formatPKR(t.invested)}
        </Text>
        <AnimatedBar onDark height={8} value={t.invested ? t.paid / t.invested : 0} />
        <View style={styles.row}>
          <Stat label="Paid" value={formatPKR(t.paid)} />
          <Stat label="Outstanding" value={formatPKR(t.outstanding)} />
        </View>
        <Text style={styles.muted}>
          {t.overdueCount > 0 ? `${t.overdueCount} instalment${t.overdueCount > 1 ? "s" : ""} overdue · ` : ""}
          {t.nextDue ? `Next: ${formatPKR(t.nextDue.amount)} on ${formatDate(t.nextDue.dueDate)}` : "All instalments cleared"}
        </Text>
      </Card>

      <SectionHeader eyebrow="Holdings" title="Your" soft="units." />
      {data.holdings.length === 0 ? <EmptyState title="No holdings yet" /> : null}
      {data.holdings.map((h) => (
        <BookingCard key={h.id} booking={h} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: h.id } })} />
      ))}

      <SectionHeader eyebrow="Receipts" title="Recent" soft="payments." />
      {data.payments.map((p) => (
        <PaymentRow key={p.id} payment={p} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: p.bookingId } })} />
      ))}
      <Button variant="secondary" label="Plan calculator" onPress={() => router.push("/calculator")} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xl },
  card: { padding: spacing.xl, gap: spacing.md, borderWidth: 1, borderColor: colors.lineNight, ...shadows.cardElevated },
  eyebrow: { color: dark.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  big: { color: dark.text, fontFamily: fonts.display, fontSize: 44, lineHeight: 46, letterSpacing: letter.tight },
  row: { flexDirection: "row", gap: spacing.lg },
  stat: { flex: 1, gap: 2 },
  statLabel: { color: dark.dim, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1 },
  statValue: { color: colors.snow, fontSize: font.lg, fontFamily: fonts.uiBold },
  muted: { color: dark.muted, fontSize: font.sm },
});
