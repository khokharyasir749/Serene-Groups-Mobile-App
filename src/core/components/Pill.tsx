import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, fonts, radius, shadows, spacing, toneColors, type Tone, groups } from "@/core/constants/theme";

type Props = {
  label: string;
  tone?: Tone;
  /** Makes the pill a toggle chip (filters / selectors). */
  selected?: boolean;
  onPress?: () => void;
  showCheck?: boolean;
};

export function Pill({ label, tone = "neutral", selected, onPress, showCheck }: Props) {
  const t = toneColors[tone];
  if (onPress === undefined) {
    return <Text style={[styles.pill, { backgroundColor: t.bg, color: t.fg }]}>{label}</Text>;
  }

  const withCheck = showCheck !== undefined ? showCheck : true;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        selected ? styles.chipOn : styles.chipOff,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.chipText, selected ? styles.textOn : styles.textOff]} numberOfLines={1}>
        {label}
      </Text>

      {withCheck ? (
        selected ? (
          <View style={styles.radioOn}>
            <Ionicons name="checkmark" size={11} color={colors.white} />
          </View>
        ) : (
          <View style={styles.radioOff} />
        )
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.pill,
    overflow: "hidden",
    fontSize: font.xs,
    fontFamily: fonts.uiBold,
  },
  chip: {
    minHeight: 46,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  chipOn: {
    backgroundColor: groups.plate,
    borderWidth: 1.5,
    borderColor: colors.pineBrand,
    ...shadows.card,
  },
  chipOff: {
    backgroundColor: colors.cardUnselected,
    borderWidth: 1,
    borderColor: groups.plateEdge,
  },
  chipText: {
    fontSize: font.sm,
    fontFamily: fonts.uiSemi,
  },
  textOn: {
    color: colors.ink,
    fontFamily: fonts.uiBold,
  },
  textOff: {
    color: colors.muted,
  },
  radioOn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: groups.pine,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOff: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
});
