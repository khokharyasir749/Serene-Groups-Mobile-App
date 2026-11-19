import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";

// Figures come from the web; the unit and the two-line caption complete each one so nothing needs trimming.
const DETAIL = [
  { unit: "", caption: "Founded by\nDM Consortium" },
  { unit: " ft", caption: "Nathia Gali\nElevation" },
  { unit: " Storeys", caption: "Gulberg Main\nBoulevard" },
  { unit: " Suites", caption: "Managed Hotel\nApartments" },
] as const;

/** About the group: four metric tiles, figure on top and a full two-line caption below. Zero truncation. */
export function HeritageStrip() {
  return (
    <View style={styles.grid}>
      {WEB.about.stats.map((s, i) => {
        const value = s.pad === "," ? s.n.toLocaleString("en-US") : `${s.n}${s.pad}`;
        const d = DETAIL[i];
        return (
          <View key={s.label} style={styles.cell}>
            <View style={styles.dot} />
            <Text style={styles.num} numberOfLines={1} adjustsFontSizeToFit>
              {value}
              <Text style={styles.unit}>{d.unit}</Text>
            </Text>
            <Text style={styles.label}>{d.caption}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  cell: { width: "48.6%", gap: spacing.xs, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, padding: spacing.lg, ...shadows.card },
  dot: { position: "absolute", top: spacing.md, right: spacing.md, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.goldAccent },
  num: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: letter.tight },
  unit: { color: colors.ink2, fontFamily: fonts.uiBold, fontSize: font.md },
  label: { color: colors.muted, fontSize: font.sm, lineHeight: 18 },
});
