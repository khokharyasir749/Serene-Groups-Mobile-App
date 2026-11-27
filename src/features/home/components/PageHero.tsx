import { type ReactNode } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FadeIn } from "@/core/components/FadeIn";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { colors, explore, font, fonts, radius, spacing } from "@/core/constants/theme";
import { Contours } from "./AltitudeStory";
import { ChapterTitle } from "./ChapterTitle";
import { usePage } from "./pageScroll";

/** The opening of a tab page, edge to edge under the header. A photo, or terrain lines on deep Pine when there is none. */
export function PageHero({ height, image, focus, children }: { height: number; image?: ImageSource; focus?: `${number}%`; children: ReactNode }) {
  const { y, still } = usePage();
  const { width } = useWindowDimensions();
  const drift = y.interpolate({ inputRange: [-height, 0, height], outputRange: [-height / 2, 0, still ? 0 : height * 0.28], extrapolate: "clamp" });
  const stretch = y.interpolate({ inputRange: [-height, 0], outputRange: [2, 1], extrapolate: "clamp" });
  return (
    <View style={[styles.stage, { height }]}>
      <View style={styles.clip}>
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: drift }, { scale: stretch }] }]}>
          {image ? (
            <Image cachePolicy="memory-disk" source={image} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: focus ?? "50%", top: "50%" }} />
          ) : (
            <Contours width={width} line={explore.contour} major={explore.contour} />
          )}
        </Animated.View>
        {image ? <LinearGradient pointerEvents="none" colors={explore.heroFade} locations={explore.heroStops} style={StyleSheet.absoluteFill} /> : <LinearGradient pointerEvents="none" colors={explore.deepFade} style={StyleSheet.absoluteFill} />}
      </View>
      <FadeIn y={24} duration={900} style={styles.body}>
        {children}
      </FadeIn>
    </View>
  );
}

export function HeroTitle({ title, soft, lede }: { title: string; soft: string; lede?: string }) {
  return (
    <View style={styles.words}>
      <ChapterTitle dark title={title} soft={soft} style={styles.title} />
      {lede ? <Text style={styles.lede}>{lede}</Text> : null}
    </View>
  );
}

type Action = { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void };

/** A hero's two actions: gold for the main one, glass for the other. */
export function HeroActions({ primary, secondary }: { primary: Action; secondary: Action }) {
  return (
    <View style={styles.actions}>
      {[primary, secondary].map((a, i) => (
        <PressScale key={a.label} onPress={a.onPress} accessibilityLabel={a.label} style={[styles.action, i ? styles.glass : styles.gold]}>
          {a.icon ? <Ionicons name={a.icon} size={19} color={i ? colors.white : explore.deep} /> : null}
          <Text style={[styles.actionText, { color: i ? colors.white : explore.deep }]} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
            {a.label}
          </Text>
        </PressScale>
      ))}
    </View>
  );
}

type Figure = { label: string; value: string; alert?: boolean };

/** Money at a glance on a dark hero: one large sum, how much of it is done, and up to three figures. */
export function MoneyHero({ label, value, done, note, figures }: { label: string; value: string; done: number; note: string; figures: Figure[] }) {
  const pct = Math.round(Math.min(1, Math.max(0, done)) * 100);
  return (
    <View style={styles.money}>
      <View>
        <Text style={styles.moneyLabel}>{label}</Text>
        <Text style={styles.moneyValue} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
          {value}
        </Text>
      </View>
      <View>
        <View style={styles.track} accessible accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: pct }}>
          <View style={[styles.fill, { width: `${pct}%` }]} />
        </View>
        <Text style={styles.moneyNote}>{note}</Text>
      </View>
      <View style={styles.figures}>
        {figures.map((f, i) => (
          <View key={f.label} style={[styles.figure, i > 0 && styles.figureLine]}>
            <Text style={[styles.figureValue, f.alert && styles.alert]} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
              {f.value}
            </Text>
            <Text style={styles.figureLabel} numberOfLines={1}>
              {f.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: { marginHorizontal: -spacing.lg, marginBottom: -spacing.xxl, justifyContent: "flex-end" },
  clip: { ...StyleSheet.absoluteFill, overflow: "hidden", backgroundColor: explore.deep, borderBottomLeftRadius: 38, borderBottomRightRadius: 38 },
  body: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  words: { gap: spacing.sm },
  title: { fontSize: 49, lineHeight: 50, letterSpacing: -1.2 },
  lede: { color: explore.onDarkSoft, fontSize: font.md + 1, lineHeight: 24, maxWidth: 340 },
  actions: { flexDirection: "row", gap: 10 },
  action: { height: 58, borderRadius: radius.pill, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 14 },
  gold: { flex: 1.3, backgroundColor: explore.gold },
  glass: { flex: 1, backgroundColor: explore.glass, borderWidth: 1, borderColor: explore.glassEdge },
  actionText: { flexShrink: 1, fontSize: 16, fontFamily: fonts.uiBold },
  money: { gap: spacing.lg },
  moneyLabel: { color: explore.gold, fontSize: font.md, fontFamily: fonts.uiSemi },
  moneyValue: { color: explore.onDark, fontFamily: fonts.display, fontSize: 60, lineHeight: 66, letterSpacing: -1.6, fontVariant: ["lining-nums"] },
  track: { height: 8, borderRadius: 4, backgroundColor: explore.glass, overflow: "hidden" },
  fill: { height: 8, borderRadius: 4, backgroundColor: explore.gold },
  moneyNote: { color: explore.onDarkSoft, fontSize: font.md, marginTop: spacing.sm },
  figures: { flexDirection: "row", borderTopWidth: 1, borderTopColor: explore.lineDark, paddingTop: spacing.md + 4 },
  figure: { flex: 1, paddingRight: spacing.sm },
  figureLine: { borderLeftWidth: 1, borderLeftColor: explore.lineDark, paddingLeft: spacing.md },
  figureValue: { color: explore.onDark, fontSize: 17, lineHeight: 23, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  alert: { color: colors.white, textDecorationLine: "underline" },
  figureLabel: { color: explore.onDarkSoft, fontSize: 13 },
});
