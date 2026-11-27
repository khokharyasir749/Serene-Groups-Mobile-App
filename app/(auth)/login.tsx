import { useEffect, useRef } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View, type ScrollViewInstance } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, font, fonts, groups, spacing } from "@/core/constants/theme";
import { MeshBackground } from "@/core/components/MeshBackground";
import { LoginHero } from "@/features/auth/components/LoginHero";
import { SignInPanel } from "@/features/auth/components/SignInPanel";

// Staff and investor sign-in. Guests never come here: they verify by mobile code when they reserve.
export default function LoginScreen() {
  const scrollRef = useRef<ScrollViewInstance>(null);

  // Keep the fields and the Sign in button above the keyboard.
  useEffect(() => {
    const sub = Keyboard.addListener("keyboardDidShow", () => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80));
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <MeshBackground />
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <LoginHero />
          <View style={styles.form}>
            <SignInPanel />
            <Pressable onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))} style={styles.back} accessibilityRole="button" hitSlop={8}>
              <Ionicons name="arrow-back-outline" size={14} color={colors.ink} />
              <Text style={styles.backText}>Back to Explore</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: groups.base },
  flex: { flex: 1 },
  content: { paddingBottom: spacing.xxl },
  form: { paddingHorizontal: spacing.lg, gap: spacing.lg, marginTop: -spacing.lg },
  back: { alignSelf: "center", flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: spacing.xs },
  backText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
});
