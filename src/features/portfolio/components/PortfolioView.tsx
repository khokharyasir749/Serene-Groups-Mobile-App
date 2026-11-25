import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { useGetMyPortfolioQuery } from "@/core/api/endpoints/portfolioApi";
import { Card } from "@/core/components/Card";
import { EmptyState } from "@/core/components/EmptyState";
import { ProgressRing } from "@/core/components/ProgressRing";
import { SectionHeader } from "@/core/components/SectionHeader";
import { StatGrid } from "@/core/components/StatGrid";
import { TileRail } from "@/core/components/TileRail";
import { colors, dark, font, fonts, groups, letter, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR, formatPKRCompact } from "@/core/lib/formatPKR";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { parseError } from "@/core/lib/errorParser";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import { PaymentRow } from "@/features/payments/components/PaymentRow";

/** An investor's own portfolio: totals, holdings (each opens its instalment timeline) and recent receipts. */
export function PortfolioView() {
  const { data, error, isLoading, refetch } = useGetMyPortfolioQuery();
  if (error) return <EmptyState icon="cloud-offline-outline" title="Couldn't load your portfolio" message={parseError(error)} actionLabel="Retry" onAction={refetch} />;
  if (isLoading || !data) return <EmptyState title="Loading your portfolio…" />;
  const t = data.totals;
  const paid = t.invested ? Math.min(1, t.paid / t.invested) : 0;

  return (
    <View style={styles.stack}>
      <SectionHeader eyebrow="Serene Investors" title="Your" soft="portfolio." />
      <TileRail
        tiles={[
          { label: "Calculator", icon: "calculator", go: () => router.push("/calculator") },
          { label: "Reserve", icon: "bed", go: () => router.navigate("/bookings") },
          { label: "Advisor", icon: "whatsapp", go: () => void openWhatsApp("Hello Serene Heights, I have a question about my investment.") },
        ]}
      />
      <Card variant="emerald" style={styles.card}>
        <View style={styles.top}>
          <ProgressRing size={112} stroke={11} segments={[{ fraction: paid, color: groups.champagne }, { fraction: 1 - paid, color: colors.white16 }]}>
            <Text style={styles.pct}>{`${Math.round(paid * 100)}%`}</Text>
            <Text style={styles.pctLabel}>PAID</Text>
          </ProgressRing>
          <View style={styles.fill}>
            <Text style={styles.eyebrow}>TOTAL INVESTED</Text>
            <Text style={styles.big} numberOfLines={1} adjustsFontSizeToFit>
              {formatPKRCompact(t.invested)}
            </Text>
            <Text style={styles.muted}>{t.nextDue ? `Next ${formatPKR(t.nextDue.amount)}\n${formatDate(t.nextDue.dueDate)}` : "All instalments cleared"}</Text>
          </View>
        </View>
        {t.overdueCount > 0 ? <Text style={styles.alert}>{`${t.overdueCount} instalment${t.overdueCount > 1 ? "s" : ""} overdue`}</Text> : null}
      </Card>
      <StatGrid short stats={[{ value: formatPKRCompact(t.paid), label: "Paid" }, { value: formatPKRCompact(t.outstanding), label: "Outstanding" }]} />

      <SectionHeader eyebrow="Holdings" title="Your" soft="units." />
      {data.holdings.length === 0 ? <EmptyState title="No holdings yet" /> : null}
      {data.holdings.map((h) => (
        <BookingCard key={h.id} booking={h} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: h.id } })} />
      ))}

      <SectionHeader eyebrow="Receipts" title="Recent" soft="payments." />
      {data.payments.map((p) => (
        <PaymentRow key={p.id} payment={p} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: p.bookingId } })} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.lg },
  fill: { flex: 1, gap: 2 },
  card: { padding: spacing.lg, gap: spacing.md },
  top: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  pct: { color: colors.white, fontFamily: fonts.displayBold, fontSize: 28, lineHeight: 32 },
  pctLabel: { color: dark.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1.4 },
  eyebrow: { color: groups.champagne, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  big: { color: dark.text, fontFamily: fonts.display, fontSize: 38, lineHeight: 46 },
  muted: { color: dark.muted, fontSize: font.sm, lineHeight: 19 },
  alert: { color: groups.alert, fontSize: font.sm, fontFamily: fonts.uiSemi },
});
