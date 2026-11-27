import { Fragment, useEffect, useRef } from "react";
import { Animated, BackHandler, Easing, Platform, StyleSheet, View } from "react-native";
import { FullWindowOverlay } from "react-native-screens";
import { StatusBar } from "expo-status-bar";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { Text } from "@/core/components/Text";
import { colors, fonts } from "@/core/constants/theme";
import { endSwitch, useSwitchStore, type MiniApp } from "@/core/stores/switchStore";

// 200 in + 620 hold + 280 out = 1.1 s.
const IN_MS = 200;
export const RISE_MS = 480;
export const HOLD_MS = 620;
export const OUT_MS = 280;
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);

// iOS presents modals above the React root, so the cover gets its own window there; on Android it already sits above every screen.
const Layer = Platform.OS === "ios" ? FullWindowOverlay : Fragment;

function Cover({ target, go }: { target: MiniApp; go: () => void }) {
  const cover = useRef(new Animated.Value(0)).current;
  const crest = useRef(new Animated.Value(0)).current;
  const words = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let alive = true;
    Animated.parallel([
      Animated.timing(crest, { toValue: 1, duration: RISE_MS, easing: EASE, useNativeDriver: true }),
      Animated.timing(words, { toValue: 1, delay: 120, duration: RISE_MS - 120, easing: EASE, useNativeDriver: true }),
    ]).start();
    const out = Animated.sequence([
      Animated.delay(HOLD_MS),
      Animated.timing(cover, { toValue: 0, duration: OUT_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]);
    Animated.timing(cover, { toValue: 1, duration: IN_MS, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() => {
      if (!alive) return;
      go(); // the screen is fully covered now
      out.start(() => {
        if (alive) endSwitch();
      });
    });
    const back = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => {
      alive = false;
      back.remove();
      out.stop();
      // Unmounted mid-switch (signed out, for example): never leave a switch marked as running.
      endSwitch();
    };
    // Plays once per switch (keyed by the host).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rise = { opacity: words, transform: [{ translateY: words.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] };
  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, { opacity: cover }]} accessibilityLiveRegion="polite" accessibilityLabel={`Switching to ${target}`}>
      <StatusBar style="light" />
      <Animated.View style={{ opacity: crest, transform: [{ scale: crest.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }) }] }}>
        <SereneLogoMark width={86} fill={colors.snow} snow={colors.pineBrand} />
      </Animated.View>
      <Animated.View style={[styles.words, rise]}>
        <View style={styles.rule} />
        <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
          {`Switching to ${target}...`}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

/** Mounted once above every (app) screen; shows whenever `switchTo()` is called. */
export function MiniAppSplashTransition() {
  const { id, target, go } = useSwitchStore();
  if (!target || !go) return null;
  return (
    <Layer>
      <Cover key={id} target={target} go={go} />
    </Layer>
  );
}

const styles = StyleSheet.create({
  root: { backgroundColor: colors.pineBrand, alignItems: "center", justifyContent: "center", zIndex: 100, elevation: 100, paddingHorizontal: 28 },
  words: { alignItems: "center", marginTop: 28, alignSelf: "stretch" },
  rule: { width: 44, height: 1.5, backgroundColor: colors.goldAccent, marginBottom: 18 },
  label: { color: colors.snow, fontFamily: fonts.uiSemi, fontSize: 16, letterSpacing: 0.4, textAlign: "center" },
});
