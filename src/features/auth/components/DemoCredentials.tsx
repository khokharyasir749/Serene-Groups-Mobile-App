import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";

const DEMOS = [
  { role: "Admin", email: "admin@serene.local", icon: "shield-checkmark-outline" },
  { role: "Staff", email: "viewer@serene.local", icon: "briefcase-outline" },
  { role: "Investor", email: "investor@serene.local", icon: "trending-up" },
] as const;

/** Mock-mode only: a gold-edged toggle that expands into one-tap role cards. */
export function DemoCredentials({ onPick }: { onPick: (email: string) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => setOpen((v) => !v)} style={styles.toggle} accessibilityRole="button" accessibilityState={{ expanded: open }}>
        <Ionicons name="key-outline" size={13} color={colors.goldAccent} />
        <Text style={styles.toggleText}>Demo Credentials</Text>
        <Ionicons name={open ? "chevron-up" : "chevron-down"} size={14} color={colors.muted} />
      </Pressable>
      {open ? (
        <>
          <View style={styles.roles}>
            {DEMOS.map((d) => (
              <Pressable key={d.role} onPress={() => onPick(d.email)} style={({ pressed }) => [styles.role, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Fill ${d.role} demo login`}>
                <View style={styles.icon}>
                  <Ionicons name={d.icon} size={16} color={colors.pineBrand} />
                </View>
                <Text style={styles.name}>{d.role}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.hint}>Tap a role to fill it in · any password works in demo mode</Text>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: spacing.sm },
  toggle: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.md + 2, paddingVertical: spacing.sm, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.goldAccent, backgroundColor: colors.white },
  toggleText: { color: colors.ink, fontSize: font.xs + 1, fontFamily: fonts.uiSemi },
  roles: { flexDirection: "row", gap: spacing.sm, alignSelf: "stretch" },
  role: { flex: 1, alignItems: "center", gap: 6, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.lg, paddingVertical: spacing.md, ...shadows.card },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  icon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.cardUnselected, alignItems: "center", justifyContent: "center" },
  name: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold },
  hint: { color: colors.muted, fontSize: font.xs, textAlign: "center" },
});
