import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandHeader from '@/features/bookings/guest/components/BrandHeader';
import FindBooking from '@/features/bookings/guest/components/FindBooking';
import { useScrollTop } from '@/features/bookings/guest/components/ScrollTop';
import Segmented from '@/features/bookings/guest/components/Segmented';
import SereneLogoMark from '@/features/bookings/guest/components/SereneLogoMark';
import StatusPill from '@/features/bookings/guest/components/StatusPill';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo, PressableScale } from '@/features/bookings/guest/components/ui';
import { fmtShort, guestsLabel, money, plural } from '@/features/bookings/guest/lib/stay';
import { tabOf, useBooking, type Tab } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S, tabBarSpace, LOGO_TOP } from '@/features/bookings/guest/theme';
import { canvas, glassCard } from '@/features/bookings/guest/theme/glass';

export default function Trips() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { lookup } = useLocalSearchParams<{ lookup?: string }>();
  const { bookings, user } = useBooking();
  const { ref, onScroll } = useScrollTop();
  const [tab, setTab] = useState<Tab>('upcoming');
  const list = bookings.filter((b) => tabOf(b) === tab);

  const upcomingCount = bookings.filter((b) => tabOf(b) === 'upcoming').length;

  return (
    <View style={canvas}>
      <StatusBar style="dark" />
      <View style={{ paddingTop: insets.top + LOGO_TOP }}>
        <BrandHeader />
      </View>
      <ScrollView
        ref={ref}
        onScroll={onScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        contentContainerStyle={{
          paddingBottom: tabBarSpace(insets.bottom),
          paddingHorizontal: S.gutter,
        }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Editorial Header ── */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            {user ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'YOUR RESERVATIONS'}
          </Text>
          <Text style={styles.title}>Trips & Stays</Text>
          <Text style={styles.sub}>
            {`${plural(upcomingCount, 'upcoming stay')} · ${plural(bookings.length, 'booking')} in total`}
          </Text>
        </View>

        {/* ── Guest Sync Banner (Replaces redundant second sign-in box) ── */}
        {!user && (
          <PressableScale
            onPress={() => router.push('/login')}
            scaleTo={0.99}
            style={styles.guestBanner}
            accessibilityRole="button"
            accessibilityLabel="Sign in to sync your bookings"
          >
            <View style={styles.guestBannerLeft}>
              <Ionicons name="sparkles-outline" size={15} color={C.pine} style={{ marginRight: 8 }} />
              <Text style={styles.guestBannerText}>
                Sign in to save and access all your reservations
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={13} color={C.pine} />
          </PressableScale>
        )}

        {/* ── Booking Lookup Component ── */}
        <FindBooking autoOpen={lookup === '1'} />

        {/* ── Segmented Control ── */}
        <View style={styles.segmentWrap}>
          <Segmented
            value={tab}
            onChange={setTab}
            options={[
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' },
              { key: 'cancelled', label: 'Cancelled' },
            ]}
          />
        </View>

        {/* ── Main Content: Empty State or Booking List ── */}
        {list.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyCrestCircle}>
              <SereneLogoMark size={40} />
            </View>

            <Text style={styles.emptyTitle}>
              {tab === 'upcoming'
                ? 'No Upcoming Stays'
                : tab === 'past'
                  ? 'No Past Stays Yet'
                  : 'No Cancelled Bookings'}
            </Text>

            <Text style={styles.emptyLede}>
              {tab === 'upcoming'
                ? 'When you reserve an apartment at Serene Heights, your itinerary, check-in instructions, and concierge bookings will appear here.'
                : 'Your completed mountain stays will be archived here for quick rebooking.'}
            </Text>

            {tab === 'upcoming' && (
              <PressableScale
                onPress={() =>
                  router.push({
                    pathname: '/stay',
                    params: { tab: 'dates', next: 'apartments' },
                  })
                }
                scaleTo={0.98}
                style={styles.planBtn}
                accessibilityRole="button"
                accessibilityLabel="Plan a stay"
              >
                <Text style={styles.planBtnText}>Explore Available Residences</Text>
                <Ionicons name="arrow-forward" size={13} color={C.cream} style={{ marginLeft: 6 }} />
              </PressableScale>
            )}
          </View>
        ) : (
          <View style={styles.bookingList}>
            {list.map((b) => (
              <PressableScale
                key={b.reference}
                onPress={() => router.push(`/booking/${b.reference}`)}
                scaleTo={0.985}
                style={styles.bookingCard}
                accessibilityRole="button"
                accessibilityLabel={`Booking ${b.reference}: ${b.type.name}`}
              >
                <Photo src={b.type.images[0]} style={styles.thumb} />
                <View style={styles.bookingDetails}>
                  <View style={styles.statusRow}>
                    <StatusPill tab={tabOf(b)} />
                    <Text style={styles.refText}>{`#${b.reference}`}</Text>
                  </View>

                  <Text numberOfLines={1} style={styles.suiteName}>
                    {b.type.name}
                  </Text>

                  <Text style={styles.bookingMeta}>
                    {`${fmtShort(b.stay.checkIn)} – ${fmtShort(b.stay.checkOut)} · ${plural(b.price.nights, 'night')}`}
                  </Text>

                  <Text style={styles.bookingPrice}>
                    {`${money(b.price.grandTotal)} · ${guestsLabel(b.stay.adults, b.stay.children)}`}
                  </Text>
                </View>

                <View style={styles.cardChevron}>
                  <Ionicons name="chevron-forward" size={15} color={C.ink55} />
                </View>
              </PressableScale>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 22,
    marginBottom: 4,
  },
  eyebrow: {
    fontFamily: FONTS.uiBold,
    fontSize: 9.5,
    letterSpacing: 1.5,
    color: C.ink55,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: -0.3,
    color: C.pine,
    marginTop: 3,
  },
  sub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 18,
    color: C.ink55,
    marginTop: 4,
  },

  /* Guest Sync Banner */
  guestBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: C.line,
    ...glassCard,
  },
  guestBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  guestBannerText: {
    fontFamily: FONTS.uiMedium,
    fontSize: 12,
    color: C.pine,
    flex: 1,
  },

  /* Segmented Wrap */
  segmentWrap: {
    marginTop: 18,
    marginBottom: 18,
  },

  /* Empty State */
  emptyCard: {
    alignItems: 'center',
    paddingVertical: S.well,
    paddingHorizontal: 24,
    backgroundColor: C.pureWhite,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    ...glassCard,
  },
  emptyCrestCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: pine(0.06),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: FONTS.display,
    fontSize: 23,
    lineHeight: 27,
    letterSpacing: -0.2,
    color: C.pine,
    textAlign: 'center',
  },
  emptyLede: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    lineHeight: 19,
    color: C.ink55,
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 290,
  },
  planBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    backgroundColor: C.pine,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 22,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 3,
  },
  planBtnText: {
    fontFamily: FONTS.uiBold,
    fontSize: 13,
    color: C.cream,
    letterSpacing: 0.2,
  },

  /* Active Booking Cards */
  bookingList: {
    gap: 12,
  },
  bookingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: C.pureWhite,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    ...glassCard,
  },
  thumb: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: C.pine,
  },
  bookingDetails: {
    flex: 1,
    marginLeft: 14,
    marginRight: 6,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  refText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 10.5,
    color: C.ink55,
    letterSpacing: 0.5,
  },
  suiteName: {
    fontFamily: FONTS.display,
    fontSize: 18,
    lineHeight: 22,
    color: C.pine,
    marginTop: 4,
  },
  bookingMeta: {
    fontFamily: FONTS.ui,
    fontSize: 12,
    color: C.ink55,
    marginTop: 3,
  },
  bookingPrice: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12,
    color: C.pine,
    marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  cardChevron: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
