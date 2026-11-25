import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { ActionTray } from "@/core/components/ActionTray";
import { PhotoBanner } from "@/core/components/PhotoBanner";
import { SectionHeader } from "@/core/components/SectionHeader";
import { StatGrid } from "@/core/components/StatGrid";
import { Text } from "@/core/components/Text";
import { TileRail } from "@/core/components/TileRail";
import { MEDIA } from "@/core/constants/media";
import { PLAN_RULES, WEB } from "@/core/constants/serene";
import { colors, font, fonts, groups, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useScrollTo } from "@/features/home/components/scrollTarget";

const JOIN = "Hello Serene Heights, I'd like to become a Serene investor. Please tell me how to get started.";
const signIn = () => router.push("/login");
const staff = () => router.push({ pathname: "/login", params: { next: "/staff/ledger" } });

/** Serene Investors for visitors who aren't signed in as an investor. Sign-in is required to see a portfolio. */
export function InvestorGate({ signedInAsOther }: { signedInAsOther?: boolean }) {
  const toReasons = useScrollTo("reasons");
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow={WEB.investors.eyebrow} title="Your investment," soft="in one place." />
      <TileRail
        tiles={[
          { label: "Sign in", icon: "account-key", go: signIn },
          { label: "Calculator", icon: "calculator", go: () => router.push("/calculator") },
          { label: "Reasons", icon: "shield-check", go: toReasons },
          { label: "Staff", icon: "badge-account", go: staff },
          { label: "Ask us", icon: "whatsapp", go: () => void openWhatsApp(JOIN) },
        ]}
      />
      <PhotoBanner image={MEDIA.nathiaGaliNight} tag="Nathia Gali" place="Smart Property" badge="Invest" title="Own from PKR 2M" kind="Hotel ownership" where="Managed in-house" />
      <ActionTray primary="Investor Sign In" onPrimary={signIn} secondary="Join" onSecondary={() => void openWhatsApp(JOIN)} />
      <StatGrid
        short
        stats={[
          { value: `${PLAN_RULES.downPercent}%`, label: "Down payment" },
          { value: String(PLAN_RULES.months), label: "Monthly instalments" },
          { value: "28", unit: " nights", label: "Free for owners, a year" },
          { value: "4", unit: " ×", label: "Profit share, a year" },
        ]}
      />
      <View style={styles.note}>
        <Text style={styles.noteTitle}>{signedInAsOther ? "You are signed in as a guest" : "Private to you"}</Text>
        <Text style={styles.noteText}>
          {signedInAsOther ? "The portfolio is for registered investors. Sign in with your investor account to open it." : "Holdings, instalments and receipts open once you sign in."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  note: { backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 24, padding: 18, gap: 4 },
  noteTitle: { color: groups.pine, fontSize: font.md, fontFamily: fonts.uiBold },
  noteText: { color: colors.ink2, fontSize: font.md - 1, lineHeight: 21 },
});
