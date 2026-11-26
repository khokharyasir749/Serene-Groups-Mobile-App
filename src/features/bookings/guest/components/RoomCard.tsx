import Ionicons from '@expo/vector-icons/Ionicons';
import { memo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo, PressableScale } from '@/features/bookings/guest/components/ui';
import { areaRangeOf, type RoomType } from '@/features/bookings/guest/data/catalog';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { availability, lowestQuote, money, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, FONTS, S } from '@/features/bookings/guest/theme';

/** One apartment type in the results: photos to swipe, the facts that decide, the price, one button. */
function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));
  const photos = type.images.filter((p) => !p.includes('floor-plans')).slice(0, 5);
  const w = width - S.gutter * 2 + 16;
  const open = () => router.push(`/room/${type.slug}`);

  return (
    <View style={styles.card}>
      <View style={[styles.photo, { width: w, height: Math.round(w * 0.92) }]}>
        <ScrollView horizontal pagingEnabled nestedScrollEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / w))}>
          {photos.map((src, i) => (
            <Pressable key={src} onPress={open} accessibilityRole="imagebutton" accessibilityLabel={`${type.name}, photo ${i + 1} of ${photos.length}`}>
              <Photo src={src} style={{ width: w, height: Math.round(w * 0.92) }} />
            </Pressable>
          ))}
        </ScrollView>
        {bookable && av.available <= 3 ? (
          <View style={styles.few}>
            <ClearGlass />
            <Text style={styles.fewText}>{`Only ${av.available} left`}</Text>
          </View>
        ) : null}
        <View style={styles.dots} pointerEvents="none">
          {photos.map((src, i) => (
            <View key={src} style={[styles.dot, i === page && styles.dotOn]} />
          ))}
        </View>
      </View>

      <PressableScale onPress={open} scaleTo={0.985} style={styles.body} accessibilityRole="button" accessibilityLabel={`${type.name}. ${bookable ? `${money(perNight)} a night` : 'Not available'}`}>
        <Text style={styles.name} numberOfLines={2}>{type.name.replace(' Apartment', '')}</Text>
        <Text style={styles.meta}>{`${areaRangeOf(type.slug)}, up to ${plural(type.maxOccupancy, 'guest')}, ${type.outdoorSpace.toLowerCase()}`}</Text>
        {bookable ? (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <View style={styles.priceRow}>
                <Text style={styles.price} numberOfLines={1}>{money(perNight)}</Text>
                <Text style={styles.per}>a night</Text>
              </View>
              <Text style={styles.total}>{`${money(best.q.grandTotal)} total with taxes`}</Text>
            </View>
            <View style={styles.go}>
              <Ionicons name="arrow-forward" size={21} color={C.sand} />
            </View>
          </View>
        ) : (
          <View style={styles.none}>
            <Ionicons name="alert-circle-outline" size={18} color={C.danger} />
            <Text style={styles.noneText}>{av.soldOut ? 'Sold out for these dates' : `Sleeps ${type.maxOccupancy}. Add an apartment for your group.`}</Text>
          </View>
        )}
      </PressableScale>
    </View>
  );
}

export default memo(RoomCard);

const styles = StyleSheet.create({
  card: { marginHorizontal: -8 },
  photo: { borderRadius: 32, overflow: 'hidden', backgroundColor: C.deep },
  few: { position: 'absolute', top: 18, left: 18, height: 34, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, ...glassEdge },
  fewText: { fontFamily: FONTS.uiSemi, fontSize: 13, ...glassInk },
  dots: { position: 'absolute', left: 0, right: 0, bottom: 16, flexDirection: 'row', justifyContent: 'center', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255, 255, 255, 0.5)' },
  dotOn: { width: 18, backgroundColor: C.pureWhite },
  body: { paddingHorizontal: 8, paddingTop: 18 },
  name: { fontFamily: FONTS.display, fontSize: 32, lineHeight: 35, letterSpacing: -0.5, color: C.ink },
  meta: { fontFamily: FONTS.ui, fontSize: 15, lineHeight: 22, color: C.ink70, marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  price: { fontFamily: FONTS.uiBold, fontSize: 22, lineHeight: 28, letterSpacing: -0.4, color: C.ink, fontVariant: ['tabular-nums'] },
  per: { fontFamily: FONTS.ui, fontSize: 15, color: C.ink55 },
  total: { fontFamily: FONTS.ui, fontSize: 14, lineHeight: 20, color: C.ink55 },
  go: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
  none: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 },
  noneText: { flex: 1, fontFamily: FONTS.uiSemi, fontSize: 15, color: C.danger },
});
