import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FadeIn } from "@/core/components/FadeIn";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { colors, explore, font, fonts, spacing } from "@/core/constants/theme";
import { usePage } from "./pageScroll";
import { StaySearch } from "./StaySearch";

type Frame = {
  image: ImageSource;
  place: string;
  note: string;
  /** Horizontal centre to keep when a wide photo fills a tall screen. */
  focus?: `${number}%`;
};

const FRAMES: Frame[] = [
  { image: require("../../../../assets/bookings/photos/resort/night-facade-portrait.jpg") as ImageSource, place: WEB.hero.caption[0], note: WEB.hero.caption[1] },
  { image: require("../../../../assets/media/lhr-hero.jpg") as ImageSource, focus: "38%", place: "Lahore", note: "Gulberg Main Boulevard" },
];
const HOLD_MS = 6000;
const FADE_MS = 1400;
const LINE = 64;

function Photo({ frame, on, still }: { frame: Frame; on: boolean; still: boolean }) {
  const opacity = useRef(new Animated.Value(on ? 1 : 0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: on ? 1 : 0, duration: still ? 0 : FADE_MS, easing: Easing.inOut(Easing.quad), useNativeDriver: true }).start();
    if (!on || still) return;
    scale.setValue(1);
    Animated.timing(scale, { toValue: 1.08, duration: HOLD_MS + FADE_MS * 2, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }, [on, still, opacity, scale]);
  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity, transform: [{ scale }] }]}>
      <Image cachePolicy="memory-disk" source={frame.image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: frame.focus ?? "50%", top: "50%" }} />
    </Animated.View>
  );
}

/** A headline line that rises from behind its own baseline. */
function RiseLine({ delay, still, children }: { delay: number; still: boolean; children: ReactNode }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: still ? 0 : 1100, delay: still ? 0 : delay, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }).start();
  }, [v, delay, still]);
  return (
    <View style={styles.line}>
      <Animated.View style={{ transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [LINE * 1.2, 0] }) }] }}>{children}</Animated.View>
    </View>
  );
}

type Props = {
  height: number;
  /** Room kept clear for the dock at the bottom of the photo. */
  dock: number;
  /** The hero has scrolled out of view. */
  passed: boolean;
};

/** Opening view: the group's addresses edge to edge, the website's headline, and a stay search ready to use. */
export function HeroStage({ height, dock, passed }: Props) {
  const { y, still } = usePage();
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false);
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  // Moves on by itself until someone picks a photo, scrolls away or asks for less motion.
  useEffect(() => {
    if (still || held || passed || !focused) return undefined;
    const t = setTimeout(() => setActive((i) => (i + 1) % FRAMES.length), HOLD_MS);
    return () => clearTimeout(t);
  }, [active, still, held, passed, focused]);

  const { drift, stretch, fade } = useMemo(
    () => ({
      drift: y.interpolate({ inputRange: [-height, 0, height], outputRange: [-height / 2, 0, still ? 0 : height * 0.3], extrapolate: "clamp" }),
      stretch: y.interpolate({ inputRange: [-height, 0], outputRange: [2, 1], extrapolate: "clamp" }),
      fade: y.interpolate({ inputRange: [0, height * 0.5], outputRange: [1, 0], extrapolate: "clamp" }),
    }),
    [y, height, still],
  );
  const frame = FRAMES[active % FRAMES.length];

  return (
    <View style={[styles.stage, { height }]}>
      <View style={styles.clip}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: drift }, { scale: stretch }] }]}>
          {FRAMES.map((f, i) => (
            <Photo key={f.note} frame={f} on={i === active} still={still} />
          ))}
        </Animated.View>
        <LinearGradient pointerEvents="none" colors={explore.heroFade} locations={explore.heroStops} style={StyleSheet.absoluteFill} />
      </View>

      <View style={[styles.body, { paddingBottom: dock }]}>
        <Animated.View style={[styles.words, { opacity: fade }]}>
          <View style={styles.caption}>
            <Ionicons name="location" size={14} color={explore.gold} />
            <Text style={styles.place} numberOfLines={1}>
              {frame.place}
            </Text>
            <Text style={styles.note} numberOfLines={1}>
              {frame.note}
            </Text>
            <View style={styles.ticks}>
              {FRAMES.map((f, i) => (
                <Pressable
                  key={f.note}
                  hitSlop={{ top: 18, bottom: 18 }}
                  style={styles.tickHit}
                  onPress={() => {
                    setHeld(true);
                    setActive(i);
                  }}
                  accessibilityRole="button"
                  accessibilityState={{ selected: i === active }}
                  accessibilityLabel={`Photo ${i + 1} of ${FRAMES.length}: ${f.place}, ${f.note}`}
                >
                  <View style={[styles.tick, i === active && styles.tickOn]} />
                </Pressable>
              ))}
            </View>
          </View>
          <View accessible accessibilityRole="header" accessibilityLabel={WEB.hero.title.join(" ")}>
            <RiseLine delay={150} still={still}>
              <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1}>
                {WEB.hero.title[0]}
              </Text>
            </RiseLine>
            <RiseLine delay={290} still={still}>
              <Text style={[styles.title, styles.titleSoft]} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1}>
                {WEB.hero.title[1]}
              </Text>
            </RiseLine>
          </View>
        </Animated.View>
        <FadeIn delay={520} y={28} duration={900}>
          <StaySearch />
        </FadeIn>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { marginHorizontal: -spacing.lg, justifyContent: "flex-end" },
  clip: { ...StyleSheet.absoluteFill, overflow: "hidden", backgroundColor: explore.deep, borderBottomLeftRadius: 38, borderBottomRightRadius: 38 },
  body: { padding: spacing.md, gap: spacing.lg },
  words: { paddingHorizontal: spacing.sm, gap: spacing.sm },
  caption: { flexDirection: "row", alignItems: "center", gap: 7 },
  place: { color: colors.white, fontSize: font.sm, fontFamily: fonts.uiSemi },
  note: { flex: 1, color: explore.onDarkSoft, fontSize: font.sm },
  ticks: { flexDirection: "row", gap: 5 },
  tickHit: { paddingVertical: 6 },
  tick: { width: 16, height: 3, borderRadius: 2, backgroundColor: explore.tick },
  tickOn: { width: 28, backgroundColor: explore.gold },
  line: { height: LINE, overflow: "hidden", justifyContent: "center" },
  title: { color: colors.white, fontFamily: fonts.display, fontSize: 60, lineHeight: LINE, letterSpacing: -1.4 },
  titleSoft: { color: explore.gold, fontFamily: fonts.displayItalic },
});
