import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { isMockMode } from "@/core/auth/session";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { colors, font, fonts, letter, spacing } from "@/core/constants/theme";
import { useGuestAuth } from "../hooks/useGuestAuth";

/** Quick guest verification shown at the moment of reserving: name + mobile, then a one-time code. */
export function GuestAuthPanel({ onSignedIn }: { onSignedIn: () => void }) {
  const a = useGuestAuth(onSignedIn);
  return (
    <View style={styles.box}>
      <Text style={styles.eyebrow}>ONE QUICK STEP</Text>
      <Text style={styles.title}>Verify to reserve</Text>
      <Text style={styles.p}>Browsing is open to everyone. We only need to know who is booking.</Text>
      {a.step === "details" ? (
        <>
          <Input icon="user" label="Your name" value={a.name} onChangeText={a.setName} autoCapitalize="words" />
          <Input icon="phone" label="Mobile" value={a.phone} onChangeText={a.setPhone} keyboardType="phone-pad" placeholder="0300-1234567" />
          <Button label="Send code" onPress={() => void a.sendCode()} loading={a.busy} />
        </>
      ) : (
        <>
          <Input icon="key" label="6-digit code" value={a.code} onChangeText={a.setCode} keyboardType="number-pad" maxLength={6} hint={isMockMode ? "Mock mode: the code is 123456" : `Sent to ${a.phone}`} />
          <Button label="Verify & continue" onPress={() => void a.verify()} loading={a.busy} />
          <Text style={styles.link} onPress={a.back}>
            Use a different number
          </Text>
        </>
      )}
      {a.error ? <Text style={styles.error}>{a.error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { gap: spacing.md },
  eyebrow: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  p: { color: colors.muted, fontSize: font.sm, lineHeight: 20 },
  link: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi, textDecorationLine: "underline", textAlign: "center" },
  error: { color: colors.danger, fontSize: font.sm },
});
