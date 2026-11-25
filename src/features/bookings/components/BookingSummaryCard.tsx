import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { HeroImage } from "@/core/components/HeroImage";
import { Pill } from "@/core/components/Pill";
import { unitImage } from "@/core/constants/media";
import { projectName } from "@/core/constants/serene";
import { colors, dark, font, letter, radius, spacing, groups } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKR } from "@/core/lib/formatPKR";
import type { Booking } from "../types";
import { BOOKING_STATUS_META } from "./statusMeta";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.factValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.muted, styles.rowLabel]} numberOfLines={2}>
        {label}
      </Text>
      <Text style={[styles.value, strong && { color: colors.gold, fontWeight: "700" }]} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
    </View>
  );
}

/** Luxury digital pass: photo header, perforated tear line, key facts, then the payment standing. Masked fields show "—". */
export function BookingSummaryCard({ booking: b }: { booking: Booking }) {
  const meta = BOOKING_STATUS_META[b.status];
  return (
    <View style={styles.pass}>
      <HeroImage source={unitImage(b.project, b.unitType)} height={210} rounded={false}>
        <View style={styles.head}>
          <Text style={styles.ref}>{b.reference}</Text>
          <Pill label={meta.label} tone={meta.tone} />
        </View>
        <Text style={styles.name}>{b.customer.name || "—"}</Text>
        <Text style={styles.sub}>
          {projectName(b.project)} · {b.unitLabel}
          {b.units > 1 ? ` × ${b.units}` : ""}
        </Text>
      </HeroImage>

      <View style={styles.tear}>
        <View style={[styles.notch, styles.notchL]} />
        <View style={styles.dash} />
        <View style={[styles.notch, styles.notchR]} />
      </View>

      <View style={styles.body}>
        <View style={styles.facts}>
          <Fact label="Mobile" value={b.customer.phone ?? "—"} />
          <Fact label="CNIC" value={b.customer.cnic ?? "—"} />
          <Fact label="Booked" value={formatDate(b.createdAt)} />
          <Fact label="Units" value={String(b.units)} />
        </View>
        {b.notes ? <Text style={styles.muted}>{b.notes}</Text> : null}

        <View style={styles.rule} />
        <Text style={styles.eyebrow}>PAYMENT PLAN</Text>
        <Text style={styles.total} numberOfLines={1} adjustsFontSizeToFit>
          {formatPKR(b.totalPrice)}
        </Text>
        <AnimatedBar onDark value={b.totalPrice ? b.paidTotal / b.totalPrice : 0} height={8} />
        <Row label="Paid so far" value={formatPKR(b.paidTotal)} />
        <Row label="Outstanding" value={formatPKR(b.outstanding)} strong />
        <Row label="Down payment" value={formatPKR(b.downPayment)} />
        <Row label={`${b.months} monthly instalments`} value={formatPKR(b.monthlyInstallment)} />
      </View>
    </View>
  );
}

const NOTCH = 22;

const styles = StyleSheet.create({
  pass: { backgroundColor: groups.pine, borderRadius: 26, overflow: "hidden", borderWidth: 1, borderColor: colors.goldLine },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ref: { color: colors.white, fontSize: 11, fontWeight: "800", letterSpacing: 1, backgroundColor: groups.badge, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, overflow: "hidden" },
  name: { color: dark.text, fontSize: font.xxl, fontWeight: "500", letterSpacing: letter.display },
  sub: { color: colors.sage, fontSize: font.sm },
  tear: { height: NOTCH, justifyContent: "center" },
  dash: { borderTopWidth: 1, borderStyle: "dashed", borderColor: colors.goldLine, marginHorizontal: NOTCH },
  notch: { position: "absolute", top: 0, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: groups.base },
  notchL: { left: -NOTCH / 2 },
  notchR: { right: -NOTCH / 2 },
  body: { padding: spacing.xl - 4, paddingTop: spacing.md, gap: spacing.md },
  facts: { flexDirection: "row", flexWrap: "wrap", rowGap: spacing.lg },
  fact: { width: "50%", gap: 2 },
  factLabel: { color: dark.dim, fontSize: font.xs, fontWeight: "700", letterSpacing: 1 },
  factValue: { color: dark.text, fontSize: font.md },
  rule: { height: StyleSheet.hairlineWidth, backgroundColor: colors.goldLine },
  eyebrow: { color: colors.gold, fontSize: font.xs, fontWeight: "700", letterSpacing: letter.eyebrow },
  total: { color: dark.text, fontSize: font.display, fontWeight: "500", letterSpacing: letter.display },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  rowLabel: { flex: 1 },
  muted: { color: dark.muted, fontSize: font.sm },
  value: { color: dark.text, fontSize: font.md },
});
