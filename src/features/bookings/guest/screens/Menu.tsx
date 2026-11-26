import { useNavigation } from 'expo-router';
import { HEX } from '@/features/bookings/guest/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from '@/features/bookings/guest/lib/nav';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { BackHandler, Keyboard, Linking, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Animated, Easing } from 'react-native';
import { Enter } from '@/features/bookings/guest/components/motion';
import GroupsPill from '@/features/bookings/guest/components/GroupsPill';
import { exitToGroups } from '@/features/bookings/guest/lib/nav';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import BrandLockup from '@/features/bookings/guest/components/BrandLockup';
import ClearGlass, { glassEdge } from '@/features/bookings/guest/components/ClearGlass';
import { Text } from '@/features/bookings/guest/components/Text';
import { Photo } from '@/features/bookings/guest/components/ui';
import { CONTACT } from '@/features/bookings/guest/data/contact';
import { C, FONTS, S, LOGO_TOP } from '@/features/bookings/guest/theme';

type Item = { n: string; label: string; go: () => void };

/**
 * Editorial Full-Screen Navigation Menu:
 * Atmospheric background photography (never used elsewhere in the app)
 * with a high-contrast cinematic Pine gradient scrim, ensuring 100% crystal-clear text readability.
 */
export default function Menu() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [hot, setHot] = useState<string | null>(null);

  const { height } = useWindowDimensions();
  const H = height + 80;
  const p = useRef(new Animated.Value(0)).current;
  const closing = useRef(false);
  const [closingState, setClosingState] = useState(false);
  const [lightBar, setLightBar] = useState(false);
  const curtain = { transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [-H, 0] }) }] };
  const inner = { transform: [{ translateY: p.interpolate({ inputRange: [0, 1], outputRange: [H, 0] }) }] };

  useEffect(() => {
    Animated.timing(p, { toValue: 1, duration: 760, easing: Easing.bezier(0.77, 0, 0.18, 1), useNativeDriver: true }).start();
    const t = setTimeout(() => setLightBar(true), 260);
    return () => clearTimeout(t);
  }, [p]);

  /** Lift the curtain, then navigate to destination */
  const closeThen = (then?: () => void) => {
    if (closing.current) return;
    closing.current = true;
    setClosingState(true);
    Keyboard.dismiss();
    Animated.timing(p, { toValue: 0, duration: 560, easing: Easing.bezier(0.77, 0, 0.18, 1), useNativeDriver: true }).start();
    setTimeout(() => setLightBar(false), 300);
    setTimeout(() => {
      if (router.canGoBack()) {
        router.back();
      }
      if (then) setTimeout(then, 60);
    }, 580);
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      // The menu stays mounted under the pages it opens; there, Back belongs to the page.
      if (!navigation.isFocused()) return false;
      closeThen();
      return true;
    });
    return () => sub.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toTab = (path: '/' | '/apartments') => () =>
    closeThen(() => {
      router.navigate(path);
    });

  const items: Item[] = [
    { n: '01', label: 'Home', go: toTab('/') },
    { n: '02', label: 'Apartments', go: toTab('/apartments') },
    { n: '03', label: 'Amenities', go: () => router.push('/amenities') },
    { n: '04', label: 'Floor plans', go: () => router.push('/floor-plans') },
    { n: '05', label: 'Location & contact', go: () => router.push('/location') },
    {
      n: '06',
      label: 'Find a booking',
      go: () => {
        Keyboard.dismiss();
        router.push('/find-booking');
      },
    },
    { n: '07', label: 'Guest reviews', go: () => router.push('/reviews') },
  ];

  const quick = [CONTACT.lines[0], CONTACT.lines[1]];

  return (
    <View style={styles.stage} pointerEvents={closingState ? 'none' : 'auto'}>
      <StatusBar style={lightBar ? 'light' : 'dark'} />
      <Animated.View style={[styles.curtain, curtain]}>
        {/* ── Background Photography (Exclusive to Menu) ── */}
        <Photo
          src="/images/resort/aerial-pool-portrait.jpg"
          style={StyleSheet.absoluteFill}
        />

        {/* ── High-Contrast Deep Pine Gradient Scrim (Guarantees Razor-Sharp Readability) ── */}
        <LinearGradient
          colors={[
            'rgba(10, 24, 17, 0.90)',
            'rgba(12, 28, 20, 0.82)',
            'rgba(12, 28, 20, 0.86)',
            'rgba(8, 20, 14, 0.95)',
          ]}
          locations={[0, 0.25, 0.7, 1]}
          style={StyleSheet.absoluteFill}
        />

        {/* ── Content Root ── */}
        <Animated.View
          style={[
            styles.root,
            { paddingTop: insets.top + LOGO_TOP, paddingBottom: insets.bottom + 16 },
            inner,
          ]}
        >
          {/* Top Bar */}
          <View style={styles.top}>
            <BrandLockup onPhoto />
            <View style={{ flex: 1 }} />
            <GroupsPill onPhoto onPress={exitToGroups} />
            <Pressable
              onPress={() => closeThen()}
              hitSlop={14}
              style={({ pressed }) => [styles.close, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Close menu"
            >
              <ClearGlass />
              <Ionicons name="close" size={18} color={C.cream} />
            </Pressable>
          </View>

          {/* Nav Items */}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {items.map((it, i) => {
              const on = hot === it.n;
              return (
                <Enter key={it.n} delay={200 + i * 50} duration={650}>
                  <Pressable
                    onPress={it.go}
                    onPressIn={() => setHot(it.n)}
                    onPressOut={() => setHot(null)}
                    accessibilityRole="link"
                    accessibilityLabel={it.label}
                    style={({ pressed }) => [
                      styles.item,
                      (on || pressed) && styles.itemHot,
                    ]}
                  >
                    <Text
                      style={[styles.label, on && { color: C.gold }]}
                      numberOfLines={2}
                      adjustsFontSizeToFit
                      minimumFontScale={0.8}
                    >
                      {it.label}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      color={C.gold}
                      style={{ opacity: on ? 1 : 0 }}
                    />
                  </Pressable>
                </Enter>
              );
            })}
          </ScrollView>

          {/* Footer Concierge Links */}
          <View style={styles.foot}>
            {quick.map((q) => (
              <Pressable
                key={q.label}
                onPress={() => void Linking.openURL(q.href).catch(() => {})}
                style={({ pressed }) => [styles.quick, pressed && { opacity: 0.7 }]}
                accessibilityRole="link"
                accessibilityLabel={`${q.label}: ${q.value}`}
              >
                <ClearGlass />
                <View style={styles.quickIconWell}>
                  <Ionicons name={q.icon as never} size={15} color={C.gold} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickLabel}>{q.label}</Text>
                  <Text style={styles.quickValue} numberOfLines={1}>
                    {q.value}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>

          <Text style={styles.small}>Serene Heights · DM Consortium · since 2017</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  curtain: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: C.pine,
    position: 'relative',
  },
  root: {
    flex: 1,
    paddingHorizontal: S.gutter,
    backgroundColor: 'transparent',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(200, 164, 106, 0.4)',
  },
  placeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.gold,
    marginRight: 7,
  },
  place: {
    color: C.cream,
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 0,
  },
  close: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: S.well,
    width: S.well,
    justifyContent: 'center',
    borderRadius: 999,
    ...glassEdge,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 17,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(236, 238, 237, 0.12)',
  },
  itemHot: {
    backgroundColor: 'rgba(200, 164, 106, 0.12)',
    borderBottomColor: 'rgba(200, 164, 106, 0.3)',
  },
  num: {
    width: 26,
    color: C.gold,
    fontFamily: FONTS.uiBold,
    fontSize: 12.5,
    letterSpacing: 0,
    fontVariant: ['tabular-nums'],
  },
  label: {
    flex: 1,
    color: HEX.white,
    fontFamily: FONTS.display,
    fontSize: 34,
    lineHeight: 38,
    letterSpacing: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  foot: {
    flexDirection: 'row',
    gap: 14,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(200, 164, 106, 0.35)',
  },
  quick: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    ...glassEdge,
  },
  quickIconWell: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(200, 164, 106, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    color: 'rgba(236, 238, 237, 0.65)',
    fontFamily: FONTS.uiBold,
    fontSize: 12,
    letterSpacing: 0,
  },
  quickValue: {
    color: C.cream,
    fontFamily: FONTS.uiSemi,
    fontSize: 13,
    marginTop: 1,
    fontVariant: ['tabular-nums'],
  },
  small: {
    color: 'rgba(236, 238, 237, 0.55)',
    fontFamily: FONTS.ui,
    fontSize: 12.5,
    textAlign: 'center',
    marginTop: 14,
  },
});
