import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/core/components/Button";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { projectName } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import { PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";
import type { Payment } from "../types";
import { paymentKindLabel } from "./PaymentRow";

function Line({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.line, last && styles.lineLast]}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={styles.lineValue}>{value}</Text>
    </View>
  );
}

type Props = { payment: Payment | null; onClose: () => void; onOpenBooking: (bookingId: string) => void };

/** Full-screen official payment voucher on Warm Alabaster. "Open booking" is an explicit extra step; closing returns to the ledger. */
export function ReceiptSheet({ payment: p, onClose, onOpenBooking }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={p !== null} animationType="slide" onRequestClose={onClose} statusBarTranslucent presentationStyle="fullScreen">
      <View style={[styles.page, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom }]}>
        <View style={styles.top}>
          <Text style={styles.topTitle}>Payment receipt</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={20} color={colors.ink} />
          </Pressable>
        </View>
        {p ? (
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.voucher}>
              <View style={styles.head}>
                <View style={styles.crest}>
                  <SereneLogoMark width={22} fill={colors.snow} snow={colors.pineBrand} />
                </View>
                <View style={styles.headText}>
                  <Text style={styles.org}>SERENE HEIGHTS · DM CONSORTIUM</Text>
                  <Text style={styles.official}>OFFICIAL PAYMENT RECEIPT</Text>
                </View>
              </View>
              <View style={styles.idRow}>
                <Text style={styles.id}>{`No. ${p.receiptRef ?? "—"}`}</Text>
                <View style={styles.verified}>
                  <Ionicons name="checkmark-circle" size={12} color={colors.pineBrand} />
                  <Text style={styles.verifiedText}>VERIFIED</Text>
                </View>
              </View>
              <View style={styles.rule} />
              <Text style={styles.amountLabel}>AMOUNT RECEIVED</Text>
              <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit>
                {formatPKR(p.amount)}
              </Text>
              <Text style={styles.kind}>{paymentKindLabel(p)}</Text>
            </View>

            <View style={styles.lines}>
              <Line label="Client" value={p.customerName || "—"} />
              <Line label="Unit" value={p.reference} />
              <Line label="Project" value={projectName(p.project)} />
              <Line label="Paid on" value={formatDate(p.paidAt)} />
              <Line label="Method" value={PAYMENT_METHOD_LABEL[p.method]} last />
            </View>

            <Button
              label="Open booking"
              onPress={() => {
                onClose();
                onOpenBooking(p.bookingId);
              }}
              showBadge
            />
            <Button variant="secondary" label="Close" onPress={onClose} />
          </ScrollView>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  topTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 22 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xxl },
  voucher: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, borderTopWidth: 4, borderTopColor: colors.goldAccent, padding: spacing.lg, gap: spacing.sm, ...shadows.cardElevated },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  crest: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  headText: { flex: 1, gap: 2 },
  org: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1.6 },
  official: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold, letterSpacing: 1 },
  idRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.xs },
  id: { color: colors.ink2, fontSize: font.sm, fontFamily: fonts.uiSemi, fontVariant: ["tabular-nums"] },
  verified: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  verifiedText: { color: colors.pineBrand, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  rule: { height: 1, backgroundColor: colors.line, marginVertical: spacing.sm },
  amountLabel: { color: colors.muted, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  amount: { color: colors.ink, fontFamily: fonts.display, fontSize: 44, lineHeight: 48, fontVariant: ["tabular-nums"] },
  kind: { alignSelf: "flex-start", color: colors.pineBrand, backgroundColor: colors.cardUnselected, fontSize: font.xs + 1, fontFamily: fonts.uiBold, paddingHorizontal: 12, paddingVertical: 5, borderRadius: radius.pill, overflow: "hidden" },
  lines: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, ...shadows.card },
  line: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, paddingVertical: spacing.md, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  lineLast: { borderBottomWidth: 0 },
  lineLabel: { color: colors.muted, fontSize: font.sm },
  lineValue: { color: colors.ink, fontSize: font.sm + 1, fontFamily: fonts.uiBold, flexShrink: 1, textAlign: "right" },
});
