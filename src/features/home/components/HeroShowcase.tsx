import { useRef, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { ActionTray } from "@/core/components/ActionTray";
import { BannerFace } from "@/core/components/PhotoBanner";
import { PressScale } from "@/core/components/PressScale";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { MEDIA, WEB_MEDIA } from "@/core/constants/media";
import { LAHORE_URL, NATHIA_GALI_URL } from "@/core/constants/serene";
import { groups, spacing } from "@/core/constants/theme";
import { openSite } from "@/core/lib/openSite";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useScrollTo } from "./scrollTarget";
import { useShowcaseStore } from "./showcaseStore";

type Go = "site-ng" | "site-lhr" | "stay" | "invest" | "upcoming" | "story";
type Card = { tag: string; place: string; badge: string; top: string; bottom: string; kind: string; where: string; image?: ImageSource; go: Go; cta: string };

// The web intro's showcase cards, in the same order and wording; each card's button says where it goes.
const CARDS: Card[] = [
  { tag: "Lahore", place: "Serene Heights", badge: "Flagship", top: "Own the", bottom: "address", kind: "Serviced hotel apartments", where: "Gulberg, Lahore", image: MEDIA.lahoreTower, go: "site-lhr", cta: "Visit Lahore" },
  { tag: "Nathia Gali", place: "Serene Booking", badge: "Stay", top: "Stay at", bottom: "7,906 ft", kind: "Hotel apartments", where: "Nathia Gali", image: WEB_MEDIA.pool, go: "stay", cta: "Reserve Your Stay" },
  { tag: "Serene Farms", place: "Upcoming", badge: "Soon", top: "Beyond", bottom: "the mountains", kind: "Upcoming projects", where: "Register interest", image: MEDIA.farms, go: "upcoming", cta: "View Upcoming" },
  { tag: "Serene", place: "Hotels & Resorts", badge: "Our story", top: "Managed as", bottom: "one hotel", kind: "In-house management", where: "DM Consortium", image: MEDIA.nathiaGaliNight, go: "story", cta: "Discover Our Story" },
  { tag: "Nathia Gali", place: "Serene Heights", badge: "Resort", top: "A haven in", bottom: "the highlands", kind: "Winter resort", where: "Galiyat", image: MEDIA.nathiaGaliSky, go: "site-ng", cta: "Visit Nathia Gali" },
  { tag: "Serene", place: "Investors", badge: "Invest", top: "Own a share", bottom: "from PKR 2M", kind: "Smart Property Units", where: "Nathia Gali", go: "invest", cta: "Explore Investments" },
];
const HEIGHT = 224;
const GAP = 12;

/** Explore hero: wide photo cards that drift as they pass, and one button that always matches the card in view. */
export function HeroShowcase() {
  const [active, setActive] = useState(0);
  const setTab = useShowcaseStore((s) => s.setTab);
  const scrollToShowcase = useScrollTo("upcoming");
  // Upcoming = Serene Farms: show its tab first, then bring the section into view.
  const toUpcoming = () => {
    setTab("more");
    scrollToShowcase();
  };
  const toStory = useScrollTo("story");
  const act = (go: Go) => {
    if (go === "site-ng") void openSite(NATHIA_GALI_URL);
    else if (go === "site-lhr") void openSite(LAHORE_URL);
    else if (go === "stay") router.navigate("/bookings");
    else if (go === "invest") router.navigate("/payments");
    else if (go === "upcoming") toUpcoming();
    else toStory();
  };
  const { width } = useWindowDimensions();
  const card = Math.min(width, 560) - spacing.lg * 2;
  const step = card + GAP;
  const x = useRef(new Animated.Value(0)).current;
  const current = CARDS[active];
  return (
    <View style={styles.wrap}>
      <Animated.ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={step}
        decelerationRate="fast"
        style={styles.bleed}
        contentContainerStyle={styles.track}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { x: number } } }) => setActive(Math.max(0, Math.min(CARDS.length - 1, Math.round(e.nativeEvent.contentOffset.x / step)))),
        })}
      >
        {CARDS.map((c, i) => {
          const range = [(i - 1) * step, i * step, (i + 1) * step];
          return (
            <PressScale key={`${c.tag}-${c.bottom}`} onPress={() => act(c.go)} accessibilityLabel={`${c.tag}. ${c.top} ${c.bottom}`} style={[styles.card, { width: card }]}>
              {c.image ? (
                <Animated.View style={[styles.photo, { transform: [{ translateX: x.interpolate({ inputRange: range, outputRange: [-26, 0, 26], extrapolate: "clamp" }) }] }]}>
                  <Image source={c.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
                </Animated.View>
              ) : (
                <View style={styles.watermark}>
                  <SereneLogoMark width={170} fill={groups.champagne} snow={groups.pine} />
                </View>
              )}
              <BannerFace tag={c.tag} place={c.place} badge={c.badge} title={`${c.top} ${c.bottom}`} kind={c.kind} where={c.where} />
            </PressScale>
          );
        })}
      </Animated.ScrollView>
      <View style={styles.dots}>
        {CARDS.map((c, i) => (
          <View key={`${c.tag}-${c.bottom}`} style={[styles.dot, i === active && styles.dotOn]} />
        ))}
      </View>
      <ActionTray
        primary={current.cta}
        onPrimary={() => act(current.go)}
        secondary="Inquire Now"
        onSecondary={() => void openWhatsApp(`Hello Serene Heights, I'd like to know more about ${current.top} ${current.bottom} (${current.tag}).`)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  bleed: { marginHorizontal: -spacing.lg },
  track: { paddingHorizontal: spacing.lg, gap: GAP },
  card: { height: HEIGHT, borderRadius: 26, overflow: "hidden", justifyContent: "space-between", backgroundColor: groups.pine, borderWidth: 1.4, borderColor: groups.heroEdge },
  photo: { position: "absolute", top: 0, bottom: 0, left: -28, right: -28 },
  watermark: { position: "absolute", right: -14, top: 10, opacity: 0.2 },
  dots: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: groups.plateEdge },
  dotOn: { width: 26, backgroundColor: groups.champagne },
});
