import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { projectName } from "@/core/constants/serene";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import { PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";
import type { Payment } from "../types";

export const paymentKindLabel = (p: Payment) => (p.kind === "down" ? "Down payment" : `Instalment ${p.installmentNo ?? "—"}`);

/** Slim ledger row: client + unit on the left, tabular amount and a quiet kind tag on the right. */
export function PaymentRow({ payment: p, onPress }: { payment: Payment; onPress?: () => void }) {
  const down = p.kind === "down";
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.dot, down && styles.dotDown]}>
        <Ionicons name={down ? "arrow-down" : "checkmark"} size={14} color={colors.pineBrand} />
      </View>
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {p.customerName || "—"}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${p.reference} · ${projectName(p.project)}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {`${formatDate(p.paidAt)} · ${PAYMENT_METHOD_LABEL[p.method]}`}
        </Text>
      </View>
      <View style={styles.end}>
        <Text style={styles.amount} numberOfLines={1}>
          {formatPKR(p.amount)}
        </Text>
        <Text style={[styles.tag, down && styles.tagDown]}>{down ? "DOWN" : `INST. ${p.installmentNo ?? "—"}`}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingVertical: spacing.md, paddingHorizontal: spacing.md + 2, ...shadows.card },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  dot: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.cardUnselected, alignItems: "center", justifyContent: "center" },
  dotDown: { backgroundColor: colors.goldSoft },
  main: { flex: 1, gap: 2 },
  name: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  meta: { color: colors.muted, fontSize: font.xs + 1 },
  end: { alignItems: "flex-end", gap: 5 },
  amount: { color: colors.ink, fontSize: font.md, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  tag: { color: colors.white, backgroundColor: colors.pineBrand, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 0.8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, overflow: "hidden" },
  tagDown: { color: colors.pineBrand, backgroundColor: colors.goldAccent },
});
