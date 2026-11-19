import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { colors, dark, font, fonts, letter, radius, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";

const ENQUIRY = "Hello Serene Heights, I'd like to check availability for a stay at Serene Heights Nathia Gali.";

/** Focused property booking card: where, what, then two actions. Suite, dates and guests are chosen in the full-screen reservation. */
export function StayBooker() {
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <Card variant="emerald" style={styles.box}>
      <View style={styles.badge}>
        <SereneLogoMark width={16} fill={colors.goldAccent} snow={colors.pineBrand} />
        <Text style={styles.badgeText}>SERENE HEIGHTS · NATHIA GALI</Text>
      </View>
      <View style={styles.meta}>
        <Ionicons name="location-outline" size={13} color={colors.goldAccent} />
        <Text style={styles.metaText}>7,906 ft · Hotel Apartments & Suites</Text>
      </View>
      <Text style={styles.title}>Reserve Your Mountain Stay</Text>
      <Text style={styles.sub}>Instant availability across 5 curated apartment categories · No sign-in required</Text>
      <View style={styles.actions}>
        <Button variant="light" label="Reserve at Nathia Gali" showBadge onPress={() => openReserve({})} />
        <Button variant="onDark" icon="logo-whatsapp" label="Enquire on WhatsApp" onPress={() => void openWhatsApp(ENQUIRY)} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.xl, gap: spacing.sm },
  badge: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: colors.goldAccent, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  meta: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xs },
  metaText: { color: dark.muted, fontSize: font.sm, fontFamily: fonts.uiMedium },
  title: { color: dark.text, fontFamily: fonts.display, fontSize: 32, lineHeight: 34, marginTop: spacing.xs },
  sub: { color: dark.muted, fontSize: font.sm + 1, lineHeight: 20 },
  actions: { gap: spacing.md, marginTop: spacing.md },
});
