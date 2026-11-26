import { memo, useEffect, useRef, type ComponentRef, type RefObject } from "react";
import { Animated, Easing, Platform, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { sf } from "@/features/services/components/fonts";
import { isReduced } from "@/features/services/components/motion";
import { ServiceIcon, type ServiceIconName } from "@/features/services/components/ServiceIcon";
import { tone } from "@/features/services/components/tone";
import { BASE } from "@/features/services/lib/nav";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";

type Slot = { path: string; label: string; icon: ServiceIconName };

const BOOKINGS = `${BASE}/my-bookings`;
const SLOTS: Slot[] = [
  { path: BASE, label: "Home", icon: "home" },
  { path: BOOKINGS, label: "Bookings", icon: "calendar" },
  { path: `${BASE}/packages`, label: "Packages", icon: "gift" },
  { path: `${BASE}/profile`, label: "Profile", icon: "user" },
];

const H = 66;
const PAD = 5;

const Face = memo(function Face({ slot, on }: { slot: Slot; on?: boolean }) {
  const color = on ? tone.onPine : tone.dockInk;
  return (
    <>
      <ServiceIcon name={slot.icon} size={24} color={color} filled={on} />
      <Text style={[styles.label, { color }, on && styles.labelOn]} numberOfLines={1} maxFontSizeMultiplier={1}>
        {slot.label}
      </Text>
    </>
  );
});

/** Blurred glass dock in the manner of an iPhone tab bar: line icons, quiet labels, and a glass capsule that lifts, stretches and settles on the open tab, all on the native driver. */
export function ServicesDock({ blurTarget }: { blurTarget?: RefObject<ComponentRef<typeof View> | null> }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const requests = useServicesStore((s) => s.requests.filter(isActive).length);
  const found = SLOTS.findIndex((s) => s.path === pathname);
  const held = useRef(0);
  if (found >= 0) held.current = found; // a pushed page keeps the tab it came from
  const active = held.current;
  const barW = Math.min(width - 40, 390);
  const cell = (barW - PAD * 2 - 2) / SLOTS.length;
  const pos = useRef(new Animated.Value(active)).current;
  const lift = useRef(new Animated.Value(0)).current;

  const aim = useRef(active);
  const frame = useRef(0);
  const slide = (i: number) => {
    if (aim.current === i) return;
    aim.current = i;
    if (isReduced()) {
      pos.setValue(i);
      return;
    }
    // Like the iPhone's glass tab bar: the capsule lifts and stretches as it travels, then settles with a little give.
    Animated.parallel([
      Animated.spring(pos, { toValue: i, damping: 17, stiffness: 165, mass: 0.85, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(lift, { toValue: 1, duration: 140, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.spring(lift, { toValue: 0, damping: 11, stiffness: 150, mass: 0.8, useNativeDriver: true }),
      ]),
    ]).start();
  };
  // A finger on a tab swells the capsule a little, as glass does under a touch.
  const press = (v: number) => {
    if (!isReduced()) Animated.spring(lift, { toValue: v, damping: 16, stiffness: 260, mass: 0.6, useNativeDriver: true }).start();
  };
  // The pill sets off first; the page changes on the next frame. The last tab tapped wins.
  const open = (i: number) => {
    slide(i);
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => router.navigate(SLOTS[i].path as Href));
  };

  useEffect(() => {
    slide(active);
    // Follows the route (back button, links); slide works on refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Builds the other tabs quietly, one at a time, so the first visit to each is instant.
  useEffect(() => {
    const waits = SLOTS.map((s, i) => (i === held.current ? null : setTimeout(() => router.prefetch(s.path as Href), 1400 + i * 500)));
    return () => waits.forEach((w) => w && clearTimeout(w));
  }, []);

  const last = SLOTS.length - 1;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.shadow, { width: barW }]}>
        <View style={styles.bar}>
          {/* Dark blur, kept strong by turning the reduction off; a low intensity keeps Android's own tint light. */}
          <BlurView blurTarget={blurTarget} blurMethod="dimezisBlurView" blurReductionFactor={1} tint={Platform.OS === "ios" ? "systemUltraThinMaterialDark" : "dark"} intensity={Platform.OS === "ios" ? 60 : 30} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={Platform.OS === "ios" ? tone.dockGlassIos : tone.dockGlass} style={StyleSheet.absoluteFill} />
          <View pointerEvents="none" style={styles.edge} />
          <Animated.View pointerEvents="none" renderToHardwareTextureAndroid style={[
              styles.pill,
              {
                width: cell,
                transform: [
                  { translateX: pos.interpolate({ inputRange: [0, last], outputRange: [0, cell * last], extrapolate: "clamp" }) },
                  { scaleX: lift.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.9, 1, 1.24] }) },
                  { scaleY: lift.interpolate({ inputRange: [-1, 0, 1], outputRange: [1.06, 1, 1.12] }) },
                ],
              },
            ]}
          >
            <LinearGradient pointerEvents="none" colors={tone.dockPillSheen} style={styles.pillSheen} />
            <Animated.View style={[styles.glow, { opacity: lift.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: "clamp" }) }]} />
          </Animated.View>
          {SLOTS.map((s, i) => {
            const on = pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: "clamp" });
            const off = pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [1, 0, 1], extrapolate: "clamp" });
            return (
              <Pressable key={s.path} onPressIn={() => press(0.4)} onPressOut={() => i === aim.current && press(0)} onPress={() => (i !== aim.current ? open(i) : press(0))} style={styles.slot} accessibilityRole="tab" accessibilityState={{ selected: i === active }} accessibilityLabel={s.label}>
                <Animated.View renderToHardwareTextureAndroid style={[styles.face, { opacity: off }]}>
                  <Face slot={s} />
                </Animated.View>
                <Animated.View renderToHardwareTextureAndroid style={[styles.face, { opacity: on, transform: [{ scale: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0.86, 1, 0.86], extrapolate: "clamp" }) }] }]}>
                  <Face slot={s} on />
                </Animated.View>
                {s.path === BOOKINGS && requests > 0 ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, alignItems: "center" },
  shadow: { borderRadius: H / 2, boxShadow: tone.dockShadow },
  bar: { height: H, borderRadius: H / 2, overflow: "hidden", flexDirection: "row", padding: PAD, borderWidth: 1, borderColor: tone.dockRim },
  // Light caught along the rim of the glass.
  edge: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: H / 2, boxShadow: tone.dockEdge },
  pill: { position: "absolute", left: PAD, top: PAD, bottom: PAD, borderRadius: (H - PAD * 2) / 2, overflow: "hidden", backgroundColor: tone.dockPill, borderWidth: 1, borderColor: tone.dockPillEdge },
  pillSheen: { position: "absolute", top: 0, left: 0, right: 0, height: "55%" },
  glow: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, borderRadius: (H - PAD * 2) / 2, backgroundColor: tone.dockPillGlow },
  slot: { flex: 1 },
  face: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", gap: 2 },
  label: { fontSize: 11, lineHeight: 14, letterSpacing: 0.1, fontFamily: sf.uiMedium },
  labelOn: { fontFamily: sf.uiSemi },
  dot: { position: "absolute", top: 7, right: "31%", width: 7, height: 7, borderRadius: 3.5, backgroundColor: tone.champagne },
});
