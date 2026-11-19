import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { Card } from "@/core/components/Card";
import { Pill } from "@/core/components/Pill";
import { unitImage } from "@/core/constants/media";
import { projectName } from "@/core/constants/serene";
import { colors, font, letter, radius, spacing, fonts, gradients, SCRIM_STOPS } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { formatPKRCompact } from "@/core/lib/formatPKR";
import type { BookingListItem } from "../types";
import { BOOKING_STATUS_META } from "./statusMeta";

type Props = { booking: BookingListItem; onPress: () => void };

export function BookingCard({ booking: b, onPress }: Props) {
  const meta = BOOKING_STATUS_META[b.status];
  const progress = b.totalPrice ? b.paidTotal / b.totalPrice : 0;
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.thumb}>
        <Image source={unitImage(b.project, b.unitType)} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.ref}>
            <Text style={styles.refText}>{b.reference}</Text>
          </View>
          <Pill label={meta.label} tone={meta.tone} />
        </View>
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
          {b.customer.name || "—"}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>
          {projectName(b.project)} · {b.unitLabel}
          {b.units > 1 ? ` × ${b.units}` : ""}
        </Text>
        <AnimatedBar value={progress} height={4} />
        <View style={styles.row}>
          <Text style={[styles.muted, styles.shrink]} numberOfLines={1}>
            {formatPKRCompact(b.paidTotal)} of {formatPKRCompact(b.totalPrice)}
          </Text>
          {b.overdueCount > 0 ? <Pill label={`${b.overdueCount} overdue`} tone="danger" /> : b.nextDue ? <Text style={styles.muted} numberOfLines={1}>{`Next ${formatDate(b.nextDue.dueDate)}`}</Text> : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", padding: 0, gap: 0 },
  thumb: { width: 92, alignSelf: "stretch" },
  body: { flex: 1, padding: spacing.md, gap: spacing.xs + 1 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  ref: { borderColor: colors.lineStrong, borderWidth: 1, backgroundColor: colors.pineSoft, borderRadius: radius.pill, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  refText: { color: colors.goldText, fontSize: font.xs, fontWeight: "800", letterSpacing: letter.eyebrow / 2 },
  name: { color: colors.text, fontSize: 22, fontFamily: fonts.display },
  shrink: { flexShrink: 1 },
  muted: { color: colors.textMuted, fontSize: font.sm },
});
