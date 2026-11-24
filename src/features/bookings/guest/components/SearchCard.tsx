import { CalendarDays, ChevronRight, Users } from '@/features/bookings/guest/components/icons';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';

import { Button, Caps, PressableScale } from '@/features/bookings/guest/components/ui';
import { fmtShort, guestsLabel, nightsBetween, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, F, FONTS, shadow } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

// The primary search: two clearly labelled fields and one obvious action.
export default function SearchCard({ stay, onDates, onGuests, onSearch }: { stay: Stay; onDates: () => void; onGuests: () => void; onSearch: () => void }) {
  const nights = nightsBetween(stay.checkIn, stay.checkOut);
  return (
    <View style={styles.card}>
      <PressableScale onPress={onDates} scaleTo={0.985} style={styles.field}>
        <View style={styles.icon}>
          <CalendarDays size={18} color={C.pine} strokeWidth={1.75} />
        </View>
        <View style={{ flex: 1 }}>
          <Caps color={C.gold} style={{ fontSize: 9.5, letterSpacing: 1.3 }}>CHECK-IN — CHECK-OUT</Caps>
          <Text style={styles.value}>
            {fmtShort(stay.checkIn)} – {fmtShort(stay.checkOut)}
          </Text>
        </View>
        <View style={styles.nightsBadge}>
          <Text style={styles.nightsText}>{plural(nights, 'night')}</Text>
        </View>
        <ChevronRight size={16} color={C.ink40} strokeWidth={1.75} />
      </PressableScale>
      <View style={styles.div} />
      <PressableScale onPress={onGuests} scaleTo={0.985} style={styles.field}>
        <View style={styles.icon}>
          <Users size={18} color={C.pine} strokeWidth={1.75} />
        </View>
        <View style={{ flex: 1 }}>
          <Caps color={C.gold} style={{ fontSize: 9.5, letterSpacing: 1.3 }}>GUESTS & APARTMENTS</Caps>
          <Text style={styles.value}>
            {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')}
          </Text>
        </View>
        <ChevronRight size={16} color={C.ink40} strokeWidth={1.75} />
      </PressableScale>
      <Button label="Search residences" onPress={onSearch} icon={<ChevronRight size={15} color={C.sand} strokeWidth={2} />} style={{ marginTop: 14 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.pureWhite, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: 'rgba(200, 164, 106, 0.3)', ...shadow.cardHover, ...glassCard },
  field: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingHorizontal: 6 },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' },
  value: { fontFamily: FONTS.uiBold, fontSize: 16, color: C.ink, marginTop: 3 },
  nightsBadge: { paddingHorizontal: 9, paddingVertical: 3.5, borderRadius: 999, backgroundColor: 'rgba(200, 164, 106, 0.16)', borderWidth: 1, borderColor: 'rgba(200, 164, 106, 0.3)', marginRight: 4 },
  nightsText: { fontFamily: FONTS.uiBold, fontSize: 11, color: C.pine },
  div: { height: StyleSheet.hairlineWidth, backgroundColor: C.line, marginLeft: 60, marginVertical: 2 },
});
