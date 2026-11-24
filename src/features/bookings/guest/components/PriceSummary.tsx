import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Enter } from '@/features/bookings/guest/components/motion';

import { Caps } from '@/features/bookings/guest/components/ui';
import type { RatePlan } from '@/features/bookings/guest/data/catalog';
import { fmtDate, fmtShort, guestsLabel, money, plural, type Quote, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, F, S, T } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

export default function PriceSummary({ stay, roomName, plan, q }: { stay: Stay; roomName: string; plan: RatePlan; q: Quote }) {
  const [nights, setNights] = useState(false);
  return (
    <View style={styles.box}>
      <View style={styles.head}>
        <Caps color={C.gold} style={{ fontSize: 9.5 }}>Your stay</Caps>
        <Text style={styles.room}>{roomName}</Text>
        <Text style={{ fontSize: 13, color: C.cream70, marginTop: 4 }}>{plan.name}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.cell, { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: C.line }]}>
          <Caps color={C.ink55} style={{ fontSize: 9 }}>Check-in</Caps>
          <Text style={styles.date}>{fmtDate(stay.checkIn)}</Text>
          <Text style={[T.small, { fontSize: 11.5 }]}>From 2:00 PM</Text>
        </View>
        <View style={styles.cell}>
          <Caps color={C.ink55} style={{ fontSize: 9 }}>Check-out</Caps>
          <Text style={styles.date}>{fmtDate(stay.checkOut)}</Text>
          <Text style={[T.small, { fontSize: 11.5 }]}>Until 12:00 PM</Text>
        </View>
      </View>
      <View style={[styles.cell, styles.top]}>
        <Caps color={C.ink55} style={{ fontSize: 9 }}>Guests</Caps>
        <Text style={{ marginTop: 6, color: C.ink, fontSize: 14 }}>
          {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')} · {plural(q.nights, 'night')}
        </Text>
      </View>
      <View style={[styles.top, { padding: 18, gap: 9 }]}>
        <Row label={`${plural(stay.rooms, 'apartment')} × ${plural(q.nights, 'night')}`} value={money(q.roomSubtotal)} />
        <Pressable onPress={() => setNights((s) => !s)} hitSlop={8}>
          <Caps color={C.ink55} style={{ fontSize: 9, textDecorationLine: 'underline' }}>{nights ? 'Hide' : 'Show'} nightly rates</Caps>
        </Pressable>
        {nights && (
          <Enter duration={250} dy={0} style={styles.nightly}>
            {q.nightly.map((n) => (
              <View key={n.date} style={styles.nightRow}>
                <Text style={[T.small, { fontSize: 12 }]}>{fmtShort(n.date)}</Text>
                <Text style={[T.small, { fontSize: 12 }]}>{money(n.rate)} per apartment</Text>
              </View>
            ))}
          </Enter>
        )}
        {q.discountTotal > 0 && <Row label={`Saver discount (${plan.discountPercent}%)`} value={`− ${money(q.discountTotal)}`} color={C.positive} />}
        {q.breakfastTotal > 0 && <Row label="Breakfast" value={money(q.breakfastTotal)} />}
        <Row label={`Taxes (${q.taxPercent}%)`} value={money(q.taxTotal)} />
        <View style={styles.total}>
          <Caps>Total</Caps>
          <Text style={{ fontFamily: F.display, fontSize: 28, color: C.ink }}>{money(q.grandTotal)}</Text>
        </View>
        <Text style={[T.small, { fontSize: 12 }]}>Payable at the property in Pakistani rupees.</Text>
      </View>
    </View>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={{ fontSize: 13.5, color: color ?? C.ink70 }}>{label}</Text>
      <Text style={{ fontSize: 13.5, color: color ?? C.ink70 }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: C.white, borderRadius: S.radius, overflow: 'hidden', borderWidth: StyleSheet.hairlineWidth, borderColor: C.line, ...glassCard },
  head: { backgroundColor: C.pine, padding: 20 },
  room: { fontFamily: F.display, fontSize: 21, lineHeight: 25, color: C.sand, marginTop: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  cell: { flex: 1, padding: 16 },
  top: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  date: { fontFamily: F.display, fontSize: 16, color: C.ink, marginTop: 6, marginBottom: 2 },
  nightly: { backgroundColor: C.sand, paddingHorizontal: 12, borderRadius: 12 },
  nightRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.lineStrong },
});
