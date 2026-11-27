import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { useState, type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ModalHeader from '@/features/bookings/guest/components/ModalHeader';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo } from '@/features/bookings/guest/components/ui';
import { RATE_PLANS, roomType, type RatePlan } from '@/features/bookings/guest/data/catalog';
import { availability, fmtDay, fromISO, guestsLabel, money, plural, quote } from '@/features/bookings/guest/lib/stay';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S, T, shadow } from '@/features/bookings/guest/theme';
import { canvas, glassCard, glassCardDark, glassFlat } from '@/features/bookings/guest/theme/glass';

type Glyph = ComponentProps<typeof Ionicons>['name'];
const WEEKDAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Full-screen rate choice. Reads top to bottom: what you picked (apartment, dates, guests) → the three rates → one action.
export default function RatesModal() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const stay = useBooking((s) => s.stay);
  const type = roomType(slug ?? '');
  const [code, setCode] = useState<RatePlan['code']>('FLEX');

  if (!type) {
    return (
      <View style={canvas}>
        <ModalHeader title="Choose your rate" onClose={() => router.back()} />
        <Text style={[T.body, { padding: S.gutter }]}>This apartment isn’t available.</Text>
      </View>
    );
  }

  const plan = RATE_PLANS.find((p) => p.code === code)!;
  const q = quote(type, plan, stay);
  const av = availability(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const ci = fromISO(stay.checkIn);
  const co = fromISO(stay.checkOut);

  return (
    <View style={canvas}>
      <ModalHeader title="Choose your rate" onClose={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: S.gutter, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
        {/* Your selection */}
        <View style={styles.summary}>
          <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
            <Photo src={type.images[0]} style={styles.thumb} />
            <View style={{ flex: 1 }}>
              <Text style={styles.eyebrowGold}>Your selection</Text>
              <Text style={styles.roomName} numberOfLines={2}>{type.name}</Text>
              <Text style={styles.roomSpecs} numberOfLines={1}>{type.bedType} · {type.outdoorSpace}</Text>
            </View>
          </View>

          <View style={styles.dates}>
            <DateCell label="Check-in" top={WEEKDAY[ci.getDay()]} value={fmtDay(stay.checkIn)} />
            <View style={styles.nightsWrap}>
              <View style={styles.nightsLine} />
              <View style={styles.nights}>
                <Text style={styles.nightsText}>{plural(q.nights, 'night')}</Text>
              </View>
              <View style={styles.nightsLine} />
            </View>
            <DateCell label="Check-out" top={WEEKDAY[co.getDay()]} value={fmtDay(stay.checkOut)} align="right" />
          </View>

          <View style={styles.summaryFoot}>
            <Ionicons name="people-outline" size={16} color={C.cream70} />
            <Text style={styles.guests}>
              {guestsLabel(stay.adults, stay.children)} · {plural(stay.rooms, 'apartment')}
            </Text>
            <Pressable onPress={() => router.push({ pathname: '/stay', params: { type: type.slug } })} hitSlop={8} style={styles.change} accessibilityRole="button" accessibilityLabel="Change dates and guests">
              <Text style={styles.changeText}>Change</Text>
              <Ionicons name="chevron-forward-outline" size={13} color={C.pine} />
            </Pressable>
          </View>
        </View>

        {!bookable ? (
          <View style={styles.notice}>
            <Text style={T.h3}>{av.soldOut ? 'Sold out for these dates' : 'Too many guests for one apartment'}</Text>
            <Text style={[T.small, { marginTop: 4 }]}>{av.soldOut ? 'Try other dates.' : `Sleeps up to ${type.maxOccupancy}. Add another apartment.`}</Text>
          </View>
        ) : (
          <>
            <Text style={[T.h2, { marginTop: 28 }]}>Select your rate</Text>
            <Text style={[T.small, { marginTop: 3, marginBottom: 14 }]}>Prices are for your whole stay and include taxes. Nothing is charged now.</Text>

            {RATE_PLANS.map((rp) => (
              <RateCard key={rp.code} rp={rp} on={rp.code === code} onPress={() => setCode(rp.code)} q={quote(type, rp, stay)} />
            ))}
          </>
        )}
      </ScrollView>

      {/* Footer: the running total and the one action */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.footLabel} numberOfLines={1}>{plan.name}</Text>
          <Text style={styles.footTotal} numberOfLines={1} adjustsFontSizeToFit>{money(q.grandTotal)}</Text>
          <Text style={styles.footNote}>Total incl. taxes</Text>
        </View>
        <Pressable
          disabled={!bookable}
          onPress={() => router.replace({ pathname: '/book/[slug]', params: { slug: type.slug, rate: plan.code } })}
          accessibilityRole="button"
          accessibilityLabel="Continue"
          style={({ pressed }) => [styles.cta, !bookable && { opacity: 0.4 }, pressed && { opacity: 0.92, transform: [{ scale: 0.985 }] }]}>
          <Text style={styles.ctaText}>Continue</Text>
          <View style={styles.badge}>
            <Ionicons name="arrow-forward-outline" size={19} color={C.pine} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function DateCell({ label, top, value, align }: { label: string; top: string; value: string; align?: 'right' }) {
  return (
    <View style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}>
      <Text style={styles.cellLabel}>{label}</Text>
      <Text style={styles.cellValue}>{value}</Text>
      <Text style={styles.cellTop}>{top}</Text>
    </View>
  );
}

function RateCard({ rp, on, onPress, q }: { rp: RatePlan; on: boolean; onPress: () => void; q: ReturnType<typeof quote> }) {
  const perNight = Math.round(q.grandTotal / Math.max(1, q.nights));
  const perks: { icon: Glyph; text: string; tone?: 'good' | 'plain' }[] = [
    ...(rp.breakfastIncluded ? [{ icon: 'cafe-outline' as Glyph, text: 'Breakfast included' }] : []),
    rp.refundable ? { icon: 'shield-checkmark-outline' as Glyph, text: 'Free cancellation' } : { icon: 'lock-closed-outline' as Glyph, text: 'Non-refundable', tone: 'plain' as const },
    { icon: 'card-outline' as Glyph, text: 'Pay at property' },
  ];
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={`${rp.name}, ${money(q.grandTotal)}`} style={[styles.rate, on ? styles.rateOn : styles.rateOff]}>
      <View style={styles.rateTop}>
        <View style={[styles.radio, on && styles.radioOn]}>{on && <Ionicons name="checkmark-outline" size={14} color={C.cream} />}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.rateName}>{rp.name}</Text>
          {rp.discountPercent > 0 && (
            <View style={styles.save}>
              <Ionicons name="pricetag-outline" size={11} color={C.cream} />
              <Text style={styles.saveText}>Save {rp.discountPercent}%</Text>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          {q.discountTotal > 0 && <Text style={styles.strike}>{money(q.undiscountedTotal)}</Text>}
          <Text style={styles.total}>{money(q.grandTotal)}</Text>
          <Text style={styles.perNight}>{money(perNight)} / night</Text>
        </View>
      </View>
      <View style={styles.perks}>
        {perks.map((p) => (
          <View key={p.text} style={[styles.perk, p.tone === 'plain' && styles.perkPlain]}>
            <Ionicons name={p.icon} size={12} color={p.tone === 'plain' ? C.ink55 : C.positive} />
            <Text style={[styles.perkText, p.tone === 'plain' && { color: C.ink55 }]}>{p.text}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: { padding: 20, marginHorizontal: -8, borderRadius: 32, ...glassCardDark },
  thumb: { width: 76, height: 76, borderRadius: 18 },
  eyebrowGold: { color: C.goldBright, fontFamily: FONTS.uiSemi, fontSize: 12, letterSpacing: 0 },
  roomName: { color: C.cream, fontFamily: FONTS.display, fontSize: 23, lineHeight: 26, marginTop: 4 },
  roomSpecs: { color: C.cream70, fontFamily: FONTS.ui, fontSize: 14, marginTop: 4 },
  dates: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 18, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(236, 238, 237, 0.2)' },
  cellLabel: { color: C.cream45, fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0 },
  cellValue: { color: C.cream, fontFamily: FONTS.display, fontSize: 27, lineHeight: 30, marginTop: 3 },
  cellTop: { color: C.cream70, fontFamily: FONTS.ui, fontSize: 13, marginTop: 1 },
  nightsWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  nightsLine: { flex: 1, height: StyleSheet.hairlineWidth * 2, backgroundColor: 'rgba(200, 164, 106, 0.55)' },
  nights: { paddingHorizontal: 10, height: 24, borderRadius: 12, backgroundColor: C.gold, justifyContent: 'center', marginHorizontal: 6 },
  nightsText: { color: C.pine, fontFamily: FONTS.uiBold, fontSize: 12.5 },
  summaryFoot: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(236, 238, 237, 0.2)' },
  guests: { flex: 1, color: C.cream, fontFamily: FONTS.uiSemi, fontSize: 13.5 },
  change: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingLeft: 16, paddingRight: 12, height: 44, borderRadius: 22, backgroundColor: C.cream },
  changeText: { color: C.pine, fontFamily: FONTS.uiBold, fontSize: 13 },
  notice: { marginTop: 24, padding: 18, borderRadius: S.card, backgroundColor: C.pureWhite, ...glassCard },
  rate: { padding: 20, marginBottom: 12, marginHorizontal: -8, borderRadius: 30, backgroundColor: C.pureWhite, ...glassCard },
  rateOff: { borderWidth: 2, borderColor: 'transparent' },
  rateOn: { borderWidth: 2, borderColor: C.pine, ...shadow.card, shadowOpacity: 0.1, shadowRadius: 12, elevation: 3, ...glassFlat },
  rateTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.lineStrong, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  radioOn: { backgroundColor: C.pine, borderColor: C.pine },
  rateName: { color: C.ink, fontFamily: FONTS.display, fontSize: 25, lineHeight: 28 },
  save: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 6, paddingHorizontal: 8, height: 20, borderRadius: 10, backgroundColor: C.pine },
  saveText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0 },
  strike: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13, textDecorationLine: 'line-through', opacity: 0.85, fontVariant: ['tabular-nums'] },
  total: { color: C.ink, fontFamily: FONTS.uiBold, fontSize: 19, letterSpacing: -0.2, fontVariant: ['tabular-nums'] },
  perNight: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13, marginTop: 1, fontVariant: ['tabular-nums'] },
  perks: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingLeft: S.well },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, height: 32, borderRadius: 16, backgroundColor: 'rgba(29, 115, 72, 0.09)' },
  perkPlain: { backgroundColor: C.snow },
  perkText: { color: C.positive, fontFamily: FONTS.uiSemi, fontSize: 13 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: S.gutter, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line, backgroundColor: C.sand },
  footLabel: { color: C.ink55, fontFamily: FONTS.uiBold, fontSize: 12, letterSpacing: 0 },
  footTotal: { color: C.ink, fontFamily: FONTS.uiBold, fontSize: 20, letterSpacing: -0.2, marginTop: 1, fontVariant: ['tabular-nums'] },
  footNote: { color: C.ink55, fontFamily: FONTS.ui, fontSize: 13 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 16, height: 58, paddingLeft: 24, paddingRight: 8, borderRadius: 29, backgroundColor: C.pine, ...shadow.card, shadowOpacity: 0.18, shadowRadius: 12, elevation: 4 },
  ctaText: { color: C.cream, fontFamily: FONTS.uiBold, fontSize: 16 },
  badge: { width: 42, height: 42, borderRadius: 21, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' },
});
