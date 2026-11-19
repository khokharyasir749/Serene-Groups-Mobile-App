import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { SereneLogoMark } from "./SereneLogoMark";

type Props = { title: string; onBack?: () => void; action?: ReactNode };

/**
 * Shared screen header: crest badge and serif title on the left (pushed screens swap the crest for a back circle to leave room for long titles and actions), action pill on the right, hairline below.
 * The crest matches Explore's exactly (40px, gold ring); the SERENE GROUP eyebrow text is dropped so titles stay single-line.
 */
export function FloatingHeader({ title, onBack, action }: Props) {
  return (
    <View style={styles.bar}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8} style={styles.back} accessibilityLabel="Go back" accessibilityRole="button">
          <Ionicons name="arrow-back" size={20} color={colors.ink} />
        </Pressable>
      ) : null}
      {onBack ? null : (
        <View style={styles.crest}>
          <SereneLogoMark width={22} fill={colors.snow} snow={colors.pineBrand} />
        </View>
      )}
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
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 64, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.paper, borderBottomWidth: 1, borderBottomColor: colors.line },
  crest: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  back: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  title: { flex: 1, color: colors.ink, fontFamily: fonts.display, fontSize: 24, lineHeight: 28, letterSpacing: 0.3 },
  cta: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: radius.pill, paddingHorizontal: 14, height: 40, ...shadows.card },
  ctaPortal: { backgroundColor: colors.pineBrand, borderWidth: 1, borderColor: colors.goldAccent },
  ctaAccount: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.goldAccent },
  ctaTextPortal: { color: colors.white },
  ctaTextAccount: { color: colors.pineBrand },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  ctaText: { fontSize: font.sm, fontFamily: fonts.uiBold },
});
