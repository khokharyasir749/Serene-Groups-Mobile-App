import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { projectName } from "@/core/constants/serene";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import { PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";
import type { Payment } from "../types";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "—";

/** Staff Ledger receipt row: client monogram, name and unit on the left, tabular amount and kind on the right. */
export function LedgerEntry({ payment: p, onPress }: { payment: Payment; onPress: () => void }) {
  const down = p.kind === "down";
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.accent, down && styles.accentDown]} />
      <View style={styles.mono}>
        <Text style={styles.monoText}>{initials(p.customerName)}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {p.customerName || "—"}
        </Text>
        <Text style={styles.unit} numberOfLines={1}>
          {`${p.reference} · ${projectName(p.project)}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${formatDate(p.paidAt)} · ${PAYMENT_METHOD_LABEL[p.method]}`}
        </Text>
      </View>
      <View style={styles.end}>
        <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
          {formatPKR(p.amount)}
        </Text>
        <Text style={[styles.tag, down && styles.tagDown]}>{down ? "DOWN PAYMENT" : `INSTALMENT ${p.installmentNo ?? "—"}`}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: spacing.md, paddingRight: spacing.md + 2, paddingLeft: spacing.lg, overflow: "hidden", ...shadows.card },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  accent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 4, backgroundColor: colors.pineBrand },
  accentDown: { backgroundColor: colors.goldAccent },
  mono: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.cardUnselected, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  monoText: { color: colors.pineBrand, fontSize: font.sm, fontFamily: fonts.uiBold, letterSpacing: 0.5 },
  main: { flex: 1, gap: 2 },
  name: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  unit: { color: colors.ink2, fontSize: font.xs + 1, fontFamily: fonts.uiMedium },
  meta: { color: colors.muted, fontSize: font.xs + 1 },
  end: { alignItems: "flex-end", gap: 6, maxWidth: 128 },
  amount: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  tag: { color: colors.white, backgroundColor: colors.pineBrand, fontSize: 8, fontFamily: fonts.uiBold, letterSpacing: 0.8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, overflow: "hidden" },
  tagDown: { color: colors.pineBrand, backgroundColor: colors.goldAccent },
});
