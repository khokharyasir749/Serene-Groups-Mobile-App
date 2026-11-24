import { HEX } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';

import { PressableScale } from '@/features/bookings/guest/components/ui';
import { fmtDay, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, FONTS } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

/**
 * Clean & Minimalist StayBar: Quiet monochrome luxury, zero clashing colors.
 */
export default function StayBar({ stay, onPress }: { stay: Stay; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      scaleTo={0.985}
      style={styles.bar}
      accessibilityRole="button"
      accessibilityLabel={`Dates: ${fmtDay(stay.checkIn)} to ${fmtDay(stay.checkOut)}, Guests: ${stay.adults + stay.children}`}
    >
      {/* Dates Cell */}
      <View style={[styles.cell, { flex: 1.2 }]}>
        <Ionicons name="calendar-outline" size={17} color={C.pine} style={styles.icon} />
        <View style={styles.textWrap}>
          <Text style={styles.label}>DATES</Text>
          <Text style={styles.val} numberOfLines={1}>
            {fmtDay(stay.checkIn)} – {fmtDay(stay.checkOut)}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Guests Cell */}
      <View style={[styles.cell, { flex: 1 }]}>
        <Ionicons name="people-outline" size={17} color={C.pine} style={styles.icon} />
        <View style={styles.textWrap}>
          <Text style={styles.label}>GUESTS</Text>
          <Text style={styles.val} numberOfLines={1}>
            {stay.adults + stay.children} · {plural(stay.rooms, 'apt')}
          </Text>
        </View>
      </View>

      {/* Search Button */}
      <View style={styles.go}>
        <Ionicons name="search" size={16} color={C.cream} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 6,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    ...glassCard,
  },
  cell: {
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  icon: {
    opacity: 0.75,
  },
  textWrap: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 9,
    fontFamily: FONTS.uiBold,
    letterSpacing: 1.2,
    color: C.ink55,
  },
  val: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.pine,
    marginTop: 1.5,
  },
  divider: {
    width: 1,
    height: 24,
    marginHorizontal: 10,
    backgroundColor: C.line,
  },
  go: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
    backgroundColor: C.pine,
  },
});
