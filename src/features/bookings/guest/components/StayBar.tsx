import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/features/bookings/guest/components/Text';
import { PressableScale } from '@/features/bookings/guest/components/ui';
import { fmtDay, guestsLabel, nightsBetween, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, FONTS } from '@/features/bookings/guest/theme';

type Props = {
  stay: Stay;
  onDates: () => void;
  onGuests: () => void;
  /** With a search button; without one the bar only edits the stay. */
  onSearch?: () => void;
};

/** The stay at a glance: dates and guests, each tappable, and one search button. The same bar as Explore. */
export default function StayBar({ stay, onDates, onGuests, onSearch }: Props) {
  const dates = `${fmtDay(stay.checkIn)} – ${fmtDay(stay.checkOut)}`;
  const guests = guestsLabel(stay.adults, stay.children);
  return (
    <View style={styles.bar}>
      <PressableScale onPress={onDates} scaleTo={0.97} style={[styles.field, { flex: 1.4 }]} accessibilityRole="button" accessibilityLabel={`Dates: ${dates}. Change`}>
        <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.1}>{plural(nightsBetween(stay.checkIn, stay.checkOut), 'night')}</Text>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>{dates}</Text>
      </PressableScale>
      <View style={styles.rule} />
      <PressableScale onPress={onGuests} scaleTo={0.97} style={[styles.field, { flex: 1 }]} accessibilityRole="button" accessibilityLabel={`Guests: ${guests}, ${plural(stay.rooms, 'apartment')}. Change`}>
        <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.1}>{plural(stay.rooms, 'apartment')}</Text>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>{guests}</Text>
      </PressableScale>
      <PressableScale onPress={onSearch ?? onDates} scaleTo={0.94} style={styles.go} accessibilityRole="button" accessibilityLabel={onSearch ? 'Search apartments' : 'Change dates'}>
        <Ionicons name={onSearch ? 'search' : 'calendar-outline'} size={21} color={C.sand} />
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 76, maxWidth: 560, flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 9, borderRadius: 28, backgroundColor: C.white, boxShadow: C.lift },
  field: { height: 76, justifyContent: 'center', gap: 2 },
  label: { fontFamily: FONTS.uiMedium, fontSize: 12.5, lineHeight: 17, color: C.goldInk },
  value: { fontFamily: FONTS.uiBold, fontSize: 16, lineHeight: 22, color: C.ink },
  rule: { width: 1, height: 34, backgroundColor: C.line, marginHorizontal: 14 },
  go: { width: 58, height: 58, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: C.pine, marginLeft: 8 },
});
