import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Button } from "@/core/components/Button";
import { projectName } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import { PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";
import type { Payment } from "../types";
import { paymentKindLabel } from "./PaymentRow";

function Line({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  );
}

type Props = { payment: Payment | null; onClose: () => void; onOpenBooking: (bookingId: string) => void };

/** Receipt detail for a ledger row. Stays inside the ledger; "Open booking" is an explicit extra step. */
export function ReceiptSheet({ payment: p, onClose, onOpenBooking }: Props) {
  return (
    <Modal visible={p !== null} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      {p ? (
        <View style={styles.sheet}>
          <View style={styles.grab} />
          <Text style={styles.eyebrow}>{`RECEIPT · ${p.receiptRef ?? "—"}`}</Text>
          <Text style={styles.amount}>{formatPKR(p.amount)}</Text>
          <Text style={styles.kind}>{paymentKindLabel(p)}</Text>
          <View style={styles.lines}>
            <Line label="Client" value={p.customerName || "—"} />
            <Line label="Unit" value={p.reference} />
            <Line label="Project" value={projectName(p.project)} />
            <Line label="Paid on" value={formatDate(p.paidAt)} />
            <Line label="Method" value={PAYMENT_METHOD_LABEL[p.method]} />
          </View>
          <Button
            label="Open booking"
            onPress={() => {
              onClose();
              onOpenBooking(p.bookingId);
            }}
          />
          <Button variant="secondary" label="Close" onPress={onClose} />
        </View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.xl + 8, borderTopRightRadius: radius.xl + 8, padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md, borderWidth: 1, borderColor: colors.lineStrong },
  grab: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong },
  eyebrow: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow, marginTop: spacing.sm },
  amount: { color: colors.ink, fontFamily: fonts.display, fontSize: 40, lineHeight: 44 },
  kind: { color: colors.pineBrand, fontSize: font.sm, fontFamily: fonts.uiBold },
  lines: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md + 2 },
  line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, paddingVertical: spacing.md - 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  lineLabel: { color: colors.muted, fontSize: font.sm },
  lineValue: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi, flexShrink: 1, textAlign: "right" },
});
