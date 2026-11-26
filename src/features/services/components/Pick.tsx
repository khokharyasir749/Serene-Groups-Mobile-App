import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type AccessibilityRole, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "@/features/services/components/Text";
import { colors } from "@/core/constants/theme";
import { isReduced } from "@/features/services/components/motion";
import { Press, SurfacePress } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { sf } from "@/features/services/components/fonts";

type Props = { on: boolean; onPress: () => void; radius?: number; style?: StyleProp<ViewStyle>; role?: AccessibilityRole; label?: string; children: ReactNode };

/** Ivory choice that fills with Pine from its centre when picked. */
export function Pick({ on, onPress, radius = 22, style, role = "radio", label, children }: Props) {
  const p = useRef(new Animated.Value(on ? 1 : 0)).current;
  useEffect(() => {
    if (isReduced()) p.setValue(on ? 1 : 0);
    else Animated.spring(p, { toValue: on ? 1 : 0, damping: 17, stiffness: 210, mass: 0.8, useNativeDriver: true }).start();
  }, [on, p]);
  return (
    <SurfacePress finish="ivory" radius={radius} onPress={onPress} style={[styles.plate, style]} accessibilityRole={role} accessibilityState={{ checked: on }} accessibilityLabel={label}>
      <Animated.View
        pointerEvents="none"
        style={[styles.fill, { borderRadius: radius, opacity: p.interpolate({ inputRange: [0, 0.7], outputRange: [0, 1], extrapolate: "clamp" }), transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [0.72, 1] }) }] }]}
      />
      {children}
    </SurfacePress>
  );
}

/** Two or more tabs on one track; the Pine thumb glides between them. */
export function Segments({ items, index, onChange, style }: { items: string[]; index: number; onChange: (i: number) => void; style?: StyleProp<ViewStyle> }) {
  const [cell, setCell] = useState(0);
  const p = useRef(new Animated.Value(index)).current;
  useEffect(() => {
    if (isReduced()) p.setValue(index);
    else Animated.spring(p, { toValue: index, damping: 20, stiffness: 220, mass: 0.9, overshootClamping: true, useNativeDriver: true }).start();
  }, [index, p]);
  return (
    <View style={[styles.track, style]} onLayout={(e) => setCell((e.nativeEvent.layout.width - 10) / items.length)}>
      <Animated.View pointerEvents="none" style={[styles.thumb, { width: cell, transform: [{ translateX: Animated.multiply(p, cell) }] }]} />
      {items.map((t, i) => (
        <Press key={i} onPress={() => onChange(i)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: index === i }}>
          <Text style={[styles.text, index === i && styles.textOn]}>{t}</Text>
        </Press>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: { borderColor: tone.tileEdge, boxShadow: "none" },
  fill: { position: "absolute", top: -1, left: -1, right: -1, bottom: -1, backgroundColor: tone.pine },
  track: { flexDirection: "row", padding: 4, borderRadius: 25, borderWidth: 1, borderColor: tone.line, backgroundColor: tone.plate },
  thumb: { position: "absolute", top: 4, bottom: 4, left: 4, borderRadius: 21, backgroundColor: tone.pine },
  tab: { flex: 1, height: 42, alignItems: "center", justifyContent: "center" },
  text: { color: tone.ink, fontSize: 13, fontFamily: sf.uiSemi },
  textOn: { color: colors.white },
});
