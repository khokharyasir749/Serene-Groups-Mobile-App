import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { EASE, HOLD_MS, OUT_MS, RISE_MS } from "@/core/components/MiniAppSplashTransition";
import { Text } from "@/core/components/Text";
import { colors, explore, fonts } from "@/core/constants/theme";

/**
 * The Serene Groups cold-start splash: it picks up where the native Pine splash leaves off (same colour, same crest),
 * then plays the mini-app cover's rhythm (the crest settles, the gold rule and the lockup rise, a hold, a fade) before
 * revealing the app. `onShown` fires after the first frame, so the native splash can be hidden with nothing in between.
 */
export function LaunchSplash({ onShown }: { onShown: () => void }) {
  const [done, setDone] = useState(false);
  const cover = useRef(new Animated.Value(1)).current;
  const crest = useRef(new Animated.Value(0)).current;
  const words = useRef(new Animated.Value(0)).current;
  const shown = useRef(false);

  useEffect(() => {
    let alive = true;
    const run = Animated.sequence([
      Animated.parallel([
        Animated.timing(crest, { toValue: 1, duration: RISE_MS, easing: EASE, useNativeDriver: true }),
        Animated.timing(words, { toValue: 1, delay: 120, duration: RISE_MS - 120, easing: EASE, useNativeDriver: true }),
      ]),
      Animated.delay(HOLD_MS),
      Animated.timing(cover, { toValue: 0, duration: OUT_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);
    run.start(() => {
      if (alive) setDone(true);
    });
    return () => {
      alive = false;
      run.stop();
    };
    // Plays once per cold start.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  const settle = { transform: [{ scale: crest.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }] };
  const rise = { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] };
  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.root, { opacity: cover }]}
      pointerEvents="none"
      accessibilityLabel="Serene Group"
      onLayout={() => {
        if (shown.current) return;
        shown.current = true;
        requestAnimationFrame(onShown);
      }}
    >
      <StatusBar style="light" />
      <Animated.View style={settle}>
        <SereneLogoMark width={86} fill={colors.snow} snow={colors.pineBrand} />
      </Animated.View>
      <Animated.View style={[styles.words, rise]}>
        <View style={styles.rule} />
        <Text style={styles.name} numberOfLines={1}>
          SERENE GROUP
        </Text>
        <Text style={styles.sub} numberOfLines={1}>
          BY DM CONSORTIUM
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.pineBrand, alignItems: "center", justifyContent: "center", zIndex: 200, elevation: 200, paddingHorizontal: 28 },
  words: { alignItems: "center", marginTop: 28, alignSelf: "stretch" },
  rule: { width: 44, height: 1.5, backgroundColor: colors.goldAccent, marginBottom: 18 },
  name: { color: colors.snow, fontFamily: fonts.display, fontSize: 30, lineHeight: 37, letterSpacing: 3, textAlign: "center" },
  sub: { color: explore.gold, fontFamily: fonts.uiMedium, fontSize: 11, lineHeight: 15, letterSpacing: 1.6, marginTop: 6, textAlign: "center" },
});
