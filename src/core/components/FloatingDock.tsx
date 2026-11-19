import { useRef } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fonts, shadows } from "@/core/constants/theme";

// The slice of the tab-bar props this dock uses (kept structural so it needs no navigation package import).
type DockProps = {
  state: { index: number; routes: { key: string; name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  emitter: { emit: (e: { type: "tabPress"; target: string; canPreventDefault: true }) => { defaultPrevented: boolean } };
  navigateToTab: (routeKey: string) => void;
};

const ICON: Record<string, { off: keyof typeof Ionicons.glyphMap; on: keyof typeof Ionicons.glyphMap }> = {
  index: { off: "compass-outline", on: "compass" },
  "bookings/index": { off: "calendar-outline", on: "calendar" },
  "payments/index": { off: "trending-up-outline", on: "trending-up" },
};

function Item({ icon, label, focused, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; focused: boolean; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: true }).start();
  const tint = focused ? colors.goldAccent : colors.dockInactive;
  return (
    <Pressable onPress={onPress} onPressIn={() => to(0.92)} onPressOut={() => to(1)} accessibilityRole="button" accessibilityState={{ selected: focused }} accessibilityLabel={label} style={styles.item}>
      <Animated.View style={[styles.pill, focused && styles.pillOn, { transform: [{ scale }] }]}>
        <Ionicons name={icon} size={21} color={tint} />
        <Text style={[styles.label, { color: focused ? colors.white : tint }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/** Detached floating capsule dock: Pine surface, fine Champagne hairline, soft gold active pill. Sits above the home indicator. */
export function FloatingDock({ state, descriptors, emitter, navigateToTab }: DockProps) {
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom: insets.bottom + 10 }]}>
      <View style={styles.dock}>
        {state.routes.map((r, i) => {
          const icon = ICON[r.name];
          if (!icon) return null;
          const focused = state.index === i;
          const press = () => {
            const e = emitter.emit({ type: "tabPress", target: r.key, canPreventDefault: true });
            if (!focused && !e.defaultPrevented) navigateToTab(r.key);
          };
          return <Item key={r.key} icon={focused ? icon.on : icon.off} label={descriptors[r.key]?.options.title ?? r.name} focused={focused} onPress={press} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 20, right: 20 },
  dock: { flexDirection: "row", alignItems: "center", height: 64, borderRadius: 999, paddingHorizontal: 8, backgroundColor: colors.dockSurface, borderWidth: 1, borderColor: colors.dockBorder, ...shadows.dock },
  item: { flex: 1, alignItems: "center", justifyContent: "center" },
  pill: { alignItems: "center", justifyContent: "center", gap: 1, paddingHorizontal: 18, height: 48, borderRadius: 999 },
  pillOn: { backgroundColor: colors.dockActivePill },
  label: { fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1.2, textTransform: "uppercase" },
});
