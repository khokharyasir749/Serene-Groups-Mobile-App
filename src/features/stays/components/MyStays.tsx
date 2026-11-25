import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { useListMyStaysQuery } from "@/core/api/endpoints/staysApi";
import { Pill } from "@/core/components/Pill";
import { SectionHeader } from "@/core/components/SectionHeader";
import { colors, font, fonts, groups, spacing } from "@/core/constants/theme";
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
        <View key={s.id} style={styles.card}>
          <View style={styles.day}>
            <Text style={styles.dayNum}>{formatDate(s.checkIn).split(" ")[0]}</Text>
            <Text style={styles.dayMonth}>{formatDate(s.checkIn).split(" ")[1]?.toUpperCase()}</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.top}>
              <Text style={styles.ref}>{s.reference}</Text>
              <Pill label={s.status === "confirmed" ? "Confirmed" : "Requested"} tone={s.status === "confirmed" ? "success" : "warning"} />
            </View>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
              {s.roomName}
            </Text>
            <Text style={styles.sub}>{`Until ${formatDate(s.checkOut)} · ${s.adults} adult${s.adults > 1 ? "s" : ""}`}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 24, padding: 12, boxShadow: groups.plateShadow },
  day: { width: 66, height: 76, borderRadius: 20, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  dayNum: { color: colors.white, fontFamily: fonts.displayBold, fontSize: 30, lineHeight: 34 },
  dayMonth: { color: groups.champagne, fontSize: 11, letterSpacing: 1, fontFamily: fonts.uiBold },
  body: { flex: 1, gap: 2 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  ref: { color: groups.goldInk, fontSize: 11, letterSpacing: 0.8, fontFamily: fonts.uiBold },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 25, lineHeight: 30 },
  sub: { color: colors.muted, fontSize: font.sm },
});
