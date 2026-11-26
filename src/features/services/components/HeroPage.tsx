import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { spacing } from "@/core/constants/theme";
import { useServiceFonts } from "@/features/services/components/fonts";
import { isReduced } from "@/features/services/components/motion";
import { PageStatus } from "@/features/services/components/PageStatus";
import { ScrollScene } from "@/features/services/components/scroll";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { RoundButton } from "@/features/services/components/ui";

export { Reveal } from "@/features/services/components/scroll";

const BAR = 56;
const TOP = 30;
/** The page is one full-width sheet whose rounded top meets the photograph. */
const LIP = 28;

type Props = { photo?: ImageSource; height: number; title: string; onBack?: () => void; bar: ReactNode; foot: ReactNode; children: ReactNode; bottom: number; /** Shown at the end of the small title bar. */ action?: ReactNode; position?: "center" | "top" | "bottom" };

/**
 * Edge-to-edge photograph that holds still while the page, a full-width sheet, is drawn over it like a curtain: the picture
 * swells and darkens, the words lift away, and a small title bar takes over.
 */
export function HeroPage({ photo, height, title, onBack, bar, foot, children, bottom, action, position = "center" }: Props) {
  const insets = useSafeAreaInsets();
  const y = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(isReduced() ? 1 : 0)).current;
  const rise = useRef(new Animated.Value(isReduced() ? 1 : 0)).current;
  const [over, setOver] = useState(true);
  const offset = useRef(0);
  // Mirrors `over`, so a scroll frame that changes nothing costs no React work.
  const overNow = useRef(true);
  useEffect(() => {
    if (isReduced()) return;
    const a = Animated.parallel([
      Animated.timing(settle, { toValue: 1, duration: 1400, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }),
      Animated.timing(rise, { toValue: 1, delay: 120, duration: 760, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }),
    ]);
    a.start();
    return () => a.stop();
  }, [rise, settle]);

  // Coming back to this page: it settles in, on the native driver.
  const arrive = useRef(new Animated.Value(1)).current;
  useFocusEffect(
    useCallback(() => {
      if (isReduced()) return;
      arrive.setValue(0);
      const a = Animated.timing(arrive, { toValue: 1, duration: 360, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true });
      a.start();
      return () => {
        a.stop();
        arrive.setValue(1);
      };
    }, [arrive]),
  );

  const turn = height - LIP - insets.top - BAR;
  const still = isReduced();
  const hold = y.interpolate({ inputRange: [0, height], outputRange: [0, still ? 0 : height], extrapolate: "clamp" });
  const drift = y.interpolate({ inputRange: [-200, 0, height], outputRange: [-100, 0, still ? 0 : -height * 0.08], extrapolate: "clamp" });
  const stretch = Animated.multiply(y.interpolate({ inputRange: [-200, 0, height], outputRange: [1.4, 1, still ? 1 : 1.16], extrapolate: "clamp" }), settle.interpolate({ inputRange: [0, 1], outputRange: [1.14, 1] }));
  const veil = y.interpolate({ inputRange: [0, height], outputRange: [0, 0.55], extrapolate: "clamp" });
  const fade = y.interpolate({ inputRange: [0, height * 0.5], outputRange: [1, 0], extrapolate: "clamp" });
  const sink = y.interpolate({ inputRange: [0, height], outputRange: [0, still ? 0 : -height * 0.2], extrapolate: "clamp" });
  const small = y.interpolate({ inputRange: [turn - 24, turn + 30], outputRange: [0, 1], extrapolate: "clamp" });

  if (!useServiceFonts()) return <View style={styles.page} />;

  return (
    <View style={styles.page}>
      <Animated.View style={[styles.fill, { opacity: arrive.interpolate({ inputRange: [0, 1], outputRange: [0.35, 1] }), transform: [{ translateY: arrive.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }]}>
      <PageStatus style={over ? "light" : "dark"} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: bottom }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => {
            offset.current = e.nativeEvent.contentOffset.y;
            const next = e.nativeEvent.contentOffset.y < turn + 8;
            if (next !== overNow.current) {
              overNow.current = next;
              setOver(next);
            }
          },
        })}
      >
        <Animated.View style={[styles.hero, { height, transform: [{ translateY: hold }] }]}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: drift }, { scale: stretch }] }]}>
            <Image cachePolicy="memory-disk" source={photo} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={position} transition={120} />
          </Animated.View>
          <LinearGradient pointerEvents="none" colors={tone.heroFade} locations={[0, 0.24, 0.46, 1]} style={StyleSheet.absoluteFill} />
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.veil, { opacity: veil }]} />
          <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>{bar}</View>
          <Animated.View style={[styles.foot, { opacity: fade, transform: [{ translateY: sink }] }]}>{foot}</Animated.View>
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [LIP - 2, 0] }) }] }]}>
          <ScrollScene y={y} sheetTop={height - LIP} offset={offset}>
            {children}
          </ScrollScene>
        </Animated.View>
      </Animated.ScrollView>
      </Animated.View>
      <Animated.View pointerEvents={over ? "none" : "auto"} accessibilityElementsHidden={over} importantForAccessibility={over ? "no-hide-descendants" : "auto"} style={[styles.small, { height: insets.top + BAR, paddingTop: insets.top, opacity: small }]}>
        {onBack ? <RoundButton icon="chevron-back-outline" label="Back" onPress={onBack} size={40} /> : null}
        <Animated.View style={[styles.fill, { transform: [{ translateY: small.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }] }]}>
          <Text style={styles.smallTitle} numberOfLines={1}>
            {title}
          </Text>
        </Animated.View>
        {action}
        <Animated.View style={[styles.thread, { transform: [{ scaleX: small }] }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: tone.page },
  fill: { flex: 1 },
  hero: { overflow: "hidden", backgroundColor: tone.pine, justifyContent: "space-between" },
  veil: { backgroundColor: tone.veil },
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  foot: { paddingHorizontal: spacing.lg, paddingBottom: LIP + spacing.xl },
  sheet: { marginTop: -LIP, borderTopLeftRadius: LIP, borderTopRightRadius: LIP, backgroundColor: tone.page, paddingTop: TOP, paddingHorizontal: spacing.lg, gap: 44 },
  small: { position: "absolute", top: 0, left: 0, right: 0, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, backgroundColor: tone.page },
  smallTitle: { ...type.title, fontSize: 22, lineHeight: 29, color: tone.ink },
  thread: { position: "absolute", left: 0, right: 0, bottom: 0, height: 1, backgroundColor: tone.champagne },
});
