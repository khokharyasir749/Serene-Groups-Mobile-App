import { useEffect, useRef, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/core/constants/theme";
import { tone } from "@/features/services/components/tone";

const EASE = Easing.bezier(0.22, 1, 0.36, 1);

let reduced = false;
void AccessibilityInfo.isReduceMotionEnabled().then((v) => (reduced = v));
AccessibilityInfo.addEventListener("reduceMotionChanged", (v) => (reduced = v));

/** The phone's Reduce Motion setting. */
export const isReduced = () => reduced;

/** Fades in while rising, once on mount. `order` staggers siblings. */
export function Enter({ children, order = 0, dy = 18, style }: { children: ReactNode; order?: number; dy?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.timing(p, { toValue: 1, delay: 60 + order * 70, duration: 520, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
    // Plays once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={[style, { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] }) }] }]}>{children}</Animated.View>;
}

/** A photo that settles into its frame once. It does not loop: an endless zoom kept the screen redrawing even behind other tabs. The parent clips it. */
export function DriftPhoto({ source, style }: { source: ImageSource; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    const a = Animated.timing(p, { toValue: 1, duration: 1400, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
  }, [p]);
  return (
    <View style={[styles.clip, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1.08, 1] }) }] }]}>
        <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />
      </Animated.View>
    </View>
  );
}

/** Confirmation tick: pops in while a ring opens and fades behind it. */
export function Tick({ size = 88 }: { size?: number }) {
  const pop = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  const ring = useRef(new Animated.Value(reduced ? 1 : 0)).current;
  useEffect(() => {
    if (reduced) return;
    Animated.parallel([
      Animated.spring(pop, { toValue: 1, damping: 11, stiffness: 170, mass: 0.8, useNativeDriver: true }),
      Animated.timing(ring, { toValue: 1, delay: 140, duration: 900, easing: EASE, useNativeDriver: true }),
    ]).start();
  }, [pop, ring]);
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.center, { height: size * 1.5 }]}>
      <Animated.View style={[styles.ring, round, { opacity: ring.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 0.7, 0] }), transform: [{ scale: ring.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.6] }) }] }]} />
      <Animated.View style={[styles.disc, styles.center, round, { opacity: pop.interpolate({ inputRange: [0, 0.4], outputRange: [0, 1], extrapolate: "clamp" }), transform: [{ scale: pop }] }]}>
        <Ionicons name="checkmark-outline" size={size * 0.46} color={colors.onGold} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: "hidden", backgroundColor: colors.stone },
  center: { alignItems: "center", justifyContent: "center" },
  ring: { position: "absolute", borderWidth: 2, borderColor: tone.champagne },
  disc: { backgroundColor: tone.champagne },
});
