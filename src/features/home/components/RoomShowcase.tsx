import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPill } from "@/core/components/GlassPill";
import { AnimatedBar } from "@/core/components/AnimatedBar";
import { SectionHeader } from "@/core/components/SectionHeader";
import { PerspectiveCarousel3D } from "@/core/components/PerspectiveCarousel3D";
import { ROOM_MEDIA } from "@/core/constants/media";
import { ROOMS } from "@/core/constants/serene";
import { colors, dark, font, fonts, gradients, letter, radius, SCRIM_STOPS, shadows, spacing } from "@/core/constants/theme";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";
import type { UnitAvailability } from "@/features/bookings/types";

/** Five residence types in a centered snap carousel: sq ft, guests and live availability as compact floating badges. */
export function RoomShowcase({ availability }: { availability?: UnitAvailability[] }) {
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="Curated residences & suites" title="Five ways" soft="to stay." />
      <PerspectiveCarousel3D
        widthRatio={0.74}
        data={ROOMS}
        keyExtractor={(r) => r.slug}
        renderItem={(r, i) => {
          const live = availability?.find((a) => a.slug === r.slug);
          const soldOut = live ? live.available <= 0 : false;
          return (
            <View style={styles.card}>
              <Image source={ROOM_MEDIA[r.slug]} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
              <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
              <View style={styles.top}>
                <Text style={styles.idx}>{`0${i + 1}`}</Text>
                <View style={styles.badges}>
                  <GlassPill label={r.size} style={styles.badge} />
                  <GlassPill label={r.guests} style={styles.badge} />
                </View>
              </View>
              <View style={styles.body}>
                <Text style={styles.name}>{r.name}</Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {r.tagline}
                </Text>
                <AnimatedBar onDark height={4} value={live && live.units ? live.booked / live.units : 0} delay={200 + i * 100} />
                <View style={styles.foot}>
                  <Text style={[styles.avail, soldOut && styles.soldOut]}>
                    {live ? (soldOut ? "Sold out" : `${live.available} of ${live.units} available`) : `${r.units} apartments`}
                  </Text>
                  <Pressable onPress={() => openReserve({ roomSlug: r.slug })} style={({ pressed }) => [styles.cta, pressed && styles.pressed]} accessibilityRole="button">
                    <Text style={styles.ctaText}>Reserve</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  card: { height: 360, borderRadius: radius.xl, overflow: "hidden", justifyContent: "flex-end", backgroundColor: colors.stone, borderWidth: 1, borderColor: colors.line, ...shadows.cardElevated },
  top: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  idx: { color: dark.text, fontFamily: fonts.displayItalic, fontSize: font.xl },
  badges: { alignItems: "flex-end", gap: 5 },
  badge: { alignSelf: "flex-end" },
  body: { padding: spacing.lg, gap: 6 },
  name: { color: dark.text, fontFamily: fonts.display, fontSize: 28, lineHeight: 30, letterSpacing: letter.tight },
  sub: { color: dark.muted, fontSize: font.sm },
  foot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm, marginTop: 2 },
  avail: { color: colors.white, fontSize: font.xs, fontFamily: fonts.uiSemi, backgroundColor: colors.photoGlass, borderWidth: 1, borderColor: colors.photoGlassBorder, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, overflow: "hidden" },
  soldOut: { color: colors.danger, borderColor: colors.danger },
  cta: { backgroundColor: colors.snow, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 8 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.92 },
  ctaText: { color: colors.pineBrand, fontSize: font.xs, fontFamily: fonts.uiBold },
});
