import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet } from 'react-native';

import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { Text } from '@/features/bookings/guest/components/Text';
import { C, FONTS } from '@/features/bookings/guest/theme';

/** "← Groups": leaves the Bookings module. Alabaster with a gold line on light pages, clear glass over photos. */
export default function GroupsPill({ onPress, onPhoto }: { onPress: () => void; onPhoto?: boolean }) {
  return (
    <Pressable onPress={onPress} hitSlop={6} accessibilityRole="button" accessibilityLabel="Back to Serene Groups" style={({ pressed }) => [styles.pill, onPhoto ? glassEdge : styles.light, pressed && styles.pressed]}>
      {onPhoto && <ClearGlass />}
      <Ionicons name="arrow-back-outline" size={14} style={onPhoto ? glassInk : { color: C.goldInk }} />
      <Text numberOfLines={1} style={[styles.label, onPhoto ? glassInk : { color: C.pine }]}>Groups</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 38, paddingHorizontal: 11, borderRadius: 999 },
  light: { backgroundColor: C.sand, borderWidth: 1, borderColor: C.goldLine },
  pressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  label: { fontSize: 14, fontFamily: FONTS.uiBold },
});
