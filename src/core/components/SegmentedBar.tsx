import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, View } from "react-native";
import { radius } from "@/core/constants/theme";

export type BarSegment = { value: number; color: string };
type Props = { segments: readonly BarSegment[]; selected?: number | null; onSelect?: (index: number) => void; height?: number };

/** Multi-colour proportional bar that sweeps in from the left; tap a segment to focus it (others dim). */
export function SegmentedBar({ segments, selected = null, onSelect, height = 16 }: Props) {
  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(sweep, { toValue: 1, duration: 1000, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [sweep]);
  return (
    <View style={[styles.clip, { height }]}>
      <Animated.View style={[styles.row, { transform: [{ scaleX: sweep }], transformOrigin: "left center" }]}>
        {segments.map((s, i) => (
          <Pressable key={i} onPress={() => onSelect?.(i)} style={[styles.seg, { flex: s.value, backgroundColor: s.color, opacity: selected === null || selected === i ? 1 : 0.3 }]} />
        ))}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: { borderRadius: radius.pill, overflow: "hidden" },
  row: { flex: 1, flexDirection: "row", gap: 2 },
  seg: { height: "100%" },
});
