import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, fonts, spacing } from "@/core/constants/theme";
import { Enter } from "@/features/services/components/motion";
import { ServiceIcon } from "@/features/services/components/ServiceIcon";
import { Press, Surface } from "@/features/services/components/surface";
import { GROUPS } from "@/features/services/data/catalog";
import { openCategory } from "@/features/services/lib/nav";

/** The four groups, evenly across the page. */
export function CategoryRow() {
  return (
    <View style={styles.row}>
      {GROUPS.map((c, i) => (
        <Enter key={c.slug} order={i + 3} style={styles.cell}>
          <Press onPress={() => openCategory(c.slug)} style={styles.item} accessibilityLabel={c.label}>
            <Surface finish="glass" radius={22} style={styles.well}>
              <ServiceIcon name={c.icon} size={48} />
            </Surface>
            <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1}>
              {c.short}
            </Text>
          </Press>
        </Enter>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", paddingHorizontal: spacing.md },
  cell: { flex: 1 },
  item: { alignItems: "center", gap: spacing.sm },
  well: { width: 68, height: 68, alignItems: "center", justifyContent: "center" },
  label: { color: colors.ink, fontSize: 11.5, fontFamily: fonts.uiSemi },
});
