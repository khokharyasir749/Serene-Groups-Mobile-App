import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useGetMyPortfolioQuery } from "@/core/api/endpoints/portfolioApi";
import { useListMyStaysQuery } from "@/core/api/endpoints/staysApi";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { P } from "@/core/constants/api";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { daysUntil, formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";

type Item = { key: string; icon: keyof typeof Ionicons.glyphMap; label: string; value: string; note: string; go: () => void };

const when = (iso: string) => {
  const d = daysUntil(iso);
  if (d < 0) return `Overdue since ${formatDate(iso)}`;
  if (d === 0) return "Today";
  return d === 1 ? "Tomorrow" : `In ${d} days, ${formatDate(iso)}`;
};

/** What matters to the person signed in: their next stay and their next instalment. Nothing at all for everyone else. */
export function ForYou() {
  const { has } = usePermissions();
  const { data: stays } = useListMyStaysQuery(undefined, { skip: !has(P.MY_STAYS) });
  const { data: portfolio } = useGetMyPortfolioQuery(undefined, { skip: !has(P.PORTFOLIO_READ) });
  const stay = [...(stays ?? [])].filter((s) => daysUntil(s.checkOut) >= 0).sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];
  const due = portfolio?.totals.nextDue;

  const items: Item[] = [];
  if (stay) items.push({ key: "stay", icon: "bed-outline", label: "Your next stay", value: stay.roomName, note: daysUntil(stay.checkIn) < 0 ? `Until ${formatDate(stay.checkOut)}` : when(stay.checkIn), go: () => router.navigate("/bookings") });
  if (due) items.push({ key: "due", icon: "calendar-outline", label: "Your next instalment", value: formatPKR(due.amount), note: when(due.dueDate), go: () => router.navigate("/payments") });
  if (!items.length) return null;

  return (
    <View style={styles.wrap}>
      {items.map((it) => (
        <PressScale key={it.key} onPress={it.go} style={styles.card} accessibilityLabel={`${it.label}: ${it.value}. ${it.note}`}>
          <View style={styles.icon}>
            <Ionicons name={it.icon} size={22} color={explore.gold} />
          </View>
          <View style={styles.words}>
            <Text style={styles.label}>{it.label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {it.value}
            </Text>
            <Text style={styles.note} numberOfLines={1}>
              {it.note}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={groups.pine} />
        </PressScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, marginHorizontal: -spacing.sm, marginBottom: -spacing.lg },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md + 2, borderRadius: 28, backgroundColor: explore.sheet, padding: spacing.md + 4, boxShadow: explore.lift },
  icon: { width: 54, height: 54, borderRadius: 19, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  words: { flex: 1 },
  label: { color: explore.goldDeep, fontSize: font.sm, lineHeight: 18, fontFamily: fonts.uiSemi },
  value: { color: groups.pine, fontSize: font.lg, lineHeight: 25, fontFamily: fonts.uiBold },
  note: { color: colors.textMuted, fontSize: font.sm, lineHeight: 18 },
});
