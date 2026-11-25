import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ActionTray } from "@/core/components/ActionTray";
import { PhotoBanner } from "@/core/components/PhotoBanner";
import { SectionHeader } from "@/core/components/SectionHeader";
import { Text } from "@/core/components/Text";
import { TileRail } from "@/core/components/TileRail";
import { MEDIA } from "@/core/constants/media";
import { P } from "@/core/constants/api";
import { colors, fonts, font, groups, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { StaffTiles } from "@/features/payments/components/StaffTiles";
import { AccountPanel } from "./AccountPanel";

const NOTE = "Staying with us? You do not need an account. You verify by mobile code when you reserve.";
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c ?? "")).slice(0, 2).join("").toUpperCase() || "S";

function Member() {
  const user = useAuthStore((s) => s.user);
  const { has } = usePermissions();
  const staff = has(P.BOOKINGS_READ) || has(P.PAYMENTS_READ);
  const name = user?.name ?? "Account";
  return (
    <>
      <View style={styles.cover}>
        <Image source={MEDIA.nathiaGaliSky} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
        <LinearGradient colors={groups.heroFade} locations={[0, 0.3, 0.45, 1]} style={StyleSheet.absoluteFill} />
        <View style={styles.role}>
          <Text style={styles.roleText}>{(user?.role ?? "account").toUpperCase()}</Text>
        </View>
        <View style={styles.who}>
          <View style={styles.avatar}>
            <Text style={styles.initials}>{initials(name)}</Text>
          </View>
          <View style={styles.fill}>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
              {name}
            </Text>
            <Text style={styles.email} numberOfLines={1}>
              {user?.email ?? ""}
            </Text>
          </View>
        </View>
      </View>
      {staff ? <StaffTiles inPage={false} /> : null}
      <AccountPanel />
    </>
  );
}

export function ProfileView() {
  const authed = useAuthStore((s) => s.accessToken !== null);
  return (
    <View style={styles.wrap}>
      <SectionHeader title="Your account" soft={authed ? "& workspace." : "in one place."} />
      {authed ? (
        <Member />
      ) : (
        <>
          <TileRail
            tiles={[
              { label: "Sign in", icon: "account-key", go: () => router.push("/login") },
              { label: "Investor", icon: "finance", go: () => router.navigate("/payments") },
              { label: "Reserve", icon: "bed", go: () => router.navigate("/bookings") },
              { label: "Ask us", icon: "whatsapp", go: () => void openWhatsApp() },
            ]}
          />
          <PhotoBanner image={MEDIA.nathiaGaliSky} tag="Serene" place="Group" badge="Members" title="Investors and staff" kind="Portfolio" where="Workspace" />
          <ActionTray primary="Sign In" onPrimary={() => router.push("/login")} secondary="Ask the concierge" onSecondary={() => void openWhatsApp()} />
          <View style={styles.note}>
            <Text style={styles.noteText}>{NOTE}</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  fill: { flex: 1 },
  cover: { height: 210, borderRadius: 26, overflow: "hidden", justifyContent: "space-between", padding: 14, backgroundColor: groups.pine, borderWidth: 1.4, borderColor: groups.heroEdge },
  role: { alignSelf: "flex-end", backgroundColor: groups.badge, borderWidth: 1, borderColor: groups.badgeEdge, borderRadius: 999, paddingHorizontal: 12, height: 27, justifyContent: "center" },
  roleText: { color: groups.meshGold, fontSize: 10, letterSpacing: 1, fontFamily: fonts.uiBold },
  who: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 62, height: 62, borderRadius: 21, backgroundColor: groups.plate, borderWidth: 1.5, borderColor: groups.heroEdge, alignItems: "center", justifyContent: "center" },
  initials: { color: groups.pine, fontSize: 21, fontFamily: fonts.uiBold },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 31, lineHeight: 38 },
  email: { color: colors.white, fontSize: font.sm },
  note: { backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 24, padding: 18 },
  noteText: { color: groups.pine, fontSize: font.md - 1, lineHeight: 21 },
});
