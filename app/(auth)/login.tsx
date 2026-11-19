import { useEffect, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import { useLoginMutation } from "@/core/api/endpoints/authApi";
import { isMockMode } from "@/core/auth/session";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { parseError } from "@/core/lib/errorParser";
import { useAuthStore } from "@/core/stores/authStore";
import { LoginHero } from "@/features/auth/components/LoginHero";

const DEMOS = ["investor@serene.local", "admin@serene.local", "viewer@serene.local"];

// Staff and investor sign-in. Guests never come here: they verify by mobile code when they reserve.
export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [demo, setDemo] = useState(false);
  const reason = useAuthStore((s) => s.logoutReason);
  const [login, { isLoading }] = useLoginMutation();
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Keep the fields and the Sign in button above the keyboard.
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80));
    return () => sub.remove();
  }, []);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) return setError("Enter your email and password.");
    try {
      await login({ email: email.trim().toLowerCase(), password }).unwrap();
    } catch (e) {
      setError(parseError(e));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <LoginHero />
          <View style={styles.form}>
            <View style={styles.head}>
              <Text style={styles.title}>Welcome back.</Text>
              <Text style={styles.lede}>Investor and staff sign-in · Guests verify via mobile on reserve.</Text>
            </View>
            {reason ? <Text style={styles.banner}>{reason}</Text> : null}
            <View style={styles.fields}>
              <Input icon="user" label="Email or ID" value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
              <Input icon="lock" label="Password" value={password} onChangeText={setPassword} secureTextEntry onSubmitEditing={submit} />
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button label="Sign in" onPress={submit} loading={isLoading} />

            {isMockMode ? (
              <View style={styles.demoWrap}>
                <Pressable onPress={() => setDemo((v) => !v)} style={styles.demoToggle} accessibilityRole="button" accessibilityState={{ expanded: demo }}>
                  <Feather name="key" size={12} color={colors.pineBrand} />
                  <Text style={styles.demoText}>Demo credentials</Text>
                  <Feather name={demo ? "chevron-up" : "chevron-down"} size={14} color={colors.muted} />
                </Pressable>
                {demo ? (
                  <View style={styles.chips}>
                    {DEMOS.map((d) => (
                      <Pressable key={d} onPress={() => { setEmail(d); setPassword("demo"); setError(null); }} style={styles.chip}>
                        <Text style={styles.chipText}>{d}</Text>
                      </Pressable>
                    ))}
                    <Text style={styles.hint}>Tap to fill · any password works in demo mode</Text>
                  </View>
                ) : null}
              </View>
            ) : null}

            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={styles.back} accessibilityRole="button">
              <Feather name="arrow-left" size={14} color={colors.ink} />
              <Text style={styles.backText}>Back to Explore</Text>
            </Pressable>
            <Text style={styles.footText}>{`Authorized access only · © ${new Date().getFullYear()} Serene Heights Group`}</Text>
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
  form: { paddingHorizontal: spacing.lg, gap: spacing.lg, marginTop: -spacing.sm },
  head: { gap: spacing.sm },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 42, lineHeight: 46 },
  lede: { color: colors.ink2, fontSize: font.sm + 1, lineHeight: 21 },
  fields: { gap: spacing.md },
  banner: { color: colors.warning, backgroundColor: colors.warningSoft, padding: spacing.md, borderRadius: radius.md, fontSize: font.sm },
  error: { color: colors.danger, fontSize: font.sm },
  demoWrap: { alignItems: "center", gap: spacing.sm },
  demoToggle: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.md + 2, paddingVertical: spacing.sm, borderRadius: radius.pill, backgroundColor: colors.cardUnselected, borderWidth: 1, borderColor: colors.line },
  demoText: { color: colors.ink, fontSize: font.xs + 1, fontFamily: fonts.uiSemi },
  chips: { alignSelf: "stretch", gap: spacing.sm },
  chip: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingVertical: spacing.sm + 1, paddingHorizontal: spacing.md + 2, ...shadows.card },
  chipText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi, textAlign: "center" },
  hint: { color: colors.muted, fontSize: font.xs, textAlign: "center", letterSpacing: letter.eyebrow / 8 },
  back: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2, borderRadius: radius.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, ...shadows.card },
  backText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold },
  footText: { color: colors.muted, fontSize: font.xs, textAlign: "center" },
});
