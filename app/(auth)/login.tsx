import { useEffect, useRef } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { isMockMode } from "@/core/auth/session";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { useAuthStore } from "@/core/stores/authStore";
import { BIOMETRIC_BUTTON_SIZE, BiometricButton } from "@/features/auth/components/BiometricButton";
import { useLoginFlow } from "@/features/auth/hooks/useLoginFlow";
import { DemoCredentials } from "@/features/auth/components/DemoCredentials";
import { LoginHero } from "@/features/auth/components/LoginHero";

// Staff and investor sign-in. Guests never come here: they verify by mobile code when they reserve.
export default function LoginScreen() {
  const f = useLoginFlow();
  const reason = useAuthStore((s) => s.logoutReason);
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Keep the fields and the Sign in button above the keyboard.
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80));
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <LoginHero />
          <View style={styles.form}>
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
                <Input icon="person-outline" label="Email or ID" value={f.email} onChangeText={f.setEmail} keyboardType="email-address" autoComplete="email" />
                <Input icon="lock-closed-outline" label="Password" value={f.password} onChangeText={f.setPassword} secureTextEntry onSubmitEditing={f.submit} />
              </View>
              {f.error ? <Text style={styles.error}>{f.error}</Text> : null}
              <View style={styles.actionRow}>
                <View style={styles.flex}>
                  <Button label="Sign in" height={BIOMETRIC_BUTTON_SIZE} corner={18} onPress={f.submit} loading={f.isLoading} />
                </View>
                {f.bio.available && f.bio.account ? <BiometricButton email={f.bio.account.email} loading={f.isLoading} onPress={f.unlock} /> : null}
              </View>
            </View>

            {isMockMode ? (
              <DemoCredentials onPick={f.fill} />
            ) : null}

            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={styles.back} accessibilityRole="button" hitSlop={8}>
              <Ionicons name="arrow-back" size={14} color={colors.ink} />
              <Text style={styles.backText}>Back to Explore</Text>
            </Pressable>
            <Text style={styles.footText}>DM Consortium · Serene Heights Management · Authorized Access Only</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  flex: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  form: { paddingHorizontal: spacing.lg, gap: spacing.lg, marginTop: -spacing.lg },
  card: { backgroundColor: colors.white, borderRadius: 24, borderWidth: 1, borderColor: colors.line, padding: spacing.lg + 4, paddingTop: spacing.xl, gap: spacing.md, overflow: "hidden", ...shadows.cardElevated },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, backgroundColor: colors.goldAccent },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  eyebrow: { color: colors.goldText, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 38, lineHeight: 42 },
  lede: { color: colors.ink2, fontSize: font.sm + 1, lineHeight: 21 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  fields: { gap: spacing.md, marginTop: spacing.xs },
  banner: { color: colors.warning, backgroundColor: colors.warningSoft, padding: spacing.md, borderRadius: radius.md, fontSize: font.sm },
  error: { color: colors.danger, fontSize: font.sm },
  back: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: spacing.xs },
  backText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  footText: { color: colors.muted, fontSize: font.xs, textAlign: "center", lineHeight: 16 },
});
