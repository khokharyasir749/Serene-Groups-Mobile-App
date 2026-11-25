import { Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGetAvailabilityQuery } from "@/core/api/endpoints/publicApi";
import { ActionTray } from "@/core/components/ActionTray";
import { PhotoBanner } from "@/core/components/PhotoBanner";
import { SectionHeader } from "@/core/components/SectionHeader";
import { StatGrid } from "@/core/components/StatGrid";
import { Text } from "@/core/components/Text";
import { TileRail } from "@/core/components/TileRail";
import { WEB_MEDIA } from "@/core/constants/media";
import { AMENITIES, NATHIA_GALI_TOTAL_UNITS, PROJECT_GEO, ROOMS, WEB } from "@/core/constants/serene";
import { colors, fonts, groups, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { switchTo } from "@/core/stores/switchStore";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";
import { RoomShowcase } from "./RoomShowcase";
import { useScrollTo } from "./scrollTarget";

const ENQUIRY = "Hello Serene Heights, I'd like to check availability for a stay at Serene Heights Nathia Gali.";
const MAP = `https://www.google.com/maps/search/?api=1&query=${PROJECT_GEO["nathia-gali"].lat},${PROJECT_GEO["nathia-gali"].lon}`;
// One glyph per amenity, in the list's order.
const AMENITY_ICON = ["pool", "weather-sunset", "silverware-fork-knife", "ski", "pine-tree", "bow-arrow", "terrain", "golf"] as const satisfies readonly (keyof typeof MaterialCommunityIcons.glyphMap)[];

/** Heading, ways in, the resort, the two actions and the key figures. */
export function StayIntro() {
  const openReserve = useReserveStore((st) => st.openReserve);
  const toSuites = useScrollTo("suites");
  const toAmenities = useScrollTo("amenities");
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow={WEB.stays.eyebrow} title={WEB.stays.title} soft={`${WEB.stays.soft}.`} />
      <TileRail
        tiles={[
          { label: "Reserve", icon: "calendar-check", go: () => openReserve({}) },
          { label: "Suites", icon: "bed", go: toSuites },
          { label: "Amenities", icon: "pool", go: toAmenities },
          { label: "Map", icon: "map-marker", go: () => void Linking.openURL(MAP) },
          { label: "Bookings", icon: "cellphone", go: () => switchTo("Serene Bookings", () => router.push("/serene-bookings")) },
          { label: "Ask us", icon: "whatsapp", go: () => void openWhatsApp(ENQUIRY) },
        ]}
      />
      <PhotoBanner image={WEB_MEDIA.pool} tag="Nathia Gali" place="Serene Heights" badge="Resort" title="Your mountain stay" kind="Hotel apartments" where="2 hrs from Islamabad" />
      <ActionTray primary="Reserve Your Stay" onPrimary={() => openReserve({})} secondary="Enquire" onSecondary={() => void openWhatsApp(ENQUIRY)} />
      <StatGrid
        short
        stats={[
          { value: "7,906", unit: " ft", label: "Above sea level" },
          { value: String(ROOMS.length), unit: " types", label: "Of residence" },
          { value: String(NATHIA_GALI_TOTAL_UNITS), label: "Hotel apartments" },
          { value: "2", unit: " hrs", label: "From Islamabad" },
        ]}
      />
    </View>
  );
}

export function StayRooms() {
  const { data } = useGetAvailabilityQuery();
  return <RoomShowcase availability={data} />;
}

export function StayAmenities() {
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="On the mountain" title="All of it," soft="on site." />
      <View style={styles.grid}>
        {AMENITIES.map((a, i) => (
          <View key={a} style={styles.amenity}>
            <View style={styles.well}>
              <MaterialCommunityIcons name={AMENITY_ICON[i] ?? "star-four-points"} size={21} color={colors.white} />
            </View>
            <Text style={styles.amenityText}>{a}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  amenity: { flexGrow: 1, flexBasis: "46%", minHeight: 64, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 10 },
  well: { width: 40, height: 40, borderRadius: 14, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  amenityText: { flex: 1, color: groups.pine, fontSize: 13, lineHeight: 17, fontFamily: fonts.uiMedium },
});
