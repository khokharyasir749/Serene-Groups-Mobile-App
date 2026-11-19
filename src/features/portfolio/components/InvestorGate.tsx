import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { SectionHeader } from "@/core/components/SectionHeader";
import { WEB } from "@/core/constants/serene";
import { InvestorReasons } from "@/features/payments/components/InvestorReasons";
import { colors, dark, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";

/** Serene Investors entry for visitors who aren't signed in as an investor. Sign-in is required here, up front. */
export function InvestorGate({ signedInAsOther }: { signedInAsOther?: boolean }) {
  return (
    <View style={styles.stack}>
      <SectionHeader eyebrow={WEB.investors.eyebrow} title="Your investment," soft="in one place." />
      <Text style={styles.p}>{WEB.investors.p}</Text>

      <Card variant="emerald" style={styles.card}>
        <Text style={styles.eyebrow}>INVESTOR PORTAL</Text>
        <Text style={styles.title}>Sign in to see your portfolio.</Text>
        <Text style={styles.cardP}>
          {signedInAsOther
            ? "You're signed in with a guest account. The portfolio is for registered investors — sign in with your investor account."
            : "Your holdings, instalment schedule and receipts are private to you."}
        </Text>
        <Button variant="light" label="Sign in" onPress={() => router.push("/login")} />
        <Button variant="onDark" icon="logo-whatsapp" label="Become an investor" onPress={() => void openWhatsApp("Hello Serene Heights, I'd like to become a Serene investor. Please tell me how to get started.")} />
      </Card>

      <Button variant="secondary" label="Try the plan calculator" onPress={() => router.push("/calculator")} />

      <Text style={styles.staff} onPress={() => router.push({ pathname: "/login", params: { next: "/staff/ledger" } })}>
        Serene staff? Sign in to the ledger
      </Text>

      <InvestorReasons />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xl },
  p: { color: colors.muted, fontSize: font.md, lineHeight: 24, marginTop: -spacing.sm },
  staff: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi, textDecorationLine: "underline", textAlign: "center" },
  card: { padding: spacing.xl, gap: spacing.md, borderWidth: 1, borderColor: colors.lineNight, ...shadows.cardElevated },
  eyebrow: { color: dark.muted, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: dark.text, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  cardP: { color: dark.muted, fontSize: font.sm, lineHeight: 20 },
});
