import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { colors, radius } from "@/core/constants/theme";

type Props = { value: number; color?: string; height?: number; delay?: number; /** Track tuned for dark forest sections. */ onDark?: boolean };

/** Progress bar that grows from the left on mount / when `value` (0–1) changes. Native-driven (scaleX). */
export function AnimatedBar({ value, color, height = 6, delay = 150, onDark = false }: Props) {
  const v = useRef(new Animated.Value(0)).current;
  const clamped = Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
  useEffect(() => {
    Animated.timing(v, { toValue: clamped, duration: 900, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v, clamped, delay]);
  return (
    <View style={[styles.track, { height, backgroundColor: onDark ? colors.trackNight : colors.track }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color ?? (onDark ? colors.snow : colors.pineBrand), transform: [{ scaleX: v }], transformOrigin: "left center" }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { borderRadius: radius.pill, overflow: "hidden" },
  fill: { flex: 1, borderRadius: radius.pill },
});
