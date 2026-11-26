import { useRef, type ReactNode } from "react";
import { Animated, Pressable, StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, radius as R, svc } from "@/core/constants/theme";
import { tone } from "@/features/services/components/tone";
import { Ready } from "@/features/services/components/Text";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressProps = Omit<PressableProps, "style" | "children"> & { style?: StyleProp<ViewStyle>; children?: ReactNode };

/** Every tappable surface in the module: the same quick spring under the finger. */
export function Press({ style, children, ...rest }: PressProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, damping: 16, stiffness: 340, mass: 0.7, useNativeDriver: true }).start();
  return (
    <AnimatedPressable accessibilityRole="button" {...rest} onPressIn={() => to(0.965)} onPressOut={() => to(1)} style={[style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}

export type Finish = "ivory" | "pine" | "dark" | "clear" | "glass" | "frost" | "pineGlass";

/** Flat alabaster plates with a hairline edge, flat Pine, and clear glass for photos and Pine. */
const SURFACE: Record<Finish, ViewStyle> = {
  ivory: { backgroundColor: tone.plate, borderColor: tone.line, boxShadow: tone.shadow },
  pine: { backgroundColor: tone.pine, borderColor: tone.pine },
  dark: { backgroundColor: svc.darkSurface, borderColor: svc.darkEdge },
  clear: { backgroundColor: colors.photoGlass, borderColor: svc.clearEdge },
  frost: { backgroundColor: tone.glassOnPine, borderColor: tone.glassOnPineEdge },
  pineGlass: { backgroundColor: tone.pine, borderColor: tone.pine },
  glass: { backgroundColor: tone.plate, borderColor: tone.line, boxShadow: tone.shadow },
};

const SHEEN = { clear: svc.glassClear } as const;

function Sheen({ finish, radius }: { finish: Finish; radius: number }) {
  if (!(finish in SHEEN)) return null;
  return <LinearGradient pointerEvents="none" colors={SHEEN[finish as keyof typeof SHEEN]} start={{ x: 0, y: 0 }} end={{ x: 0.4, y: 1 }} style={[StyleSheet.absoluteFill, { borderRadius: Math.max(0, radius - 1) }]} />;
}

type SurfaceProps = { children?: ReactNode; style?: StyleProp<ViewStyle>; finish?: Finish; radius?: number };

export function Surface({ children, style, finish = "ivory", radius = R.lg }: SurfaceProps) {
  return (
    <View style={[styles.edge, { borderRadius: radius }, SURFACE[finish], style]}>
      <Sheen finish={finish} radius={radius} />
      {children}
    </View>
  );
}

export function SurfacePress({ children, style, finish = "ivory", radius = R.lg, ...rest }: PressProps & SurfaceProps) {
  return (
    <Press {...rest} style={[styles.edge, { borderRadius: radius }, SURFACE[finish], style]}>
      <Sheen finish={finish} radius={radius} />
      {children}
    </Press>
  );
}

/** Plain ivory page. */
export function Canvas({ children }: { children: ReactNode }) {
  return (
    <View style={styles.page}>
      <Ready>{children}</Ready>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: tone.page },
  edge: { borderWidth: 1 },
});
