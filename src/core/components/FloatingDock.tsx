import { useEffect, useRef, type ComponentRef, type RefObject } from "react";
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PlateButton } from "@/core/components/PlateButton";
import { Text } from "@/core/components/Text";
import { fonts, groups } from "@/core/constants/theme";
import { scrollActiveToTop, useScrollTopStore } from "@/core/lib/scrollTop";

// The slice of the tab-bar props this dock uses (kept structural so it needs no navigation package import).
export type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  emitter: { emit: (e: { type: "tabPress"; target: string; canPreventDefault: true }) => { defaultPrevented: boolean } };
  navigateToTab: (routeKey: string) => void;
};

type Props = DockProps & { blurTarget?: RefObject<ComponentRef<typeof View> | null>; onServices: () => void; services: number };
type Slot = { name: string; label: string; icon: (color: string) => React.ReactNode };

const mci = (name: keyof typeof MaterialCommunityIcons.glyphMap) => (color: string) => <MaterialCommunityIcons name={name} size={24} color={color} />;
const ion = (name: keyof typeof Ionicons.glyphMap) => (color: string) => <Ionicons name={name} size={22} color={color} />;

// Services is a mini-app, not a tab: its slot switches over to it.
const SERVICES = "services";
const SLOTS: Slot[] = [
  { name: "index", label: "Explore", icon: ion("navigate") },
  { name: "bookings/index", label: "Stay", icon: mci("calendar-month") },
  { name: "payments/index", label: "Invest", icon: mci("chart-line-variant") },
  { name: SERVICES, label: "Services", icon: mci("bell") },
  { name: "profile", label: "Profile", icon: mci("card-account-details") },
];

const H = 72;
const PAD = 7;

/** Frosted capsule with five destinations; a Pine pill springs to the active one. The up-arrow appears once a page is scrolled. */
export function FloatingDock({ state, emitter, navigateToTab, blurTarget, onServices, services }: Props) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const showTop = useScrollTopStore((st) => st.visible);
  const barW = Math.min(width - 32, 460);
  const cell = (barW - PAD * 2 - 2) / SLOTS.length;
  const active = Math.max(0, SLOTS.findIndex((s) => s.name === state.routes[state.index]?.name));
  const pos = useRef(new Animated.Value(active)).current;

  useEffect(() => {
    Animated.spring(pos, { toValue: active, damping: 19, stiffness: 210, mass: 0.8, useNativeDriver: true }).start();
  }, [active, pos]);

  const press = (slot: Slot) => {
    if (slot.name === SERVICES) return onServices();
    const route = state.routes.find((r) => r.name === slot.name);
    if (!route) return;
    const e = emitter.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
    if (state.routes[state.index]?.key !== route.key && !e.defaultPrevented) navigateToTab(route.key);
  };
  const last = SLOTS.length - 1;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.shadow, { width: barW }]}>
        <View style={styles.bar}>
          <BlurView blurTarget={blurTarget} blurMethod="dimezisBlurView" tint="light" intensity={34} style={StyleSheet.absoluteFill} />
          <LinearGradient colors={groups.dock} style={[StyleSheet.absoluteFill, styles.edge]} />
          <Animated.View pointerEvents="none" style={[styles.pill, { width: cell, transform: [{ translateX: pos.interpolate({ inputRange: [0, last], outputRange: [0, cell * last], extrapolate: "clamp" }) }] }]} />
          {SLOTS.map((s, i) => {
            const on = pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [0, 1, 0], extrapolate: "clamp" });
            const off = pos.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [1, 0, 1], extrapolate: "clamp" });
            const face = (color: string) => (
              <>
                {s.icon(color)}
                <Text style={[styles.label, { color }]} numberOfLines={1} maxFontSizeMultiplier={1}>
                  {s.label.toUpperCase()}
                </Text>
              </>
            );
            return (
              <Pressable key={s.name} onPress={() => press(s)} style={styles.slot} accessibilityRole={s.name === SERVICES ? "button" : "tab"} accessibilityState={{ selected: i === active }} accessibilityLabel={s.label}>
                <Animated.View style={[styles.face, { opacity: off }]}>{face(groups.dockInk)}</Animated.View>
                <Animated.View style={[styles.face, { opacity: on }]}>{face(groups.meshLight)}</Animated.View>
                {s.name === SERVICES && services > 0 ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
      </View>
      {showTop ? (
        <View style={styles.top}>
          <PlateButton icon="chevron-up-outline" label="Scroll to top" size={40} onPress={() => scrollActiveToTop()} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 16, right: 16, alignItems: "center" },
  shadow: { borderRadius: H / 2, boxShadow: "0px 10px 26px rgba(24, 48, 38, 0.2)" },
  bar: { height: H, borderRadius: H / 2, overflow: "hidden", flexDirection: "row", padding: PAD, borderWidth: 1, borderColor: groups.dockEdge },
  edge: { borderRadius: H / 2 },
  pill: { position: "absolute", left: PAD, top: PAD, bottom: PAD, borderRadius: (H - PAD * 2) / 2, backgroundColor: groups.pine, borderWidth: 1, borderColor: groups.pineEdge },
  slot: { flex: 1 },
  face: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", gap: 1 },
  label: { fontSize: 9, lineHeight: 12, fontFamily: fonts.uiBold, letterSpacing: 0.5 },
  dot: { position: "absolute", top: 8, right: "28%", width: 10, height: 10, borderRadius: 5, backgroundColor: groups.champagne, borderWidth: 1.5, borderColor: groups.plate },
  top: { position: "absolute", right: 0, top: -52 },
});
