import { Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colors, groups } from "@/core/constants/theme";

export const BIOMETRIC_BUTTON_SIZE = 56;

/** Square fingerprint button that sits beside Sign in. Unlocks the remembered account after a device biometric check. */
export function BiometricButton({ email, loading, onPress }: { email: string; loading?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} disabled={loading} style={({ pressed }) => [styles.btn, (pressed || loading) && styles.pressed]} accessibilityRole="button" accessibilityLabel={`Sign in with fingerprint as ${email}`}>
      <Ionicons name="finger-print-outline" size={26} color={colors.pineBrand} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { width: BIOMETRIC_BUTTON_SIZE, height: BIOMETRIC_BUTTON_SIZE, borderRadius: 18, backgroundColor: groups.plate, borderWidth: 1.5, borderColor: colors.pineBrand, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.85 },
});
