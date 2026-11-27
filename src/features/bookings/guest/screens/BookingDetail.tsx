import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { CalendarDays, Clock, MapPin, Phone, ShieldCheck, Users } from '@/features/bookings/guest/components/icons';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { Animated, Easing } from 'react-native';
import { Enter } from '@/features/bookings/guest/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import StatusPill from '@/features/bookings/guest/components/StatusPill';
import { BackBar, BookingSteps, Button, Caps, Photo, Sheet } from '@/features/bookings/guest/components/ui';
import { PROPERTY } from '@/features/bookings/guest/data/catalog';
import { fmtDate, guestsLabel, money, plural } from '@/features/bookings/guest/lib/stay';
import { useShallow } from 'zustand/react/shallow';
import { freeCancelUntil, tabOf, useBooking } from '@/features/bookings/guest/state/booking';
import { C, F, FONTS, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

const ACircle = Animated.createAnimatedComponent(Circle);
const APath = Animated.createAnimatedComponent(Path);

export default function BookingScreen() {
  const { ref, new: isNewParam } = useLocalSearchParams<{ ref: string; new?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { bookings, cancelBooking } = useBooking(useShallow((s) => ({ bookings: s.bookings, cancelBooking: s.cancelBooking })));
  const b = bookings.find((x) => x.reference === ref);
  const [confirm, setConfirm] = useState(false);
  const [reason, setReason] = useState('');

  if (!b) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter }}>
        <Text style={{ fontFamily: F.display, fontSize: 24, color: C.ink }}>Booking not found</Text>
        <Button label="My bookings" style={{ marginTop: 20 }} onPress={() => router.replace('/trips')} />
      </View>
    );
  }

  const isNew = isNewParam === '1' && b.status === 'CONFIRMED';
  const tab = tabOf(b);
  const until = freeCancelUntil(b);
  const canCancel = tab === 'upcoming';
  const cancelIsFree = until != null && until >= new Date().toISOString().slice(0, 10);

  return (
    <View style={canvas}>
      <View style={[styles.barBg, { height: insets.top + 56 }]} />
      <BackBar onBack={() => (router.canGoBack() ? router.back() : router.replace('/trips'))}  />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 72, paddingBottom: insets.bottom + 40, paddingHorizontal: S.gutter }}>
        {isNew && (
          <>
            <BookingSteps current={3} />
            <View style={styles.confirmed}>
              <DrawnCheck />
              <Enter delay={700} duration={700}><Text style={styles.confTitle}>Your booking is confirmed</Text></Enter>
              <Enter delay={850} duration={700}><Text style={[T.body, { textAlign: 'center', marginTop: 10 }]}>
                Thank you, {b.guest.firstName}. Keep your reference <Text style={{ fontWeight: '700', color: C.ink }}>{b.reference}</Text> to manage your booking. You’ll pay at the property.
              </Text></Enter>
            </View>
          </>
        )}

        <Enter delay={isNew ? 1000 : 0} duration={650}>
          {isNew ? null : <Text style={T.h1} accessibilityRole="header">Your stay</Text>}

          {/* Reference & price */}
          <View style={styles.refCard}>
            <View style={{ backgroundColor: C.deep, padding: 22 }}>
              <Caps color={C.goldBright} style={{ fontSize: 12 }}>Booking reference</Caps>
              <Text style={styles.ref}>{b.reference}</Text>
            </View>
            <View style={{ padding: 18, gap: 9 }}>
              <Row label="Apartments × nights" value={money(b.price.roomSubtotal)} />
              {b.price.discountTotal > 0 && <Row label="Discount" value={`− ${money(b.price.discountTotal)}`} />}
              {b.price.breakfastTotal > 0 && <Row label="Breakfast" value={money(b.price.breakfastTotal)} />}
              <Row label="Taxes" value={money(b.price.taxTotal)} />
              <View style={styles.total}>
                <Caps>Total</Caps>
                <Text style={{ fontFamily: F.display, fontSize: 28, color: C.ink }}>{money(b.price.grandTotal)}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: C.sand, paddingHorizontal: 18, paddingVertical: 12 }}>
              <Caps color={C.ink55} style={{ fontSize: 12 }}>Pay at the property · {b.status === 'CANCELLED' ? 'Cancelled' : 'Not paid yet'}</Caps>
            </View>
          </View>

          {/* Stay */}
          <View style={styles.card}>
            <Photo src={b.type.images[0]} style={{ width: '100%', aspectRatio: 16 / 9 }} />
            <View style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <StatusPill tab={tab} />
                <Text style={[T.small, { fontSize: 13 }]}>Booked {fmtDate(b.createdAt)}</Text>
              </View>
              <Text style={styles.name} onPress={() => router.push(`/room/${b.type.slug}`)}>{b.type.name}</Text>
              <Text style={[T.small, { marginTop: 4 }]}>{b.plan.name} · {b.type.bedType} · {b.type.outdoorSpace}</Text>
              <View style={styles.items}>
                <Item Icon={CalendarDays} label="Check-in" value={fmtDate(b.stay.checkIn)} sub="From 2:00 PM" />
                <Item Icon={CalendarDays} label="Check-out" value={fmtDate(b.stay.checkOut)} sub="Until 12:00 PM" />
                <Item Icon={Users} label="Guests" value={guestsLabel(b.stay.adults, b.stay.children)} sub={`${plural(b.stay.rooms, 'apartment')} · ${plural(b.price.nights, 'night')}`} />
                {b.arrivalTime && <Item Icon={Clock} label="Arrival" value={b.arrivalTime} />}
              </View>
            </View>
          </View>

          {b.status === 'CANCELLED' && (
            <View style={styles.cancelled}>
              <Text style={{ fontFamily: F.display, fontSize: 17, color: C.ink }}>This booking was cancelled</Text>
              <Text style={[T.small, { marginTop: 4 }]}>The apartment has been released.</Text>
            </View>
          )}

          <View style={{ marginTop: 22, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.lineStrong }}>
            <Section title="Lead guest">
              <Text style={[T.small, { color: C.ink70 }]}>
                {b.guest.firstName} {b.guest.lastName} · {b.guest.email} · {b.guest.phone}
              </Text>
              {b.specialRequests && (
                <Text style={styles.requests}>
                  <Text style={{ fontWeight: '700', color: C.ink }}>Special requests: </Text>
                  {b.specialRequests}
                </Text>
              )}
            </Section>
            <Section title="Cancellation policy">
              {b.plan.refundable && until ? (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <ShieldCheck size={15} color={C.positive} strokeWidth={1.5} style={{ marginTop: 2 }} />
                  <Text style={{ fontSize: 13.5, color: C.positive, flex: 1 }}>Free cancellation until {fmtDate(until)}, 2:00 PM (Pakistan time).</Text>
                </View>
              ) : (
                <Text style={T.small}>Non-refundable rate. If you cancel, the full amount is payable.</Text>
              )}
              {canCancel && b.status === 'CONFIRMED' && <Button variant="secondary" label="Cancel booking" style={{ marginTop: 16 }} onPress={() => setConfirm(true)} />}
            </Section>
            <Section title="Getting there">
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <MapPin size={15} color={C.ink55} strokeWidth={1.5} style={{ marginTop: 2 }} />
                <Text style={[T.small, { flex: 1, color: C.ink70 }]}>{PROPERTY.address}</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                <Phone size={15} color={C.ink55} strokeWidth={1.5} style={{ marginTop: 2 }} />
                <Text style={[T.small, { color: C.ink70 }]}>Front desk: {PROPERTY.phone}</Text>
              </View>
            </Section>
          </View>

          {isNew && (
            <View style={{ gap: 10, marginTop: 26 }}>
              <Button label="View my trips" onPress={() => router.replace('/trips')} />
              <Button variant="secondary" label="Back to Serene Bookings" onPress={() => router.replace('/')} />
            </View>
          )}
        </Enter>
      </ScrollView>

      <Sheet
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Cancel this booking?"
        footer={
          <View style={{ gap: 10 }}>
            <Button
              label="Yes, cancel"
              style={{ backgroundColor: C.danger, borderColor: C.danger }}
              onPress={() => {
                cancelBooking(b.reference);
                setConfirm(false);
              }}
            />
            <Button variant="secondary" label="Keep booking" onPress={() => setConfirm(false)} />
          </View>
        }>
        <View style={{ paddingHorizontal: S.gutter }}>
          <Text style={T.body}>
            {cancelIsFree
              ? 'You’re within the free cancellation window. Nothing will be charged.'
              : b.plan.refundable
                ? 'The free cancellation window has passed. The front desk will contact you about any charge.'
                : 'This is a non-refundable rate. The full amount remains payable.'}
          </Text>
          <Caps color={C.ink70} style={{ marginTop: 18, marginBottom: 8, fontSize: 12.5 }}>Reason (optional)</Caps>
          <TextInput value={reason} onChangeText={setReason} multiline maxLength={300} style={styles.input} placeholderTextColor={C.ink40} />
        </View>
      </Sheet>
    </View>
  );
}

// A ring and tick that draw themselves, then rest.
function DrawnCheck() {
  const ring = useRef(new Animated.Value(0)).current;
  const tick = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    // SVG props can't use the native driver.
    Animated.timing(ring, { toValue: 1, duration: 700, easing: Easing.bezier(0.65, 0, 0.35, 1), useNativeDriver: false }).start();
    Animated.timing(tick, { toValue: 1, delay: 450, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: false }).start();
  }, [ring, tick]);
  const R = 30;
  const CIRC = 2 * Math.PI * R;
  const ringOffset = ring.interpolate({ inputRange: [0, 1], outputRange: [CIRC, 0] }) as unknown as number;
  const tickOffset = tick.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) as unknown as number;
  return (
    <Svg width={72} height={72} viewBox="0 0 72 72">
      <ACircle cx={S.well} cy={S.well} r={R} stroke={C.pine} strokeWidth={1.5} fill="none" strokeDasharray={[CIRC, CIRC]} strokeDashoffset={ringOffset} rotation={-90} originX={S.well} originY={S.well} />
      <APath d="M24 37 L32 45 L48 28" stroke={C.pine} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={[40, 40]} strokeDashoffset={tickOffset} />
    </Svg>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text style={{ fontSize: 13.5, color: C.ink70 }}>{label}</Text>
      <Text style={{ fontSize: 13.5, color: C.ink70 }}>{value}</Text>
    </View>
  );
}

function Item({ Icon, label, value, sub }: { Icon: typeof Users; label: string; value: string; sub?: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, width: '50%', paddingVertical: 8, paddingRight: 8 }}>
      <Icon size={15} color={C.ink55} strokeWidth={1.5} style={{ marginTop: 1 }} />
      <View style={{ flex: 1 }}>
        <Caps color={C.ink55} style={{ fontSize: 12 }}>{label}</Caps>
        <Text style={{ fontFamily: F.display, fontSize: 15, color: C.ink, marginTop: 5 }}>{value}</Text>
        {sub && <Text style={[T.small, { fontSize: 13, marginTop: 2 }]}>{sub}</Text>}
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ paddingVertical: 20, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.lineStrong }}>
      <Text style={[T.h3, { marginBottom: 10 }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 15, backgroundColor: C.sand },
  confirmed: { alignItems: 'center', paddingVertical: 34, marginTop: 20, marginBottom: 18, backgroundColor: C.snow, borderRadius: S.radius, paddingHorizontal: 20, ...glassCard },
  confTitle: { fontFamily: F.display, fontSize: 35, lineHeight: 39, color: C.ink, marginTop: 18, textAlign: 'center' },
  refCard: { marginTop: 18, backgroundColor: C.white, marginHorizontal: -8, borderRadius: 32, overflow: 'hidden', ...glassCard },
  ref: { fontFamily: F.display, fontSize: 38, color: C.sand, marginTop: 4, letterSpacing: 0.5 },
  total: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.lineStrong },
  card: { marginTop: 18, backgroundColor: C.white, marginHorizontal: -8, borderRadius: 32, overflow: 'hidden', ...glassCard },
  name: { fontFamily: F.display, fontSize: 24, lineHeight: 28, color: C.ink, marginTop: 12 },
  items: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 14, paddingTop: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
  cancelled: { marginTop: 18, padding: 16, borderLeftWidth: 2, borderLeftColor: C.danger, backgroundColor: C.white },
  requests: { marginTop: 12, fontSize: 14, color: C.ink70, borderLeftWidth: 2, borderLeftColor: C.lineStrong, paddingLeft: 12, paddingVertical: 6 },
  input: { fontFamily: FONTS.ui, borderWidth: 1, borderColor: C.lineStrong, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: C.ink, backgroundColor: C.white, borderRadius: 12, minHeight: 70, textAlignVertical: 'top' },
});
