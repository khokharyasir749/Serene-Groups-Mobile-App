import { Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetAvailabilityQuery } from "@/core/api/endpoints/publicApi";
import { PressScale } from "@/core/components/PressScale";
import { QuickRow } from "@/core/components/QuickRow";
import { Text } from "@/core/components/Text";
import { AMENITIES, PROJECT_GEO, ROOMS, WEB } from "@/core/constants/serene";
import { colors, explore, font, fonts, groups, radius, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { switchTo } from "@/core/stores/switchStore";
import { photo } from "@/features/bookings/guest/data/photos";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";
import { ChapterTitle } from "./ChapterTitle";
import { HeroActions, HeroTitle, PageHero } from "./PageHero";
import { useScrollTo } from "./scrollTarget";

const ENQUIRY = "Hello Serene Heights, I'd like to check availability for a stay at Serene Heights Nathia Gali.";
const MAP = `https://www.google.com/maps/search/?api=1&query=${PROJECT_GEO["nathia-gali"].lat},${PROJECT_GEO["nathia-gali"].lon}`;
// One glyph per amenity, in the list's order.
const AMENITY_ICON = ["pool", "weather-sunset", "silverware-fork-knife", "ski", "pine-tree", "bow-arrow", "terrain", "golf"] as const satisfies readonly (keyof typeof MaterialCommunityIcons.glyphMap)[];
const ROOM_PHOTO: Record<string, string> = {
  "classic-one-bedroom": "/images/interiors/living-room-sofa.jpg",
  "premier-one-bedroom": "/images/interiors/lounge-art.jpg",
  "grand-one-bedroom": "/images/interiors/bedroom-morning.jpg",
  "signature-corner-suite": "/images/interiors/window-view.jpg",
  "terrace-apartment": "/images/resort/rooftop-crown.jpg",
};

export function StayHero({ height }: { height: number }) {
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <PageHero height={height} image={photo("/images/interiors/dining-nook-arch.jpg") as ImageSource}>
      <HeroTitle title={WEB.stays.title} soft={WEB.stays.soft} lede="Furnished hotel apartments in the pines, two hours from Islamabad." />
      <HeroActions primary={{ label: "Reserve", icon: "calendar-outline", onPress: () => openReserve({}) }} secondary={{ label: "Enquire", icon: "logo-whatsapp", onPress: () => void openWhatsApp(ENQUIRY) }} />
    </PageHero>
  );
}

export function StayShortcuts() {
  const toSuites = useScrollTo("suites");
  const toAmenities = useScrollTo("amenities");
  return (
    <QuickRow
      tiles={[
        { label: "Suites", icon: "bed", go: toSuites },
        { label: "Amenities", icon: "pool", go: toAmenities },
        { label: "Map", icon: "map-marker", go: () => void Linking.openURL(MAP) },
        { label: "Bookings", icon: "cellphone", go: () => switchTo("Serene Bookings", () => router.push("/serene-bookings")) },
      ]}
    />
  );
}

/** Every residence type with what is free right now, ready to reserve. */
export function StayRooms() {
  const { data } = useGetAvailabilityQuery();
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <View style={styles.wrap}>
      <ChapterTitle title={WEB.stays.roomsTitle} soft={`${WEB.stays.roomsSoft}.`} />
      <View>
        {ROOMS.map((r) => {
          const live = data?.find((a) => a.slug === r.slug);
          const full = live ? live.available <= 0 : false;
          return (
            <View key={r.slug} style={styles.room}>
              <Image source={photo(ROOM_PHOTO[r.slug]) as ImageSource} style={styles.roomPhoto} contentFit="cover" transition={300} accessibilityLabel={r.name} />
              <View style={styles.roomBody}>
                <View>
                  <Text style={styles.roomName} maxFontSizeMultiplier={1.1}>
                    {r.name.replace(" One-", "\nOne-")}
                  </Text>
                  <Text style={styles.roomFact}>{r.size}</Text>
                  <Text style={styles.roomFact}>{r.guests}</Text>
                </View>
                <View>
                  <View style={styles.freeRow}>
                    <View style={[styles.freeDot, full && styles.fullDot]} />
                    <Text style={[styles.free, full && styles.full]} numberOfLines={1}>
                      {live ? (full ? "Sold out" : `${live.available} of ${live.units} free`) : `${r.units} apartments`}
                    </Text>
                  </View>
                  <PressScale onPress={() => openReserve({ roomSlug: r.slug })} disabled={full} style={[styles.reserve, full && styles.off]} accessibilityLabel={`Reserve ${r.name}`}>
                    <Text style={styles.reserveText} maxFontSizeMultiplier={1.1}>
                      Reserve
                    </Text>
                  </PressScale>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

export function StayAmenities() {
  return (
    <View style={styles.dark}>
      <ChapterTitle dark title="All of it," soft="on site." />
      <View>
        {AMENITIES.map((a, i) => (
          <View key={a} style={styles.amenity}>
            <MaterialCommunityIcons name={AMENITY_ICON[i] ?? "star-four-points"} size={25} color={explore.gold} />
            <Text style={styles.amenityText}>{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  room: { flexDirection: "row", gap: spacing.lg - 2, paddingVertical: spacing.lg, borderBottomWidth: 1, borderBottomColor: explore.line },
  roomPhoto: { width: 136, height: 206, borderRadius: 28, backgroundColor: explore.deep },
  roomBody: { flex: 1, justifyContent: "space-between", gap: spacing.md },
  roomName: { color: groups.pine, fontFamily: fonts.display, fontSize: 28, lineHeight: 29, letterSpacing: -0.4, marginBottom: 6 },
  roomFact: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  freeRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 10 },
  freeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  fullDot: { backgroundColor: colors.danger },
  free: { color: colors.success, fontSize: 14, fontFamily: fonts.uiSemi },
  full: { color: colors.danger },
  reserve: { height: 48, borderRadius: radius.pill, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  off: { opacity: 0.4 },
  reserveText: { color: colors.white, fontSize: font.md, fontFamily: fonts.uiBold },
  dark: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingVertical: spacing.hero, gap: spacing.lg, backgroundColor: explore.deep, borderRadius: 38 },
  amenity: { minHeight: 66, flexDirection: "row", alignItems: "center", gap: spacing.lg, borderTopWidth: 1, borderTopColor: explore.lineDark },
  amenityText: { flex: 1, color: explore.onDark, fontSize: font.md + 1.5, fontFamily: fonts.uiMedium },
});
