import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { memo, useRef, useState, type ComponentProps } from 'react';
import { Animated, FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/features/bookings/guest/components/BrandHeader';
import FocusedStatusBar from '@/features/bookings/guest/components/FocusedStatusBar';
import LuxuryFooter from '@/features/bookings/guest/components/LuxuryFooter';
import { useScrollTop } from '@/features/bookings/guest/components/ScrollTop';
import StayBar from '@/features/bookings/guest/components/StayBar';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo, PressableScale } from '@/features/bookings/guest/components/ui';
import { areaRangeOf, REASONS, ROOM_TYPES, type RoomType } from '@/features/bookings/guest/data/catalog';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { fmtShort, lowestQuote, money, plural, type Stay } from '@/features/bookings/guest/lib/stay';
import { tabOf, useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, HEX, LOGO_TOP, S, T, tabBarSpace } from '@/features/bookings/guest/theme';
import { canvas } from '@/features/bookings/guest/theme/glass';

type Glyph = ComponentProps<typeof Ionicons>['name'];

// What people ask before booking (from the resort's own policies).
const PROMISES: { icon: Glyph; title: string; text: string }[] = [
  { icon: 'shield-checkmark-outline', title: 'Free cancellation', text: 'Until 48 hours before, on flexible rates' },
  { icon: 'wallet-outline', title: 'Pay at the property', text: 'Nothing is charged when you book' },
  { icon: 'time-outline', title: 'Check in from 2 PM', text: 'Check out until 12 noon' },
  { icon: 'car-outline', title: 'Two hours away', text: 'Drive from Islamabad' },
];

const EXPERIENCES = [
  { title: 'Rooftop pool', image: '/images/resort/aerial-pool-portrait.jpg' },
  { title: 'Panoramic dining', image: '/images/dining/rooftop-dining-glass.jpg' },
  { title: 'Ski slope', image: '/images/activities/ski-slope-aerial.jpg' },
  { title: 'Sky lounge', image: '/images/dining/sky-lounge.jpg' },
  { title: 'Pine forest trails', image: '/images/activities/winter-trails.jpg' },
];
const REASON_PHOTO = ['/images/interiors/window-view.jpg', '/images/resort/tower-snow-night.jpg', '/images/interiors/guests-lounge.jpg'];

function Heading({ title, soft, more, onMore }: { title: string; soft: string; more?: string; onMore?: () => void }) {
  return (
    <View style={styles.heading}>
      <Text style={styles.title} accessibilityRole="header">
        {`${title}\n`}
        <Text style={styles.soft}>{soft}</Text>
      </Text>
      {onMore ? (
        <Pressable onPress={onMore} hitSlop={12} style={({ pressed }) => [styles.more, pressed && { opacity: 0.6 }]} accessibilityRole="link" accessibilityLabel={more}>
          <Ionicons name="arrow-forward" size={21} color={C.pine} />
        </Pressable>
      ) : null}
    </View>
  );
}

const Residence = memo(function Residence({ t, stay, w, onPress }: { t: RoomType; stay: Stay; w: number; onPress: () => void }) {
  const q = lowestQuote(t, stay).q;
  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={[styles.res, { width: w, height: Math.round(w * 1.38) }]} accessibilityRole="button" accessibilityLabel={t.name}>
      <Photo src={t.images[0]} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={C.tileFade} style={StyleSheet.absoluteFill} />
      <Text style={styles.resName} numberOfLines={2}>{t.name.replace(' Apartment', '').replace(' One-', '\nOne-')}</Text>
      <Text style={styles.resMeta} numberOfLines={1}>{`${areaRangeOf(t.slug)}, up to ${plural(t.maxOccupancy, 'guest')}`}</Text>
      <View style={styles.resFoot}>
        <Text style={styles.resPrice} numberOfLines={1}>
          {money(q.grandTotal / Math.max(1, q.nights))}
          <Text style={styles.resPer}>  a night</Text>
        </Text>
        <View style={styles.resGo}>
          <Ionicons name="arrow-forward" size={19} color={C.deep} />
        </View>
      </View>
    </PressableScale>
  );
});

/** Discover: the search first, then what you can book, what there is to do, and who to ask. */
export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { stay, setStay, bookings } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [overHero, setOverHero] = useState(true);
  const y = useRef(new Animated.Value(0)).current;
  // The whole first view, with a sliver of the page below; the search sits clear of the dock.
  const hero = Math.round(Math.max(560, height - 16));
  const resW = Math.min(340, Math.round(width * 0.76));
  const next = bookings.filter((b) => tabOf(b) === 'upcoming').sort((a, b) => a.stay.checkIn.localeCompare(b.stay.checkIn))[0];

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });
  const search = () => {
    setStay(stay);
    router.navigate('/apartments');
  };

  return (
    <View style={canvas}>
      <FocusedStatusBar style={overHero ? 'light' : 'dark'} />
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        removeClippedSubviews={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          onScroll(e);
          const at = e.nativeEvent.contentOffset.y;
          y.setValue(at);
          const over = at < hero - insets.top - 20;
          if (over !== overHero) setOverHero(over);
        }}>
        <View style={[styles.hero, { height: hero, paddingTop: insets.top + LOGO_TOP }]}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: y.interpolate({ inputRange: [0, hero], outputRange: [0, hero * 0.28], extrapolate: 'clamp' }) }] }]}>
            <Photo src="/images/interiors/sunrise-balcony.jpg" style={StyleSheet.absoluteFill} />
          </Animated.View>
          <LinearGradient pointerEvents="none" colors={C.heroFade} locations={C.heroStops} style={StyleSheet.absoluteFill} />
          <BrandHeader variant="overPhoto" />
          <View style={{ flex: 1 }} />
          <View style={[styles.heroBody, { paddingBottom: insets.bottom + S.tabBar + 8 }]}>
            <View style={styles.heroPlace}>
              <Ionicons name="location" size={14} color={C.goldBright} />
              <Text style={styles.heroPlaceText}>Nathia Gali, 7,906 ft</Text>
            </View>
            <Text style={styles.heroTitle} accessibilityRole="header" maxFontSizeMultiplier={1.1}>
              Wake above{'\n'}
              <Text style={styles.heroSoft}>the clouds</Text>
            </Text>
            <StayBar stay={stay} onDates={() => openStay('dates')} onGuests={() => openStay('guests')} onSearch={search} />
          </View>
        </View>

        {next ? (
          <PressableScale onPress={() => router.push(`/booking/${next.reference}`)} scaleTo={0.985} style={styles.next} accessibilityRole="button" accessibilityLabel={`Your next stay: ${next.type.name}`}>
            <Photo src={next.type.images[0]} style={styles.nextPhoto} />
            <View style={{ flex: 1 }}>
              <Text style={styles.nextLabel}>Your next stay</Text>
              <Text style={styles.nextName} numberOfLines={1}>{next.type.name.replace(' Apartment', '')}</Text>
              <Text style={T.small} numberOfLines={1}>{`${fmtShort(next.stay.checkIn)}, ${plural(next.price.nights, 'night')}`}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={C.pine} />
          </PressableScale>
        ) : null}

        <View style={styles.promises}>
          {PROMISES.map((p) => (
            <View key={p.title} style={styles.promise}>
              <Ionicons name={p.icon} size={24} color={C.goldInk} />
              <Text style={styles.promiseTitle}>{p.title}</Text>
              <Text style={styles.promiseText}>{p.text}</Text>
            </View>
          ))}
        </View>

        <Heading title="Five apartments," soft="one mountain." more="See all apartments" onMore={() => router.navigate('/apartments')} />
        <FlatList
          horizontal
          nestedScrollEnabled
          removeClippedSubviews={false}
          data={ROOM_TYPES}
          keyExtractor={(t) => t.slug}
          renderItem={({ item }) => <Residence t={item} stay={stay} w={resW} onPress={() => router.push(`/room/${item.slug}`)} />}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={resW + 12}
          initialNumToRender={2}
          windowSize={3}
          contentContainerStyle={styles.rail}
        />

        <Heading title="Days filled" soft="as you like." more="See all amenities" onMore={() => router.push('/amenities')} />
        <FlatList
          horizontal
          nestedScrollEnabled
          removeClippedSubviews={false}
          data={EXPERIENCES}
          keyExtractor={(e) => e.title}
          renderItem={({ item }) => (
            <PressableScale onPress={() => router.push('/amenities')} scaleTo={0.975} style={styles.exp} accessibilityRole="button" accessibilityLabel={item.title}>
              <Photo src={item.image} style={StyleSheet.absoluteFill} />
              <LinearGradient pointerEvents="none" colors={C.tileFade} style={StyleSheet.absoluteFill} />
              <Text style={styles.expName}>{item.title}</Text>
            </PressableScale>
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={232 + 12}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={styles.rail}
        />

        <View style={styles.why}>
          <Text style={[styles.title, { color: C.sand }]} accessibilityRole="header">
            {'A home up here,\n'}
            <Text style={[styles.soft, { color: C.goldBright }]}>a hotel behind it.</Text>
          </Text>
          {REASONS.map((r, i) => (
            <View key={r.label} style={styles.reason}>
              <Photo src={REASON_PHOTO[i]} style={styles.reasonPhoto} />
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonTitle}>{r.label}</Text>
                <Text style={styles.reasonText}>{r.text}</Text>
              </View>
            </View>
          ))}
        </View>

        <PressableScale onPress={() => router.push('/floor-plans')} scaleTo={0.985} style={styles.plans} accessibilityRole="button" accessibilityLabel="See the floor plans">
          <View style={styles.plansArt}>
            <Photo src="/images/floor-plans/floor-3.png" style={StyleSheet.absoluteFill} />
          </View>
          <View style={styles.plansBody}>
            <View style={{ flex: 1 }}>
              <Text style={T.h3}>Choose by floor</Text>
              <Text style={[T.small, { marginTop: 2 }]}>Plans from G1 to the 8th floor terraces</Text>
            </View>
            <View style={styles.plansGo}>
              <Ionicons name="arrow-forward" size={20} color={C.sand} />
            </View>
          </View>
        </PressableScale>

        <LuxuryFooter bottomSpace={tabBarSpace(insets.bottom)} />
      </ScrollView>
      {overHero ? null : <View pointerEvents="none" style={[styles.strip, { height: insets.top }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: C.sand },
  hero: { overflow: 'hidden', backgroundColor: C.deep, borderBottomLeftRadius: 38, borderBottomRightRadius: 38 },
  heroBody: { padding: 12, gap: 14 },
  heroPlace: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingHorizontal: 8 },
  heroPlaceText: { fontFamily: FONTS.uiSemi, fontSize: 14, color: HEX.white },
  heroTitle: { fontFamily: FONTS.display, fontSize: 60, lineHeight: 60, letterSpacing: -1.4, color: HEX.white, paddingHorizontal: 8, marginBottom: 6 },
  heroSoft: { fontFamily: FONTS.displayItalic, fontStyle: 'italic', fontSize: 60, color: C.goldBright },
  next: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 24, marginHorizontal: 12, padding: 12, paddingRight: 18, borderRadius: 28, backgroundColor: C.white, boxShadow: C.lift },
  nextPhoto: { width: 76, height: 76, borderRadius: 20 },
  nextLabel: { fontFamily: FONTS.uiSemi, fontSize: 13.5, color: C.goldInk },
  nextName: { fontFamily: FONTS.display, fontSize: 24, lineHeight: 28, color: C.ink },
  promises: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: S.gutter, marginTop: 38, rowGap: 26 },
  promise: { width: '50%', paddingRight: 14 },
  promiseTitle: { fontFamily: FONTS.uiBold, fontSize: 15.5, lineHeight: 21, color: C.ink, marginTop: 10 },
  promiseText: { fontFamily: FONTS.ui, fontSize: 14, lineHeight: 20, color: C.ink55, marginTop: 2 },
  heading: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: S.gutter, marginTop: 60, marginBottom: 22, gap: 12 },
  title: { flex: 1, fontFamily: FONTS.display, fontSize: 44, lineHeight: 45, letterSpacing: -1, color: C.ink },
  soft: { fontFamily: FONTS.displayItalic, fontStyle: 'italic', fontSize: 44, color: C.goldInk },
  more: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  rail: { paddingHorizontal: S.gutter, gap: 12 },
  res: { borderRadius: 34, overflow: 'hidden', justifyContent: 'flex-end', padding: 20, backgroundColor: C.deep },
  resName: { fontFamily: FONTS.display, fontSize: 34, lineHeight: 35, letterSpacing: -0.5, color: HEX.white },
  resMeta: { fontFamily: FONTS.ui, fontSize: 14.5, color: C.cream70, marginTop: 4 },
  resFoot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },
  resPrice: { flex: 1, fontFamily: FONTS.uiBold, fontSize: 19, color: HEX.white, fontVariant: ['tabular-nums'] },
  resPer: { fontFamily: FONTS.ui, fontSize: 14, color: C.cream70 },
  resGo: { width: 50, height: 50, borderRadius: 25, backgroundColor: C.goldBright, alignItems: 'center', justifyContent: 'center' },
  exp: { width: 232, height: 300, borderRadius: 30, overflow: 'hidden', justifyContent: 'flex-end', padding: 18, backgroundColor: C.deep },
  expName: { fontFamily: FONTS.display, fontSize: 29, lineHeight: 31, color: HEX.white },
  why: { marginTop: 64, paddingHorizontal: S.gutter, paddingTop: 48, paddingBottom: 28, gap: 8, backgroundColor: C.deep, borderRadius: 38 },
  reason: { flexDirection: 'row', gap: 18, paddingVertical: 20, alignItems: 'center' },
  reasonPhoto: { width: 104, height: 138, borderRadius: 26 },
  reasonTitle: { fontFamily: FONTS.display, fontSize: 27, lineHeight: 29, color: C.sand },
  reasonText: { fontFamily: FONTS.ui, fontSize: 14.5, lineHeight: 22, color: C.cream70, marginTop: 6 },
  plans: { marginTop: 24, marginHorizontal: 12, borderRadius: 34, overflow: 'hidden', backgroundColor: C.white },
  plansArt: { height: 210, overflow: 'hidden', backgroundColor: HEX.white },
  plansBody: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  plansGo: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.pine, alignItems: 'center', justifyContent: 'center' },
});
