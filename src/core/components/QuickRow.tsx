import { StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import type { Tile } from "@/core/components/TileRail";
import { explore, fonts, groups, spacing } from "@/core/constants/theme";

/** A page's shortcuts in one quiet plate, equal widths, hairlines between. Up to five. */
export function QuickRow({ tiles }: { tiles: Tile[] }) {
  return (
    <View style={styles.row}>
      {tiles.map((t, i) => (
        <PressScale key={t.label} onPress={t.go} accessibilityLabel={t.label} style={[styles.item, i > 0 && styles.line]}>
          <MaterialCommunityIcons name={t.icon} size={24} color={groups.pine} />
          <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
            {t.label}
          </Text>
        </PressScale>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginHorizontal: -spacing.sm, borderRadius: 30, backgroundColor: explore.sheet, boxShadow: explore.lift },
  item: { flex: 1, minHeight: 88, alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 4 },
  line: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: explore.line },
  label: { color: groups.pine, fontSize: 12.5, fontFamily: fonts.uiMedium },
});
