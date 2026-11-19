import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { useGetAvailabilityQuery } from "@/core/api/endpoints/publicApi";
import { SectionHeader } from "@/core/components/SectionHeader";
import { NATHIA_GALI_TOTAL_UNITS, ROOMS, WEB } from "@/core/constants/serene";
import { colors, font, fonts, radius, spacing } from "@/core/constants/theme";
import { RoomShowcase } from "./RoomShowcase";
import { StayBooker } from "./StayBooker";

// Scannable lede from the web copy: first clause only, with the highlights as tags.
const LEDE = `${WEB.stays.p.split(" — ")[0]}.`;
const TAGS = ["Nathia Gali · 2 hrs from Islamabad", "Heated glass-roof pool", "Rooftop dining"] as const;

/** Serene Booking — open to everyone: pitch, availability widget and the five residence types with live availability. */
export function StayDiscovery() {
  const { data } = useGetAvailabilityQuery();
  return (
    <View style={styles.wrap}>
      <View style={styles.intro}>
        <SectionHeader eyebrow={WEB.stays.eyebrow} title={WEB.stays.title} soft={`${WEB.stays.soft}.`} />
        <View style={styles.tags}>
          {TAGS.map((t) => (
            <Text key={t} style={styles.tag}>
              {t}
            </Text>
          ))}
        </View>
        <Text style={styles.p}>{LEDE}</Text>
      </View>
      <StayBooker />
      <RoomShowcase availability={data} />
      <View style={styles.sumWrap}>
        <Text style={styles.sum}>{`${NATHIA_GALI_TOTAL_UNITS} CURATED HOTEL APARTMENTS · ${ROOMS.length} RESIDENCE CATEGORIES`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  intro: { gap: spacing.md },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: { color: colors.ink, fontSize: font.xs, fontFamily: fonts.uiSemi, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, overflow: "hidden" },
  p: { color: colors.ink2, fontSize: font.md, lineHeight: 23 },
  sumWrap: { alignSelf: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2 },
  sum: { color: colors.pineBrand, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1.2, textAlign: "center", lineHeight: 15 },
});
