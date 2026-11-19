import { Modal, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { useLogoutMutation } from "@/core/api/endpoints/authApi";
import { P } from "@/core/constants/api";
import { colors, font, fonts, letter, radius, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { useAuthStore } from "@/core/stores/authStore";

type Props = { open: boolean; onClose: () => void };

/** Account menu: who is signed in, role-appropriate shortcuts (portfolio, stays, staff consoles) and sign-out. */
export function ProfileSheet({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const { has } = usePermissions();
  const [logout] = useLogoutMutation();
  const go = (path: "/bookings" | "/payments" | "/staff/bookings" | "/staff/ledger") => {
    onClose();
    router.push(path);
  };

  const rows: { label: string; hint: string; path: Parameters<typeof go>[0] }[] = [];
  if (has(P.PORTFOLIO_READ) && !has(P.PAYMENTS_READ)) rows.push({ label: "My portfolio", hint: "Holdings, instalments and receipts", path: "/payments" });
  if (has(P.MY_STAYS) && !has(P.BOOKINGS_READ)) rows.push({ label: "My stays", hint: "Your reservations", path: "/bookings" });
  if (has(P.BOOKINGS_READ)) rows.push({ label: "Staff · Bookings", hint: "All bookings, filters, new booking", path: "/staff/bookings" });
  if (has(P.PAYMENTS_READ)) rows.push({ label: "Staff · Ledger", hint: "Payments, instalments, receipts", path: "/staff/ledger" });

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.grab} />
        <Text style={styles.eyebrow}>{(user?.role ?? "account").toUpperCase()}</Text>
        <Text style={styles.name}>{user?.name ?? "Account"}</Text>
        {user?.email ? <Text style={styles.email}>{user.email}</Text> : null}
        {rows.map((r) => (
          <Pressable key={r.label} onPress={() => go(r.path)} style={styles.row}>
            <View style={styles.flex}>
              <Text style={styles.rowTitle}>{r.label}</Text>
              <Text style={styles.rowHint}>{r.hint}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => {
            onClose();
            void logout();
          }}
          style={styles.signout}
        >
          <Text style={styles.signoutText}>Sign out</Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: { backgroundColor: colors.paper, borderTopLeftRadius: radius.xl + 8, borderTopRightRadius: radius.xl + 8, padding: spacing.xl, paddingBottom: spacing.xxl * 2, gap: spacing.sm },
  grab: { alignSelf: "center", width: 40, height: 4, borderRadius: 2, backgroundColor: colors.lineStrong, marginBottom: spacing.md },
  eyebrow: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  name: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  email: { color: colors.muted, fontSize: font.sm, marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, gap: spacing.md },
  flex: { flex: 1 },
  rowTitle: { color: colors.ink, fontSize: font.lg, fontFamily: fonts.uiSemi },
  rowHint: { color: colors.muted, fontSize: font.sm },
  arrow: { color: colors.ink, fontSize: font.xl },
  signout: { marginTop: spacing.lg, borderWidth: 1, borderColor: colors.lineStrong, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: "center" },
  signoutText: { color: colors.danger, fontSize: font.md, fontFamily: fonts.uiSemi },
});
