import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, fonts, groups, radius } from "@/core/constants/theme";

type Props = { label: string; gold?: boolean; style?: StyleProp<ViewStyle> };

/** Translucent dark-glass pill for anything laid over a photograph: soft green tint, hairline light border, white or gold text. */
export function GlassPill({ label, gold, style }: Props) {
  return (
    <View style={[styles.pill, style]}>
      <Text style={[styles.text, gold && styles.gold]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: "flex-start", backgroundColor: groups.badge, borderWidth: 1, borderColor: groups.badgeEdge, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  text: { color: colors.white, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 0.6 },
  gold: { color: groups.champagne },
});
