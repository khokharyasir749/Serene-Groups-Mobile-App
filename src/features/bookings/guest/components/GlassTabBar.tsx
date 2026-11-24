import { HEX } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import ClearGlass from '@/features/bookings/guest/components/ClearGlass';
import { usePathname, useRouter as useRawRouter } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ComponentProps } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';

import { scrollActiveToTop, useScrollTopVisible } from '@/features/bookings/guest/components/ScrollTop';
import { BASE, useRouter } from '@/features/bookings/guest/lib/nav';
import { C, S, shadow } from '@/features/bookings/guest/theme';

// Liquid-notch dock: four equal slots in one clear glass pill. The active icon rises into a clear glass ball that sits in
// a smooth notch in the bar's top edge. The notch is one static SVG strip, two bars wide, that
// slides inside the clipped pill, so nothing is redrawn while it moves: only transform and opacity, on the native driver.

type Glyph = ComponentProps<typeof Ionicons>['name'];
type Item = { name: string; path: string; label: string; icon: Glyph; filled: Glyph };
const ITEMS: Item[] = [
  { name: 'index', path: BASE, label: 'Discover', icon: 'compass-outline', filled: 'compass' },
  { name: 'apartments', path: `${BASE}/apartments`, label: 'Stay', icon: 'bed-outline', filled: 'bed' },
  { name: 'trips', path: `${BASE}/trips`, label: 'Trips', icon: 'calendar-outline', filled: 'calendar' },
  { name: 'menu', path: `${BASE}/menu`, label: 'Menu', icon: 'menu-outline', filled: 'menu' },
];
const MENU = ITEMS.length - 1;

const PINE = HEX.deepPine; // a deeper Pine than the brand's, to read through clear glass

const H = S.tabBar;
const SIDE = 20;
const ICON = 22;
const ICON_Y = 30; // resting icon centre
const RISE = -16;
const BADGE = 44;
const BADGE_Y = ICON_Y + RISE; // badge centre
const RIM = [3, 5, 7, 9, 11, 13, 15]; // soft light along the inside of the glass edge
const LINE = 1.25;
const GLOW = 18; // margin for the painted shadow
const SPRING = { damping: 21, stiffness: 250, mass: 0.8 };

const E = 0.75; // the outline runs this far inside the bar's box, so its full width shows
const HALF = 40; // half the notch's width, shoulder to shoulder
const R = H / 2; // the capsule ends; the top edge is straight between R and barW - R
const END = R + HALF + 1; // centre of the first and last slot: the whole notch stays on the straight part

/** The bar's top edge with its notch centred on `c`: a soft shoulder, an arc 4.5 px outside the badge, a soft shoulder. */
const topEdge = (c: number, width: number) =>
  `M0 ${E}H${c - HALF}C${c - 32.5} ${E} ${c - 28} 7.3 ${c - 26.1} 18.1A26.5 26.5 0 0 0 ${c + 26.1} 18.1C${c + 28} 7.3 ${c + 32.5} ${E} ${c + HALF} ${E}H${width}`;

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

/**
 * The glass. Its outline is one line in two parts that meet on the straight top edge: the capsule ends and bottom never
 * move, and the top edge with the notch slides between them. Both parts are static drawings; only translateX changes.
 */
const Glass = memo(function Glass({ barW, x }: { barW: number; x: Animated.AnimatedInterpolation<number> }) {
  const stripW = barW * 2;
  const c = stripW / 2;
  const edge = topEdge(c, stripW);
  const r = R - E;
  const ends = `M${R} ${E}A${r} ${r} 0 0 0 ${R} ${H - E}H${barW - R}A${r} ${r} 0 0 0 ${barW - R} ${E}`;
  const slideFill = { transform: [{ translateX: Animated.subtract(x, c) }] };
  const slideLine = { transform: [{ translateX: Animated.subtract(x, c + R) }] };
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {/* Soft static shadow along the sides and bottom only, so the notch itself stays clear. */}
      <Svg width={barW + GLOW * 2} height={H + GLOW * 2} style={styles.glow}>
        {[2, 5, 8, 11].map((w) => (
          <Path key={w} d={ends} transform={`translate(${GLOW} ${GLOW + 3})`} fill="none" stroke={HEX.shade} strokeOpacity={0.013} strokeWidth={w} />
        ))}
      </Svg>
      <View style={styles.clip}>
        <Animated.View renderToHardwareTextureAndroid style={[styles.strip, { width: stripW }, slideFill]}>
          <Svg width={stripW} height={H}>
            <Defs>
              {/* Clear glass: almost no body, a little light at the top and bottom. */}
              <SvgGradient id="dock-glass" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={HEX.white} stopOpacity={0.24} />
                <Stop offset="0.45" stopColor={HEX.white} stopOpacity={0.07} />
                <Stop offset="1" stopColor={HEX.white} stopOpacity={0.16} />
              </SvgGradient>
            </Defs>
            <Path d={`${edge}V${H}H0Z`} fill="url(#dock-glass)" />
          </Svg>
        </Animated.View>
        <Svg width={barW} height={H} style={StyleSheet.absoluteFill}>
          {RIM.map((w) => (
            <Path key={w} d={ends} fill="none" stroke={HEX.white} strokeOpacity={0.045} strokeWidth={w} />
          ))}
        </Svg>
      </View>
      <Svg width={barW} height={H} style={StyleSheet.absoluteFill}>
        <Path d={ends} fill="none" stroke={HEX.white} strokeWidth={LINE} />
      </Svg>
      <View style={[styles.topClip, { width: barW - R * 2 }]}>
        <Animated.View renderToHardwareTextureAndroid style={[styles.strip, { width: stripW }, slideLine]}>
          <Svg width={stripW} height={H}>
            {RIM.map((w) => (
              <Path key={w} d={edge} fill="none" stroke={HEX.white} strokeOpacity={0.045} strokeWidth={w} />
            ))}
            <Path d={edge} fill="none" stroke={HEX.white} strokeWidth={LINE} />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
});

const Slot = memo(function Slot({ i, g, left }: { i: number; g: Animated.Value; left: number }) {
  const t = ITEMS[i];
  const lift = { transform: [{ translateY: g.interpolate({ inputRange: [0, 1], outputRange: [0, RISE] }) }] };
  const outline = { opacity: g.interpolate({ inputRange: [0, 0.625], outputRange: [1, 0], extrapolate: 'clamp' }) };
  // The badge glides empty; the icon appears as it lands.
  const filled = { opacity: g.interpolate({ inputRange: [0.55, 0.95], outputRange: [0, 1], extrapolate: 'clamp' }) };
  return (
    <Animated.View pointerEvents="none" style={[styles.icon, { left }, lift]}>
      <Animated.View style={[StyleSheet.absoluteFill, outline]}>
        <Ionicons name={t.icon} size={ICON} color={PINE} style={styles.halo} />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, filled]}>
        <Ionicons name={t.filled} size={ICON} color={PINE} style={styles.halo} />
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

  const barW = Math.round(Math.min(screenW - SIDE * 2, 440));
  const step = (barW - END * 2) / (ITEMS.length - 1);

  const grow = useRef(ITEMS.map((_, i) => new Animated.Value(i === index ? 1 : 0))).current;
  const x = useRef(new Animated.Value(END + step * index)).current; // centre of the active slot
  // The spring may overshoot; at the end slots it must not carry the notch into the rounded ends.
  const pos = useMemo(() => x.interpolate({ inputRange: [END, barW - END], outputRange: [END, barW - END], extrapolate: 'clamp' }), [barW, x]);
  const follow = { transform: [{ translateX: pos }] };
  const shown = useRef(index);
  const menuAt = useRef(0);

  const moveTo = useCallback(
    (i: number) => {
      shown.current = i;
      const target = END + step * i;
      if (reduced) x.setValue(target);
      else Animated.spring(x, { toValue: target, ...SPRING, useNativeDriver: true }).start();
      grow.forEach((g, j) => {
        const to = j === i ? 1 : 0;
        if (reduced) g.setValue(to);
        else Animated.spring(g, { toValue: to, ...SPRING, useNativeDriver: true }).start();
      });
    },
    [grow, reduced, step, x],
  );

  // Follows the page: the menu opening and closing, a "See all" link, the back button.
  useEffect(() => {
    if (shown.current !== index) moveTo(index);
    // Only the page drives this; a resize re-seats the badge below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // A new window size: re-seat the badge without animating.
  useEffect(() => {
    x.setValue(END + step * shown.current);
  }, [step, x]);

  const select = useCallback(
    (i: number) => {
      if (Date.now() - menuAt.current < 450) return; // the menu is opening
      if (i === MENU) {
        menuAt.current = Date.now();
        guarded.navigate('/menu'); // the badge follows once the menu is really open
        return;
      }
      if (i === shown.current) return;
      moveTo(i);
      tabs.navigate(ITEMS[i].path);
    },
    [guarded, moveTo, tabs],
  );

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.bar, { width: barW }]} accessibilityRole="tablist">
        <Glass barW={barW} x={pos} />
        <Animated.View pointerEvents="none" style={[styles.follow, follow]}>
          <View style={styles.badge}>
            <ClearGlass />
          </View>
        </Animated.View>
        {ITEMS.map((t, i) => (
          <Slot key={t.name} i={i} g={grow[i]} left={END + step * i - ICON / 2} />
        ))}
        {ITEMS.map((t, i) => (
          <Pressable
            key={t.name}
            onPress={() => select(i)}
            hitSlop={{ top: 10 }}
            style={[styles.hit, { width: i === 0 || i === MENU ? END + step / 2 : step }]}
            accessibilityRole={i === MENU ? 'button' : 'tab'}
            accessibilityState={i === MENU ? undefined : { selected: i === index }}
            accessibilityLabel={t.label}
          />
        ))}
      </View>
      {showTop && (
        <View pointerEvents="box-none" style={styles.topShadow}>
          <View style={styles.top}>
            <ClearGlass />
            <Pressable onPress={scrollActiveToTop} hitSlop={8} style={styles.topHit} accessibilityRole="button" accessibilityLabel="Scroll to top">
              <Ionicons name="chevron-up-outline" size={16} color={PINE} style={styles.haloSmall} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: SIDE, right: SIDE, alignItems: 'center' },
  bar: { height: H, flexDirection: 'row' },
  glow: { position: 'absolute', left: -GLOW, top: -GLOW },
  clip: { ...StyleSheet.absoluteFill, borderRadius: H / 2, overflow: 'hidden' },
  topClip: { position: 'absolute', left: R, top: 0, height: H, overflow: 'hidden' },
  strip: { position: 'absolute', left: 0, top: 0, height: H },
  follow: { position: 'absolute', left: 0, top: 0, width: 0, height: H },
  badge: {
    position: 'absolute',
    left: -BADGE / 2,
    top: BADGE_Y - BADGE / 2,
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    overflow: 'hidden',
    borderWidth: 1.25,
    borderColor: 'rgba(255, 255, 255, 0.95)',
  },
  icon: { position: 'absolute', top: ICON_Y - ICON / 2, width: ICON, height: ICON },
  // A soft light behind each icon, so Pine stays readable through clear glass on dark photos.
  halo: { padding: 14, margin: -14, textShadowColor: HEX.white, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 3 },
  hit: { height: H },
  // Same clear glass as the ball; the faint outer line keeps it visible on light pages.
  topShadow: { position: 'absolute', right: 0, top: -54, borderRadius: 19, borderWidth: 1, borderColor: 'rgba(15, 42, 30, 0.08)' },
  top: { width: S.well, height: S.well, borderRadius: 18, overflow: 'hidden', borderWidth: 1.25, borderColor: 'rgba(255, 255, 255, 0.95)' },
  haloSmall: { padding: 10, margin: -10, textShadowColor: HEX.white, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 3 },
  topHit: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
