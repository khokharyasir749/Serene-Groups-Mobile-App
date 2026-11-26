import { useEffect, useState, type ComponentRef, type RefObject } from "react";
import { AccessibilityInfo, Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { GlassView, isGlassEffectAPIAvailable, isLiquidGlassAvailable } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { navGlass } from "@/core/constants/theme";

export type BlurTarget = RefObject<ComponentRef<typeof View> | null>;

// Some early iOS 26 builds lack the API, so both checks are needed.
const LIQUID = Platform.OS === "ios" && isLiquidGlassAvailable() && isGlassEffectAPIAvailable();

/** True while the phone asks for less transparency (iOS). */
function useSolid() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    if (Platform.OS !== "ios") return undefined;
    let live = true;
    AccessibilityInfo.isReduceTransparencyEnabled()
      .then((v) => {
        if (live) setSolid(v);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener("reduceTransparencyChanged", setSolid);
    return () => {
      live = false;
      sub.remove();
    };
  }, []);
  return solid;
}

/**
 * The glass body of a navigation bar; fills its parent. Apple's own Liquid Glass on iOS 26, elsewhere a live blur of the page
 * (Android needs `blurTarget`) with a light sheen and a bright rim. Solid when the phone asks for less transparency.
 */
export function NavGlass({ radius, blurTarget }: { radius: number; blurTarget?: BlurTarget }) {
  const solid = useSolid();
  const shape = { borderRadius: radius };
  if (solid) return <View pointerEvents="none" style={[StyleSheet.absoluteFill, shape, styles.solid]} />;
  if (LIQUID) return <GlassView pointerEvents="none" glassEffectStyle="regular" colorScheme="light" tintColor={navGlass.tint} style={[StyleSheet.absoluteFill, shape]} />;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, shape, styles.clip]}>
      <BlurView blurTarget={blurTarget} blurMethod="dimezisBlurViewSdk31Plus" tint="light" intensity={46} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={navGlass.sheen} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, shape, styles.rim]} />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { overflow: "hidden" },
  solid: { backgroundColor: navGlass.solid },
  rim: { borderWidth: 1, borderColor: navGlass.rim },
});
