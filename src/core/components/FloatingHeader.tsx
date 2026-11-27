import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, font, fonts, groups, shadows, spacing } from "@/core/constants/theme";
import { PlateButton } from "./PlateButton";

type Props = { title: string; onBack?: () => void; action?: ReactNode };

/** Pushed pages: back plate, serif title, optional action. The main tabs use BrandBar instead. */
export function FloatingHeader({ title, onBack, action }: Props) {
  return (
    <View style={styles.bar}>
      {onBack ? <PlateButton icon="arrow-back-outline" label="Go back" onPress={onBack} /> : null}
      <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </Text>
      {action}
    </View>
  );
}

type ActionProps = {
  label: string;
  onPress: () => void;
  /** portal = Pine pill with gold hairline (Staff / Portal / + Book); account = white pill with gold ring (Logout). */
  tone?: "portal" | "account";
  /** Overrides the tone's default icon. Pass `null` for a text-only pill. */
  icon?: keyof typeof Ionicons.glyphMap | null;
  /** Legacy flag: a text-only portal pill. */
  primary?: boolean;
};

/** Header action pill shared by every screen. */
export function HeaderAction({ label, onPress, tone = "portal", icon, primary }: ActionProps) {
  const account = tone === "account";
  const glyph = icon === null || primary ? null : icon ?? (account ? "log-out-outline" : "shield-checkmark-outline");
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cta, account ? styles.ctaAccount : styles.ctaPortal, pressed && styles.pressed]} accessibilityRole="button">
      {glyph ? <Ionicons name={glyph} size={16} color={account ? colors.pineBrand : colors.goldAccent} /> : null}
      <Text style={[styles.ctaText, account ? styles.ctaTextAccount : styles.ctaTextPortal]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 64, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.sm },
  title: { flex: 1, color: colors.ink, fontFamily: fonts.display, fontSize: 27, lineHeight: 33, letterSpacing: 0.2 },
  cta: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 15, paddingHorizontal: 15, height: 46, ...shadows.card },
  ctaPortal: { backgroundColor: groups.pine, borderWidth: 1, borderColor: groups.pineEdge },
  ctaAccount: { backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge },
  ctaTextPortal: { color: colors.white },
  ctaTextAccount: { color: colors.pineBrand },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  ctaText: { fontSize: font.sm, fontFamily: fonts.uiBold },
});
