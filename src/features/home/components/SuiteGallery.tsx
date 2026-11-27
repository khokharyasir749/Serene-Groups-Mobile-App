import { useMemo, useRef } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { ROOMS, WEB } from "@/core/constants/serene";
import { colors, explore, font, fonts, groups, radius, spacing } from "@/core/constants/theme";
import { switchTo } from "@/core/stores/switchStore";
import { photo } from "@/features/bookings/guest/data/photos";
import { ChapterTitle } from "./ChapterTitle";
import { usePage } from "./pageScroll";

type Slug = (typeof ROOMS)[number]["slug"];

/** One photo from each type's own gallery in Serene Bookings. */
const PHOTO: Record<Slug, string> = {
  "classic-one-bedroom": "/images/interiors/bedroom-arch-window.jpg",
  "premier-one-bedroom": "/images/interiors/dining-window.jpg",
  "grand-one-bedroom": "/images/interiors/living-room-wide.jpg",
  "signature-corner-suite": "/images/interiors/guests-lounge.jpg",
  "terrace-apartment": "/images/interiors/sunrise-balcony.jpg",
};
const GAP = 14;

const open = (slug: Slug) => switchTo("Serene Bookings", () => router.push({ pathname: "/serene-bookings/room/[slug]", params: { slug } }));

/** The five residence types as a photo gallery. The card in front stands forward; tapping it opens the room in Serene Bookings. */
export function SuiteGallery() {
  const { still } = usePage();
  const { width } = useWindowDimensions();
  const card = Math.min(Math.round(width * 0.78), 400);
  const step = card + GAP;
  const x = useRef(new Animated.Value(0)).current;
  const onScroll = useMemo(() => Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true }), [x]);
  return (
    <View style={styles.wrap}>
      <ChapterTitle title={WEB.stays.roomsTitle} soft={`${WEB.stays.roomsSoft}.`} />
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        style={styles.bleed}
        contentContainerStyle={{ paddingLeft: spacing.lg, paddingRight: width - card - spacing.lg, gap: GAP }}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {ROOMS.map((r, i) => {
          const range = [(i - 1) * step, i * step, (i + 1) * step];
          const at = (from: number, to: number) => x.interpolate({ inputRange: range, outputRange: [from, to, from], extrapolate: "clamp" });
          const slide = x.interpolate({ inputRange: range, outputRange: [-34, 0, 34], extrapolate: "clamp" });
          return (
            <Animated.View key={r.slug} style={{ width: card, transform: [{ scale: still ? 1 : at(0.95, 1) }] }}>
              <PressScale onPress={() => open(r.slug)} style={[styles.card, { height: Math.round(card * 1.42) }]} accessibilityLabel={`${r.name}. ${r.tagline}. ${r.size}, ${r.guests}. View`}>
                <Animated.View style={[styles.photo, { transform: [{ translateX: still ? 0 : slide }] }]}>
                  <Image cachePolicy="memory-disk" source={photo(PHOTO[r.slug]) as ImageSource} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
                </Animated.View>
                <LinearGradient pointerEvents="none" colors={explore.tileFade} style={StyleSheet.absoluteFill} />
                <View style={styles.body}>
                  <Text style={styles.name} numberOfLines={2} maxFontSizeMultiplier={1.1}>
                    {r.name.replace(" One-", "\nOne-")}
                  </Text>
                  <Text style={styles.line} numberOfLines={2}>
                    {r.tagline}
                  </Text>
                  <View style={styles.foot}>
                    <View style={styles.facts}>
                      <Text style={styles.fact} numberOfLines={1}>
                        {r.size}
                      </Text>
                      <Text style={styles.fact} numberOfLines={1}>
                        {r.guests}
                      </Text>
                    </View>
                    <View style={styles.view}>
                      <Text style={styles.viewText} maxFontSizeMultiplier={1.1}>
                        View
                      </Text>
                      <Ionicons name="arrow-forward" size={16} color={explore.deep} />
                    </View>
                  </View>
                </View>
              </PressScale>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>
      <View style={styles.dots}>
        {ROOMS.map((r, i) => (
          <View key={r.slug} style={styles.dotBase}>
            <Animated.View style={[StyleSheet.absoluteFill, styles.dotOn, { opacity: x.interpolate({ inputRange: [(i - 1) * step, i * step, (i + 1) * step], outputRange: [0, 1, 0], extrapolate: "clamp" }) }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  card: { borderRadius: 34, overflow: "hidden", justifyContent: "flex-end", backgroundColor: explore.deep },
  photo: { position: "absolute", top: 0, bottom: 0, left: -34, right: -34 },
  body: { padding: spacing.lg, gap: 4 },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 34, lineHeight: 35, letterSpacing: -0.4 },
  line: { color: explore.onDarkSoft, fontSize: font.md, lineHeight: 21 },
  foot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, marginTop: spacing.md },
  facts: { flex: 1 },
  fact: { color: colors.white, fontSize: font.sm, lineHeight: 19, fontFamily: fonts.uiMedium },
  view: { flexDirection: "row", alignItems: "center", gap: 8, height: 46, paddingHorizontal: 18, borderRadius: radius.pill, backgroundColor: explore.gold },
  viewText: { color: explore.deep, fontSize: font.md, fontFamily: fonts.uiBold },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: -spacing.sm },
  dotBase: { width: 22, height: 3, borderRadius: 2, backgroundColor: explore.line, overflow: "hidden" },
  dotOn: { backgroundColor: groups.pine },
});
