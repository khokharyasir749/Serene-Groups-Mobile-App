import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { useGetMyPortfolioQuery } from "@/core/api/endpoints/portfolioApi";
import { EmptyState } from "@/core/components/EmptyState";
import { QuickRow } from "@/core/components/QuickRow";
import { spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { parseError } from "@/core/lib/errorParser";
import { BookingCard } from "@/features/bookings/components/BookingCard";
import { ChapterTitle } from "@/features/home/components/ChapterTitle";
import { MoneyHero, PageHero } from "@/features/home/components/PageHero";
import { PaymentRow } from "@/features/payments/components/PaymentRow";

/** Totals of the signed-in investor's own holdings. */
export function PortfolioHero({ height }: { height: number }) {
  const { data } = useGetMyPortfolioQuery();
  const t = data?.totals;
  const paid = t?.invested ? t.paid / t.invested : 0;
  return (
    <PageHero height={height}>
      <MoneyHero
        label="Total invested"
        value={t ? formatPKRCompact(t.invested) : "…"}
        done={paid}
        note={t ? `${Math.round(paid * 100)}% paid${t.overdueCount ? `, ${t.overdueCount} overdue` : ""}` : " "}
        figures={[
          { label: "Paid", value: formatPKRCompact(t?.paid) },
          { label: "Outstanding", value: formatPKRCompact(t?.outstanding) },
          { label: "Next due", value: t?.nextDue ? formatDate(t.nextDue.dueDate) : "Cleared" },
        ]}
      />
    </PageHero>
  );
}

/** An investor's own portfolio: holdings (each opens its instalment timeline) and recent receipts. */
export function PortfolioView() {
  const { data, error, isLoading, refetch } = useGetMyPortfolioQuery();
  if (error) return <EmptyState icon="cloud-offline-outline" title="Couldn't load your portfolio" message={parseError(error)} actionLabel="Retry" onAction={refetch} />;
  if (isLoading || !data) return <EmptyState title="Loading your portfolio…" />;
  return (
    <View style={styles.stack}>
      <QuickRow
        tiles={[
          { label: "Calculator", icon: "calculator", go: () => router.push("/calculator") },
          { label: "Stay", icon: "bed", go: () => router.navigate("/bookings") },
          { label: "Advisor", icon: "whatsapp", go: () => void openWhatsApp("Hello Serene Heights, I have a question about my investment.") },
        ]}
      />
      <View style={styles.part}>
        <ChapterTitle title="Your" soft="holdings." />
        {data.holdings.length === 0 ? <EmptyState title="No holdings yet" /> : null}
        {data.holdings.map((h) => (
          <BookingCard key={h.id} booking={h} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: h.id } })} />
        ))}
      </View>
      <View style={styles.part}>
        <ChapterTitle title="Recent" soft="payments." />
        {data.payments.length === 0 ? <EmptyState title="No payments yet" /> : null}
        {data.payments.map((p) => (
          <PaymentRow key={p.id} payment={p} onPress={() => router.push({ pathname: "/booking/[id]", params: { id: p.bookingId } })} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ stack: { gap: spacing.hero }, part: { gap: spacing.md } });
