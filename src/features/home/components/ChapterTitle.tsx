import { StyleSheet, type StyleProp, type TextStyle } from "react-native";
import { Text } from "@/core/components/Text";
import { explore, fonts, groups } from "@/core/constants/theme";

type Props = { title: string; soft: string; dark?: boolean; style?: StyleProp<TextStyle> };

/** One heading for every chapter of Explore: an upright line, then an italic one. */
export function ChapterTitle({ title, soft, dark, style }: Props) {
  return (
    <Text style={[styles.title, dark && styles.onDark, style]} accessibilityRole="header" maxFontSizeMultiplier={1.15}>
      {`${title}\n`}
      <Text style={[styles.soft, dark && styles.softOnDark]}>{soft}</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  title: { color: groups.pine, fontFamily: fonts.display, fontSize: 46, lineHeight: 47, letterSpacing: -1 },
  onDark: { color: explore.onDark },
  soft: { color: explore.goldDeep, fontFamily: fonts.displayItalic },
  softOnDark: { color: explore.gold },
});
