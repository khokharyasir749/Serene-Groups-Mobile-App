import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/features/bookings/guest/components/Text';
import { Photo, PressableScale } from '@/features/bookings/guest/components/ui';
import { areaRangeOf, REVIEW_SCORE, type RoomType } from '@/features/bookings/guest/data/catalog';
import { availability, lowestQuote, money, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { C, FONTS } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

/**
 * Editorial Luxury RoomCard:
 * Pure typographical hierarchy, zero icon clutter, flawless layout and spacing.
 */
function RoomCard({ type, stay }: { type: RoomType; stay: Stay }) {
  const router = useRouter();
  const av = availability(type, stay);
  const best = lowestQuote(type, stay);
  const bookable = !av.soldOut && av.fitsParty;
  const perNight = Math.round(best.q.grandTotal / Math.max(1, best.q.nights));

  const areaStr = areaRangeOf(type.slug).replace(' sq ft', '');
  const bedStr = type.bedType.replace(/^1 /, '').replace(' + sofa bed', ' + sofa');
  // Clean meta line with NO redundant repetition of outdoor space:
  const metaLine = `${areaStr} sq ft  ·  ${bedStr}  ·  Up to ${type.maxOccupancy} guests`;

  return (
    <PressableScale
      onPress={() => router.push(`/room/${type.slug}`)}
      scaleTo={0.985}
      style={styles.card}
      accessibilityRole="button"
      accessibilityLabel={`${type.name}, ${money(perNight)} per night`}
    >
      {/* ── 16:10 Editorial Landscape Photography ── */}
      <View style={styles.photoWrap}>
        <Photo src={type.images[0]} style={StyleSheet.absoluteFill} />

        {/* Minimalist Frosted Rating Pill (Top-Right) */}
        <View style={styles.ratingBadge}>
          <ClearGlass />
          <Ionicons name="star" size={10.5} style={[glassInk, { marginRight: 3.5 }]} />
          <Text style={styles.ratingText}>{REVIEW_SCORE.average.toFixed(1)}</Text>
        </View>

        {/* Scarcity Pill (Only if 3 or less remaining) */}
        {bookable && av.available <= 3 && (
          <View style={styles.scarcityBadge}>
            <ClearGlass />
            <Text style={styles.scarcityText}>{`Only ${av.available} left`}</Text>
          </View>
        )}
      </View>

      {/* ── Bespoke Editorial Card Body ── */}
      <View style={styles.body}>
        {/* Eyebrow */}
        <Text style={styles.kicker}>
          {`ONE-BEDROOM · ${type.outdoorSpace.toUpperCase()}`}
        </Text>

        {/* Title: Rich Cormorant Garamond Serif */}
        <Text style={styles.title} numberOfLines={2}>
          {type.name}
        </Text>

        {/* Clean Editorial Meta Line (Area · Bed · Capacity) */}
        <Text style={styles.metaLine} numberOfLines={1}>
          {metaLine}
        </Text>

        <View style={styles.divider} />

        {/* Pricing & Reservation Row */}
        {bookable ? (
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <View style={styles.priceMainRow}>
                <Text style={styles.priceBig}>{money(perNight)}</Text>
                <Text style={styles.pricePer}> / night</Text>
              </View>
              <Text style={styles.priceTotal}>
                {`${money(best.q.grandTotal)} total · ${plural(best.q.nights, 'night')} incl. taxes`}
              </Text>
            </View>

            <View style={styles.reserveBtn}>
              <Text style={styles.reserveBtnText}>Reserve</Text>
              <Ionicons name="arrow-forward" size={13} color={C.cream} style={{ marginLeft: 6 }} />
            </View>
          </View>
        ) : (
          <View style={styles.soldOutWrap}>
            <Ionicons name="alert-circle-outline" size={14} color={C.danger} style={{ marginRight: 5 }} />
            <Text style={styles.soldOutText}>
              {av.soldOut ? 'Sold out for selected dates' : `Sleeps ${type.maxOccupancy} max per apartment`}
            </Text>
          </View>
        )}
      </View>
    </PressableScale>
  );
}

export default memo(RoomCard);

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: pine(0.1),
    overflow: 'hidden',
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
    ...glassCard,
  },
  photoWrap: {
    width: '100%',
    aspectRatio: 1.55,
    backgroundColor: C.pine,
    position: 'relative',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 999,
    ...glassEdge,
  },
  ratingText: {
    fontFamily: FONTS.uiBold,
    fontSize: 10.5,
    fontVariant: ['tabular-nums'],
    ...glassInk,
  },
  scarcityBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
    paddingVertical: 4.5,
    borderRadius: 999,
    ...glassEdge,
  },
  scarcityText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10,
    ...glassInk,
  },
  body: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  kicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.6,
    color: C.ink55,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.3,
    color: C.pine,
    marginTop: 4,
  },
  metaLine: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 18,
    color: C.ink55,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: pine(0.08),
    marginTop: 15,
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCol: {
    flex: 1,
    paddingRight: 12,
  },
  priceMainRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceBig: {
    fontFamily: FONTS.uiBold,
    fontSize: 20,
    lineHeight: 24,
    color: C.pine,
    fontVariant: ['tabular-nums'],
  },
  pricePer: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.ink55,
    marginLeft: 3,
  },
  priceTotal: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    lineHeight: 16,
    color: C.ink55,
    marginTop: 2.5,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.pine,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  reserveBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: C.cream,
    letterSpacing: 0.3,
  },
  soldOutWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  soldOutText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: C.danger,
  },
});
