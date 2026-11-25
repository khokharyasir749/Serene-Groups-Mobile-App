import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { SectionHeader } from "@/core/components/SectionHeader";
import { PressScale } from "@/core/components/PressScale";
import { ROOM_MEDIA } from "@/core/constants/media";
import { ROOMS } from "@/core/constants/serene";
import { colors, font, fonts, groups, spacing } from "@/core/constants/theme";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";
import type { UnitAvailability } from "@/features/bookings/types";

const CARD = 290;
const GAP = 14;

/** The five residence types: photo, facts and live availability on one plate each. */
export function RoomShowcase({ availability }: { availability?: UnitAvailability[] }) {
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="Curated residences & suites" title="Five ways" soft="to stay." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={CARD + GAP} decelerationRate="fast" style={styles.bleed} contentContainerStyle={styles.track}>
        {ROOMS.map((r, i) => {
          const live = availability?.find((a) => a.slug === r.slug);
          const soldOut = live ? live.available <= 0 : false;
          return (
            <View key={r.slug} style={styles.card}>
              <View style={styles.photo}>
                <Image source={ROOM_MEDIA[r.slug]} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
                <View style={styles.idx}>
                  <Text style={styles.idxText}>{`0${i + 1}`}</Text>
                </View>
              </View>
              <View style={styles.body}>
                <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                  {r.name}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {r.tagline}
                </Text>
                <View style={styles.specs}>
                  {[
                    ["resize-outline", r.size],
                    ["people-outline", r.guests],
                  ].map(([icon, label]) => (
                    <View key={label} style={styles.spec}>
                      <Ionicons name={icon as "resize-outline"} size={14} color={groups.goldInk} />
                      <Text style={styles.specText}>{label}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.foot}>
                  <View style={styles.fill}>
                    <Text style={[styles.avail, soldOut && styles.soldOut]} numberOfLines={1}>
                      {live ? (soldOut ? "Sold out" : `${live.available} of ${live.units} available`) : `${r.units} apartments`}
                    </Text>
                    <AnimatedBar height={4} value={live && live.units ? live.available / live.units : 1} delay={200 + i * 100} />
                  </View>
                  <PressScale onPress={() => openReserve({ roomSlug: r.slug })} style={styles.cta} accessibilityLabel={`Reserve ${r.name}`}>
                    <Text style={styles.ctaText}>Reserve</Text>
                  </PressScale>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  track: { paddingHorizontal: spacing.lg, paddingBottom: 8, gap: GAP },
  fill: { flex: 1, gap: 6 },
  card: { width: CARD, borderRadius: 26, overflow: "hidden", backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, boxShadow: groups.plateShadow },
  photo: { height: 172, backgroundColor: colors.stone },
  idx: { position: "absolute", top: 12, left: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: groups.plate, alignItems: "center", justifyContent: "center" },
  idxText: { color: groups.pine, fontSize: 12, fontFamily: fonts.uiBold },
  body: { padding: 16, gap: 4 },
  name: { color: groups.pine, fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  sub: { color: colors.muted, fontSize: font.sm },
  specs: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 6 },
  spec: { flexDirection: "row", alignItems: "center", gap: 5 },
  specText: { color: groups.pine, fontSize: 12.5, fontFamily: fonts.uiMedium },
  foot: { flexDirection: "row", alignItems: "center", gap: 14, marginTop: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: groups.plateEdge },
  avail: { color: groups.pine, fontSize: 12, fontFamily: fonts.uiSemi },
  soldOut: { color: colors.danger },
  cta: { height: 42, borderRadius: 21, paddingHorizontal: 20, justifyContent: "center", backgroundColor: groups.pine },
  ctaText: { color: colors.white, fontSize: 14, fontFamily: fonts.uiSemi },
});
