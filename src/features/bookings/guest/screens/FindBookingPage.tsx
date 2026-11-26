import { HEX, pine } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { useEffect } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Enter } from '@/features/bookings/guest/components/motion';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BookingLookupForm from '@/features/bookings/guest/components/BookingLookupForm';
import PageHeader from '@/features/bookings/guest/components/PageHeader';
import { Text } from '@/features/bookings/guest/components/Text';
import { useBooking } from '@/features/bookings/guest/state/booking';
import { C, FONTS, S } from '@/features/bookings/guest/theme';
import { glassCard } from '@/features/bookings/guest/theme/glass';

const rise = (i: number) => 50 + i * 60;

export default function FindBookingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, bookings } = useBooking();

  useEffect(() => {
    return () => {
      Keyboard.dismiss();
    };
  }, []);

  return (
    <View style={styles.root}>
      <PageHeader title="Find a Reservation" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: S.gutter, paddingTop: 20, paddingBottom: insets.bottom + 40 }}
        >
          {/* Hero Section */}
          <Enter delay={rise(0)} duration={450} style={styles.hero}>
            <View style={styles.kickerRow}>
              <View style={styles.kickerDot} />
              <Text style={styles.kickerText}>Reservations</Text>
            </View>
            <Text style={styles.headline}>Find Your Reservation</Text>
            <Text style={styles.lede}>
              Access your stay details, check-in instructions, and guest privileges with your reference code and confirmation email.
            </Text>
          </Enter>

          {/* Booking Lookup Card */}
          <Enter delay={rise(1)} duration={450} style={styles.card}>
            <View style={styles.cardHead}>
              <View style={styles.iconWell}>
                <Ionicons name="search" size={17} color={C.pine} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>Booking Lookup</Text>
                <Text style={styles.cardSub}>No account or login password needed</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark-outline" size={12} color={C.pine} />
                <Text style={styles.badgeText}>Direct Access</Text>
              </View>
            </View>
            <BookingLookupForm
              hideNote
              onFound={(b) => {
                Keyboard.dismiss();
                router.replace({ pathname: '/booking/[ref]', params: { ref: b.reference } });
              }}
            />
          </Enter>

          {/* Quick Options Card */}
          <Enter delay={rise(2)} duration={450} style={styles.options}>
            {user ? (
              <Option
                icon="calendar-outline"
                title="View all my stays"
                sub={bookings.length ? `${bookings.length} reservation${bookings.length === 1 ? '' : 's'} on your account` : 'Your reservations appear here'}
                onPress={() => {
                  Keyboard.dismiss();
                  router.navigate('/trips');
                }}
              />
            ) : (
              <Option
                icon="person-outline"
                title="Sign in to view all stays"
                sub="Sync all your mountain reservations in one place"
                onPress={() => {
                  Keyboard.dismiss();
                  router.push('/login');
                }}
              />
            )}
            <Option
              icon="bed-outline"
              title="Explore residences"
              sub="Browse available suites and plan a new alpine stay"
              onPress={() => {
                Keyboard.dismiss();
                router.navigate('/apartments');
              }}
              last
            />
          </Enter>

          {/* Concierge Help Assistance Footer */}
          <Enter delay={rise(3)} duration={450} style={styles.helpFooter}>
            <Ionicons name="headset-outline" size={14} color={HEX.bronze} />
            <Text style={styles.helpText}>Need help finding your reference? </Text>
            <Pressable
              onPress={() => {
                Keyboard.dismiss();
                router.push('/menu');
              }}
              hitSlop={8}
            >
              <Text style={styles.helpLink}>Contact Concierge →</Text>
            </Pressable>
          </Enter>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Option({
  icon,
  title,
  sub,
  onPress,
  last,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  sub: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={title}
      style={({ pressed }) => [styles.opt, !last && styles.optLine, pressed && { opacity: 0.75 }]}
    >
      <View style={styles.optIconWell}>
        <Ionicons name={icon} size={18} color={C.pine} />
      </View>
      <View style={{ flex: 1, paddingVertical: 2 }}>
        <Text style={styles.optTitle}>{title}</Text>
        <Text style={styles.optSub}>{sub}</Text>
      </View>
      <View style={styles.optArrowWell}>
        <Ionicons name="chevron-forward" size={15} color={C.ink40} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.sand,
  },
  hero: {
    marginBottom: 4,
  },
  kickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 8,
  },
  kickerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.gold,
  },
  kickerText: {
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 0,
    color: HEX.bronze,
  },
  headline: {
    fontFamily: FONTS.display,
    fontSize: 32,
    lineHeight: 38,
    color: C.pine,
    letterSpacing: -0.3,
  },
  lede: {
    fontFamily: FONTS.ui,
    fontSize: 13.5,
    lineHeight: 20,
    color: C.ink70,
    marginTop: 8,
  },
  card: {
    marginTop: 22,
    padding: 18,
    borderRadius: 22,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: pine(0.08),
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    ...glassCard,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: pine(0.08),
  },
  iconWell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: pine(0.06),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontFamily: FONTS.display,
    fontSize: 20,
    lineHeight: 24,
    color: C.pine,
  },
  cardSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink55,
    marginTop: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: pine(0.05),
  },
  badgeText: {
    fontFamily: FONTS.uiSemi,
    fontSize: 12.5,
    color: C.pine,
  },
  options: {
    marginTop: 18,
    borderRadius: 20,
    backgroundColor: C.pureWhite,
    borderWidth: 1,
    borderColor: pine(0.08),
    paddingHorizontal: 16,
    shadowColor: HEX.pine,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
    ...glassCard,
  },
  opt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  optLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: pine(0.08),
  },
  optIconWell: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: pine(0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  optTitle: {
    fontFamily: FONTS.display,
    fontSize: 18,
    lineHeight: 22,
    color: C.pine,
  },
  optSub: {
    fontFamily: FONTS.ui,
    fontSize: 13,
    color: C.ink55,
    marginTop: 2,
  },
  optArrowWell: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: pine(0.03),
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  helpText: {
    fontFamily: FONTS.ui,
    fontSize: 14,
    color: C.ink55,
    marginLeft: 6,
  },
  helpLink: {
    fontFamily: FONTS.uiSemi,
    fontSize: 14,
    color: C.pine,
  },
});
