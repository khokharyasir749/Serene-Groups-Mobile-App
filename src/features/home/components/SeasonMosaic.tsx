import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { switchTo } from "@/core/stores/switchStore";
import { photo } from "@/features/bookings/guest/data/photos";
import { ChapterTitle } from "./ChapterTitle";

type Shot = { src: string; name: string; focus?: `${number}%` };

const WIDE: Shot = { src: "/images/resort/aerial-rooftop-pool.jpg", name: "Rooftop infinity pool" };
const LEFT: Shot[] = [
  { src: "/images/activities/ski-slope.jpg", name: "Ski slope" },
  { src: "/images/activities/mini-golf.jpg", name: "Mini golf", focus: "20%" },
];
const RIGHT: Shot[] = [
  { src: "/images/dining/rooftop-restaurant.jpg", name: "Rooftop dining", focus: "30%" },
  { src: "/images/activities/winter-trails.jpg", name: "Winter trails", focus: "70%" },
];

const all = () => switchTo("Serene Bookings", () => router.push("/serene-bookings/amenities"));

function Tile({ shot, height }: { shot: Shot; height: number }) {
  return (
    <PressScale onPress={all} style={[styles.tile, { height }]} accessibilityLabel={`${shot.name}. See all amenities`}>
      <Image cachePolicy="memory-disk" source={photo(shot.src) as ImageSource} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: shot.focus ?? "50%", top: "50%" }} transition={300} />
      <LinearGradient pointerEvents="none" colors={explore.tileFade} style={StyleSheet.absoluteFill} />
      <Text style={styles.name} maxFontSizeMultiplier={1.15}>
        {shot.name}
      </Text>
    </PressScale>
  );
}

/** What there is to do at the resort, as an uneven photo wall. */
export function SeasonMosaic() {
  return (
    <View style={styles.wrap}>
      <ChapterTitle title="Something for" soft="every season." />
      <View style={styles.wall}>
        <Tile shot={WIDE} height={236} />
        <View style={styles.cols}>
          <View style={styles.col}>
            <Tile shot={LEFT[0]} height={248} />
            <Tile shot={LEFT[1]} height={168} />
          </View>
          <View style={styles.col}>
            <Tile shot={RIGHT[0]} height={168} />
            <Tile shot={RIGHT[1]} height={248} />
          </View>
        </View>
      </View>
      <PressScale onPress={all} style={styles.more} accessibilityLabel="See all amenities in Serene Bookings">
        <Text style={styles.moreText}>See all amenities</Text>
        <Ionicons name="arrow-forward" size={19} color={groups.pine} />
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  wall: { gap: 8, marginHorizontal: -spacing.sm },
  cols: { flexDirection: "row", gap: 8 },
  col: { flex: 1, gap: 8 },
  tile: { borderRadius: 26, overflow: "hidden", justifyContent: "flex-end", backgroundColor: explore.deep },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 28, lineHeight: 29, padding: spacing.md + 4 },
  more: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 58, borderTopWidth: 1, borderBottomWidth: 1, borderColor: explore.line },
  moreText: { color: groups.pine, fontSize: font.md + 1, fontFamily: fonts.uiSemi },
});
