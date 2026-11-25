import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import ClearGlass, { glassEdge, glassInk } from '@/features/bookings/guest/components/ClearGlass';
import { LinearGradient } from 'expo-linear-gradient';
import FocusedStatusBar from '@/features/bookings/guest/components/FocusedStatusBar';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { ChevronRight } from '@/features/bookings/guest/components/icons';
import { memo, useRef, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text } from '@/features/bookings/guest/components/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/features/bookings/guest/components/BrandHeader';
import LuxuryFooter from '@/features/bookings/guest/components/LuxuryFooter';
import Scrim from '@/features/bookings/guest/components/Scrim';
import { useScrollTop } from '@/features/bookings/guest/components/ScrollTop';
import SearchCard from '@/features/bookings/guest/components/SearchCard';
import { Photo, PressableScale } from '@/features/bookings/guest/components/ui';
import { ROOM_TYPES, type RoomType } from '@/features/bookings/guest/data/catalog';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S, shadow, tabBarSpace, LOGO_TOP } from '@/features/bookings/guest/theme';
import { GLASS_CARDS, canvas, glassCard, glassCardDark } from '@/features/bookings/guest/theme/glass';

const SEASONS = {
  summer: '/images/resort/hero-tower-mist.jpg',
  winter: '/images/resort/aerial-snow-resort.jpg',
} as const;

const GLANCE = [
  { value: '7,906 ft', label: 'Altitude', icon: 'trail-sign-outline' as const },
  { value: '50+', label: 'Facilities', icon: 'business-outline' as const },
  { value: '24/7', label: 'Concierge', icon: 'key-outline' as const },
  { value: '2 hrs', label: 'Islamabad', icon: 'car-outline' as const },
];

const EXPERIENCES = [
  {
    title: 'Heated Glass Pool',
    image: '/images/resort/aerial-rooftop-pool.jpg',
  },
  {
    title: 'Panoramic Dining',
    image: '/images/dining/rooftop-dining-glass.jpg',
  },
  {
    title: 'Private Ski Slope',
    image: '/images/activities/ski-slope-aerial.jpg',
  },
  {
    title: 'Sunset Sky Lounge',
    image: '/images/dining/sky-lounge.jpg',
  },
  {
    title: 'Pine Forest Trails',
    image: '/images/activities/winter-trails.jpg',
  },
  {
    title: 'Cedarwood Sauna & Spa',
    image: '/images/resort/glass-roof-pool.jpg',
  },
];

const EDITORIAL_PILLARS = [
  {
    badge: '7,906 ft Elevation',
    icon: 'trail-sign-outline' as const,
    kicker: '01 · REAL MOUNTAIN AIR',
    title: '7,906 ft above the noise',
    text: 'Crisp pine forest air, cool summers, snowy winters, and unbroken valley views from every terrace.',
    image: '/images/interiors/window-view.jpg',
    chips: ['Pine Valley Canopy', '2 Hrs from ISB'],
  },
  {
    badge: 'All-Year Resort',
    icon: 'snow-outline' as const,
    kicker: '02 · MADE FOR EVERY SEASON',
    title: "Pakistan's first winter resort",
    text: 'Heated glass infinity pool, cedarwood sauna, private snow ski slope, and cloud-level rooftop dining.',
    image: '/images/resort/glass-roof-pool.jpg',
    chips: ['Heated Pool', 'Ski Slope'],
  },
  {
    badge: 'Serviced Living',
    icon: 'key-outline' as const,
    kicker: '03 · FULLY MANAGED LIVING',
    title: 'A home with a hotel behind it',
    text: 'Daily housekeeping, 24/7 concierge, in-room dining, and underfloor radiant heating throughout.',
    image: '/images/interiors/living-room-wide.jpg',
    chips: ['24/7 Concierge', 'Heated Floors'],
  },
];

export default function Discover() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { stay, setStay } = useBooking();
  const { ref, onScroll } = useScrollTop();
  // Once the hero photo has left the top, the clock sits on a solid strip so page text never runs under it.
  const [overHero, setOverHero] = useState(true);
  const heroH = useRef(0);
  const resW = Math.min(312, Math.round(width * 0.78));

  const openStay = (tab: 'dates' | 'guests') => router.push({ pathname: '/stay', params: { tab, next: 'apartments' } });

  return (
    <View style={canvas}>
      <FocusedStatusBar style={overHero ? 'light' : 'dark'} />
      <ScrollView
        ref={ref}
        style={{ flex: 1 }}
        scrollEnabled={true}
        removeClippedSubviews={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        onScroll={(e) => {
          onScroll(e);
          const over = e.nativeEvent.contentOffset.y < Math.max(1, heroH.current - insets.top);
          if (over !== overHero) setOverHero(over);
        }}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 0 }}
      >
        {/* Full-Bleed Panoramic Mountain Hero Stage */}
        <View onLayout={(e) => { heroH.current = e.nativeEvent.layout.height; }} style={[styles.hero, { paddingTop: insets.top + LOGO_TOP }]}>
          <Photo src={SEASONS.summer} style={StyleSheet.absoluteFill} />
          {/* Dual scrim: top scrim for brand header, bottom deep pine scrim for editorial copy */}
          <Scrim top={0.35} bottom={0.92} />

          {/* Integrated Luxury Brand Header */}
          <BrandHeader variant="overPhoto" />

          <View style={{ flex: 1 }} />

          {/* Clean Editorial Content Inside Hero */}
          <View style={styles.heroBottom}>
            <Text style={styles.heroKicker}>NATHIA GALI · 7,906 FT</Text>
            <Text style={styles.heroTitle}>
              Where clouds meet <Text style={styles.heroTitleItalic}>luxury</Text>
            </Text>
          </View>
        </View>

        {/* Elevated Overlapping Search Card */}
        <View style={styles.searchCardWrap}>
          <SearchCard
            stay={stay}
            onDates={() => openStay('dates')}
            onGuests={() => openStay('guests')}
            onSearch={() => {
              setStay(stay);
              router.navigate('/apartments');
            }}
          />
        </View>

        {/* At a glance metric bar */}
        <View style={styles.glance}>
          {GLANCE.map((g, i) => (
            <View key={g.label} style={[styles.glanceItem, i > 0 && styles.glanceDiv]}>
              <Ionicons name={g.icon} size={16} color={C.gold} />
              <Text style={styles.glanceNum} numberOfLines={1}>{g.value}</Text>
              <Text style={styles.glanceLabel} numberOfLines={1}>{g.label.toUpperCase()}</Text>
            </View>
          ))}
        </View>

        {/* Curated Apartments Showcase */}
        <SectionHead
          title="Curated Residences"
          onMore={() => router.navigate('/apartments')}
        />
        <FlatList
          horizontal
          nestedScrollEnabled
          removeClippedSubviews={false}
          data={ROOM_TYPES}
          keyExtractor={(t) => t.slug}
          renderItem={({ item }) => (
            <ResidenceCard
              t={item}
              w={resW}
              onPress={() => router.push(`/room/${item.slug}`)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={resW + 14}
          initialNumToRender={2}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
        />

        {/* Resort Facilities & Experiences */}
        <SectionHead
          title="Resort Experiences"
          onMore={() => router.push('/amenities')}
        />
        <FlatList
          horizontal
          nestedScrollEnabled
          removeClippedSubviews={false}
          data={EXPERIENCES}
          keyExtractor={(e) => e.title}
          renderItem={({ item }) => (
            <ExperienceCard
              title={item.title}
              image={item.image}
              onPress={() => router.push('/amenities')}
            />
          )}
          showsHorizontalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={240 + 14}
          initialNumToRender={3}
          windowSize={3}
          contentContainerStyle={{ paddingHorizontal: S.gutter, gap: 14 }}
        />

        {/* Resort Architecture & Floor Plans Feature Card */}
        <View style={styles.storyCard}>
          {/* Architectural Background Photography: Portrait Facade at Night */}
          <Photo src="/images/resort/night-facade-portrait.jpg" style={StyleSheet.absoluteFill} />
          <LinearGradient
            colors={[
              'rgba(0, 0, 0, 0.35)',
              'transparent',
              'rgba(0, 0, 0, 0.45)',
            ]}
            locations={[0, 0.35, 1]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top badges in crystal glass */}
          <View style={styles.storyHeader}>
            <View style={styles.storyBadge}>
              <ClearGlass />
              <Ionicons name="business-outline" size={12} style={[glassInk, { marginRight: 6 }]} />
              <Text style={styles.storyBadgeText}>ARCHITECTURE & DESIGN</Text>
            </View>
            <View style={styles.storyPillMini}>
              <ClearGlass />
              <Text style={styles.storyPillMiniText}>G1 – 8TH FLOOR</Text>
            </View>
          </View>

          <View style={{ flex: 1 }} />

          {/* Bottom Crystal Clear Glass Dock with Limited Text */}
          <View style={styles.archGlassDock}>
            <ClearGlass />

            <Text style={styles.storyTitle}>Residences & Alpine Terraces</Text>

            {/* Luxury CTA Button */}
            <PressableScale
              onPress={() => router.push('/floor-plans')}
              scaleTo={0.975}
              style={styles.storyBtn}
            >
              <LinearGradient
                colors={[HEX.goldLight, HEX.goldDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.storyBtnText}>Floor plans</Text>
              <View style={styles.storyBtnArrow}>
                <Ionicons name="arrow-forward" size={13} color={HEX.white} />
              </View>
            </PressableScale>
          </View>
        </View>

        {/* Why Serene Heights: one lead story, then two numbered pillars */}
        <View style={{ paddingHorizontal: S.gutter, marginTop: 40 }}>
          <Text style={styles.sectionTitle}>Why Serene Heights</Text>

          <PressableScale onPress={() => router.push('/amenities')} scaleTo={0.985} style={styles.leadCard}>
            <Photo src={EDITORIAL_PILLARS[0].image} style={StyleSheet.absoluteFill} />
            <Scrim top={0.2} bottom={0.78} />
            <View style={styles.leadTag}>
              <ClearGlass />
              <Ionicons name={EDITORIAL_PILLARS[0].icon} size={12} style={glassInk} />
              <Text style={styles.leadTagText}>{EDITORIAL_PILLARS[0].badge}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.leadNum}>01</Text>
            <Text style={styles.leadTitle}>{EDITORIAL_PILLARS[0].title}</Text>
          </PressableScale>

          <View style={styles.pillarList}>
            {EDITORIAL_PILLARS.slice(1).map((p, i) => (
              <PressableScale key={p.kicker} onPress={() => router.push('/amenities')} scaleTo={0.985} style={[styles.pillarRow, i > 0 && styles.pillarLine]}>
                <Photo src={p.image} style={styles.pillarImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.pillarNum}>{String(i + 2).padStart(2, '0')} · {p.badge.toUpperCase()}</Text>
                  <Text style={styles.pillarTitle}>{p.title}</Text>
                </View>
              </PressableScale>
            ))}
          </View>
        </View>

        {/* Footer: concierge + contact */}
        <LuxuryFooter bottomSpace={tabBarSpace(insets.bottom)} />
      </ScrollView>
      {overHero ? null : <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top, backgroundColor: C.sand }} />}
    </View>
  );
}

const ResidenceCard = memo(function ResidenceCard({
  t,
  w,
  onPress,
}: {
  t: RoomType;
  w: number;
  onPress: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={[styles.resCard, { width: w }]}>
      {/* Full-bleed portrait photography */}
      <Photo src={t.images[0]} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.22} />

      <View style={{ flex: 1 }} />

      {/* Crystal clear glass pill */}
      <View style={styles.glassDock}>
        <View style={styles.crystalPill}>
          <ClearGlass />
          <Text numberOfLines={1} style={styles.crystalTitle}>{t.name}</Text>
          <View style={styles.crystalArrow}>
            <Ionicons name="arrow-forward" size={13} style={glassInk} />
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

const ExperienceCard = memo(function ExperienceCard({
  title,
  image,
  onPress,
}: {
  title: string;
  image: string;
  onPress?: () => void;
}) {
  return (
    <PressableScale onPress={onPress} scaleTo={0.975} style={styles.expCard}>
      {/* Full-bleed experience photography */}
      <Photo src={image} style={StyleSheet.absoluteFill} />
      <Scrim bottom={0.22} />

      <View style={{ flex: 1 }} />

      {/* Crystal clear glass pill */}
      <View style={styles.glassDock}>
        <View style={styles.crystalPill}>
          <ClearGlass />
          <Text numberOfLines={1} style={styles.crystalTitle}>{title}</Text>
          <View style={styles.crystalArrow}>
            <Ionicons name="arrow-forward" size={13} style={glassInk} />
          </View>
        </View>
      </View>
    </PressableScale>
  );
});

function SectionHead({
  title,
  sub,
  onMore,
}: {
  title: string;
  sub?: string;
  onMore?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={{ flex: 1 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {sub && <Text style={styles.sectionSub}>{sub}</Text>}
      </View>
      {onMore && (
        <Pressable onPress={onMore} hitSlop={10} style={styles.more}>
          <Text style={styles.moreText}>See all</Text>
          <ChevronRight size={15} color={C.pine} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: 420,
    borderBottomLeftRadius: S.well,
    borderBottomRightRadius: S.well,
    overflow: 'hidden',
    backgroundColor: C.pine,
    ...shadow.cardHover,
  },
  heroBottom: {
    paddingHorizontal: S.gutter,
    paddingBottom: GLASS_CARDS ? 28 : 48,
  },
  heroKicker: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.8,
    color: C.gold,
  },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 32,
    lineHeight: S.well,
    letterSpacing: -0.3,
    color: HEX.white,
    marginTop: 6,
  },
  heroTitleItalic: {
    fontFamily: FONTS.displayItalic,
    color: HEX.parchment,
  },
  heroSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(236, 238, 237, 0.92)',
    marginTop: 6,
  },
  searchCardWrap: {
    paddingHorizontal: S.gutter,
    // Glass would show the photo's edge through the card, so it sits below the photo; solid, it overlaps as before.
    marginTop: GLASS_CARDS ? 18 : -32,
    zIndex: 10,
  },
  glance: {
    flexDirection: 'row',
    marginHorizontal: S.gutter,
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: C.pine,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.goldLine,
    ...shadow.card,
    ...glassCardDark,
  },
  glanceItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  glanceDiv: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: 'rgba(200, 164, 106, 0.25)',
  },
  glanceNum: {
    fontFamily: FONTS.uiBold,
    fontSize: 15.5,
    lineHeight: 20,
    color: C.cream,
    fontVariant: ['tabular-nums'],
  },
  glanceLabel: {
    fontFamily: FONTS.uiBold,
    fontSize: 9,
    letterSpacing: 1.3,
    color: C.gold,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: S.gutter,
    marginTop: 34,
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 26,
    lineHeight: 30,
    color: C.ink,
  },
  sectionSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink55,
    marginTop: 4,
  },
  more: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 4,
  },
  moreText: {
    fontSize: 13,
    fontFamily: FONTS.uiBold,
    color: C.pine,
  },
  resCard: {
    height: 360,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.35)',
    ...shadow.cardHover,
  },
  expCard: {
    width: 240,
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: 'rgba(200, 164, 106, 0.3)',
    ...shadow.cardHover,
  },
  glassDock: {
    padding: 12,
  },
  crystalPill: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    paddingHorizontal: 15,
    paddingVertical: 10,
    ...glassEdge,
  },
  crystalTitle: {
    flex: 1,
    fontFamily: FONTS.display,
    fontSize: 15.5,
    lineHeight: 19,
    marginRight: 6,
    ...glassInk,
  },
  crystalArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyCard: {
    marginHorizontal: S.gutter,
    marginTop: 32,
    height: 410,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1.2,
    borderColor: 'rgba(200, 164, 106, 0.4)',
    padding: 14,
    backgroundColor: HEX.night,
    ...shadow.cardHover,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    ...glassEdge,
  },
  storyBadgeText: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.3,
    ...glassInk,
  },
  storyPillMini: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    ...glassEdge,
  },
  storyPillMiniText: {
    fontFamily: FONTS.uiBold,
    fontSize: 8.5,
    letterSpacing: 1.1,
    ...glassInk,
  },
  archGlassDock: {
    position: 'relative',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...glassEdge,
  },
  storyTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 26,
    letterSpacing: 0.2,
    ...glassInk,
  },
  storySubtitle: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 17,
    color: 'rgba(255, 253, 249, 0.8)',
    marginTop: 4,
  },
  storyBtn: {
    position: 'relative',
    marginTop: 14,
    borderRadius: 999,
    overflow: 'hidden',
    paddingVertical: 11,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: HEX.goldPale,
    shadowColor: HEX.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  storyBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 0.3,
    color: C.pine,
  },
  storyBtnArrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: pine(0.88),
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewSection: {
    marginTop: 40,
  },
  eyebrow: {
    fontFamily: FONTS.uiBold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: C.gold,
  },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginHorizontal: S.gutter,
    marginTop: 16,
    marginBottom: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: C.pine,
    borderWidth: 1,
    borderColor: C.goldLine,
  },
  scoreBig: {
    fontFamily: FONTS.display,
    fontSize: 46,
    lineHeight: 50,
    color: C.cream,
    fontVariant: ['tabular-nums'],
  },
  scoreDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: C.goldLine,
  },
  scoreLabel: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 24,
    color: C.cream,
    marginTop: 6,
  },
  scoreSub: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    color: C.cream70,
    marginTop: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  reviewCard: {
    minHeight: 236,
    padding: 20,
    backgroundColor: C.white,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    ...shadow.card,
  },
  reviewTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    height: 30,
  },
  quoteMark: {
    fontFamily: FONTS.display,
    fontSize: 52,
    lineHeight: 52,
    color: C.gold,
    marginTop: -6,
  },
  reviewTitle: {
    fontFamily: FONTS.display,
    fontSize: 21,
    lineHeight: 25,
    color: C.ink,
    marginTop: 4,
  },
  reviewBody: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 20.5,
    color: C.ink70,
    marginTop: 8,
  },
  reviewFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  authorAvatar: {
    width: S.well,
    height: S.well,
    borderRadius: 18,
    backgroundColor: C.pine,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarText: {
    fontFamily: FONTS.uiBold,
    fontSize: 11.5,
    letterSpacing: 0.5,
    color: C.gold,
  },
  reviewAuthor: {
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    color: C.ink,
  },
  reviewRoom: {
    fontFamily: FONTS.ui,
    fontSize: 11.5,
    color: C.ink55,
    marginTop: 1,
  },
  leadCard: {
    height: 400,
    marginTop: 16,
    padding: 22,
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: C.pine,
    ...shadow.card,
  },
  leadTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    ...glassEdge,
  },
  leadTagText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11.5,
    letterSpacing: 0.3,
    ...glassInk,
  },
  leadNum: {
    fontFamily: FONTS.uiBold,
    fontSize: 11,
    letterSpacing: 2,
    color: C.gold,
  },
  leadTitle: {
    fontFamily: FONTS.display,
    fontSize: 31,
    lineHeight: 35,
    color: HEX.white,
    marginTop: 6,
  },
  leadText: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.88)',
    marginTop: 8,
  },
  leadMeta: {
    fontFamily: FONTS.uiSemi,
    fontSize: 11.5,
    letterSpacing: 0.4,
    color: C.gold,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  pillarList: {
    marginTop: 14,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: C.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.line,
    ...shadow.card,
    ...glassCard,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  pillarLine: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.line,
  },
  pillarImg: {
    width: 92,
    height: 108,
    borderRadius: 16,
  },
  pillarNum: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.gold,
  },
  pillarTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 23,
    color: C.ink,
    marginTop: 4,
  },
  pillarText: {
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    lineHeight: 18,
    color: C.ink70,
    marginTop: 4,
  },
});
