import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLogoutMutation } from "@/core/api/endpoints/authApi";
import { P } from "@/core/constants/api";
import { colors, font, fonts, radius, spacing, groups } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";
import { useBiometric } from "../hooks/useBiometric";

type Path = "/bookings" | "/payments";
type Row = { label: string; hint: string; path: Path; icon: keyof typeof Ionicons.glyphMap };

/** Role shortcuts, fingerprint status and sign-out, under the profile card. */
export function AccountPanel({ onDone }: { onDone?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const { has } = usePermissions();
  const [logout] = useLogoutMutation();
  const bio = useBiometric();

  const rows: Row[] = [];
  if (has(P.PORTFOLIO_READ) && !has(P.PAYMENTS_READ)) rows.push({ label: "My Portfolio", hint: "Holdings, instalments and receipts", path: "/payments", icon: "pie-chart-outline" });
  if (has(P.MY_STAYS) && !has(P.BOOKINGS_READ)) rows.push({ label: "My Stays", hint: "Your reservations", path: "/bookings", icon: "bed-outline" });
  const remembered = bio.account !== null && bio.account.email === user?.email;

  return (
    <View style={styles.wrap}>
      {rows.map((r) => (
        <Pressable key={r.label} onPress={() => {
            onDone?.();
            router.navigate(r.path);
          }} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
          <View style={styles.icon}>
            <Ionicons name={r.icon} size={20} color={colors.white} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.rowTitle}>{r.label}</Text>
            <Text style={styles.rowHint}>{r.hint}</Text>
          </View>
          <Ionicons name="arrow-forward-outline" size={18} color={colors.ink} />
        </Pressable>
      ))}

      {bio.available ? (
        <View style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name="finger-print-outline" size={22} color={colors.white} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.rowTitle}>Fingerprint sign-in</Text>
            <Text style={styles.rowHint}>{remembered ? "On for this device" : "Enable it when you next sign in with your password"}</Text>
          </View>
          {remembered ? (
            <Pressable onPress={() => void bio.forget()} style={styles.off} accessibilityRole="button">
              <Text style={styles.offText}>Turn off</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      <Pressable onPress={() => {
          onDone?.();
          void logout();
        }} style={({ pressed }) => [styles.signout, pressed && styles.pressed]} accessibilityRole="button">
        <Ionicons name="log-out-outline" size={18} color={colors.danger} />
        <Text style={styles.signoutText}>Sign out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: groups.plate, borderRadius: 22, borderWidth: 1.2, borderColor: groups.plateEdge, padding: 14 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  icon: { width: 44, height: 44, borderRadius: 15, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1, gap: 2 },
  rowTitle: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  rowHint: { color: colors.muted, fontSize: font.sm },
  off: { borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  offText: { color: colors.pineBrand, fontSize: font.xs + 1, fontFamily: fonts.uiBold },
  signout: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 54, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.danger, backgroundColor: groups.plate },
  signoutText: { color: colors.danger, fontSize: font.md, fontFamily: fonts.uiBold },
});
