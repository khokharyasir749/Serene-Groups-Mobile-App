import { StyleSheet, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { explore, font, fonts, spacing } from "@/core/constants/theme";
import { ChapterTitle } from "@/features/home/components/ChapterTitle";

// One glyph per reason, in the web's order.
const ICON = ["office-building-cog", "chart-donut", "key-variant", "weather-night", "check-decagram", "scale-balance"] as const satisfies readonly (keyof typeof MaterialCommunityIcons.glyphMap)[];

/** The six investor reasons on a full-bleed dark chapter. */
export function InvestorReasons() {
  return (
    <View style={styles.wrap}>
      <ChapterTitle dark title="Six reasons" soft="to own." />
      <View>
        {WEB.investors.reasons.map((r, i) => (
          <View key={r.t} style={styles.row}>
            <MaterialCommunityIcons name={ICON[i] ?? "star-four-points"} size={28} color={explore.gold} style={styles.icon} />
            <View style={styles.body}>
              <Text style={styles.title}>{r.t}</Text>
              <Text style={styles.text}>{r.d}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, paddingTop: spacing.hero, paddingBottom: spacing.xl, gap: spacing.lg, backgroundColor: explore.deep, borderRadius: 38 },
  row: { flexDirection: "row", gap: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: explore.lineDark },
  icon: { marginTop: 2 },
  body: { flex: 1, gap: 4 },
  title: { color: explore.onDark, fontFamily: fonts.display, fontSize: 28, lineHeight: 30 },
  text: { color: explore.onDarkSoft, fontSize: font.md, lineHeight: 23 },
});
