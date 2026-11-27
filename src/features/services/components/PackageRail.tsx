import { memo, useMemo, useRef } from "react";
import { Animated, StyleSheet, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/features/services/components/Text";
import { colors, spacing } from "@/core/constants/theme";
import { isReduced } from "@/features/services/components/motion";
import { Press } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { PACKAGES } from "@/features/services/data/catalog";
import { openService } from "@/features/services/lib/nav";

const GAP = 12;

/** Stay packages, aligned to the page's left edge. The front card stands full size and bright; the next ones sit back, dimmed, and every photograph slides in its frame. */
export const PackageRail = memo(function PackageRail() {
  const { width } = useWindowDimensions();
  const x = useRef(new Animated.Value(0)).current;
  const onScroll = useMemo(() => Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true }), [x]);
  const still = isReduced();
  const w = Math.round(Math.min(width * 0.76, 340));
  const step = w + GAP;
  return (
    <Animated.ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={step}
      scrollEventThrottle={16}
      onScroll={onScroll}
      style={styles.bleed}
      // The end pad lets the last card rest on the same edge as the first.
      contentContainerStyle={{ paddingLeft: spacing.lg, paddingRight: width - w - spacing.lg, gap: GAP }}
    >
      {PACKAGES.map((s, i) => {
        const at = (outputRange: number[]) => x.interpolate({ inputRange: [(i - 1) * step, i * step, (i + 1) * step], outputRange, extrapolate: "clamp" });
        return (
          <Animated.View key={s.slug} style={still ? null : { transform: [{ scale: at([0.9, 1, 0.9]) }] }}>
          <Press onPress={() => openService(s.slug)} accessibilityLabel={`${s.name}. ${s.line}`} style={[styles.card, { width: w }]}>
            <Animated.View style={[styles.photo, still ? null : { transform: [{ translateX: at([-34, 0, 34]) }, { scale: at([1.16, 1, 1.16]) }] }]}>
              <Image cachePolicy="memory-disk" source={s.photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />
            </Animated.View>
            <LinearGradient pointerEvents="none" colors={tone.photoFoot} locations={[0.4, 0.7, 1]} style={StyleSheet.absoluteFill} />
            <Animated.View style={[styles.words, still ? null : { transform: [{ translateX: at([26, 0, -26]) }] }]}>
              <Text style={styles.name} maxFontSizeMultiplier={1.1}>
                {s.name}
              </Text>
              <Text style={styles.line}>{s.line}</Text>
            </Animated.View>
            {still ? null : <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim, { opacity: at([0.4, 0, 0.4]) }]} />}
          </Press>
          </Animated.View>
        );
      })}
    </Animated.ScrollView>
  );
});

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  card: { height: 380, borderRadius: 20, overflow: "hidden", backgroundColor: tone.pineDeep },
  photo: { position: "absolute", top: 0, bottom: 0, left: -34, right: -34 },
  dim: { backgroundColor: tone.pineDeep },
  words: { position: "absolute", left: 20, right: 20, bottom: 20, gap: 3 },
  name: { ...type.onPhoto, fontSize: 26, lineHeight: 32, letterSpacing: -0.3, color: colors.white },
  line: { ...type.label, fontSize: 13.5, color: colors.white },
});
