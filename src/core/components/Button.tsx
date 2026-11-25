import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, groups, radius, shadows, spacing } from "@/core/constants/theme";

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
  icon?: keyof typeof Ionicons.glyphMap;
  /** Glyph inside the gold badge (default "→"). */
  arrow?: string;
  /** Fixed pill height (and min-height), so side-by-side buttons match exactly. */
  height?: number;
  /** Corner radius override for a rounded-square button (the gold badge follows). */
  corner?: number;
};

export function Button({ label, onPress, variant = "primary", loading, disabled, showBadge, compact, icon, arrow = "→", height, corner }: Props) {
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
        isPillCta && !displayBadge && styles.centered,
        variant === "danger" && styles.danger,
        height !== undefined && { height, minHeight: height },
        corner !== undefined && { borderRadius: corner },
        off && styles.off,
        pressed && styles.pressed,
      ]}
    >
      {loading && !displayBadge ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={18} color={variant === "goldLine" ? colors.goldAccent : fg} style={styles.icon} /> : null}
          <Text style={[styles.label, { color: fg }, isPillCta && styles.ctaLabel, compact && styles.compactLabel]} numberOfLines={1}>
          {label}
          </Text>
        </>
      )}

      {displayBadge ? (
        <View style={[styles.goldBadge, compact && styles.compactBadge, corner !== undefined && { borderRadius: corner - 6 }]}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.pineBrand} />
          ) : (
            (arrow === "→" ? <Ionicons name="arrow-forward" size={18} color={groups.pine} /> : <Text style={styles.arrowText}>{arrow}</Text>)
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
    backgroundColor: groups.pine,
    borderColor: groups.pineEdge,
    paddingLeft: spacing.xl,
    paddingRight: spacing.sm,
    justifyContent: "space-between",
    ...shadows.cta,
  },
  primaryCompact: { minHeight: 46, paddingLeft: spacing.md + 2, paddingRight: 5 },
  compactLabel: { fontSize: 14 },
  compactBadge: { width: 34, height: 34, borderRadius: 17, marginLeft: spacing.sm },
  secondary: {
    backgroundColor: groups.plate,
    borderColor: groups.plateEdge,
    ...shadows.card,
  },
  light: {
    backgroundColor: groups.plate,
    borderColor: groups.plateEdge,
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
  centered: { justifyContent: "center", paddingLeft: spacing.md, paddingRight: spacing.md },
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
    backgroundColor: groups.champagne,
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
