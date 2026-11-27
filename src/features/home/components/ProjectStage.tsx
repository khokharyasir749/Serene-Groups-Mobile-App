import { useState } from "react";
import { Animated, Linking, StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { MEDIA } from "@/core/constants/media";
import { DESTINATIONS, FARMS, PROJECTS, PROJECT_GEO, PROJECT_URL, WEB, type ProjectInfo, type ProjectSlug } from "@/core/constants/serene";
import { colors, explore, font, fonts, groups, radius, spacing } from "@/core/constants/theme";
import { openSite } from "@/core/lib/openSite";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { ChapterTitle } from "./ChapterTitle";
import { usePage } from "./pageScroll";
import { useRegisterTarget } from "./scrollTarget";

const PHOTO: Record<ProjectSlug, ImageSource> = {
  "nathia-gali": require("../../../../assets/bookings/photos/resort/aerial-pool-portrait.jpg") as ImageSource,
  lahore: MEDIA.lahoreTower,
};
/** Which part of each wide photo stays in a tall frame. */
const FOCUS: Record<ProjectSlug, { left: `${number}%`; top: `${number}%` }> = {
  "nathia-gali": { left: "50%", top: "40%" },
  lahore: { left: "16%", top: "50%" },
};
/** The three figures that set each address apart, by their label in DESTINATIONS. */
const FIGURES: Record<ProjectSlug, readonly string[]> = {
  "nathia-gali": ["Elevation", "Apartments", "Amenities"],
  lahore: ["Height", "Offices", "Delivery"],
};
const GAP = 16;
/** Dock height, its offset and a little air. */
const DOCK = 98;
const mapsFor = (slug: ProjectSlug) => `https://www.google.com/maps/search/?api=1&query=${PROJECT_GEO[slug].lat},${PROJECT_GEO[slug].lon}`;

function Round({ icon, label, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void }) {
  return (
    <PressScale onPress={onPress} style={styles.round} accessibilityLabel={label}>
      <Ionicons name={icon} size={20} color={colors.white} />
    </PressScale>
  );
}

function Face({ project: p }: { project: ProjectInfo }) {
  const specs = DESTINATIONS[p.slug].specs.filter((s) => FIGURES[p.slug].includes(s.k));
  return (
    <>
      <Image cachePolicy="memory-disk" source={PHOTO[p.slug]} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={FOCUS[p.slug]} transition={300} accessibilityLabel={`Serene Heights ${p.name}`} />
      <LinearGradient pointerEvents="none" colors={explore.cardFade} locations={explore.cardStops} style={StyleSheet.absoluteFill} />
      <View style={styles.status}>
        <View style={styles.dot} />
        <Text style={styles.statusText} numberOfLines={1}>
          {p.status}
        </Text>
      </View>
      <View style={styles.body}>
        <View>
          <Text style={styles.kind}>{p.kind}</Text>
          <Text style={styles.name} accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
            {p.name}
          </Text>
          <Text style={styles.place} numberOfLines={1}>
            {p.place}
          </Text>
        </View>
        <View style={styles.figures}>
          {specs.map((s, i) => {
            // "21 storeys" → a large figure with its unit set small beside it.
            const [figure, ...unit] = s.v.split(" ");
            return (
              <View key={s.k} style={[styles.figure, i > 0 && styles.figureLine]}>
                <View style={styles.valueRow}>
                  <Text style={styles.value} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                    {figure}
                  </Text>
                  <Text style={styles.unit} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                    {unit.join(" ")}
                  </Text>
                </View>
                <Text style={styles.label} numberOfLines={1}>
                  {s.k}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.actions}>
          <PressScale style={styles.visit} onPress={() => void openSite(PROJECT_URL[p.slug])} accessibilityLabel={`Visit the ${p.name} website`}>
            <Text style={styles.visitText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              Website
            </Text>
          </PressScale>
          <Round icon="navigate-outline" label={`Directions to ${p.name}`} onPress={() => void Linking.openURL(mapsFor(p.slug))} />
          <Round icon="call-outline" label={`Call ${p.name}`} onPress={() => void Linking.openURL(`tel:${p.phone.replace(/[^\d+]/g, "")}`)} />
          <Round icon="mail-outline" label={`Email ${p.name}`} onPress={() => void Linking.openURL(`mailto:${p.email}`)} />
        </View>
      </View>
    </>
  );
}

function Upcoming() {
  const { cta, interest } = WEB.upcoming;
  return (
    <View style={styles.farms}>
      <Image cachePolicy="memory-disk" source={MEDIA.farms} style={styles.farmsPhoto} contentFit="cover" contentPosition={{ left: "50%", top: "34%" }} transition={300} accessibilityLabel={FARMS.name} />
      <View style={styles.farmsBody}>
        <Text style={styles.farmsKind}>{`${FARMS.status}, ${FARMS.place}`}</Text>
        <Text style={styles.farmsText}>{`${FARMS.facts.map((f, i) => (i ? f.toLowerCase() : f)).join(", ")}.`}</Text>
        <PressScale style={styles.row} onPress={() => void openWhatsApp(FARMS.interest)} accessibilityLabel={`Register interest in ${FARMS.name} on WhatsApp`}>
          <Text style={styles.rowTitle}>{`Register interest in ${FARMS.name}`}</Text>
          <Ionicons name="logo-whatsapp" size={20} color={groups.pine} />
        </PressScale>
        <PressScale style={styles.row} onPress={() => void openWhatsApp(interest)} accessibilityLabel={`${cta.title} Hear about the next projects on WhatsApp`}>
          <View style={styles.rowWords}>
            <Text style={styles.rowTitle}>{cta.title}</Text>
            <Text style={styles.rowNote}>Hear about new projects before they are announced</Text>
          </View>
          <Ionicons name="logo-whatsapp" size={20} color={groups.pine} />
        </PressScale>
      </View>
    </View>
  );
}

/** The group's addresses. Each card holds under the header while the next one slides over it. */
export function ProjectStage() {
  const { y, view, top, still } = usePage();
  const insets = useSafeAreaInsets();
  const register = useRegisterTarget();
  const [at, setAt] = useState<number | null>(null);
  const [deck, setDeck] = useState<number | null>(null);
  const pin = top + spacing.md;
  // Between the header and the dock, so a held card shows whole.
  const height = Math.round(Math.min(680, Math.max(420, view - pin - DOCK - insets.bottom)));
  const step = height + GAP;

  return (
    <View
      style={styles.wrap}
      onLayout={(e) => {
        setAt(e.nativeEvent.layout.y);
        register("projects", e.nativeEvent.layout.y);
      }}
    >
      <ChapterTitle title={WEB.projects.title} soft={WEB.projects.soft} />
      <View style={styles.deck} onLayout={(e) => setDeck(e.nativeEvent.layout.y)}>
        {PROJECTS.map((p, i) => {
          const held = i < PROJECTS.length - 1 && at !== null && deck !== null && !still;
          const from = (at ?? 0) + (deck ?? 0) + i * step - pin;
          const range = [from, from + step];
          const hold = held
            ? {
                transformOrigin: "top",
                transform: [
                  { translateY: y.interpolate({ inputRange: range, outputRange: [0, step], extrapolate: "clamp" }) },
                  { scale: y.interpolate({ inputRange: range, outputRange: [1, 0.9], extrapolate: "clamp" }) },
                ],
              }
            : null;
          return (
            <Animated.View key={p.slug} style={[styles.card, { height }, hold]}>
              <Face project={p} />
              {held ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.dim, { opacity: y.interpolate({ inputRange: range, outputRange: [0, 0.6], extrapolate: "clamp" }) }]} /> : null}
            </Animated.View>
          );
        })}
      </View>
      <Upcoming />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  deck: { gap: GAP, marginHorizontal: -spacing.sm },
  card: { borderRadius: 34, overflow: "hidden", backgroundColor: explore.deep, justifyContent: "space-between" },
  dim: { backgroundColor: explore.deep },
  status: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, margin: spacing.lg, backgroundColor: explore.glassDark, borderWidth: 1, borderColor: explore.glassEdge, borderRadius: radius.pill, paddingHorizontal: 14, height: 34 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: explore.gold },
  statusText: { flexShrink: 1, color: colors.white, fontSize: 12.5, fontFamily: fonts.uiSemi },
  body: { padding: spacing.lg, gap: spacing.lg },
  kind: { color: explore.gold, fontSize: font.sm, fontFamily: fonts.uiSemi },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 58, lineHeight: 62, letterSpacing: -1.2 },
  place: { color: explore.onDarkSoft, fontSize: font.sm, lineHeight: 20 },
  figures: { flexDirection: "row", borderTopWidth: 1, borderTopColor: explore.glassEdge, paddingTop: spacing.md + 2 },
  figure: { flex: 1, gap: 1 },
  figureLine: { borderLeftWidth: 1, borderLeftColor: explore.glassEdge, paddingLeft: spacing.md },
  valueRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  value: { color: colors.white, fontFamily: fonts.display, fontSize: 30, lineHeight: 34, fontVariant: ["lining-nums"] },
  unit: { flexShrink: 1, color: colors.white, fontSize: font.sm, fontFamily: fonts.uiMedium },
  label: { color: explore.onDarkSoft, fontSize: 12.5 },
  actions: { flexDirection: "row", gap: 8 },
  visit: { flex: 1, height: 52, borderRadius: radius.pill, backgroundColor: explore.gold, alignItems: "center", justifyContent: "center" },
  visitText: { color: explore.deep, fontSize: font.md, fontFamily: fonts.uiBold },
  round: { width: 52, height: 52, borderRadius: 26, backgroundColor: explore.glass, borderWidth: 1, borderColor: explore.glassEdge, alignItems: "center", justifyContent: "center" },
  farms: { marginHorizontal: -spacing.sm, borderRadius: 34, overflow: "hidden", backgroundColor: explore.sheet },
  farmsPhoto: { height: 190, backgroundColor: explore.deep },
  farmsBody: { padding: spacing.lg, paddingBottom: spacing.sm, gap: spacing.xs },
  farmsKind: { color: explore.goldDeep, fontSize: font.sm, fontFamily: fonts.uiSemi },
  farmsText: { color: groups.pine, fontSize: font.md, lineHeight: 23, marginBottom: spacing.sm },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, minHeight: 62, borderTopWidth: 1, borderTopColor: explore.line },
  rowWords: { flex: 1 },
  rowTitle: { color: groups.pine, fontSize: font.md, fontFamily: fonts.uiBold },
  rowNote: { color: colors.textMuted, fontSize: font.sm },
});
