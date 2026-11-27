import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/core/components/Button";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { colors, font, fonts, letter, radius, shadows, spacing, groups } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import type { Stay } from "../types";

const DAY_MS = 86_400_000;
const NOTCH = 22;

function Cell({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <View style={[styles.cell, wide && styles.wide]}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
    </View>
  );
}

/** Digital resort pass for a requested stay: brand header, perforated divider with edge notches, itinerary grid, concierge note, actions. */
export function ReservationPass({ stay, onClose }: { stay: Stay; onClose: () => void }) {
  const nights = Math.max(1, Math.round((new Date(stay.checkOut).getTime() - new Date(stay.checkIn).getTime()) / DAY_MS));
  return (
    <View style={styles.pass}>
      <View style={styles.bar} />
      <View style={styles.head}>
        <View style={styles.crest}>
          <SereneLogoMark width={22} fill={colors.snow} snow={groups.pine} />
        </View>
        <View style={styles.headText}>
          <Text style={styles.org}>SERENE HEIGHTS · NATHIA GALI</Text>
          <Text style={styles.kind}>Reservation pass</Text>
        </View>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.noLabel}>RESERVATION PASS NO.</Text>
        <View style={styles.status}>
          <View style={styles.dot} />
          <Text style={styles.statusText}>REQUESTED</Text>
        </View>
      </View>
      <Text style={styles.code}>{stay.reference}</Text>

      <View style={styles.perf}>
        <View style={[styles.notch, styles.notchL]} />
        <View style={styles.dash} />
        <View style={[styles.notch, styles.notchR]} />
      </View>

      <View style={styles.grid}>
        <Cell wide label="RESIDENCE" value={stay.roomName} />
        <Cell label="CHECK-IN" value={formatDate(stay.checkIn)} />
        <Cell label="CHECK-OUT" value={formatDate(stay.checkOut)} />
        <Cell label="DURATION" value={`${nights} ${nights > 1 ? "Nights" : "Night"}`} />
        <Cell label="GUESTS" value={`${stay.adults} ${stay.adults > 1 ? "Adults" : "Adult"}`} />
      </View>

      <View style={styles.note}>
        <Ionicons name="information-circle-outline" size={18} color={colors.pineBrand} />
        <Text style={styles.noteText}>Our reservations desk will confirm shortly. Track your booking anytime under My Stays.</Text>
      </View>

      <Button variant="secondary" icon="logo-whatsapp" label="Message us on WhatsApp" onPress={() => void openWhatsApp(`Hello Serene Heights, I've requested reservation ${stay.reference}. Could you please confirm?`)} />
      <Button label="Done" showBadge arrow="✓" onPress={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  pass: { backgroundColor: groups.plate, borderRadius: radius.xl, borderWidth: 1, borderColor: groups.plateEdge, padding: spacing.xl, paddingTop: spacing.xl + 6, gap: spacing.md, ...shadows.cardElevated },
  bar: { position: "absolute", top: -1, left: -1, right: -1, height: 6, backgroundColor: colors.goldAccent, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  crest: { width: 46, height: 46, borderRadius: 23, backgroundColor: groups.pine, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  headText: { flex: 1, gap: 2 },
  org: { color: colors.pineBrand, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1.4 },
  kind: { color: colors.ink, fontFamily: fonts.display, fontSize: 24, lineHeight: 28 },
  statusRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, marginTop: spacing.xs },
  noLabel: { flex: 1, color: colors.muted, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  status: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.goldAccent },
  statusText: { color: colors.pineBrand, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1 },
  code: { color: colors.ink, fontFamily: fonts.display, fontSize: 40, lineHeight: 44, fontVariant: ["tabular-nums"] },
  perf: { height: NOTCH, marginHorizontal: -spacing.xl, justifyContent: "center" },
  dash: { marginHorizontal: NOTCH, borderTopWidth: 1.5, borderStyle: "dashed", borderColor: colors.lineStrong },
  notch: { position: "absolute", top: 0, width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: groups.base, borderWidth: 1, borderColor: groups.plateEdge },
  notchL: { left: -NOTCH / 2 - 1 },
  notchR: { right: -NOTCH / 2 - 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", rowGap: spacing.md, columnGap: spacing.md },
  cell: { width: "47%", gap: 3 },
  wide: { width: "100%" },
  cellLabel: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  cellValue: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  note: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start", backgroundColor: colors.cardUnselected, borderRadius: radius.lg, padding: spacing.md },
  noteText: { flex: 1, color: colors.ink2, fontSize: font.sm, lineHeight: 19 },
});
