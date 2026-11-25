import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { colors, font, fonts, letter, radius, shadows, spacing, groups } from "@/core/constants/theme";
import { useAuthStore } from "@/core/stores/authStore";
import { BIOMETRIC_BUTTON_SIZE, BiometricButton } from "./BiometricButton";
import { useLoginFlow } from "../hooks/useLoginFlow";

// Flat, recessed fields: tinted canvas, hairline border, no shadow.
const flatField = { backgroundColor: colors.paper, borderColor: groups.plateEdge, shadowOpacity: 0, elevation: 0 } as const;

/** Management & investor sign-in card: Sign in + fingerprint row on flat recessed fields. Rendered under the hero on /login. */
export function SignInPanel() {
  const f = useLoginFlow();
  const reason = useAuthStore((s) => s.logoutReason);
  return (
    <View style={styles.card}>
      <View style={styles.topBar} />
      <View style={styles.eyebrowRow}>
        <View style={styles.rule} />
        <Text style={styles.eyebrow}>MANAGEMENT & INVESTOR PORTAL</Text>
      </View>
      <Text style={styles.title}>Welcome back.</Text>
      <Text style={styles.lede}>Sign in with your assigned credentials to access portfolios, bookings, and ledger records.</Text>
      {reason ? <Text style={styles.banner}>{reason}</Text> : null}
      <View style={styles.fields}>
        <Input style={flatField} icon="person-outline" label="Email or ID" value={f.email} onChangeText={f.setEmail} keyboardType="email-address" autoComplete="email" />
        <Input style={flatField} icon="lock-closed-outline" label="Password" value={f.password} onChangeText={f.setPassword} secureTextEntry onSubmitEditing={f.submit} />
      </View>
      {f.error ? <Text style={styles.error}>{f.error}</Text> : null}
      <View style={styles.actionRow}>
        <View style={styles.flex}>
          <Button label="Sign in" height={BIOMETRIC_BUTTON_SIZE} corner={18} onPress={f.submit} loading={f.isLoading} />
        </View>
        {f.bio.available && f.bio.account ? <BiometricButton email={f.bio.account.email} loading={f.isLoading} onPress={f.unlock} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: { backgroundColor: groups.plate, borderRadius: 24, borderWidth: 1, borderColor: groups.plateEdge, padding: spacing.lg + 4, paddingTop: spacing.xl, gap: spacing.md, overflow: "hidden", ...shadows.card },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 2, backgroundColor: colors.goldAccent },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  eyebrow: { color: colors.goldText, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 38, lineHeight: 42 },
  lede: { color: colors.ink2, fontSize: font.sm + 1, lineHeight: 21 },
  fields: { gap: spacing.md, marginTop: spacing.xs },
  banner: { color: colors.warning, backgroundColor: colors.warningSoft, padding: spacing.md, borderRadius: radius.md, fontSize: font.sm },
  error: { color: colors.danger, fontSize: font.sm },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
});
