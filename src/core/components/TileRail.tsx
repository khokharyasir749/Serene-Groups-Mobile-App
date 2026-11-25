import { ScrollView, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "@/core/components/Text";
import { fonts, groups, spacing } from "@/core/constants/theme";
import { PressScale } from "./PressScale";

export type Tile = { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; go: () => void };

/** Numbered ways into a page, in one scrolling row. */
export function TileRail({ tiles }: { tiles: Tile[] }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.row}>
      {tiles.map((t, i) => (
        <PressScale key={t.label} onPress={t.go} accessibilityLabel={t.label} style={styles.item}>
          <View style={styles.tile}>
            <Text style={styles.num}>{`0${i + 1}`}</Text>
            <MaterialCommunityIcons name={t.icon} size={29} color={groups.pine} />
          </View>
          <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.1}>
            {t.label}
          </Text>
        </PressScale>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  row: { paddingHorizontal: spacing.lg, paddingVertical: 6, gap: 10 },
  item: { alignItems: "center", gap: 7, minWidth: 64 },
  tile: { width: 64, height: 62, borderRadius: 20, backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, alignItems: "center", justifyContent: "center", paddingTop: 6, boxShadow: groups.plateShadow },
  num: { position: "absolute", top: 5, left: 9, color: groups.pine, fontSize: 9, fontFamily: fonts.uiMedium },
  label: { color: groups.pine, fontSize: 12.5, fontFamily: fonts.uiMedium },
});
