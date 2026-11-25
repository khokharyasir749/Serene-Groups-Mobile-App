import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import type { ImageSource } from "expo-image";
import { QuickRow } from "@/core/components/QuickRow";
import { Text } from "@/core/components/Text";
import { PLAN_RULES } from "@/core/constants/serene";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { HeroActions, HeroTitle, PageHero } from "@/features/home/components/PageHero";
import { useScrollTo } from "@/features/home/components/scrollTarget";

const JOIN = "Hello Serene Heights, I'd like to become a Serene investor. Please tell me how to get started.";
const PHOTO = require("../../../../assets/media/lhr-aerial.jpg") as ImageSource;
const signIn = () => router.push("/login");
const staff = () => router.push({ pathname: "/login", params: { next: "/staff/ledger" } });
const TERMS = [
  { value: `${PLAN_RULES.downPercent}%`, label: "down, to begin" },
  { value: String(PLAN_RULES.months), label: "monthly instalments after that" },
  { value: "28", label: "free nights a year for Nathia Gali owners" },
  { value: "4", label: "profit shares a year for Smart Property owners" },
];

export function InvestorGateHero({ height }: { height: number }) {
  return (
    <PageHero height={height} image={PHOTO} focus="42%">
      <HeroTitle title="Your investment," soft="in one place." lede="Own part of a working hotel, managed for you by the team that builds it." />
      <HeroActions primary={{ label: "Investor sign in", onPress: signIn }} secondary={{ label: "Join", icon: "logo-whatsapp", onPress: () => void openWhatsApp(JOIN) }} />
    </PageHero>
  );
}

/** Serene Investors for visitors who aren't signed in as an investor. Sign-in is required to see a portfolio. */
export function InvestorGate({ signedInAsOther }: { signedInAsOther?: boolean }) {
  const toReasons = useScrollTo("reasons");
  return (
    <View style={styles.wrap}>
      <QuickRow
        tiles={[
          { label: "Calculator", icon: "calculator", go: () => router.push("/calculator") },
          { label: "Reasons", icon: "shield-check", go: toReasons },
          { label: "Staff", icon: "badge-account", go: staff },
          { label: "Ask us", icon: "whatsapp", go: () => void openWhatsApp(JOIN) },
        ]}
      />
      {signedInAsOther ? (
        <View style={styles.note}>
          <Text style={styles.noteTitle}>You are signed in as a guest</Text>
          <Text style={styles.noteText}>The portfolio is for registered investors. Sign in with your investor account to open it.</Text>
        </View>
      ) : null}
      <View>
        {TERMS.map((t) => (
          <View key={t.label} style={styles.term}>
            <Text style={styles.termValue} maxFontSizeMultiplier={1.1}>
              {t.value}
            </Text>
            <Text style={styles.termLabel}>{t.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xxl },
  note: { marginHorizontal: -spacing.sm, borderRadius: 28, backgroundColor: explore.sheet, padding: spacing.lg, gap: 4 },
  noteTitle: { color: groups.pine, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  noteText: { color: colors.textMuted, fontSize: font.md, lineHeight: 22 },
  term: { flexDirection: "row", alignItems: "center", gap: spacing.lg, minHeight: 88, borderTopWidth: 1, borderTopColor: explore.line },
  termValue: { width: 112, color: groups.pine, fontFamily: fonts.display, fontSize: 58, lineHeight: 62, letterSpacing: -1.4, fontVariant: ["lining-nums"] },
  termLabel: { flex: 1, color: colors.ink2, fontSize: font.md + 1, lineHeight: 23 },
});
