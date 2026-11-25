import { StyleSheet } from "react-native";
import { StatGrid } from "@/core/components/StatGrid";
import { Text } from "@/core/components/Text";
import { WEB } from "@/core/constants/serene";
import { colors, fonts, groups } from "@/core/constants/theme";
import { StatArt } from "./StatArt";

// Figures come from the web; the unit and the two-line caption complete each one so nothing needs trimming.
const DETAIL = [
  { unit: "", caption: "Founded by\nDM Consortium" },
  { unit: " ft", caption: "Nathia Gali\nAltitude" },
  { unit: " Storeys", caption: "Gulberg Main\nBoulevard" },
  { unit: " Suites", caption: "Managed Hotel\nApartments" },
] as const;

/** About the group: four metric tiles, figure on top and a full two-line caption below. Zero truncation. */
export function HeritageStrip() {
  return (
    <StatGrid
      stats={WEB.about.stats.map((s, i) => ({
        value: s.pad === "," ? s.n.toLocaleString("en-US") : `${s.n}${s.pad}`,
        unit: DETAIL[i].unit,
        label: DETAIL[i].caption,
        art: (
          <>
            <StatArt kind={i as 0 | 1 | 2 | 3} />
            {i === 1 ? <Text style={styles.tag}>Elevation</Text> : null}
          </>
        ),
      }))}
    />
  );
}

const styles = StyleSheet.create({
  tag: { position: "absolute", right: 12, bottom: 14, color: colors.white, backgroundColor: groups.champagne, fontSize: 11, fontFamily: fonts.uiMedium, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999, overflow: "hidden" },
});
