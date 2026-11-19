import type { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { SereneLogoMark } from "./SereneLogoMark";

type Props = { title: string; onBack?: () => void; action?: ReactNode };

/** Frameless top bar shared by every screen, identical in structure to the Explore bar: crest (or back) circle · serif title · right action. */
export function FloatingHeader({ title, onBack, action }: Props) {
  return (
    <View style={styles.bar}>
      <Pressable onPress={onBack} disabled={!onBack} hitSlop={8} style={[styles.mark, onBack && styles.back]} accessibilityLabel={onBack ? "Go back" : "Serene Group"}>
        {onBack ? <Ionicons name="chevron-back" size={20} color={colors.ink} /> : <SereneLogoMark width={19} fill={colors.snow} snow={colors.pineBrand} />}
      </Pressable>
      <View style={styles.titles}>
        <Text style={styles.eyebrow} numberOfLines={1}>
          SERENE GROUP
        </Text>
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}

/** White pill used for header actions ("Staff", "Logout", "+ Book"), matching Explore's Concierge pill. */
export function HeaderAction({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cta, pressed && styles.pressed]} accessibilityRole="button">
      <Text style={styles.ctaText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.md, backgroundColor: colors.paper },
  mark: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pineBrand, alignItems: "center", justifyContent: "center" },
  back: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadows.card },
  titles: { flex: 1, justifyContent: "center" },
  eyebrow: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 2 },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 21, lineHeight: 24, letterSpacing: 0.6 },
  cta: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 14, height: 40, justifyContent: "center", ...shadows.card },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  ctaText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
});
