import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tone } from "@/features/services/components/tone";

/** Shadow for white words set on glass over a photograph. */
export const glassText = { textShadowColor: "rgba(0, 0, 0, 0.45)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 } as const;

/** Crystal-clear glass laid on a photograph: a breath of white, light along the top edge, and a bright rim. */
export function ClearGlass({ children, radius = 24, style, dark }: { children: ReactNode; radius?: number; style?: StyleProp<ViewStyle>; /** Smoked glass, for lines of white text over a bright photograph. */ dark?: boolean }) {
  return (
    <View style={[styles.glass, { borderRadius: radius }, style]}>
      <LinearGradient pointerEvents="none" colors={dark ? tone.smokeGlass : tone.deskGlass} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={tone.deskGlassSheen} style={styles.sheen} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  glass: { overflow: "hidden", borderWidth: 1, borderColor: tone.deskGlassEdge },
  sheen: { position: "absolute", top: 0, left: 0, right: 0, height: "45%" },
});
