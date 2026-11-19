import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, radius } from "@/core/constants/theme";

type Tab<T extends string> = { id: T; label: string };
type Props<T extends string> = { tabs: readonly Tab<T>[]; value: T; onChange: (id: T) => void };

/** Sleek segmented pill switcher: Pine fill with a Champagne dot on the active segment. */
export function SegmentedTabs<T extends string>({ tabs, value, onChange }: Props<T>) {
  return (
    <View style={styles.track}>
      {tabs.map((t) => {
        const on = t.id === value;
        return (
          <Pressable key={t.id} onPress={() => onChange(t.id)} style={[styles.seg, on && styles.segOn]} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            {on ? <View style={styles.dot} /> : null}
            <Text style={[styles.label, on && styles.labelOn]} numberOfLines={1}>
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flexDirection: "row", backgroundColor: colors.cardUnselected, borderRadius: radius.pill, padding: 4, borderWidth: 1, borderColor: colors.line },
  seg: { flex: 1, minHeight: 40, borderRadius: radius.pill, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 6 },
  segOn: { backgroundColor: colors.pineBrand },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.goldAccent },
  label: { color: colors.muted, fontSize: font.sm - 1, fontFamily: fonts.uiSemi },
  labelOn: { color: colors.white, fontFamily: fonts.uiBold },
});
