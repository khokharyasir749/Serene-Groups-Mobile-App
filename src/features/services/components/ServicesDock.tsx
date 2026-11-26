import { memo, useEffect, useMemo, useRef, useState, type ComponentRef, type ReactNode, type RefObject } from "react";
import { Animated, Pressable, StyleSheet, View, useWindowDimensions, type LayoutChangeEvent } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavGlass } from "@/core/components/NavGlass";
import { fonts, groups, navGlass } from "@/core/constants/theme";
import { router, usePathname, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { isReduced } from "@/features/services/components/motion";
import { BASE } from "@/features/services/lib/nav";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";

type Slot = { path: string; label: string; icon: (color: string) => ReactNode };
type Box = { x: number; width: number };

const mci = (name: keyof typeof MaterialCommunityIcons.glyphMap) => (color: string) => <MaterialCommunityIcons name={name} size={24} color={color} />;
const ion = (name: keyof typeof Ionicons.glyphMap) => (color: string) => <Ionicons name={name} size={22} color={color} />;

const BOOKINGS = `${BASE}/my-bookings`;
const SLOTS: Slot[] = [
  { path: BASE, label: "Home", icon: ion("home") },
  { path: BOOKINGS, label: "Bookings", icon: mci("calendar-month") },
  { path: `${BASE}/packages`, label: "Packages", icon: mci("gift") },
  { path: `${BASE}/profile`, label: "Profile", icon: mci("card-account-details") },
];
const INDEXES = SLOTS.map((_, i) => i);

const H = 72;
const PAD = 7;

const Face = memo(function Face({ slot, on }: { slot: Slot; on?: boolean }) {
  const color = on ? groups.pine : navGlass.ink;
  return (
    <>
      {slot.icon(color)}
      <Text style={[styles.label, { color }]} numberOfLines={1} maxFontSizeMultiplier={1}>
        {slot.label}
      </Text>
    </>
  );
});

/**
 * The Serene Groups dock (core FloatingDock) with this module's tabs, animated the way Groups animates it: the route decides
 * the active tab, and one spring carries the pill onto that tab's measured slot. Nothing else moves the pill, so it always
 * comes to rest exactly on the tab that is open.
 */
export function ServicesDock({ blurTarget }: { blurTarget?: RefObject<ComponentRef<typeof View> | null> }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const pathname = usePathname();
  const requests = useServicesStore((s) => s.requests.filter(isActive).length);

  const found = SLOTS.findIndex((s) => s.path === pathname);
  const held = useRef(0);
  if (found >= 0) held.current = found; // a page pushed over a tab keeps that tab lit
  const active = held.current;

  const barW = Math.min(width - 32, 460);
  const guess = (barW - PAD * 2) / SLOTS.length;
  // Each tab's real place in the bar, read from layout; an even split until it is measured.
  const [boxes, setBoxes] = useState<Box[]>(() => SLOTS.map((_, i) => ({ x: i * guess, width: guess })));
  const measure = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width: w } = e.nativeEvent.layout;
    const at = x - PAD; // the pill is placed from the padded edge
    setBoxes((b) => (Math.abs(b[i].x - at) < 0.5 && Math.abs(b[i].width - w) < 0.5 ? b : b.map((o, k) => (k === i ? { x: at, width: w } : o))));
  };

  const pos = useRef(new Animated.Value(active)).current;
  useEffect(() => {
    if (isReduced()) {
      pos.setValue(active);
      return;
    }
    // Driven from JS on purpose: with the native driver, Android could keep a half-way value when a page rebuilt during the
    // slide, leaving the pill between two tabs. Here every frame is a real prop, so it always ends on the active tab.
    const run = Animated.spring(pos, { toValue: active, damping: 20, stiffness: 230, mass: 0.8, useNativeDriver: false });
    run.start();
    return () => run.stop();
  }, [active, pos]);

  const pill = useMemo(
    () => ({
      width: boxes[active]?.width ?? guess,
      transform: [{ translateX: pos.interpolate({ inputRange: INDEXES, outputRange: boxes.map((b) => b.x), extrapolate: "clamp" }) }],
    }),
    [boxes, active, guess, pos],
  );
  const faces = useMemo(
    () =>
      INDEXES.map((i) => ({
        off: { opacity: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [1, 0, 1], extrapolate: "clamp" }) },
        on: { opacity: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: "clamp" }) },
      })),
    [pos],
  );

  // Builds the other tabs quietly, one at a time, so the first visit to each is instant.
  useEffect(() => {
    const waits = SLOTS.map((s, i) => (i === held.current ? null : setTimeout(() => router.prefetch(s.path as Href), 1400 + i * 500)));
    return () => waits.forEach((w) => w && clearTimeout(w));
  }, []);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.shadow, { width: barW }]}>
        <View style={styles.bar}>
          <NavGlass radius={H / 2} blurTarget={blurTarget} />
          <Animated.View pointerEvents="none" style={[styles.pill, pill]} />
          {SLOTS.map((s, i) => (
            <Pressable
              key={s.path}
              onLayout={measure(i)}
              onPress={() => {
                if (i !== active) router.navigate(s.path as Href);
              }}
              style={styles.slot}
              accessibilityRole="tab"
              accessibilityState={{ selected: i === active }}
              accessibilityLabel={s.label}
            >
              <Animated.View style={[styles.face, faces[i].off]}>
                <Face slot={s} />
              </Animated.View>
              <Animated.View style={[styles.face, faces[i].on]}>
                <Face slot={s} on />
              </Animated.View>
              {s.path === BOOKINGS && requests > 0 ? <View style={styles.dot} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, alignItems: "center" },
  shadow: { borderRadius: H / 2, boxShadow: navGlass.shadow },
  bar: { height: H, borderRadius: H / 2, flexDirection: "row", padding: PAD },
  pill: { position: "absolute", left: PAD, top: PAD, bottom: PAD, borderRadius: (H - PAD * 2) / 2, backgroundColor: navGlass.pill, borderWidth: 1, borderColor: navGlass.pillRim },
  slot: { flex: 1 },
  face: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", gap: 1 },
  label: { fontSize: 11, lineHeight: 14, fontFamily: fonts.uiBold },
  dot: { position: "absolute", top: 8, right: "28%", width: 10, height: 10, borderRadius: 5, backgroundColor: groups.champagne, borderWidth: 1.5, borderColor: groups.plate },
});
