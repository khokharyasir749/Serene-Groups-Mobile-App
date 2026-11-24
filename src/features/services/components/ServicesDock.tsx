import { useEffect, useRef, type ComponentRef, type RefObject } from "react";
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { router, usePathname, type Href } from "expo-router";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, fonts, spacing, svc } from "@/core/constants/theme";
import { BASE } from "@/features/services/lib/nav";

const TABS = [
  { label: "Home", path: BASE },
  { label: "Bookings", path: `${BASE}/my-bookings` },
  { label: "Packages", path: `${BASE}/packages` },
  { label: "Profile", path: `${BASE}/profile` },
];
const LAST = TABS.length - 1;
const RADIUS = 17;
const HEIGHT = 52;
/** Space that opens on each side of the active tab. */
const GAP = 9;
const MAX_W = 440;

type BlurTarget = RefObject<ComponentRef<typeof View> | null>;

/**
 * One end of the split bar. A moving, rounded window reveals a glass pane that itself stays still on screen (it is shifted back by
 * the same amount), so the segment grows and shrinks on the native driver with no layout, and the blur never drags.
 */
function Segment({ width, shift, blurTarget }: { width: number; shift: Animated.AnimatedInterpolation<number>; blurTarget: BlurTarget }) {
  const back = Animated.multiply(shift, -1);
  return (
    <View pointerEvents="none" style={[styles.clip, { width }]}>
      <Animated.View style={[styles.window, { width, transform: [{ translateX: shift }] }]}>
        <Animated.View style={[styles.pane, { width, transform: [{ translateX: back }] }]}>
          <BlurView blurTarget={blurTarget} blurMethod="dimezisBlurView" tint="light" intensity={32} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={svc.dockGlass} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={[StyleSheet.absoluteFill, styles.edge]} />
        </Animated.View>
        <View style={[StyleSheet.absoluteFill, styles.edge]} />
      </Animated.View>
    </View>
  );
}

/** Serene Services' own dock: a clear glass bar that splits around the active tab, which floats between the halves as a Pine pill. */
export function ServicesDock({ blurTarget }: { blurTarget: BlurTarget }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const found = TABS.findIndex((t) => t.path === pathname);
  const last = useRef(0);
  if (found >= 0) last.current = found; // a pushed page keeps the tab it came from
  const index = last.current;

  const barW = Math.min(width - spacing.lg * 2, MAX_W);
  const cell = (barW - GAP * 2) / TABS.length;
  const pos = useRef(new Animated.Value(index)).current; // measured in tabs

  useEffect(() => {
    Animated.spring(pos, { toValue: index, damping: 20, stiffness: 170, mass: 0.9, useNativeDriver: true }).start();
  }, [index, pos]);

  // Everything follows this one value; clamped so the spring never pushes past the ends.
  const along = (from: number, to: number) => pos.interpolate({ inputRange: [0, LAST], outputRange: [from, to], extrapolate: "clamp" });
  const leftShift = along(-barW, cell * LAST - barW); // right end of the left half sits at pos * cell
  const rightShift = along(cell + GAP * 2, barW); // left end of the right half sits two gaps after the pill
  const pillX = along(GAP, GAP + cell * LAST);
  // At either end only one gap is open, so the whole bar re-centres.
  const centre = pos.interpolate({ inputRange: [0, 1, LAST - 1, LAST], outputRange: [-GAP / 2, 0, 0, GAP / 2], extrapolate: "clamp" });

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 14 }]}>
      <Animated.View style={[styles.bar, { width: barW, transform: [{ translateX: centre }] }]}>
        <Segment width={barW} shift={leftShift} blurTarget={blurTarget} />
        <Segment width={barW} shift={rightShift} blurTarget={blurTarget} />
        <Animated.View pointerEvents="none" style={[styles.pill, { width: cell, transform: [{ translateX: pillX }] }]}>
          <LinearGradient colors={svc.dockPill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.pillFill}>
            <LinearGradient colors={svc.dockPillGlow} style={styles.glow} />
            <LinearGradient colors={svc.dockPillRim} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.rim} />
          </LinearGradient>
        </Animated.View>
        {TABS.map((t, i) => {
          const range = [i - 1, i, i + 1];
          // A label steps aside as the pill arrives and passes, and its two colours cross-fade.
          const x = pos.interpolate({ inputRange: range, outputRange: [cell * i + GAP * 2, cell * i + GAP, cell * i], extrapolate: "clamp" });
          const lit = pos.interpolate({ inputRange: range, outputRange: [0, 1, 0], extrapolate: "clamp" });
          const dim = pos.interpolate({ inputRange: range, outputRange: [1, 0, 1], extrapolate: "clamp" });
          return (
            <Animated.View key={t.path} style={[styles.tab, { width: cell, transform: [{ translateX: x }] }]}>
              <Pressable onPress={() => i !== index && router.navigate(t.path as Href)} style={styles.press} accessibilityRole="tab" accessibilityLabel={t.label} accessibilityState={{ selected: i === index }}>
                <Animated.View style={{ opacity: dim }}>
                  <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.15}>
                    {t.label}
                  </Text>
                </Animated.View>
                <Animated.View style={[StyleSheet.absoluteFill, styles.press, { opacity: lit }]}>
                  <Text style={[styles.label, styles.labelOn]} numberOfLines={1} maxFontSizeMultiplier={1.15}>
                    {t.label}
                  </Text>
                </Animated.View>
              </Pressable>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, alignItems: "center" },
  bar: { height: HEIGHT },
  clip: { position: "absolute", left: 0, top: 0, height: HEIGHT, borderRadius: RADIUS, overflow: "hidden" },
  window: { height: HEIGHT, borderRadius: RADIUS, overflow: "hidden", boxShadow: svc.dockHair },
  pane: { height: HEIGHT, borderRadius: RADIUS, overflow: "hidden" },
  edge: { borderRadius: RADIUS, borderWidth: 1, borderColor: svc.dockEdge },
  pill: { position: "absolute", left: 0, top: 0, height: HEIGHT, borderRadius: RADIUS, boxShadow: svc.dockPillShadow },
  pillFill: { flex: 1, borderRadius: RADIUS, overflow: "hidden", borderWidth: 1, borderColor: svc.dockPillEdge },
  glow: { position: "absolute", left: 0, right: 0, top: 0, height: 18 },
  rim: { position: "absolute", left: 0, right: 0, top: 0, height: 1.5 },
  tab: { position: "absolute", left: 0, top: 0, height: HEIGHT },
  press: { flex: 1, alignItems: "center", justifyContent: "center" },
  label: { color: svc.dockMuted, fontSize: 13, fontFamily: fonts.uiSemi },
  labelOn: { color: colors.white, fontFamily: fonts.uiBold },
});
