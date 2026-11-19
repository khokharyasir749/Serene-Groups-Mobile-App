import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { useListMyStaysQuery } from "@/core/api/endpoints/staysApi";
import { Card } from "@/core/components/Card";
import { Pill } from "@/core/components/Pill";
import { SectionHeader } from "@/core/components/SectionHeader";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { useAuthStore } from "@/core/stores/authStore";

/** The signed-in guest's own reservations. Renders nothing for visitors who aren't signed in. */
export function MyStays() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  const { data } = useListMyStaysQuery(undefined, { skip: !authed });
  if (!authed || !data?.length) return null;
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="My stays" title="Your" soft="reservations." />
      {data.map((s) => (
        <Card key={s.id} style={styles.passCard}>
          <View style={styles.top}>
            <View style={styles.refBadge}>
              <Text style={styles.ref}>{s.reference}</Text>
            </View>
            <Pill label={s.status === "confirmed" ? "Confirmed" : "Requested"} tone={s.status === "confirmed" ? "success" : "warning"} />
          </View>
          <View style={styles.divider} />
          <View style={styles.body}>
            <Text style={styles.name}>{s.roomName}</Text>
            <Text style={styles.sub}>
              {formatDate(s.checkIn)} → {formatDate(s.checkOut)} · {s.adults} adult{s.adults > 1 ? "s" : ""}
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  passCard: { gap: spacing.sm, borderWidth: 1, borderColor: colors.lineStrong, ...shadows.cardElevated },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  refBadge: { backgroundColor: colors.pineSoft, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  ref: { color: colors.goldText, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow / 2 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.xs },
  body: { gap: 4 },
  name: { color: colors.ink, fontFamily: fonts.display, fontSize: 26, lineHeight: 28 },
  sub: { color: colors.muted, fontSize: font.sm },
});
