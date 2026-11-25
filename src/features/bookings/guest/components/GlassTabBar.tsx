import { HEX } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { usePathname, useRouter as useRawRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentProps } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { scrollActiveToTop, useScrollTopVisible } from '@/features/bookings/guest/components/ScrollTop';
import { Text } from '@/features/bookings/guest/components/Text';
import { BASE, useRouter } from '@/features/bookings/guest/lib/nav';
import { tabOf, useBooking } from '@/features/bookings/guest/state/booking';
import { FONTS, S } from '@/features/bookings/guest/theme';

// Liquid-lens dock: a smoked capsule of icons and labels. The active tab sits in a soft pill; touch or drag the bar and the
// pill lifts into a clear lens, larger than the bar, under which icons fill in and grow. Let go and it settles.
//
// Built to never stutter: the finger drives `drag` through a native Animated.event, so no JavaScript runs while dragging, and
// everything else is a native spring. Only transforms and opacity move; nothing is clipped, masked or laid out.

type Glyph = ComponentProps<typeof Ionicons>['name'];
type Item = { name: string; path: string; label: string; icon: Glyph; filled: Glyph };
const ITEMS: Item[] = [
  { name: 'index', path: BASE, label: 'Discover', icon: 'compass-outline', filled: 'compass' },
  { name: 'apartments', path: `${BASE}/apartments`, label: 'Stay', icon: 'bed-outline', filled: 'bed' },
  { name: 'trips', path: `${BASE}/trips`, label: 'Trips', icon: 'calendar-outline', filled: 'calendar' },
  { name: 'menu', path: `${BASE}/menu`, label: 'Menu', icon: 'menu-outline', filled: 'menu' },
];
const N = ITEMS.length;
const MENU = N - 1;
const TRIPS = 2;
const NATIVE = Platform.OS !== 'web';

// Dock tint: 'black' or 'pine'.
const LOOK: 'black' | 'pine' = 'black';
const TINT = {
  black: { bar: ['rgba(46, 47, 49, 0.88)', 'rgba(22, 23, 24, 0.94)'] as const, lens: 'rgba(12, 12, 13, 0.55)', ball: 'rgba(20, 21, 22, 0.9)' },
  pine: { bar: ['rgba(24, 50, 38, 0.82)', 'rgba(11, 31, 21, 0.92)'] as const, lens: 'rgba(11, 31, 21, 0.55)', ball: 'rgba(11, 31, 21, 0.82)' },
}[LOOK];

const H = S.tabBar;
const SIDE = 20;
const PAD = 5;
const LENS_H = H - PAD * 2;
const OVER = 7; // how far past the first and last tab it may be pulled
const LIFT = { damping: 18, stiffness: 300, mass: 0.6, useNativeDriver: NATIVE };
const SETTLE = { damping: 20, stiffness: 240, mass: 0.75, useNativeDriver: NATIVE };

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

type Node = Animated.AnimatedInterpolation<number>;

/** One tab. `near` is 1 under the lens and 0 a tab away: the outline gives way to the filled icon, which grows as the lens lifts. */
const Tab = memo(function Tab({ item, near, lift, cell, count }: { item: Item; near: Node; lift: Animated.Value; cell: number; count: number }) {
  const s = useMemo(() => {
    const raised = Animated.multiply(near, lift);
    return {
      tab: { transform: [{ scale: raised.interpolate({ inputRange: [0, 1], outputRange: [1, 1.17] }) }] },
      outline: { opacity: near.interpolate({ inputRange: [0.15, 0.6], outputRange: [1, 0], extrapolate: 'clamp' }) },
      filled: { opacity: near.interpolate({ inputRange: [0.15, 0.6], outputRange: [0, 1], extrapolate: 'clamp' }) },
      label: { opacity: near.interpolate({ inputRange: [0, 1], outputRange: [0.74, 1], extrapolate: 'clamp' }) },
    };
  }, [near, lift]);
  return (
    <Animated.View style={[styles.cell, { width: cell }, s.tab]}>
      <View style={styles.glyph}>
        <Animated.View style={[styles.layer, s.outline]}>
          <Ionicons name={item.icon} size={23} color={HEX.snow} />
        </Animated.View>
        <Animated.View style={[styles.layer, s.filled]}>
          <Ionicons name={item.filled} size={23} color={HEX.goldPale} />
        </Animated.View>
        {count > 0 ? (
          <View style={styles.count}>
            <Text style={styles.countText}>{String(count)}</Text>
          </View>
        ) : null}
      </View>
      <Animated.View style={s.label}>
        <Text numberOfLines={1} maxFontSizeMultiplier={1.1} style={styles.label}>
          {item.label}
        </Text>
      </Animated.View>
    </Animated.View>
  );
});

export function FloatingDock() {
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const guarded = useRouter(); // 450 ms guard, for Menu
  const tabs = useRawRouter(); // tab switches can't stack screens, so they are never dropped
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setReduced);
  }, []);
  const active = useActiveName();
  const menuOpen = usePathname() === `${BASE}/menu`;
  const index = menuOpen ? MENU : Math.max(0, ITEMS.findIndex((t) => t.name === active));
  const showTop = useScrollTopVisible();
  const trips = useBooking((s) => s.bookings.filter((b) => tabOf(b) === 'upcoming').length);

  const barW = Math.round(Math.min(screenW - SIDE * 2, 440));
  const cell = (barW - PAD * 2) / N;
  const centre = useCallback((i: number) => PAD + cell * (i + 0.5), [cell]);

  // The lens centre is base + drag. `base` springs between tabs; `drag` is the finger's travel, written natively.
  const base = useRef(new Animated.Value(centre(index))).current;
  const drag = useRef(new Animated.Value(0)).current;
  const speed = useRef(new Animated.Value(0)).current;
  const lift = useRef(new Animated.Value(0)).current;
  const at = useRef({ i: index, down: false, moved: false, from: 0 });
  const live = useRef(index);
  live.current = index;

  const settle = useCallback(
    (i: number) => {
      at.current.i = i;
      if (reduced) {
        base.setValue(centre(i));
        drag.setValue(0);
      } else {
        // The same spring on both, so their sum moves as one.
        Animated.spring(base, { toValue: centre(i), ...SETTLE }).start();
        Animated.spring(drag, { toValue: 0, ...SETTLE }).start();
      }
      Animated.spring(speed, { toValue: 0, damping: 14, stiffness: 220, mass: 0.6, useNativeDriver: NATIVE }).start();
    },
    [base, centre, drag, reduced, speed],
  );
  const raise = useCallback(
    (up: boolean) => {
      if (!reduced) Animated.spring(lift, { toValue: up ? 1 : 0, ...LIFT }).start();
    },
    [lift, reduced],
  );

  // Follows the page: the menu opening and closing, a "See all" link, the back button.
  useEffect(() => {
    if (at.current.i !== index && !at.current.down) settle(index);
    // Only the page drives this; a resize re-seats the lens below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);
  useEffect(() => {
    base.setValue(centre(at.current.i));
  }, [base, centre]);

  const go = useCallback(
    (i: number) => {
      if (i === MENU) {
        guarded.navigate('/menu');
        // If the menu did not open (a page was already opening), return to the real tab.
        setTimeout(() => {
          if (live.current !== MENU && at.current.i === MENU && !at.current.down) settle(live.current);
        }, 900);
      } else if (i !== live.current) tabs.navigate(ITEMS[i].path);
    },
    [guarded, settle, tabs],
  );

  const tabAt = (px: number) => Math.max(0, Math.min(MENU, Math.floor((px - PAD) / cell)));
  const track = useMemo(() => Animated.event([{ nativeEvent: { handlerData: { translationX: drag, velocityX: speed } } }], { useNativeDriver: NATIVE }), [drag, speed]);
  const pan = usePanGesture({
    useAnimated: true,
    minDistance: 4,
    hitSlop: { top: 8, bottom: 8 },
    onBegin: (e) => {
      const a = at.current;
      a.down = true;
      a.moved = false;
      a.from = e.x;
      raise(true);
      const i = tabAt(e.x);
      if (i !== a.i) settle(i); // the lens comes to the finger; dragging carries on from there
    },
    onActivate: () => {
      at.current.moved = true;
    },
    onUpdate: track as never,
    onFinalize: (e) => {
      const a = at.current;
      if (!a.down) return;
      a.down = false;
      raise(false);
      const i = a.moved ? Math.max(0, Math.min(MENU, Math.round((centre(a.i) + e.x - a.from - centre(0)) / cell))) : a.i;
      settle(i);
      go(i);
    },
  });

  const m = useMemo(() => {
    const lo = centre(0) - OVER;
    const hi = centre(MENU) + OVER;
    const x = Animated.add(base, drag).interpolate({ inputRange: [lo, hi], outputRange: [lo, hi], extrapolate: 'clamp' });
    const stretch = speed.interpolate({ inputRange: [-1600, 0, 1600], outputRange: [1.16, 1, 1.16], extrapolate: 'clamp' });
    const squeeze = speed.interpolate({ inputRange: [-1600, 0, 1600], outputRange: [0.9, 1, 0.9], extrapolate: 'clamp' });
    return {
      near: ITEMS.map((_, i) => x.interpolate({ inputRange: [centre(i) - cell * 0.8, centre(i), centre(i) + cell * 0.8], outputRange: [0, 1, 0], extrapolate: 'clamp' })),
      lens: {
        transform: [
          { translateX: Animated.subtract(x, cell / 2) },
          { scaleX: Animated.multiply(lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.18] }), stretch) },
          { scaleY: Animated.multiply(lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.36] }), squeeze) },
        ],
      },
      bar: { transform: [{ scale: lift.interpolate({ inputRange: [0, 1], outputRange: [1, 1.02] }) }] },
      rest: { opacity: lift.interpolate({ inputRange: [0, 0.7], outputRange: [1, 0], extrapolate: 'clamp' }) },
      glass: { opacity: lift.interpolate({ inputRange: [0, 0.8], outputRange: [0, 1], extrapolate: 'clamp' }) },
    };
  }, [base, cell, centre, drag, lift, speed]);

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <GestureDetector gesture={pan}>
        <View style={{ width: barW, height: H }} collapsable={false}>
          <Animated.View pointerEvents="none" style={[styles.bar, { width: barW }, m.bar]}>
            <View style={[StyleSheet.absoluteFill, styles.body]} renderToHardwareTextureAndroid>
              <LinearGradient colors={TINT.bar} style={[StyleSheet.absoluteFill, styles.fill]} />
            </View>

            <Animated.View style={[styles.lens, { width: cell }, m.lens]}>
              <Animated.View style={[styles.cap, styles.rest, m.rest]} />
              <Animated.View style={[styles.cap, { backgroundColor: TINT.lens }, m.glass]}>
                <LinearGradient colors={['rgba(255,255,255,0.24)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.02)', 'rgba(255,255,255,0.14)']} locations={[0, 0.28, 0.75, 1]} style={[StyleSheet.absoluteFill, styles.round]} />
                {/* The rim, with the colour split a thick lens gives its edges. */}
                <View style={[styles.cap, styles.cyan]} />
                <View style={[styles.cap, styles.amber]} />
                <View style={[styles.cap, styles.white]} />
              </Animated.View>
            </Animated.View>

            <View style={styles.row}>
              {ITEMS.map((t, i) => (
                <Tab key={t.name} item={t} near={m.near[i]} lift={lift} cell={cell} count={i === TRIPS ? trips : 0} />
              ))}
            </View>
          </Animated.View>

          {/* For screen readers; touches are handled by the gesture. */}
          <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.row]}>
            {ITEMS.map((t, i) => (
              <Pressable
                key={t.name}
                onPress={() => {
                  settle(i);
                  go(i);
                }}
                style={styles.hit}
                accessibilityRole={i === MENU ? 'button' : 'tab'}
                accessibilityState={i === MENU ? undefined : { selected: i === index }}
                accessibilityLabel={i === TRIPS && trips > 0 ? `${t.label}, ${trips} upcoming` : t.label}
              />
            ))}
          </View>
        </View>
      </GestureDetector>
      {showTop && (
        <View pointerEvents="box-none" style={styles.topShadow}>
          <View style={styles.top}>
            <Pressable onPress={scrollActiveToTop} hitSlop={8} style={styles.topHit} accessibilityRole="button" accessibilityLabel="Scroll to top">
              <Ionicons name="chevron-up-outline" size={16} color={HEX.snow} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: SIDE, right: SIDE, alignItems: 'center' },
  bar: { height: H },
  body: { borderRadius: H / 2, boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.26)' },
  fill: { borderRadius: H / 2, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.16)' },
  row: { position: 'absolute', left: 0, right: 0, top: 0, height: H, flexDirection: 'row', paddingHorizontal: PAD },
  cell: { height: H, alignItems: 'center', justifyContent: 'center', gap: 2 },
  glyph: { width: 26, height: 25 },
  layer: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  label: { color: HEX.white, fontSize: 10.5, lineHeight: 14, fontFamily: FONTS.uiSemi },
  count: { position: 'absolute', top: -4, left: 15, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4, backgroundColor: HEX.gold, alignItems: 'center', justifyContent: 'center' },
  countText: { color: HEX.pine, fontSize: 9.5, lineHeight: 12, fontFamily: FONTS.uiBold },
  lens: { position: 'absolute', left: 0, top: PAD, height: LENS_H },
  cap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: LENS_H / 2 },
  round: { borderRadius: LENS_H / 2 },
  rest: { backgroundColor: 'rgba(255, 255, 255, 0.16)' },
  cyan: { left: -1, right: 1, borderWidth: 1.3, borderColor: 'rgba(120, 225, 255, 0.38)' },
  amber: { left: 1, right: -1, borderWidth: 1.3, borderColor: 'rgba(255, 196, 110, 0.42)' },
  white: { borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.75)' },
  hit: { flex: 1, height: H },
  topShadow: { position: 'absolute', right: 0, top: -54, borderRadius: 19, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.08)' },
  top: { width: S.well, height: S.well, borderRadius: 18, overflow: 'hidden', backgroundColor: TINT.ball, borderWidth: 1.25, borderColor: 'rgba(255, 255, 255, 0.4)' },
  topHit: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
