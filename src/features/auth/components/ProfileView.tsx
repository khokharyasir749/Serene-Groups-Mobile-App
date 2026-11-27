import { StyleSheet, View } from "react-native";
import type { ImageSource } from "expo-image";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { MEDIA } from "@/core/constants/media";
import { P } from "@/core/constants/api";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { HeroActions, HeroTitle, PageHero } from "@/features/home/components/PageHero";
import { StaffTiles } from "@/features/payments/components/StaffTiles";
import { AccountPanel } from "./AccountPanel";

const NOTE = "Staying with us? You do not need an account. You verify by mobile code when you reserve.";
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c ?? "")).slice(0, 2).join("").toUpperCase() || "S";

type Row = { label: string; hint: string; icon: keyof typeof Ionicons.glyphMap; go: () => void };
const ROWS: Row[] = [
  { label: "Investor portfolio", hint: "Holdings, instalments and receipts", icon: "pie-chart-outline", go: () => router.navigate("/payments") },
  { label: "Reserve a stay", hint: "Apartments in Nathia Gali", icon: "bed-outline", go: () => router.navigate("/bookings") },
  { label: "Message us", hint: "WhatsApp, seven days a week", icon: "logo-whatsapp", go: () => void openWhatsApp() },
];

export function ProfileHero({ height }: { height: number }) {
  const user = useAuthStore((s) => s.user);
  const authed = useAuthStore((s) => s.accessToken !== null);
  if (!authed)
    return (
      <PageHero height={height} image={MEDIA.nathiaGaliSky as ImageSource} focus="62%">
        <HeroTitle title="Your account," soft="in one place." lede="For investors and the Serene team." />
        <HeroActions primary={{ label: "Sign in", onPress: () => router.push("/login") }} secondary={{ label: "Ask us", icon: "logo-whatsapp", onPress: () => void openWhatsApp() }} />
      </PageHero>
    );
  const name = user?.name ?? "Account";
  const role = user?.role ?? "account";
  return (
    <PageHero height={height} image={MEDIA.nathiaGaliSky as ImageSource} focus="62%">
      <View style={styles.who}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials(name)}</Text>
        </View>
        <View style={styles.fill}>
          <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit accessibilityRole="header">
            {name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {[role.charAt(0).toUpperCase() + role.slice(1), user?.email].filter(Boolean).join(", ")}
          </Text>
        </View>
      </View>
    </PageHero>
  );
}

export function ProfileView() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  const { has } = usePermissions();
  if (authed)
    return (
      <View style={styles.wrap}>
        {has(P.BOOKINGS_READ) || has(P.PAYMENTS_READ) ? <StaffTiles inPage={false} /> : null}
        <AccountPanel />
      </View>
    );
  return (
    <View style={styles.wrap}>
      <View style={styles.list}>
        {ROWS.map((r, i) => (
          <PressScale key={r.label} onPress={r.go} style={[styles.row, i > 0 && styles.line]} accessibilityLabel={`${r.label}. ${r.hint}`}>
            <View style={styles.icon}>
              <Ionicons name={r.icon} size={22} color={explore.gold} />
            </View>
            <View style={styles.fill}>
              <Text style={styles.label}>{r.label}</Text>
              <Text style={styles.hint}>{r.hint}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={groups.pine} />
          </PressScale>
        ))}
      </View>
      <Text style={styles.note}>{NOTE}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  fill: { flex: 1 },
  who: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: { width: 76, height: 76, borderRadius: 26, backgroundColor: explore.gold, alignItems: "center", justifyContent: "center" },
  initials: { color: explore.deep, fontSize: 26, fontFamily: fonts.uiBold },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 42, lineHeight: 47, letterSpacing: -0.8 },
  email: { color: explore.onDarkSoft, fontSize: font.md },
  list: { marginHorizontal: -spacing.sm, borderRadius: 32, backgroundColor: explore.sheet, paddingHorizontal: spacing.md + 4, boxShadow: explore.lift },
  row: { minHeight: 90, flexDirection: "row", alignItems: "center", gap: 16 },
  line: { borderTopWidth: 1, borderTopColor: explore.line },
  icon: { width: 54, height: 54, borderRadius: 19, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
  label: { color: groups.pine, fontSize: 17, lineHeight: 23, fontFamily: fonts.uiBold },
  hint: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  note: { color: colors.textMuted, fontSize: font.md, lineHeight: 23 },
});
