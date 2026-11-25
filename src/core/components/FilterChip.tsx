import { Pressable, StyleSheet } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, radius, spacing, groups } from "@/core/constants/theme";

type Props = { label: string; selected?: boolean; onPress: () => void };

/** Slim, high-density filter chip: Pine fill when active, hairline outline otherwise. No radio circles. */
export function FilterChip({ label, selected, onPress }: Props) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={({ pressed }) => [styles.chip, selected && styles.on, pressed && styles.pressed]}>
      <Text style={[styles.text, selected && styles.textOn]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 34, paddingHorizontal: spacing.md + 2, borderRadius: radius.pill, backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge, alignItems: "center", justifyContent: "center" },
  on: { backgroundColor: groups.pine, borderColor: colors.pineBrand },
  pressed: { opacity: 0.9 },
  text: { color: colors.ink2, fontSize: font.sm, fontFamily: fonts.uiSemi },
  textOn: { color: colors.white },
});
