import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { useAuthStore } from "@/core/stores/authStore";
import { AccountPanel } from "@/features/auth/components/AccountPanel";

/**
 * The one account entry point in every top bar. Signed out: a Pine "Portal" pill with a gold hairline that opens /login.
 * Signed in: an ivory gold-ringed pill with the user's role that opens the full-screen Account & Workspace page.
 */
export function AccountButton({ compact }: { compact?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const authed = useAuthStore((s) => s.accessToken !== null);
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const role = (user?.role ?? "account").replace(/^./, (c) => c.toUpperCase());

  const press = () => (authed ? setOpen(true) : router.push("/login"));
  const glyph = authed ? "person-circle-outline" : "shield-checkmark-outline";

  return (
    <>
      <Pressable
        onPress={press}
        accessibilityRole="button"
        accessibilityLabel={authed ? "Account" : "Portal sign in"}
        style={({ pressed }) => [compact ? styles.circle : styles.pill, authed ? styles.on : styles.off, pressed && styles.pressed]}
      >
        <Ionicons name={glyph} size={compact ? 20 : 17} color={authed ? colors.pineBrand : colors.goldAccent} />
        {compact ? null : <Text style={[styles.label, authed ? styles.labelOn : styles.labelOff]}>{authed ? role : "Portal"}</Text>}
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)} statusBarTranslucent presentationStyle="fullScreen">
        <View style={[styles.page, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom }]}>
          <View style={styles.top}>
            <Text style={styles.topTitle}>Account & Workspace</Text>
            <Pressable onPress={() => setOpen(false)} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
              <Ionicons name="close-outline" size={22} color={colors.ink} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <AccountPanel onDone={() => setOpen(false)} />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: radius.pill, paddingHorizontal: 14, height: 40, ...shadows.card },
  circle: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", ...shadows.card },
  off: { backgroundColor: colors.pineBrand, borderWidth: 1, borderColor: colors.goldAccent },
  on: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.goldAccent },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  label: { fontSize: font.sm, fontFamily: fonts.uiBold },
  labelOff: { color: colors.white },
  labelOn: { color: colors.pineBrand },
  page: { flex: 1, backgroundColor: colors.paper },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  topTitle: { flex: 1, color: colors.ink, fontFamily: fonts.display, fontSize: 24 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
});
