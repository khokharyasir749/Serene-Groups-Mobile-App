import { useRef, type ReactNode } from "react";
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = Omit<PressableProps, "style" | "children"> & { style?: StyleProp<ViewStyle>; children?: ReactNode };

/** The one press feel: a quick spring under the finger. */
export function PressScale({ style, children, ...rest }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: true }).start();
  return (
    <AnimatedPressable accessibilityRole="button" {...rest} onPressIn={() => to(0.96)} onPressOut={() => to(1)} style={[style, { transform: [{ scale }] }]}>
      {children}
    </AnimatedPressable>
  );
}
