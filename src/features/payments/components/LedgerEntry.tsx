import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { projectName } from "@/core/constants/serene";
import { colors, font, fonts, groups } from "@/core/constants/theme";
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
      <View style={[styles.mono, down && styles.monoDown]}>
        <Text style={[styles.monoText, down && styles.monoTextDown]}>{initials(p.customerName)}</Text>
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
  row: { flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: groups.plate, borderRadius: 22, borderWidth: 1.2, borderColor: groups.plateEdge, padding: 12, marginBottom: 2 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  mono: { width: 48, height: 48, borderRadius: 17, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  monoDown: { backgroundColor: groups.champagne },
  monoText: { color: colors.white, fontSize: 14, fontFamily: fonts.uiBold, letterSpacing: 0.5 },
  monoTextDown: { color: groups.pine },
  main: { flex: 1, gap: 2 },
  name: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  unit: { color: colors.ink2, fontSize: font.xs + 1, fontFamily: fonts.uiMedium },
  meta: { color: colors.muted, fontSize: font.xs + 1 },
  end: { alignItems: "flex-end", gap: 6, maxWidth: 128 },
  amount: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  tag: { color: groups.goldInk, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 0.7 },
  tagDown: { color: groups.pine },
});
