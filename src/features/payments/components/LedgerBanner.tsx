import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Card } from "@/core/components/Card";
import { colors, dark, font, fonts, letter, spacing } from "@/core/constants/theme";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import type { PaymentSummary } from "../types";

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.label} numberOfLines={1}>
        {label.toUpperCase()}
      </Text>
      <Text style={[styles.value, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

/** Compact collections summary: the total on top, three single-line metrics beneath, divided by a hairline. */
export function LedgerBanner({ summary }: { summary: PaymentSummary | undefined }) {
  return (
    <Card variant="emerald" style={styles.card}>
      <Text style={styles.eyebrow}>TOTAL COLLECTED</Text>
      <Text style={styles.big} numberOfLines={1} adjustsFontSizeToFit>
        {formatPKRCompact(summary?.collected)}
      </Text>
      <View style={styles.rule} />
      <View style={styles.row}>
        <Stat label="Outstanding" value={formatPKRCompact(summary?.outstanding)} color={colors.white} />
        <Stat label="Overdue" value={formatPKRCompact(summary?.overdueAmount)} color={colors.danger} />
        <Stat label="This week" value={formatPKRCompact(summary?.dueThisWeekAmount)} color={colors.goldAccent} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.xs },
  eyebrow: { color: colors.goldAccent, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  big: { color: dark.text, fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: letter.tight },
  rule: { height: 1, backgroundColor: colors.lineNight, marginVertical: spacing.sm },
  row: { flexDirection: "row", gap: spacing.sm },
  stat: { flex: 1, gap: 2 },
  label: { color: dark.dim, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1 },
  value: { fontSize: font.md, fontFamily: fonts.uiBold },
});
