import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Pill } from "@/core/components/Pill";
import { colors, font, fonts, spacing, type Tone } from "@/core/constants/theme";
import { daysUntil, formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import type { Installment, InstallmentStatus } from "../types";

export const INSTALLMENT_META: Record<InstallmentStatus, { label: string; tone: Tone }> = {
  paid: { label: "Paid", tone: "success" },
  partial: { label: "Partial", tone: "info" },
  due: { label: "Due soon", tone: "warning" },
  overdue: { label: "Overdue", tone: "danger" },
  upcoming: { label: "Upcoming", tone: "neutral" },
};

const DOT: Record<InstallmentStatus, string> = {
  paid: colors.success,
  partial: colors.info,
  due: colors.warning,
  overdue: colors.danger,
  upcoming: colors.moss,
};

/** Vertical installment timeline: a gold rail with a status-coloured node per instalment. */
export function InstallmentScheduleList({ installments }: { installments: Installment[] }) {
  return (
    <View>
      {installments.map((i, idx) => {
        const meta = INSTALLMENT_META[i.status];
        const part = i.paidAmount > 0 && i.paidAmount < i.amount;
        const last = idx === installments.length - 1;
        return (
          <View key={i.no} style={styles.row}>
            <View style={styles.rail}>
              <View style={[styles.node, { backgroundColor: DOT[i.status], shadowColor: colors.shadow }, i.status === "paid" && styles.nodeDone]} />
              {last ? null : <View style={styles.line} />}
            </View>
            <View style={styles.left}>
              <Text style={styles.label}>{i.label}</Text>
              <Text style={styles.muted}>
                {formatDate(i.dueDate)}
                {i.status === "overdue" ? ` · ${Math.abs(daysUntil(i.dueDate))}d late` : ""}
              </Text>
            </View>
            <View style={styles.right}>
              <Text style={styles.amount}>{formatPKR(i.amount)}</Text>
              {part ? <Text style={styles.muted}>Paid {formatPKR(i.paidAmount)}</Text> : null}
              <Pill label={meta.label} tone={meta.tone} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md, paddingBottom: spacing.lg },
  rail: { width: 14, alignItems: "center" },
  node: { width: 12, height: 12, borderRadius: 6, marginTop: 3, shadowOpacity: 0.7, shadowRadius: 5, shadowOffset: { width: 0, height: 0 } },
  nodeDone: { opacity: 0.9 },
  line: { flex: 1, width: 1, backgroundColor: colors.lineStrong, marginTop: 4, marginBottom: -spacing.lg },
  left: { flex: 1, gap: 2 },
  right: { alignItems: "flex-end", gap: spacing.xs },
  label: { color: colors.text, fontSize: font.md, fontFamily: fonts.uiBold },
  muted: { color: colors.textMuted, fontSize: font.sm },
  amount: { color: colors.goldText, fontSize: font.md, fontFamily: fonts.uiBold },
});
