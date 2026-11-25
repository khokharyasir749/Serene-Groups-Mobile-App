import { ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SectionHeader } from "@/core/components/SectionHeader";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { colors, fonts, groups, spacing } from "@/core/constants/theme";

// One short category and glyph per reason, in the web's order.
const FACE = [
  ["In-house operations", "office-building-cog"],
  ["Quarterly yield", "chart-donut"],
  ["Accessible entry", "key-variant"],
  ["Owner privileges", "weather-night"],
  ["LDA approved", "check-decagram"],
  ["Halal structure", "scale-balance"],
] as const satisfies readonly (readonly [string, keyof typeof MaterialCommunityIcons.glyphMap])[];

/** The six investor reasons as numbered plates in one row. */
export function InvestorReasons() {
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="Why Serene" title="Six reasons" soft="to own." />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={CARD + 12} decelerationRate="fast" style={styles.bleed} contentContainerStyle={styles.track}>
        {WEB.investors.reasons.map((r, i) => (
          <View key={r.t} style={styles.card}>
            <View style={styles.head}>
              <View style={styles.well}>
                <MaterialCommunityIcons name={FACE[i]?.[1] ?? "star-four-points"} size={24} color={colors.white} />
              </View>
              <Text style={styles.num}>{`0${i + 1}`}</Text>
            </View>
            <Text style={styles.tag}>{(FACE[i]?.[0] ?? "").toUpperCase()}</Text>
            <Text style={styles.title}>{r.t}</Text>
            <Text style={styles.text}>{r.d}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const CARD = 256;
const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  track: { paddingHorizontal: spacing.lg, paddingBottom: 8, gap: 12 },
  card: { width: CARD, gap: 6, backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 26, padding: 18, boxShadow: groups.plateShadow },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  well: { width: 48, height: 48, borderRadius: 17, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  num: { color: groups.champagne, fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 40 },
  tag: { color: groups.goldInk, fontSize: 10, letterSpacing: 1.2, fontFamily: fonts.uiBold },
  title: { color: groups.pine, fontFamily: fonts.display, fontSize: 28, lineHeight: 33 },
  text: { color: colors.ink2, fontSize: 14, lineHeight: 21 },
});
