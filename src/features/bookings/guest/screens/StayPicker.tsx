import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ModalHeader from '@/features/bookings/guest/components/ModalHeader';
import Segmented from '@/features/bookings/guest/components/Segmented';
import { Button, Stepper } from '@/features/bookings/guest/components/ui';
import { CONFIG, roomType, type RoomType } from '@/features/bookings/guest/data/catalog';
import { addDays, fromISO, guestsLabel, monthName, nightlyRate, nightsBetween, plural, today, toISO } from '@/features/bookings/guest/lib/stay';
import { useShallow } from 'zustand/react/shallow';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCardDark } from '@/features/bookings/guest/theme/glass';

type Tab = 'dates' | 'guests';

// Full-screen "Your stay": a range calendar (with nightly prices when an apartment type is known) and guests.
// Params: tab = dates | guests · type = room slug for prices · next = apartments to show results after applying.
export default function StayModal() {
  const params = useLocalSearchParams<{ tab?: Tab; type?: string; next?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { stay, setStay } = useBooking(useShallow((s) => ({ stay: s.stay, setStay: s.setStay })));
  const type = params.type ? roomType(params.type) : undefined;
  const [draft, setDraft] = useState(stay);
  const [tab, setTab] = useState<Tab>(params.tab === 'guests' ? 'guests' : 'dates');
  const [picking, setPicking] = useState<'in' | 'out'>('in');

  const nights = nightsBetween(draft.checkIn, draft.checkOut);
  const valid = nights >= 1 && picking === 'in';

  const pick = useCallback(
    (iso: string) => {
      if (picking === 'in' || iso <= draft.checkIn) {
        setDraft((d) => ({ ...d, checkIn: iso, checkOut: addDays(iso, 1) }));
        setPicking('out');
      } else {
        const out = nightsBetween(draft.checkIn, iso) > CONFIG.maxStayNights ? addDays(draft.checkIn, CONFIG.maxStayNights) : iso;
        setDraft((d) => ({ ...d, checkOut: out }));
        setPicking('in');
      }
    },
    [picking, draft.checkIn],
  );

  const apply = () => {
    setStay(draft);
    router.back();
    if (params.next === 'apartments') setTimeout(() => router.navigate('/apartments'), 50);
  };

  return (
    <View style={canvas}>
      <ModalHeader title="Your stay" onClose={() => router.back()} />

      <View style={{ paddingHorizontal: S.gutter, paddingTop: 14 }}>
        {/* Live summary of the selection */}
        <View style={styles.hero}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.heroEyebrow}>{type ? type.name : 'Serene Heights, Nathia Gali'}</Text>
            {picking === 'in' && nights >= 1 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{plural(nights, 'night')}</Text>
              </View>
            )}
          </View>
          <Text style={styles.heroTitle}>{picking === 'out' ? 'Now choose check-out' : `${nights}-night stay`}</Text>
          <View style={styles.dates}>
            <DateBlock label="Check-in" iso={draft.checkIn} active={tab === 'dates' && picking === 'in'} onPress={() => { setTab('dates'); setPicking('in'); }} />
            <Ionicons name="arrow-forward-outline" size={16} color={C.gold} />
            <DateBlock label="Check-out" iso={picking === 'out' ? null : draft.checkOut} active={tab === 'dates' && picking === 'out'} onPress={() => { setTab('dates'); setPicking('out'); }} />
          </View>
          <Pressable onPress={() => setTab('guests')} style={styles.guests} hitSlop={6}>
            <Ionicons name="people-outline" size={15} color={C.cream70} />
            <Text style={styles.guestsText}>
              {guestsLabel(draft.adults, draft.children)} · {plural(draft.rooms, 'apartment')}
            </Text>
            <Text style={styles.edit}>Edit</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 14 }}>
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { key: 'dates', label: 'Dates' },
              { key: 'guests', label: 'Guests' },
            ]}
          />
        </View>
      </View>

      {tab === 'dates' ? (
        <Calendar checkIn={draft.checkIn} checkOut={picking === 'out' ? null : draft.checkOut} onPick={pick} type={type} />
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: S.gutter, paddingTop: 8 }}>
          <Stepper label="Adults" hint="Age 13+" value={draft.adults} min={draft.rooms} max={20} onChange={(adults) => setDraft((d) => ({ ...d, adults }))} />
          <Stepper label="Children" hint="Age 0–12" value={draft.children} min={0} max={20} onChange={(children) => setDraft((d) => ({ ...d, children }))} />
          <Stepper label="Apartments" hint={`Up to ${CONFIG.maxRooms} per booking`} value={draft.rooms} min={1} max={CONFIG.maxRooms} onChange={(rooms) => setDraft((d) => ({ ...d, rooms, adults: Math.max(d.adults, rooms) }))} />
          <Text style={[T.small, { marginTop: 16 }]}>Each apartment sleeps 3–4 guests depending on type. Children under 5 stay free using existing beds.</Text>
        </ScrollView>
      )}

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable onPress={() => { setDraft(stay); setPicking('in'); }} hitSlop={8}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, textDecorationLine: 'underline' }}>Reset</Text>
        </Pressable>
        <Button label={valid ? `Search · ${plural(nights, 'night')}` : 'Choose check-out'} disabled={!valid} onPress={apply} style={{ flex: 1, marginLeft: 20 }} />
      </View>
    </View>
  );
}

const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function DateBlock({ label, iso, active, onPress }: { label: string; iso: string | null; active: boolean; onPress: () => void }) {
  const d = iso ? fromISO(iso) : null;
  return (
    <Pressable onPress={onPress} style={[styles.dateBlock, active && styles.dateOn]} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.dateLabel}>{label}</Text>
      {d ? (
        <>
          <Text style={styles.dateBig}>
            {d.getDate()} {monthName(d.getMonth()).slice(0, 3)}
          </Text>
          <Text style={styles.dateSub}>{WEEKDAY[d.getDay()]}</Text>
        </>
      ) : (
        <>
          <Text style={[styles.dateBig, { color: C.cream45 }]}>Select</Text>
          <Text style={styles.dateSub}>Tap a date</Text>
        </>
      )}
    </Pressable>
  );
}

const CELL = 56;
/** Month title: its space above, line and space below. */
const MONTH_HEAD = 20 + 28 + 8;
const WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function Calendar({ checkIn, checkOut, onPick, type }: { checkIn: string; checkOut: string | null; onPick: (iso: string) => void; type?: RoomType }) {
  const min = today();
  const months = useMemo(() => {
    const start = fromISO(min);
    return Array.from({ length: 12 }, (_, i) => toISO(new Date(start.getFullYear(), start.getMonth() + i, 1)));
  }, [min]);

  // Fixed row heights, so the list can open on the check-in month.
  const layout = useMemo(() => {
    let offset = 0;
    return months.map((iso, index) => {
      const m = fromISO(iso);
      const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      const length = MONTH_HEAD + Math.ceil((m.getDay() + days) / 7) * CELL;
      const item = { length, offset, index };
      offset += length;
      return item;
    });
  }, [months]);
  const first = Math.max(0, months.findIndex((m) => m.slice(0, 7) === checkIn.slice(0, 7)));

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.weekRow}>
        {WEEK.map((d, i) => (
          <Text key={i} style={styles.weekDay}>{d}</Text>
        ))}
      </View>
      <FlatList
        data={months}
        keyExtractor={(m) => m}
        initialNumToRender={2}
        initialScrollIndex={first}
        getItemLayout={(_, i) => layout[i]}
        windowSize={5}
        contentContainerStyle={{ paddingHorizontal: S.gutter, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Month first={item} min={min} checkIn={checkIn} checkOut={checkOut} onPick={onPick} type={type} />}
      />
    </View>
  );
}

const Month = memo(function Month({ first, min, checkIn, checkOut, onPick, type }: { first: string; min: string; checkIn: string; checkOut: string | null; onPick: (iso: string) => void; type?: RoomType }) {
  const m = fromISO(first);
  const lead = m.getDay();
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells: (string | null)[] = [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => toISO(new Date(m.getFullYear(), m.getMonth(), i + 1)))];
  while (cells.length % 7) cells.push(null);
  return (
    <View style={{ paddingTop: 20 }}>
      <Text numberOfLines={1} maxFontSizeMultiplier={1} style={[T.h3, { height: 28, marginBottom: 8 }]}>{monthName(m.getMonth())} {m.getFullYear()}</Text>
      <View style={styles.grid}>
        {cells.map((iso, i) => {
          if (!iso) return <View key={i} style={styles.cell} />;
          const past = iso < min;
          const edge = iso === checkIn || iso === checkOut;
          const inRange = checkOut != null && iso > checkIn && iso < checkOut;
          const price = type && !past ? nightlyRate(type, iso) : null;
          return (
            <Pressable key={iso} disabled={past} onPress={() => onPick(iso)} style={[styles.cell, inRange && styles.inRange]}>
              <View style={[styles.day, edge && styles.dayOn]}>
                <Text style={[styles.dayText, past && { color: C.ink40, opacity: 0.55 }, edge && { color: C.sand }]}>{fromISO(iso).getDate()}</Text>
              </View>
              {price != null && <Text style={styles.price}>{Math.round(price / 1000)}k</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  hero: { padding: 20, marginHorizontal: -8, borderRadius: 32, ...glassCardDark },
  heroEyebrow: { flex: 1, color: C.goldBright, fontFamily: FONTS.uiSemi, fontSize: 13.5 },
  heroTitle: { color: C.cream, fontFamily: FONTS.display, fontSize: 30, lineHeight: 34, marginTop: 6 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, backgroundColor: C.gold },
  badgeText: { color: C.pine, fontFamily: FONTS.uiBold, fontSize: 12.5 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 },
  dateBlock: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, backgroundColor: 'rgba(236, 238, 237, 0.08)', borderWidth: 1, borderColor: 'transparent' },
  dateOn: { borderColor: C.gold },
  dateLabel: { color: C.cream45, fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0 },
  dateBig: { color: C.cream, fontFamily: FONTS.display, fontSize: 24, lineHeight: 28, marginTop: 4 },
  dateSub: { color: C.cream70, fontFamily: FONTS.ui, fontSize: 13 },
  guests: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(236, 238, 237, 0.18)' },
  guestsText: { flex: 1, color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 13.5 },
  edit: { color: C.gold, fontFamily: FONTS.uiBold, fontSize: 14 },
  weekRow: { flexDirection: 'row', paddingHorizontal: S.gutter, marginTop: 16, paddingBottom: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  weekDay: { flex: 1, textAlign: 'center', fontSize: 12.5, color: C.ink55, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, height: CELL, alignItems: 'center', justifyContent: 'center' },
  inRange: { backgroundColor: C.goldSoft },
  day: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  dayOn: { backgroundColor: C.pine },
  dayText: { fontSize: 16, fontFamily: FONTS.uiMedium, color: C.ink },
  price: { fontSize: 12, color: C.ink55, marginTop: -3 },
  footer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.gutter, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, backgroundColor: C.sand },
});
