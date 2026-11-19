import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { CONTACT } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";

type Props = { eyebrow: string; title: string; subtitle: string };

/** Editorial footer head on the Alabaster canvas: hairline, gold rule and crest, serif headline, and two short, never-truncating actions. */
export function EditorialConcierge({ eyebrow, title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.hairline} />
      <View style={styles.mark}>
        <View style={styles.rule} />
        <View style={styles.crest}>
          <SereneLogoMark width={22} fill={colors.snow} snow={colors.pineBrand} />
        </View>
        <View style={styles.rule} />
      </View>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.sub}>{subtitle}</Text>
      <View style={styles.row}>
        <Pressable onPress={() => void openWhatsApp()} style={({ pressed }) => [styles.pill, styles.pine, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="WhatsApp concierge">
          <Ionicons name="logo-whatsapp" size={17} color={colors.white} />
          <Text style={styles.pineText}>WhatsApp</Text>
        </Pressable>
        <Pressable onPress={() => void Linking.openURL(CONTACT.uanHref)} style={({ pressed }) => [styles.pill, styles.gold, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel="Call desk">
          <Ionicons name="call-outline" size={17} color={colors.pineBrand} />
          <Text style={styles.goldText}>Call Desk</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing.sm, paddingTop: spacing.md },
  hairline: { alignSelf: "stretch", height: 1, backgroundColor: colors.line, marginBottom: spacing.md },
  mark: { flexDirection: "row", alignItems: "center", gap: spacing.md, alignSelf: "stretch" },
  rule: { flex: 1, height: 1.5, backgroundColor: colors.goldAccent },
  crest: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  eyebrow: { color: colors.goldText, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow + 0.6, marginTop: spacing.sm },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 38, lineHeight: 42, textAlign: "center" },
  sub: { color: colors.ink2, fontSize: font.md - 1, lineHeight: 22, textAlign: "center", maxWidth: 320 },
  row: { flexDirection: "row", gap: spacing.sm, alignSelf: "stretch", marginTop: spacing.md },
  pill: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52, borderRadius: radius.pill },
  pine: { backgroundColor: colors.pineBrand },
  gold: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.goldAccent },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  pineText: { color: colors.white, fontSize: font.md, fontFamily: fonts.uiBold },
  goldText: { color: colors.pineBrand, fontSize: font.md, fontFamily: fonts.uiBold },
});
