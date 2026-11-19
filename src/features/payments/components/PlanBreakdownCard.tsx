import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { Card } from "@/core/components/Card";
import { ProgressRing } from "@/core/components/ProgressRing";
import { PLAN_RULES } from "@/core/constants/serene";
import { colors, dark, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatPKR, spokenPKR } from "@/core/lib/formatPKR";
import type { PlanBreakdown } from "../types";

function Out({ n, label, hint, amount }: { n: string; label: string; hint?: string; amount: number }) {
  return (
    <View style={styles.out}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{n}</Text>
      </View>
      <View style={styles.outMain}>
        <Text style={styles.muted}>{label}</Text>
        <Text style={styles.exact}>{hint ? `${hint} · ${formatPKR(amount)}` : formatPKR(amount)}</Text>
      </View>
      <Text style={styles.spoken} numberOfLines={1} adjustsFontSizeToFit>
        {spokenPKR(amount)}
      </Text>
    </View>
  );
}

/** Centerpiece: forest card, gold trim — ring + bar for the 30% / 70% split, Lakh/Crore and exact PKR. */
export function PlanBreakdownCard({ plan }: { plan: PlanBreakdown }) {
  const down = plan.total ? plan.down / plan.total : PLAN_RULES.downPercent / 100;
  return (
    <Card variant="emerald" style={styles.card}>
      <Text style={styles.eyebrow}>SERENE INVESTORS · PAYMENT PLAN</Text>
      <View style={styles.top}>
        <ProgressRing
          size={132}
          stroke={12}
          segments={[
            { fraction: down, color: colors.goldAccent },
            { fraction: 1 - down, color: colors.dusk3 },
          ]}
        >
          <Text style={styles.pct}>{PLAN_RULES.downPercent}%</Text>
          <Text style={styles.pctLabel}>DOWN</Text>
        </ProgressRing>
        <View style={styles.totalBox}>
          <Text style={styles.muted}>Total price</Text>
          <Text style={styles.total}>{spokenPKR(plan.total)}</Text>
          <Text style={styles.exact}>{formatPKR(plan.total)}</Text>
        </View>
      </View>

      <View style={styles.split}>
        <AnimatedBar onDark height={8} value={down} />
        <View style={styles.legend}>
          <Text style={[styles.legendText, { color: colors.goldAccent }]}>{PLAN_RULES.downPercent}% down payment</Text>
          <Text style={[styles.legendText, { color: colors.dusk3 }]}>{PLAN_RULES.months} monthly installments</Text>
        </View>
      </View>

      <View style={styles.rule} />
      <Out n="1" label={`Down payment (${PLAN_RULES.downPercent}%)`} amount={plan.down} />
      <View style={styles.rule} />
      <Out n="2" label={`${plan.months - 1} monthly instalments`} hint="each" amount={plan.monthly} />
      <View style={styles.rule} />
      <Out n="3" label={`Final instalment (${plan.months})`} hint="absorbs rounding" amount={plan.lastMonthly} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.xl, gap: spacing.lg, ...shadows.cardElevated },
  eyebrow: { color: colors.snow, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  top: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  pct: { color: colors.snow, fontSize: font.xxl, fontFamily: fonts.displayBold },
  pctLabel: { color: dark.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  totalBox: { flex: 1, gap: 2 },
  total: { color: dark.text, fontSize: 40, fontFamily: fonts.display, letterSpacing: letter.tight, lineHeight: 44 },
  split: { gap: spacing.sm },
  legend: { flexDirection: "row", justifyContent: "space-between" },
  legendText: { fontSize: font.xs, fontFamily: fonts.uiSemi, letterSpacing: 0.5 },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.goldAccent, opacity: 0.45 },
  out: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  outMain: { flex: 1, gap: 2 },
  badge: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  badgeText: { color: colors.goldAccent, fontSize: font.xs, fontFamily: fonts.uiBold },
  muted: { color: dark.muted, fontSize: font.sm, fontFamily: fonts.uiMedium },
  spoken: { color: dark.text, fontSize: font.xl, fontFamily: fonts.display, letterSpacing: letter.tight, maxWidth: 120, textAlign: "right", fontVariant: ["tabular-nums"] },
  exact: { color: colors.sage, fontSize: font.xs + 1, fontFamily: fonts.uiMedium, fontVariant: ["tabular-nums"] },
});
