import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, type StyleProp, type ViewStyle } from "react-native";

type Props = { children: ReactNode; delay?: number; y?: number; duration?: number; style?: StyleProp<ViewStyle> };

/** Fade + rise entrance (native-driven). Stagger siblings by passing increasing `delay`. */
export function FadeIn({ children, delay = 0, y = 18, duration = 650, style }: Props) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v, delay, duration]);
  return (
    <Animated.View style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [y, 0] }) }] }]}>
      {children}
    </Animated.View>
  );
}
