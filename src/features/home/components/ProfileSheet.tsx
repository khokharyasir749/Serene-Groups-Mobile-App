import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLogoutMutation } from "@/core/api/endpoints/authApi";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { P } from "@/core/constants/api";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";
import { useBiometric } from "@/features/auth/hooks/useBiometric";

type Props = { open: boolean; onClose: () => void };
type Path = "/bookings" | "/payments" | "/staff/bookings" | "/staff/ledger";
type Row = { label: string; hint: string; path: Path; icon: keyof typeof Ionicons.glyphMap };

/** Account & workspace: full-screen Alabaster page with the signed-in profile, role shortcuts, fingerprint status and sign-out. */
export function ProfileSheet({ open, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const user = useAuthStore((s) => s.user);
  const { has } = usePermissions();
  const [logout] = useLogoutMutation();
  const bio = useBiometric();
  const go = (path: Path) => {
    onClose();
    router.push(path);
  };

  const rows: Row[] = [];
  if (has(P.PORTFOLIO_READ) && !has(P.PAYMENTS_READ)) rows.push({ label: "My portfolio", hint: "Holdings, instalments and receipts", path: "/payments", icon: "pie-chart-outline" });
  if (has(P.MY_STAYS) && !has(P.BOOKINGS_READ)) rows.push({ label: "My stays", hint: "Your reservations", path: "/bookings", icon: "bed-outline" });
  if (has(P.BOOKINGS_READ)) rows.push({ label: "Staff · Bookings", hint: "All bookings, filters, new booking", path: "/staff/bookings", icon: "albums-outline" });
  if (has(P.PAYMENTS_READ)) rows.push({ label: "Staff · Ledger", hint: "Payments, instalments, receipts", path: "/staff/ledger", icon: "receipt-outline" });

  const remembered = bio.account !== null && bio.account.email === user?.email;

  return (
    <Modal visible={open} animationType="slide" onRequestClose={onClose} statusBarTranslucent presentationStyle="fullScreen" onShow={() => void bio.refresh()}>
      <View style={[styles.page, { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom }]}>
        <View style={styles.top}>
          <Text style={styles.topTitle}>Account & Workspace</Text>
          <Pressable onPress={onClose} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Close">
            <Ionicons name="close" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.profile}>
            <View style={styles.bar} />
            <View style={styles.crest}>
              <SereneLogoMark width={24} fill={colors.snow} snow={colors.pineBrand} />
            </View>
            <View style={styles.role}>
              <Text style={styles.roleText}>{(user?.role ?? "account").toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{user?.name ?? "Account"}</Text>
            {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
          </View>

          {rows.map((r) => (
            <Pressable key={r.label} onPress={() => go(r.path)} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
              <View style={styles.icon}>
                <Ionicons name={r.icon} size={20} color={colors.pineBrand} />
              </View>
              <View style={styles.flex}>
                <Text style={styles.rowTitle}>{r.label}</Text>
                <Text style={styles.rowHint}>{r.hint}</Text>
              </View>
              <Ionicons name="arrow-forward" size={18} color={colors.ink} />
            </Pressable>
          ))}

          {bio.available ? (
            <View style={styles.card}>
              <View style={styles.icon}>
                <Ionicons name="finger-print-outline" size={22} color={colors.pineBrand} />
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

          <Pressable
            onPress={() => {
              onClose();
              void logout();
            }}
            style={({ pressed }) => [styles.signout, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.signoutText}>Sign out</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  topTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 24 },
  close: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  profile: { backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.line, padding: spacing.xl, paddingTop: spacing.xl + 4, gap: spacing.sm, overflow: "hidden", ...shadows.cardElevated },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.goldAccent },
  crest: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  role: { alignSelf: "flex-start", backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  roleText: { color: colors.pineBrand, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  name: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  email: { color: colors.muted, fontSize: font.sm + 1 },
  card: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.md + 2, ...shadows.card },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  icon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.cardUnselected, alignItems: "center", justifyContent: "center" },
  flex: { flex: 1, gap: 2 },
  rowTitle: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  rowHint: { color: colors.muted, fontSize: font.sm },
  off: { borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  offText: { color: colors.pineBrand, fontSize: font.xs + 1, fontFamily: fonts.uiBold },
  signout: { marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 54, borderRadius: radius.pill, borderWidth: 1.5, borderColor: colors.danger, backgroundColor: colors.white },
  signoutText: { color: colors.danger, fontSize: font.md, fontFamily: fonts.uiBold },
});
