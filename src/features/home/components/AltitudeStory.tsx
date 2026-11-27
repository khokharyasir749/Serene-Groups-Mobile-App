import { memo, useEffect, useMemo, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Circle, Path } from "react-native-svg";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { explore, font, fonts, spacing } from "@/core/constants/theme";
import contours from "../../../../assets/data/galiyat-contours.json";
import { ChapterTitle } from "./ChapterTitle";
import { usePage, useReached } from "./pageScroll";

const MAJOR_M = 500;
const COUNT_MS = 1900;

/** Real elevation lines of the Galiyat around the resort (the website's terrain data); every 500 m is drawn brighter. */
export const Contours = memo(function Contours({ width, line, major, pin }: { width: number; line: string; major: string; pin?: boolean }) {
  return (
    <Svg width={width} height={(width * contours.height) / contours.width} viewBox={`0 0 ${contours.width} ${contours.height}`}>
      {contours.bands.map((b) => (
        <Path key={b.m} d={b.d} fill="none" stroke={b.m % MAJOR_M === 0 ? major : line} strokeWidth={b.m % MAJOR_M === 0 ? 0.9 : 0.6} />
      ))}
      {pin ? (
        <>
          <Circle cx={contours.pin[0]} cy={contours.pin[1]} r={15} fill={explore.contour} />
          <Circle cx={contours.pin[0]} cy={contours.pin[1]} r={4.5} fill={explore.gold} />
        </>
      ) : null}
    </Svg>
  );
});

function useCount(to: number, run: boolean, still: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return undefined;
    if (still) {
      setN(to);
      return undefined;
    }
    let frame = 0;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / COUNT_MS);
      setN(Math.round(to * (1 - (1 - p) ** 4)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [to, run, still]);
  return n;
}

/** The altitude, counting up. Its own component, so the count re-renders only this number while the page scrolls. */
function Feet({ to, run, still }: { to: number; run: boolean; still: boolean }) {
  const feet = useCount(to, run, still);
  return (
    <Text style={styles.feet} numberOfLines={1} maxFontSizeMultiplier={1}>
      {feet.toLocaleString("en-US")}
    </Text>
  );
}

/** The climb to the resort, then the group behind it. A full-bleed dark chapter. */
export function AltitudeStory() {
  const { y, view, still } = usePage();
  const { width } = useWindowDimensions();
  const [at, setAt] = useState<number | null>(null);
  const reached = useReached(at, 0.55);
  const [founded, altitude, storeys, apartments] = WEB.about.stats;
  const art = (width * contours.height) / contours.width;
  const drift = useMemo(
    () => (still || at === null ? 0 : y.interpolate({ inputRange: [at - view, at + art], outputRange: [-46, 46], extrapolate: "clamp" })),
    [y, at, view, art, still],
  );

  return (
    <View style={styles.wrap} onLayout={(e) => setAt(e.nativeEvent.layout.y)}>
      <View style={[styles.map, { height: art * 0.92 }]}>
        <Animated.View style={{ transform: [{ translateY: drift }, { scale: 1.16 }] }}>
          <Contours width={width} line={explore.contour} major={explore.contourMajor} pin />
        </Animated.View>
        <LinearGradient pointerEvents="none" colors={explore.deepTop} style={styles.mapTop} />
        <LinearGradient pointerEvents="none" colors={explore.deepFade} style={styles.mapBottom} />
        <Text style={styles.mapNote}>{WEB.about.caption}</Text>
      </View>
      <View style={styles.body}>
        <View accessible accessibilityLabel={`${altitude.n.toLocaleString("en-US")} feet, Nathia Gali altitude`}>
          <View style={styles.feetRow}>
            <Feet to={altitude.n} run={reached} still={still} />
            <Text style={styles.feetUnit}>ft</Text>
          </View>
          <Text style={styles.feetNote}>Nathia Gali, where the group began</Text>
        </View>
        <ChapterTitle dark title="Planned, built, sold" soft="and managed by one team." style={styles.title} />
        <Text style={styles.copy}>{WEB.about.p1}</Text>
        <Text style={styles.copy}>{WEB.about.p2}</Text>
        <View style={styles.facts}>
          {[
            { n: `${founded.n}`, label: founded.label },
            { n: `${storeys.n}`, label: storeys.label },
            { n: `${apartments.n}${apartments.pad}`, label: apartments.label },
          ].map((f) => (
            <View key={f.label} style={styles.fact}>
              <Text style={styles.factValue}>{f.n}</Text>
              <Text style={styles.factLabel}>{f.label}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: -spacing.lg, backgroundColor: explore.deep, borderRadius: 38, overflow: "hidden" },
  map: { overflow: "hidden" },
  mapTop: { position: "absolute", top: 0, left: 0, right: 0, height: 80 },
  mapBottom: { position: "absolute", bottom: 0, left: 0, right: 0, height: 190 },
  mapNote: { position: "absolute", top: spacing.xl, left: spacing.lg, right: spacing.lg, color: explore.onDarkSoft, fontSize: 12, lineHeight: 17 },
  body: { paddingHorizontal: spacing.lg, paddingBottom: spacing.hero, marginTop: -74, gap: spacing.lg },
  feetRow: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  feet: { color: explore.onDark, fontFamily: fonts.display, fontSize: 108, lineHeight: 108, letterSpacing: -4, fontVariant: ["lining-nums", "tabular-nums"] },
  feetUnit: { color: explore.gold, fontFamily: fonts.displayItalic, fontSize: 40, lineHeight: 44 },
  feetNote: { color: explore.onDarkSoft, fontSize: font.md },
  title: { marginTop: spacing.xl, fontSize: 38, lineHeight: 40 },
  copy: { color: explore.onDarkSoft, fontSize: font.md + 1, lineHeight: 25 },
  facts: { marginTop: spacing.sm },
  fact: { flexDirection: "row", alignItems: "center", gap: spacing.lg, borderTopWidth: 1, borderTopColor: explore.lineDark, paddingVertical: spacing.md + 2 },
  factValue: { width: 92, color: explore.gold, fontFamily: fonts.display, fontSize: 40, lineHeight: 44, fontVariant: ["lining-nums"] },
  factLabel: { flex: 1, color: explore.onDark, fontSize: font.md, lineHeight: 21 },
});
