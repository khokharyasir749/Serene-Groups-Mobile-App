import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, groups, letter, spacing } from "@/core/constants/theme";

type Props = { eyebrow?: string; title?: string; soft?: string; dark?: boolean };

/** Editorial section heading: gold dot eyebrow, Cormorant display title, soft forest second line. */
export function SectionHeader({ eyebrow, title, soft, dark }: Props) {
  return (
    <View style={styles.wrap}>
      {eyebrow ? (
        <View style={styles.eyebrowRow}>
          <View style={styles.rule} />
          <Text style={[styles.eyebrow, { color: dark ? colors.gold : colors.goldText }]}>{eyebrow.toUpperCase()}</Text>
        </View>
      ) : null}
      {title ? (
        <Text style={[styles.title, { color: dark ? colors.onNight : colors.ink }]}>
          {title}
          {soft ? <Text style={[styles.soft, { color: dark ? groups.champagne : groups.goldInk }]}>{`\n${soft}`}</Text> : null}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  rule: { width: 22, height: 1.5, backgroundColor: groups.champagne },
  soft: { fontFamily: fonts.displayItalic },
  eyebrow: { fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: 2 },
  title: { fontSize: font.display, fontFamily: fonts.display, letterSpacing: letter.display, lineHeight: 46, includeFontPadding: false },
});
