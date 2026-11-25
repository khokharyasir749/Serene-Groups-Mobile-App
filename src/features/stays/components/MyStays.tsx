import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { useListMyStaysQuery } from "@/core/api/endpoints/staysApi";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { useAuthStore } from "@/core/stores/authStore";
import { ChapterTitle } from "@/features/home/components/ChapterTitle";

/** The signed-in guest's own reservations. Renders nothing for visitors who aren't signed in. */
export function MyStays() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  const { data } = useListMyStaysQuery(undefined, { skip: !authed });
  if (!authed || !data?.length) return null;
  return (
    <View style={styles.wrap}>
      <ChapterTitle title="Your" soft="reservations." />
      <View style={styles.list}>
        {data.map((s) => {
          const [day, month] = formatDate(s.checkIn).split(" ");
          const ok = s.status === "confirmed";
          return (
            <View key={s.id} style={styles.card}>
              <View style={styles.day}>
                <Text style={styles.dayNum}>{day}</Text>
                <Text style={styles.dayMonth}>{month}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                  {s.roomName}
                </Text>
                <Text style={styles.sub}>{`Until ${formatDate(s.checkOut)}, ${s.adults} adult${s.adults > 1 ? "s" : ""}`}</Text>
                <Text style={styles.sub}>
                  <Text style={[styles.status, ok && styles.ok]}>{ok ? "Confirmed" : "Requested"}</Text>
                  {`  ${s.reference}`}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  list: { gap: 10, marginHorizontal: -spacing.sm },
  card: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: explore.sheet, borderRadius: 30, padding: 12, boxShadow: explore.lift },
  day: { width: 78, height: 94, borderRadius: 22, backgroundColor: explore.deep, alignItems: "center", justifyContent: "center" },
  dayNum: { color: explore.onDark, fontFamily: fonts.display, fontSize: 38, lineHeight: 42, fontVariant: ["lining-nums"] },
  dayMonth: { color: explore.gold, fontSize: 14, fontFamily: fonts.uiSemi },
  body: { flex: 1, gap: 2 },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 26, lineHeight: 30 },
  sub: { color: colors.textMuted, fontSize: font.sm + 0.5, lineHeight: 20 },
  status: { color: colors.warning, fontFamily: fonts.uiSemi },
  ok: { color: colors.success },
});
