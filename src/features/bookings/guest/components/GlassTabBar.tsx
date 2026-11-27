import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePathname, useRouter as useRawRouter } from 'expo-router';
import { memo, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { NavGlass, type BlurTarget } from '@/core/components/NavGlass';
import { PlateButton } from '@/core/components/PlateButton';
import { groups, navGlass } from '@/core/constants/theme';
import { scrollActiveToTop, useScrollTopVisible } from '@/features/bookings/guest/components/ScrollTop';
import { Text } from '@/features/bookings/guest/components/Text';
import { BASE, useRouter } from '@/features/bookings/guest/lib/nav';
import { tabOf, useBooking } from '@/features/bookings/guest/state/booking';
import { FONTS, S } from '@/features/bookings/guest/theme';

// The Serene Groups dock (core FloatingDock) with this module's tabs: the same glass, capsule, icon and label sizes. The
// route decides the active tab and one native spring carries the capsule onto that tab's measured slot; nothing else moves it.

const mci = (name: keyof typeof MaterialCommunityIcons.glyphMap) => (color: string) => <MaterialCommunityIcons name={name} size={24} color={color} />;
const ion = (name: keyof typeof Ionicons.glyphMap) => (color: string) => <Ionicons name={name} size={22} color={color} />;

type Item = { name: string; path: string; label: string; icon: (color: string) => ReactNode };
const ITEMS: Item[] = [
  { name: 'index', path: BASE, label: 'Discover', icon: ion('compass') },
  { name: 'apartments', path: `${BASE}/apartments`, label: 'Stay', icon: ion('bed') },
  { name: 'trips', path: `${BASE}/trips`, label: 'Trips', icon: mci('calendar-month') },
  { name: 'menu', path: `${BASE}/menu`, label: 'Menu', icon: ion('menu') },
];
const INDEXES = ITEMS.map((_, i) => i);
const MENU = ITEMS.length - 1;
const TRIPS = 2;
const NATIVE = Platform.OS !== 'web';

const H = S.tabBar;
const PAD = 7;
type Box = { x: number; width: number };

// ── Active tab, synced from the navigator ────────────────────────────────
let activeName = 'index';
const listeners = new Set<() => void>();
const useActiveName = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => {
        listeners.delete(l);
      };
    },
    () => activeName,
  );

/** Rendered as the navigator's tab bar: reports the active tab, draws nothing itself. */
export function DockBridge({ state }: { state: { index: number; routes: readonly { name: string }[] } }) {
  const name = state.routes[state.index]?.name ?? 'index';
  useEffect(() => {
    if (name === activeName) return;
    activeName = name;
    listeners.forEach((l) => l());
  }, [name]);
  return null;
}

const Face = memo(function Face({ item, on }: { item: Item; on?: boolean }) {
  const color = on ? groups.pine : navGlass.ink;
  return (
    <>
      {item.icon(color)}
      <Text style={[styles.label, { color }]} numberOfLines={1} maxFontSizeMultiplier={1}>
        {item.label}
      </Text>
    </>
  );
});

export function FloatingDock({ blurTarget }: { blurTarget?: BlurTarget }) {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const guarded = useRouter(); // 450 ms guard, for Menu
  const tabs = useRawRouter(); // tab switches can't stack screens, so they are never dropped
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
  }, []);
  const name = useActiveName();
  const menuOpen = usePathname() === `${BASE}/menu`;
  const active = menuOpen ? MENU : Math.max(0, ITEMS.findIndex((t) => t.name === name));
  const showTop = useScrollTopVisible();
  const trips = useBooking((s) => s.bookings.filter((b) => tabOf(b) === 'upcoming').length);

  const barW = Math.min(screenW - 32, 460);
  const guess = (barW - PAD * 2) / ITEMS.length;
  const [boxes, setBoxes] = useState<Box[]>(() => ITEMS.map((_, i) => ({ x: i * guess, width: guess })));
  const measure = (i: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    const at = x - PAD;
    setBoxes((b) => (Math.abs(b[i].x - at) < 0.5 && Math.abs(b[i].width - width) < 0.5 ? b : b.map((o, k) => (k === i ? { x: at, width } : o))));
  };

  const pos = useRef(new Animated.Value(active)).current;
  useEffect(() => {
    if (reduced) {
      pos.setValue(active);
      return;
    }
    const run = Animated.spring(pos, { toValue: active, damping: 20, stiffness: 230, mass: 0.8, useNativeDriver: NATIVE });
    run.start();
    return () => run.stop();
  }, [active, pos, reduced]);

  const pill = useMemo(
    () => ({ width: boxes[0].width, transform: [{ translateX: pos.interpolate({ inputRange: INDEXES, outputRange: boxes.map((b) => b.x), extrapolate: 'clamp' }) }] }),
    [boxes, pos],
  );
  const faces = useMemo(
    () =>
      INDEXES.map((i) => ({
        off: { opacity: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [1, 0, 1], extrapolate: 'clamp' }) },
        on: { opacity: pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: 'clamp' }) },
      })),
    [pos],
  );

  const press = (i: number) => {
    if (i === MENU) guarded.navigate('/menu');
    else if (i !== active) tabs.navigate(ITEMS[i].path);
  };

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.shadow, { width: barW }]}>
        <View style={styles.bar}>
          <NavGlass radius={H / 2} blurTarget={blurTarget} />
          <Animated.View pointerEvents="none" style={[styles.pill, pill]} />
          {ITEMS.map((t, i) => (
            <Pressable
              key={t.name}
              onLayout={measure(i)}
              onPress={() => press(i)}
              style={styles.slot}
              accessibilityRole={i === MENU ? 'button' : 'tab'}
              accessibilityState={i === MENU ? undefined : { selected: i === active }}
              accessibilityLabel={i === TRIPS && trips > 0 ? `${t.label}, ${trips} upcoming` : t.label}
            >
              <Animated.View style={[styles.face, faces[i].off]}>
                <Face item={t} />
              </Animated.View>
              <Animated.View style={[styles.face, faces[i].on]}>
                <Face item={t} on />
              </Animated.View>
              {i === TRIPS && trips > 0 ? <View style={styles.dot} /> : null}
            </Pressable>
          ))}
        </View>
      </View>
      {showTop ? (
        <View style={styles.top}>
          <PlateButton icon="chevron-up-outline" label="Scroll to top" size={40} onPress={scrollActiveToTop} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  shadow: { borderRadius: H / 2, boxShadow: navGlass.shadow },
  bar: { height: H, borderRadius: H / 2, flexDirection: 'row', padding: PAD },
  pill: { position: 'absolute', left: PAD, top: PAD, bottom: PAD, borderRadius: (H - PAD * 2) / 2, backgroundColor: navGlass.pill, borderWidth: 1, borderColor: navGlass.pillRim },
  slot: { flex: 1 },
  face: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', gap: 1 },
  label: { fontSize: 11, lineHeight: 14, fontFamily: FONTS.uiBold },
  dot: { position: 'absolute', top: 8, right: '28%', width: 10, height: 10, borderRadius: 5, backgroundColor: groups.champagne, borderWidth: 1.5, borderColor: groups.plate },
  top: { position: 'absolute', right: 0, top: -52 },
});
