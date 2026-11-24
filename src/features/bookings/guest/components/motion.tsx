import { useEffect, useRef, type ReactNode } from 'react';
import { Animated, Easing, type StyleProp, type ViewStyle } from 'react-native';

// The booking app's Reanimated motion, rebuilt on the stock Animated API (this app ships without Reanimated).
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

/** Fade in while rising `dy` px (0 = fade only). Plays once on mount. */
export function Enter({ children, delay = 0, duration = 450, dy = 25, style }: { children: ReactNode; delay?: number; duration?: number; dy?: number; style?: StyleProp<ViewStyle> }) {
  const p = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const a = Animated.timing(p, { toValue: 1, delay, duration, easing: EASE, useNativeDriver: true });
    a.start();
    return () => a.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Animated.View style={[style, { opacity: p, transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [dy, 0] }) }] }]}>{children}</Animated.View>;
}

/** A chevron that turns half-way round while `open`. */
export function useTurn(open: boolean, duration: number) {
  const p = useRef(new Animated.Value(open ? 1 : 0)).current;
  useEffect(() => {
    Animated.timing(p, { toValue: open ? 1 : 0, duration, useNativeDriver: true }).start();
  }, [open, duration, p]);
  return { transform: [{ rotate: p.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] }) }] };
}
