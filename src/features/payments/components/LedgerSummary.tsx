import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { Card } from "@/core/components/Card";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { colors, dark, font, fonts, letter, spacing, groups } from "@/core/constants/theme";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import type { PaymentSummary } from "../types";

type TileProps = { label: string; value: string; note?: string; dot: string; color: string; last?: boolean };

function Tile({ label, value, note, dot, color, last }: TileProps) {
  return (
    <View style={[styles.tile, !last && styles.tileRule]}>
      <View style={styles.tileHead}>
        <View style={[styles.dot, { backgroundColor: dot }]} />
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
      </View>
      <Text style={[styles.value, { color }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.note} numberOfLines={1}>
        {note ?? " "}
      </Text>
    </View>
  );
}

/** Staff Ledger summary: total collected with a crest watermark, the collection split, and three ruled metrics with their own captions. */
export function LedgerSummary({ summary }: { summary: PaymentSummary | undefined }) {
  const book = summary ? summary.collected + summary.outstanding : 0;
  const rate = book > 0 && summary ? summary.collected / book : 0;
  const pct = Math.round(rate * 100);
  return (
    <Card variant="emerald" style={styles.card}>
      <View style={styles.watermark} pointerEvents="none">
        <SereneLogoMark width={150} fill={colors.goldAccent} snow={groups.pine} />
      </View>

      <View style={styles.top}>
        <Text style={styles.eyebrow}>TOTAL COLLECTED</Text>
        <View style={styles.rate}>
          <Text style={styles.rateText}>{`${pct}% OF BOOK`}</Text>
        </View>
      </View>
      <Text style={styles.big} numberOfLines={1} adjustsFontSizeToFit>
        {formatPKRCompact(summary?.collected)}
      </Text>

      <View style={styles.bar}>
        <AnimatedBar onDark height={8} value={rate} />
        <View style={styles.split}>
          <Text style={styles.splitText}>{`${pct}% collected`}</Text>
          <Text style={styles.splitText}>{`${100 - pct}% outstanding`}</Text>
        </View>
      </View>

      <View style={styles.tiles}>
        <Tile label="OUTSTANDING" value={formatPKRCompact(summary?.outstanding)} note="Still to collect" dot={colors.white} color={colors.white} />
        <Tile
          label="OVERDUE"
          value={formatPKRCompact(summary?.overdueAmount)}
          note={summary ? `${summary.overdueCount} instalment${summary.overdueCount === 1 ? "" : "s"}` : undefined}
          dot={groups.alert}
          color={groups.alert}
        />
        <Tile label="THIS WEEK" value={formatPKRCompact(summary?.dueThisWeekAmount)} note="Due in 7 days" dot={colors.goldAccent} color={colors.goldAccent} last />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg + 2, gap: spacing.sm, borderColor: colors.goldAccent, borderWidth: 1.5 },
  watermark: { position: "absolute", right: -26, top: 40, opacity: 0.1 },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  eyebrow: { color: colors.goldAccent, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  rate: { borderWidth: 1, borderColor: colors.goldAccent, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  rateText: { color: colors.goldAccent, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1 },
  big: { color: dark.text, fontFamily: fonts.display, fontSize: 44, lineHeight: 48, letterSpacing: -0.5 },
  bar: { gap: 6, marginTop: spacing.xs },
  split: { flexDirection: "row", justifyContent: "space-between" },
  splitText: { color: dark.muted, fontSize: font.xs, fontFamily: fonts.uiMedium },
  tiles: { flexDirection: "row", marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.lineNight, paddingTop: spacing.md },
  tile: { flex: 1, gap: 3, paddingHorizontal: spacing.sm },
  tileRule: { borderRightWidth: 1, borderRightColor: colors.lineNight },
  tileHead: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  label: { flex: 1, color: dark.dim, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1 },
  value: { fontSize: font.md + 1, fontFamily: fonts.uiBold },
  note: { color: dark.dim, fontSize: 10 },
});
