import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { colors } from "@/core/constants/theme";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type RingSegment = { fraction: number; color: string };
type Props = { segments: RingSegment[]; size?: number; stroke?: number; children?: ReactNode };

/** Donut that sweeps in on mount. Segments are drawn clockwise from 12 o'clock and should sum to 1. */
export function ProgressRing({ segments, size = 168, stroke = 14, children }: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const sweep = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    sweep.setValue(0);
    // SVG props can't use the native driver; the ring is tiny so JS-driven is fine.
    Animated.timing(sweep, { toValue: 1, duration: 1100, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [sweep, segments]);

  let start = 0;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={colors.trackNight} strokeWidth={stroke} fill="none" />
        {segments.map((s, i) => {
          const len = Math.max(0, s.fraction) * c;
          const rotation = -90 + start * 360;
          start += s.fraction;
          return (
            <AnimatedCircle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={stroke}
              strokeLinecap="butt"
              fill="none"
              strokeDasharray={`${len} ${c}`}
              strokeDashoffset={sweep.interpolate({ inputRange: [0, 1], outputRange: [len, 0] }) as unknown as number}
              rotation={rotation}
              origin={`${size / 2}, ${size / 2}`}
            />
          );
        })}
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill, alignItems: "center", justifyContent: "center" },
});
