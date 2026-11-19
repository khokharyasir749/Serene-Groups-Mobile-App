import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { SUPER_APP } from "@/core/constants/serene";
import { colors, font, fonts, radius, shadows, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { ProfileSheet } from "./ProfileSheet";

/** Clean alabaster top bar: Pine crest + SERENE GROUP wordmark, Concierge pill and a profile / sign-in button. */
export function ExploreTopBar() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  const [menu, setMenu] = useState(false);

  return (
    <View style={styles.row}>
      <View style={styles.crest}>
        <SereneLogoMark width={22} fill={colors.snow} snow={colors.pineBrand} />
      </View>
      <Text style={styles.brand} numberOfLines={1} adjustsFontSizeToFit>
        {SUPER_APP.wordmark}
      </Text>
      <Pressable onPress={() => void openWhatsApp()} style={({ pressed }) => [styles.pill, pressed && styles.pressed]} accessibilityRole="button">
        <Text style={styles.pillText}>Concierge</Text>
      </Pressable>
      <Pressable
        onPress={() => (authed ? setMenu(true) : router.push("/login"))}
        style={({ pressed }) => [styles.profile, authed && styles.profileOn, pressed && styles.pressed]}
        accessibilityLabel={authed ? "Account" : "Sign in"}
      >
        <Feather name="user" size={18} color={authed ? colors.snow : colors.pineBrand} />
      </Pressable>
      <ProfileSheet open={menu} onClose={() => setMenu(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  crest: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.pineBrand, alignItems: "center", justifyContent: "center" },
  brand: { flex: 1, color: colors.ink, fontFamily: fonts.display, fontSize: 21, letterSpacing: 2.5 },
  pill: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radius.pill, paddingHorizontal: 14, height: 40, justifyContent: "center", ...shadows.card },
  pressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  pillText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  profile: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center", ...shadows.card },
  profileOn: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand },
});
