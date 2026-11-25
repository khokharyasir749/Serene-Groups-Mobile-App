import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { PermissionGate } from "@/core/components/PermissionGate";
import { SectionHeader } from "@/core/components/SectionHeader";
import { SegmentedBar } from "@/core/components/SegmentedBar";
import { P } from "@/core/constants/api";
import { ROOMS } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, roomColorsLight, shadows, spacing, groups } from "@/core/constants/theme";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import type { BookingStats } from "@/features/bookings/types";
import type { PaymentSummary } from "@/features/payments/types";

type Props = { stats?: BookingStats; payments?: PaymentSummary };

function Kpi({ label, value, hero, compact, tone }: { label: string; value: string; hero?: boolean; compact?: boolean; tone?: "danger" | "gold" }) {
  return (
    <View style={[styles.kpi, hero && styles.kpiHero, compact && styles.kpiCompact, tone === "danger" && styles.kpiDanger]}>
      <View style={styles.kpiHead}>
        {tone === "gold" ? <View style={styles.goldDot} /> : null}
        <Text style={[styles.kpiLabel, hero && styles.kpiLabelHero, tone === "danger" && styles.kpiLabelDanger]} numberOfLines={1}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text style={[styles.kpiValue, hero && styles.kpiValueHero, compact && styles.kpiValueCompact, tone === "danger" && styles.kpiValueDanger]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

/** Staff live-figures dashboard: a 2-column KPI bento, then the unit inventory as one card with a segmented bar and status pills. */
export function CommandCard({ stats, payments }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const inv = stats?.inventory;
  const total = inv?.totalUnits ?? ROOMS.reduce((s, r) => s + r.units, 0);
  const toggle = (i: number) => setPicked((p) => (p === i ? null : i));

  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="Staff · live figures" title="Collections" soft="and inventory." />

      <PermissionGate permission={P.PAYMENTS_READ}>
        <View style={styles.bento}>
          <View style={styles.pair}>
            <Kpi hero label="Contract value" value={formatPKRCompact(stats?.totals.contractValue)} />
            <Kpi hero label="Collected" value={formatPKRCompact(payments?.collected)} />
          </View>
          <View style={styles.pair}>
            <Kpi compact label="Outstanding" value={formatPKRCompact(payments?.outstanding)} />
            <Kpi compact tone="danger" label="Overdue" value={formatPKRCompact(payments?.overdueAmount)} />
            <Kpi compact tone="gold" label="This week" value={formatPKRCompact(payments?.dueThisWeekAmount)} />
          </View>
        </View>
      </PermissionGate>

      <PermissionGate permission={P.BOOKINGS_READ}>
        <View style={styles.inv}>
          <View style={styles.invHead}>
            <Text style={styles.invTitle}>{`${total} units`}</Text>
            <Text style={styles.invSub}>{inv ? `${inv.bookedUnits} booked · ${inv.availableUnits} available` : "Nathia Gali inventory"}</Text>
          </View>
          <SegmentedBar selected={picked} onSelect={toggle} height={12} segments={ROOMS.map((r, i) => ({ value: r.units, color: roomColorsLight[i] }))} />
          <View>
            {ROOMS.map((r, i) => {
              const live = inv?.rooms.find((x) => x.slug === r.slug);
              const on = picked === i;
              return (
                <Pressable key={r.slug} onPress={() => toggle(i)} style={styles.invRow} accessibilityRole="button" accessibilityState={{ selected: on }}>
                  <View style={styles.invLine}>
                    <View style={[styles.swatch, { backgroundColor: roomColorsLight[i] }]} />
                    <Text style={[styles.invName, on && styles.invNameOn]}>{r.name}</Text>
                    <Text style={styles.pill}>{live ? `${live.available} / ${r.units} avail` : `${r.units} units`}</Text>
                  </View>
                  {on ? (
                    <View style={styles.detail}>
                      <Text style={styles.detailText}>{`${r.size} · ${r.guests}`}</Text>
                      <AnimatedBar height={5} value={live && live.units ? live.booked / live.units : 0} />
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </PermissionGate>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  bento: { gap: spacing.sm },
  pair: { flexDirection: "row", gap: spacing.sm },
  kpi: { flex: 1, backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge, borderRadius: radius.lg, padding: spacing.md + 2, gap: 4, ...shadows.card },
  kpiHero: { ...shadows.cardElevated, padding: spacing.lg },
  kpiCompact: { padding: spacing.md },
  kpiDanger: { backgroundColor: groups.plate, borderColor: colors.danger, borderWidth: 1.5, elevation: 0, shadowOpacity: 0 },
  kpiHead: { flexDirection: "row", alignItems: "center", gap: 6 },
  goldDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.goldAccent },
  kpiLabel: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  kpiLabelHero: { color: colors.goldText },
  kpiLabelDanger: { color: colors.danger },
  kpiValue: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, lineHeight: 28, fontVariant: ["tabular-nums"] },
  kpiValueHero: { fontSize: 28, lineHeight: 32 },
  kpiValueCompact: { fontSize: 20, lineHeight: 24 },
  kpiValueDanger: { color: colors.danger },
  inv: { backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, ...shadows.card },
  invHead: { flexDirection: "row", alignItems: "baseline", gap: spacing.md },
  invTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  invSub: { flex: 1, color: colors.muted, fontSize: font.sm },
  invRow: { paddingVertical: spacing.md - 2, borderTopWidth: 1, borderTopColor: colors.line, gap: spacing.sm },
  invLine: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  swatch: { width: 10, height: 10, borderRadius: 5 },
  invName: { flex: 1, color: colors.ink2, fontSize: font.md - 1, fontFamily: fonts.uiMedium },
  invNameOn: { color: colors.ink, fontFamily: fonts.uiBold },
  pill: { color: colors.pineBrand, backgroundColor: colors.cardUnselected, fontSize: 11, fontFamily: fonts.uiBold, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, overflow: "hidden", fontVariant: ["tabular-nums"] },
  detail: { gap: spacing.sm, paddingLeft: spacing.lg + 4 },
  detailText: { color: colors.muted, fontSize: font.sm },
});
