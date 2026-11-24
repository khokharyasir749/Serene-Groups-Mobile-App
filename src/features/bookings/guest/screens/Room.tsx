import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { Building, Car, Check, Coffee, Dumbbell, MapPin, Star, Utensils, Waves, Wifi } from '@/features/bookings/guest/components/icons';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Accordion from '@/features/bookings/guest/components/Accordion';
import { HeroGallery } from '@/features/bookings/guest/components/Gallery';
import StayBar from '@/features/bookings/guest/components/StayBar';
import { BackBar, Button, Photo } from '@/features/bookings/guest/components/ui';
import { areaRangeOf, PROPERTY, REVIEW_SCORE, REVIEWS, roomType } from '@/features/bookings/guest/data/catalog';
import { availability, lowestQuote, money, plural } from '@/features/bookings/guest/lib/stay';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, S, T } from '@/features/bookings/guest/theme';
import { canvas, glassCard, glassCardDark } from '@/features/bookings/guest/theme/glass';

const POPULAR = [
  { Icon: Waves, label: 'Heated pool' },
  { Icon: Utensils, label: 'Rooftop dining' },
  { Icon: Dumbbell, label: 'Gym & spa' },
  { Icon: Wifi, label: 'Fast Wi-Fi' },
  { Icon: Building, label: '24/7 front desk' },
  { Icon: Car, label: 'Parking' },
];

// Apartment detail: the essentials up top, prices one tap away, everything else in collapsible sections.
export default function RoomDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const t = roomType(slug ?? '');
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { stay } = useBooking();

  if (!t) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', padding: S.gutter }}>
        <Text style={T.h2}>Apartment type not found</Text>
        <Button label="Back to apartments" style={{ marginTop: 20 }} onPress={() => router.back()} />
      </View>
    );
  }

  const photos = [...t.images, ...PROPERTY.gallery.filter((g) => !t.images.includes(g))].filter((p) => !p.includes('floor-plans'));
  const av = availability(t, stay);
  const best = lowestQuote(t, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const groups = [...new Set(PROPERTY.amenities.map((a) => a.group))];
  const openRates = () => router.push({ pathname: '/rates/[slug]', params: { slug: t.slug } });
  const openStay = () => router.push({ pathname: '/stay', params: { type: t.slug } });

  const tiles = [
    { k: 'Size', v: areaRangeOf(t.slug) },
    { k: 'Sleeps', v: `Up to ${t.maxOccupancy}` },
    { k: 'Beds', v: t.bedType },
    { k: 'Outdoor', v: t.outdoorSpace },
  ];

  return (
    <View style={canvas}>
      <BackBar onBack={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 + insets.bottom }}>
        <HeroGallery photos={photos} height={Math.round(height * 0.48)} />

        <View style={{ paddingHorizontal: S.gutter, paddingTop: 22 }}>
          {/* Overview */}
          <Text style={T.eyebrow}>Hotel apartment · Nathia Gali</Text>
          <Text style={[T.h1, { marginTop: 4 }]}>{t.name}</Text>
          <View style={styles.meta}>
            <Star size={13} color={C.ink} fill={C.ink} />
            <Text style={styles.metaStrong}>{REVIEW_SCORE.average.toFixed(1)}</Text>
            <Text style={T.small}>· {REVIEW_SCORE.count} reviews · 7,906 ft</Text>
          </View>

          <View style={styles.tiles}>
            {tiles.map((f) => (
              <View key={f.k} style={styles.tile}>
                <Text style={T.small}>{f.k}</Text>
                <Text style={[T.h3, { fontSize: 16, lineHeight: 20, marginTop: 4 }]} numberOfLines={2}>{f.v}</Text>
              </View>
            ))}
          </View>

          <Text style={[T.body, { marginTop: 22 }]}>{t.description}</Text>

          <View style={styles.popular}>
            {POPULAR.map(({ Icon, label }) => (
              <View key={label} style={styles.pop}>
                <Icon size={16} color={C.pine} strokeWidth={1.6} />
                <Text style={[T.small, { color: C.ink70 }]} numberOfLines={1}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Prices */}
          <View style={styles.prices}>
            <Text style={[T.h2, { color: C.cream }]}>Prices & availability</Text>
            <Text style={[T.small, { color: C.cream70, marginTop: 4, marginBottom: 14 }]}>Total for your stay, taxes included. No prepayment.</Text>
            <StayBar stay={stay} onPress={openStay} />
            {bookable ? (
              <View style={styles.priceRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[T.small, { color: C.gold, fontWeight: '700', fontSize: 10, letterSpacing: 1.4 }]}>FROM</Text>
                  <Text style={[T.price, { color: C.cream, fontSize: 21 }]}>{money(best.q.grandTotal)}</Text>
                  <Text style={[T.small, { fontSize: 12, color: C.cream70 }]}>{plural(best.q.nights, 'night')} · {best.plan.name}</Text>
                </View>
                <Button variant="light" label="See rates" onPress={openRates} style={{ paddingHorizontal: 24, borderColor: C.gold, borderWidth: 1 }} />
              </View>
            ) : (
              <Text style={[T.small, { color: C.gold, marginTop: 14 }]}>
                {av.soldOut ? 'Sold out for these dates — try other dates.' : `Sleeps up to ${t.maxOccupancy} per apartment — add an apartment.`}
              </Text>
            )}
            {bookable && av.available <= 3 && <Text style={[T.small, { color: C.gold, marginTop: 10, fontWeight: '600' }]}>Only {av.available} left for your dates</Text>}
          </View>

          {/* Secondary sections */}
          <View style={{ marginTop: 28 }}>
            <Accordion first title="Facilities" summary={`${t.features.length} in your apartment · ${PROPERTY.amenities.length} at the resort`}>
              <List title="In your apartment" items={t.features} />
              {groups.map((g) => (
                <List key={g} title={g} items={PROPERTY.amenities.filter((a) => a.group === g).map((a) => a.name)} />
              ))}
            </Accordion>

            <Accordion title="House rules" summary="Check-in 2 PM · check-out 12 PM · ID required">
              {PROPERTY.policies.map((p) => (
                <View key={p.label} style={styles.rule}>
                  <Text style={[T.small, { color: C.ink, fontWeight: '600' }]}>{p.label}</Text>
                  <Text style={[T.small, { marginTop: 3 }]}>{p.value}</Text>
                </View>
              ))}
            </Accordion>

            <Accordion title="Location" summary="Nathia Gali · 2 hrs from Islamabad">
              <Photo src="/images/resort/tower-sunset-forest.jpg" style={{ width: '100%', aspectRatio: 1, borderRadius: S.photo }} />
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                <MapPin size={15} color={C.ink55} strokeWidth={1.5} style={{ marginTop: 2 }} />
                <Text style={[T.small, { flex: 1 }]}>{PROPERTY.address}</Text>
              </View>
              {PROPERTY.distances.map((d) => (
                <View key={d.place} style={styles.dist}>
                  <Text style={[T.small, { color: C.ink70, flex: 1 }]}>{d.place}</Text>
                  <Text style={T.small}>{d.drive ?? d.distance}</Text>
                </View>
              ))}
            </Accordion>

            <Accordion title="Reviews" summary={`${REVIEW_SCORE.average.toFixed(1)} · Exceptional · ${REVIEW_SCORE.count} reviews`}>
              {REVIEWS.map((r) => (
                <View key={r.id} style={styles.review}>
                  <View style={{ flexDirection: 'row', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={12} color={C.pine} fill={k < r.rating ? C.pine : 'transparent'} strokeWidth={1.5} />
                    ))}
                  </View>
                  <Text style={[T.h3, { marginTop: 8 }]}>{r.title}</Text>
                  <Text style={[T.body, { marginTop: 4 }]}>{r.body}</Text>
                  <Text style={[T.small, { marginTop: 8 }]}>{r.author} · {r.country} · {r.stayed}</Text>
                </View>
              ))}
            </Accordion>
          </View>
        </View>
      </ScrollView>

      {/* Sticky reserve bar */}
      <View style={[styles.bottom, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          {bookable ? (
            <>
              <Text style={T.price}>{money(best.q.grandTotal)}</Text>
              <Text style={[T.small, { fontSize: 12 }]}>{plural(best.q.nights, 'night')} · from, incl. taxes</Text>
            </>
          ) : (
            <Text style={[T.small, { color: C.danger }]}>Not available for your search</Text>
          )}
        </View>
        <Button label={bookable ? 'Reserve' : 'Change dates'} onPress={bookable ? openRates : openStay} style={{ paddingHorizontal: 30 }} />
      </View>
    </View>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[T.small, { color: C.ink, fontWeight: '700', marginBottom: 6 }]}>{title}</Text>
      {items.map((it) => (
        <View key={it} style={{ flexDirection: 'row', gap: 9, paddingVertical: 4 }}>
          <Check size={14} color={C.pine} strokeWidth={2} style={{ marginTop: 2 }} />
          <Text style={[T.small, { color: C.ink70, flex: 1 }]}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  metaStrong: { fontSize: 13.5, fontWeight: '700', color: C.ink },
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 },
  tile: { width: '48.5%', flexGrow: 1, padding: 14, backgroundColor: C.white, borderRadius: 16, ...glassCard },
  popular: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 18, rowGap: 12 },
  pop: { width: '50%', flexDirection: 'row', alignItems: 'center', gap: 9, paddingRight: 8 },
  prices: { marginTop: 28, padding: 18, backgroundColor: C.pine, borderRadius: S.card, borderWidth: 1, borderColor: C.goldLine, ...glassCardDark },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 16 },
  rule: { paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  dist: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  review: { paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: C.line },
  bottom: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: S.gutter, paddingTop: 12, backgroundColor: C.sand, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: C.line },
});
