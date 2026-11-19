import { useRef, type ReactNode } from "react";
import { Animated, Pressable, StyleSheet, type GestureResponderEvent } from "react-native";

type Props = {
  children?: ReactNode;
  onPress?: ((e: GestureResponderEvent) => void) | null;
  onLongPress?: ((e: GestureResponderEvent) => void) | null;
  accessibilityState?: { selected?: boolean };
  accessibilityLabel?: string;
  testID?: string;
};

/** Tab bar button with a soft press-in scale (haptic-style feedback). */
export function TabButton({ children, onPress, onLongPress, accessibilityState, accessibilityLabel, testID }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(scale, { toValue: v, speed: 40, bounciness: 6, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={onPress ?? undefined}
      onLongPress={onLongPress ?? undefined}
      onPressIn={() => to(0.9)}
      onPressOut={() => to(1)}
      accessibilityRole="button"
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={styles.btn}
    >
      <Animated.View style={[styles.inner, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { flex: 1 },
  inner: { flex: 1, alignItems: "center", justifyContent: "center" },
});
