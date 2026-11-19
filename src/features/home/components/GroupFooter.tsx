import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { EditorialConcierge } from "@/core/components/EditorialConcierge";
import { CONTACT, GROUP, PROJECTS, WEB } from "@/core/constants/serene";
import { colors, dark, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useScrollTo } from "./scrollTarget";

const OFFICE_MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.office)}`;

const SOCIAL_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Instagram: "logo-instagram",
  Facebook: "logo-facebook",
  LinkedIn: "logo-linkedin",
  YouTube: "logo-youtube",
};

function Row({ icon, label, value, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} accessibilityRole="link">
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={16} color={colors.pineBrand} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.muted} />
    </Pressable>
  );
}

/** Finale ("Rise above the ordinary") on Pine, then a clean white contact card with icon rows and social pills. */
export function GroupFooter() {
  const toTop = useScrollTo("top");
  return (
    <View style={styles.wrap}>
      <EditorialConcierge eyebrow="PRIVATE CONCIERGE" title="Beyond the ordinary." subtitle={WEB.finale.p} />

      <View style={styles.contact}>
        <Text style={styles.contactEyebrow}>REACH US</Text>
        <Row icon="call-outline" label="UAN" value={CONTACT.uan} onPress={() => void Linking.openURL(CONTACT.uanHref)} />
        <Row icon="logo-whatsapp" label="WhatsApp" value={CONTACT.whatsapp} onPress={() => void openWhatsApp()} />
        <Text style={[styles.contactEyebrow, styles.groupEyebrow]}>VISIT</Text>
        <Row icon="location-outline" label="Head office · Office Map" value={CONTACT.office} onPress={() => void Linking.openURL(OFFICE_MAP)} />
        <Text style={[styles.contactEyebrow, styles.groupEyebrow]}>WRITE</Text>
        {PROJECTS.map((p) => (
          <Row key={p.email} icon="mail-outline" label={`Serene ${p.name}`} value={p.email} onPress={() => void Linking.openURL(`mailto:${p.email}`)} />
        ))}

        <Text style={[styles.contactEyebrow, styles.followEyebrow]}>FOLLOW</Text>
        <View style={styles.social}>
          {CONTACT.social.map((s) => (
            <Pressable key={s.label} onPress={() => void Linking.openURL(s.href)} style={({ pressed }) => [styles.pill, pressed && styles.rowPressed]} accessibilityRole="link">
              <Ionicons name={SOCIAL_ICON[s.label] ?? "link-outline"} size={16} color={colors.pineBrand} />
              <Text style={styles.pillText}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <Text style={styles.small}>{`© ${new Date().getFullYear()} ${GROUP.name} · ${GROUP.developer} · since ${GROUP.founded}`}</Text>
      <Pressable onPress={toTop} style={styles.top} accessibilityRole="button">
        <Ionicons name="arrow-up" size={14} color={colors.ink} />
        <Text style={styles.topText}>Back to top</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  groupEyebrow: { marginTop: spacing.md, marginBottom: 0 },
  contact: { gap: 2 },
  contactEyebrow: { color: colors.muted, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow, marginBottom: spacing.xs },
  followEyebrow: { marginTop: spacing.lg },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md - 2, borderTopWidth: 1, borderTopColor: colors.line },
  rowPressed: { opacity: 0.85 },
  rowIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.cardUnselected, alignItems: "center", justifyContent: "center" },
  rowText: { flex: 1, gap: 1 },
  rowLabel: { color: colors.muted, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 1, textTransform: "uppercase" },
  rowValue: { color: colors.ink, fontSize: font.sm + 1, fontFamily: fonts.uiSemi, lineHeight: 19 },
  social: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  pill: { width: "48.6%", flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.cardUnselected, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md + 2 },
  pillText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold },
  small: { color: colors.muted, fontSize: font.xs, lineHeight: 16, textAlign: "center" },
  top: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, ...shadows.card },
  topText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold },
});
