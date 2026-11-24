import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, View, type StyleProp, type ViewStyle } from 'react-native';

import { EASE } from '@/features/bookings/guest/components/motion';

/**
 * Inline reveal: the height opens from 0 to its content's height with a short ease-out and a fade. The content stays mounted,
 * so inputs keep their text when it closes, and the drawer follows if the content later grows (an error message).
 */
export default function Drawer({ open, children, style, duration = 320 }: { open: boolean; children: ReactNode; style?: StyleProp<ViewStyle>; duration?: number }) {
  const p = useRef(new Animated.Value(open ? 1 : 0)).current;
  const [full, setFull] = useState(0);

  useEffect(() => {
    // Height can't use the native driver.
    Animated.timing(p, { toValue: open ? 1 : 0, duration, easing: EASE, useNativeDriver: false }).start();
  }, [open, duration, p]);

  const box = { height: p.interpolate({ inputRange: [0, 1], outputRange: [0, full] }), opacity: p, overflow: 'hidden' as const };
  return (
    <Animated.View style={[box, style]} pointerEvents={open ? 'auto' : 'none'} accessibilityElementsHidden={!open} importantForAccessibility={open ? 'auto' : 'no-hide-descendants'}>
      <View onLayout={(e) => setFull(e.nativeEvent.layout.height)} style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {children}
      </View>
    </Animated.View>
  );
}
