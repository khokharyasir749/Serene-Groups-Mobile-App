import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { CONTACT, GROUP, PROJECTS, WEB } from "@/core/constants/serene";
import { colors, dark, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useScrollTo } from "./scrollTarget";

const OFFICE_MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.office)}`;

const SOCIAL_ICON: Record<string, keyof typeof Feather.glyphMap> = {
  Instagram: "instagram",
  Facebook: "facebook",
  LinkedIn: "linkedin",
  YouTube: "youtube",
};

function Row({ icon, label, value, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} accessibilityRole="link">
      <View style={styles.rowIcon}>
        <Feather name={icon} size={16} color={colors.pineBrand} />
      </View>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <Feather name="chevron-right" size={16} color={colors.muted} />
    </Pressable>
  );
}

/** Finale ("Rise above the ordinary") on Pine, then a clean white contact card with icon rows and social pills. */
export function GroupFooter() {
  const toTop = useScrollTo("top");
  return (
    <View style={styles.wrap}>
      <Card variant="emerald" style={[styles.finale, styles.finaleGold]}>
        <View style={styles.crestFrame}>
          <SereneLogoMark width={30} fill={colors.snow} snow={colors.pineBrand} />
        </View>
        <View style={styles.eyebrowRow}>
          <View style={styles.eyebrowRule} />
          <Text style={styles.eyebrow}>PRIVATE CONCIERGE</Text>
        </View>
        <Text style={styles.title}>{`${WEB.finale.title}\n${WEB.finale.soft}`}</Text>
        <Text style={styles.p}>{WEB.finale.p}</Text>
        <View style={styles.actions}>
          <Button variant="light" showBadge label="Chat on WhatsApp" onPress={() => void openWhatsApp()} />
          <Button variant="goldLine" icon="phone" label={`Call ${CONTACT.uan}`} onPress={() => void Linking.openURL(CONTACT.uanHref)} />
        </View>
      </Card>

      <Card style={styles.contact}>
        <Text style={styles.contactEyebrow}>REACH US</Text>
        <Row icon="phone" label="UAN" value={CONTACT.uan} onPress={() => void Linking.openURL(CONTACT.uanHref)} />
        <Row icon="message-circle" label="WhatsApp" value={CONTACT.whatsapp} onPress={() => void openWhatsApp()} />
        <Text style={[styles.contactEyebrow, styles.groupEyebrow]}>VISIT</Text>
        <Row icon="map-pin" label="Head office · Office Map" value={CONTACT.office} onPress={() => void Linking.openURL(OFFICE_MAP)} />
        <Text style={[styles.contactEyebrow, styles.groupEyebrow]}>WRITE</Text>
        {PROJECTS.map((p) => (
          <Row key={p.email} icon="mail" label={`Serene ${p.name}`} value={p.email} onPress={() => void Linking.openURL(`mailto:${p.email}`)} />
        ))}

        <Text style={[styles.contactEyebrow, styles.followEyebrow]}>FOLLOW</Text>
        <View style={styles.social}>
          {CONTACT.social.map((s) => (
            <Pressable key={s.label} onPress={() => void Linking.openURL(s.href)} style={({ pressed }) => [styles.pill, pressed && styles.rowPressed]} accessibilityRole="link">
              <Feather name={SOCIAL_ICON[s.label] ?? "link"} size={16} color={colors.pineBrand} />
              <Text style={styles.pillText}>{s.label}</Text>
            </Pressable>
          ))}
        </View>
      </Card>

      <Text style={styles.small}>{`© ${new Date().getFullYear()} ${GROUP.name} · ${GROUP.developer} · since ${GROUP.founded}`}</Text>
      <Pressable onPress={toTop} style={styles.top} accessibilityRole="button">
        <Feather name="arrow-up" size={14} color={colors.ink} />
        <Text style={styles.topText}>Back to top</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  finale: { padding: spacing.xl, gap: spacing.md, alignItems: "flex-start" },
  finaleGold: { borderColor: colors.goldAccent, borderWidth: 1.5 },
  crestFrame: { width: 56, height: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.goldAccent, backgroundColor: colors.white16, alignItems: "center", justifyContent: "center" },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  eyebrowRule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  groupEyebrow: { marginTop: spacing.md, marginBottom: 0 },
  eyebrow: { color: colors.goldAccent, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow, marginTop: spacing.xs },
  title: { color: dark.text, fontFamily: fonts.display, fontSize: 40, lineHeight: 42, letterSpacing: -0.5 },
  p: { color: dark.muted, fontSize: font.md - 1, lineHeight: 22 },
  actions: { alignSelf: "stretch", gap: spacing.sm, marginTop: spacing.sm },
  contact: { padding: spacing.lg, gap: 2 },
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
