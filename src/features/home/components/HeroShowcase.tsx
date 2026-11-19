import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/core/components/Button";
import { GlassPill } from "@/core/components/GlassPill";
import { PerspectiveCarousel3D } from "@/core/components/PerspectiveCarousel3D";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { MEDIA, WEB_MEDIA } from "@/core/constants/media";
import { LAHORE_URL, NATHIA_GALI_URL } from "@/core/constants/serene";
import { colors, dark, fonts, gradients, radius, SCRIM_STOPS, shadows, spacing } from "@/core/constants/theme";
import { openSite } from "@/core/lib/openSite";
import { useScrollTo } from "./scrollTarget";
import { useShowcaseStore } from "./showcaseStore";

type Go = "site-ng" | "site-lhr" | "stay" | "invest" | "upcoming" | "story";
type Card = { tag: string; top: string; bottom: string; image?: ImageSource; go: Go; cta: string };

// The web intro's showcase cards, in the same order and wording; each card's button says where it goes.
const CARDS: Card[] = [
  { tag: "Lahore", top: "Own the", bottom: "address", image: MEDIA.lahoreTower, go: "site-lhr", cta: "Visit Lahore" },
  { tag: "Serene Booking", top: "Stay at", bottom: "7,906 ft", image: WEB_MEDIA.pool, go: "stay", cta: "Reserve Your Stay" },
  { tag: "Upcoming", top: "Beyond", bottom: "the mountains", image: WEB_MEDIA.upClouds, go: "upcoming", cta: "View Upcoming Projects" },
  { tag: "Hotels & Resorts", top: "Managed as", bottom: "one hotel", image: MEDIA.nathiaGaliNight, go: "story", cta: "Discover Our Story" },
  { tag: "Nathia Gali", top: "A haven in", bottom: "the highlands", image: MEDIA.nathiaGaliSky, go: "site-ng", cta: "Visit Nathia Gali" },
  { tag: "Serene Investors", top: "Own a share", bottom: "from PKR 2M", go: "invest", cta: "Explore Investments" },
];

/** Explore hero: a drag-around 3D card ring with the web's own cards, and one button that always matches the centred card. */
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
  const current = CARDS[active];
  return (
    <View style={styles.wrap}>
      <PerspectiveCarousel3D
        data={CARDS}
        keyExtractor={(c) => c.tag}
        onIndexChange={setActive}
        renderItem={(c, _i, ctx) => (
          <Pressable onPress={() => (ctx.active ? act(c.go) : ctx.focus())} style={[styles.card, !c.image && styles.pine]} accessibilityRole="button" accessibilityLabel={`${c.tag}. ${c.top} ${c.bottom}`}>
            {c.image ? (
              <>
                <Image source={c.image} style={styles.fill} contentFit="cover" transition={300} />
                <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={styles.fill} />
              </>
            ) : (
              <>
                <LinearGradient colors={gradients.forest} style={styles.fill} />
                <View style={styles.watermark}>
                  <SereneLogoMark width={190} fill={colors.goldAccent} snow={colors.pineBrand} />
                </View>
              </>
            )}
            <GlassPill label={c.tag} gold style={styles.tag} />
            <View style={styles.body}>
              <Text style={styles.top}>{c.top}</Text>
              <Text style={styles.bottom}>{c.bottom}</Text>
            </View>
          </Pressable>
        )}
      />
      <View style={styles.cta}>
        <Button label={current.cta} showBadge onPress={() => act(current.go)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: { height: 380, borderRadius: radius.xl, overflow: "hidden", justifyContent: "flex-end", backgroundColor: colors.stone, borderWidth: 1, borderColor: colors.line, ...shadows.cardElevated },
  pine: { backgroundColor: colors.pineBrand, borderColor: colors.goldAccent },
  fill: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  watermark: { position: "absolute", right: -spacing.xl, top: spacing.xxl * 2, opacity: 0.14 },
  tag: { position: "absolute", top: spacing.md, left: spacing.md },
  body: { padding: spacing.lg, gap: 0 },
  top: { color: dark.text, fontFamily: fonts.displayMedium, fontSize: 30, lineHeight: 32 },
  bottom: { color: colors.white, fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 38 },
  cta: { alignItems: "center", paddingHorizontal: spacing.xl },
});
