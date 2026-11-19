import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";

type Props = {
  label: string;
  onPress: () => void;
  /** primary = deep forest pill with gold arrow badge; secondary = ivory/stone card pill; light = white pill; danger = soft red pill */
  variant?: "primary" | "gold" | "light" | "ghost" | "onDark" | "goldLine" | "secondary" | "whatsapp" | "danger";
  loading?: boolean;
  disabled?: boolean;
  showBadge?: boolean;
  /** Smaller pill + badge for narrow (two-column) cards. */
  compact?: boolean;
  /** Optional leading icon (used by onDark outline buttons). */
  icon?: keyof typeof Feather.glyphMap;
  /** Glyph inside the gold badge (default "→"). */
  arrow?: string;
};

export function Button({ label, onPress, variant = "primary", loading, disabled, showBadge, compact, icon, arrow = "→" }: Props) {
  const off = disabled || loading;
  const isPillCta = variant === "primary" || variant === "gold" || variant === "whatsapp";
  const displayBadge = showBadge !== undefined ? showBadge : isPillCta;
  const fg = isPillCta || variant === "onDark" || variant === "goldLine" ? colors.white : variant === "danger" ? colors.danger : colors.ink;

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        isPillCta && styles.primaryCta,
        isPillCta && compact && styles.primaryCompact,
        variant === "secondary" && styles.secondary,
        variant === "light" && styles.light,
        variant === "ghost" && styles.ghost,
        variant === "onDark" && styles.onDark,
        variant === "goldLine" && styles.goldLine,
        displayBadge && !isPillCta && styles.withBadge,
        variant === "danger" && styles.danger,
        off && styles.off,
        pressed && styles.pressed,
      ]}
    >
      {loading && !displayBadge ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Feather name={icon} size={18} color={variant === "goldLine" ? colors.goldAccent : fg} style={styles.icon} /> : null}
          <Text style={[styles.label, { color: fg }, isPillCta && styles.ctaLabel, compact && styles.compactLabel]} numberOfLines={1}>
          {label}
          </Text>
        </>
      )}

      {displayBadge ? (
        <View style={[styles.goldBadge, compact && styles.compactBadge]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.pineBrand} />
          ) : (
            <Text style={styles.arrowText}>{arrow}</Text>
          )}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 54,
    borderRadius: radius.pill,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "transparent",
  },
  primaryCta: {
    backgroundColor: colors.pineBrand,
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    justifyContent: "space-between",
    ...shadows.cta,
  },
  primaryCompact: { minHeight: 46, paddingLeft: spacing.md + 2, paddingRight: 5 },
  compactLabel: { fontSize: 14 },
  compactBadge: { width: 34, height: 34, borderRadius: 17, marginLeft: spacing.sm },
  secondary: {
    backgroundColor: colors.card,
    borderColor: colors.line,
    ...shadows.card,
  },
  light: {
    backgroundColor: colors.white,
    borderColor: colors.line,
  },
  ghost: {
    backgroundColor: colors.white16,
    borderColor: colors.lineNight,
  },
  // Crisp outline for dark cards: clear white hairline, white label.
  onDark: {
    backgroundColor: "transparent",
    borderColor: colors.white,
    borderWidth: 1.5,
  },
  goldLine: { backgroundColor: "transparent", borderColor: colors.goldAccent, borderWidth: 1.5 },
  withBadge: { justifyContent: "space-between", paddingLeft: spacing.xl, paddingRight: spacing.sm },
  icon: { marginRight: spacing.sm },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
  },
  off: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontSize: font.md,
    fontFamily: fonts.uiSemi,
    letterSpacing: -0.2,
  },
  ctaLabel: {
    fontFamily: fonts.uiBold,
    fontSize: 16,
    color: colors.white,
    flexShrink: 1,
  },
  goldBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.goldAccent,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.md,
  },
  arrowText: {
    color: colors.pineBrand,
    fontSize: 18,
    fontFamily: fonts.uiBold,
    marginTop: -2,
  },
});
