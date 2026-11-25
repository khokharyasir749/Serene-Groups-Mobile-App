import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { Pill } from "@/core/components/Pill";
import { PressScale } from "@/core/components/PressScale";
import { unitImage } from "@/core/constants/media";
import { projectName } from "@/core/constants/serene";
import { colors, fonts, groups, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import type { BookingListItem } from "../types";
import { BOOKING_STATUS_META } from "./statusMeta";

type Props = { booking: BookingListItem; onPress: () => void };

export function BookingCard({ booking: b, onPress }: Props) {
  const meta = BOOKING_STATUS_META[b.status];
  const progress = b.totalPrice ? b.paidTotal / b.totalPrice : 0;
  return (
    <PressScale onPress={onPress} style={styles.card} accessibilityLabel={`${b.reference}, ${b.customer.name || "booking"}`}>
      <View style={styles.row}>
        <Image source={unitImage(b.project, b.unitType)} style={styles.thumb} contentFit="cover" transition={300} />
        <View style={styles.fill}>
          <View style={styles.between}>
            <Text style={styles.ref}>{b.reference}</Text>
            <Pill label={meta.label} tone={meta.tone} />
          </View>
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
            {b.customer.name || "—"}
          </Text>
          <Text style={styles.muted} numberOfLines={1}>
            {projectName(b.project)} · {b.unitLabel}
            {b.units > 1 ? ` × ${b.units}` : ""}
          </Text>
        </View>
      </View>
      <View style={styles.foot}>
        <View style={styles.between}>
          <Text style={styles.paid} numberOfLines={1}>
            {formatPKRCompact(b.paidTotal)}
            <Text style={styles.muted}>{`  of ${formatPKRCompact(b.totalPrice)}`}</Text>
          </Text>
          {b.overdueCount > 0 ? <Pill label={`${b.overdueCount} overdue`} tone="danger" /> : <Text style={styles.muted}>{b.nextDue ? `Next ${formatDate(b.nextDue.dueDate)}` : `${Math.round(progress * 100)}% paid`}</Text>}
        </View>
        <AnimatedBar value={progress} height={5} />
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 24, padding: 12, gap: 12, boxShadow: groups.plateShadow },
  row: { flexDirection: "row", alignItems: "center", gap: 14 },
  between: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  fill: { flex: 1, gap: 2 },
  thumb: { width: 84, height: 84, borderRadius: 18, backgroundColor: colors.stone },
  ref: { color: groups.goldInk, fontSize: 11, letterSpacing: 0.9, fontFamily: fonts.uiBold },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 25, lineHeight: 30 },
  muted: { color: colors.textMuted, fontSize: 12.5, fontFamily: fonts.ui },
  foot: { gap: 8, borderTopWidth: 1, borderTopColor: groups.plateEdge, paddingTop: 10 },
  paid: { flexShrink: 1, color: groups.pine, fontSize: 14, fontFamily: fonts.uiBold },
});
