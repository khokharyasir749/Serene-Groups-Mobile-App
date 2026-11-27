import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { P } from "@/core/constants/api";
import { colors, explore, font, fonts, groups, spacing } from "@/core/constants/theme";
import { usePermissions } from "@/core/hooks/usePermissions";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useAuthStore } from "@/core/stores/authStore";
import { switchTo } from "@/core/stores/switchStore";
import { ChapterTitle } from "./ChapterTitle";
import { useScrollTo } from "./scrollTarget";

type App = { title: string; line: string; image: ImageSource; go: () => void };
type Link = { label: string; icon: keyof typeof MaterialCommunityIcons.glyphMap; go: () => void };

const APPS: App[] = [
  {
    title: "Bookings",
    line: "Find and book a stay",
    image: require("../../../../assets/bookings/photos/interiors/window-view.jpg") as ImageSource,
    go: () => switchTo("Serene Bookings", () => router.push("/serene-bookings")),
  },
  {
    title: "Services",
    line: "Room care and dining",
    image: require("../../../../assets/services/reception.jpg") as ImageSource,
    go: () => switchTo("Serene Services", () => router.push("/serene-services")),
  },
];

/** Every way in: the two mini-apps as photo tiles, everything else in one quiet row below. */
export function EntryGrid() {
  const { has } = usePermissions();
  const authed = useAuthStore((s) => s.accessToken !== null);
  const toProjects = useScrollTo("projects");
  const manage = () => {
    if (has(P.BOOKINGS_READ)) router.push("/staff/bookings");
    else if (authed) router.navigate("/profile");
    else router.push({ pathname: "/login", params: { next: "/staff/bookings" } });
  };
  const links: Link[] = [
    { label: "Invest", icon: "finance", go: () => router.navigate("/payments") },
    { label: "Projects", icon: "floor-plan", go: toProjects },
    { label: "Manage", icon: "key-variant", go: manage },
    { label: "Concierge", icon: "whatsapp", go: () => void openWhatsApp() },
  ];
  return (
    <View style={styles.wrap}>
      <ChapterTitle title="One group." soft="Every way in." />
      <View style={styles.ways}>
        <View style={styles.apps}>
          {APPS.map((a) => (
            <PressScale key={a.title} onPress={a.go} style={styles.app} accessibilityLabel={`Serene ${a.title}. ${a.line}`}>
              <Image cachePolicy="memory-disk" source={a.image} style={StyleSheet.absoluteFill} contentFit="cover" transition={300} />
              <LinearGradient colors={explore.tileFade} style={StyleSheet.absoluteFill} />
              <View style={styles.arrow}>
                <Ionicons name="arrow-forward" size={18} color={colors.white} style={styles.arrowIcon} />
              </View>
              <View>
                <Text style={styles.appTitle} numberOfLines={1} adjustsFontSizeToFit>
                  {a.title}
                </Text>
                <Text style={styles.appLine} numberOfLines={2}>
                  {a.line}
                </Text>
              </View>
            </PressScale>
          ))}
        </View>
        <View style={styles.links}>
          {links.map((l, i) => (
            <PressScale key={l.label} onPress={l.go} style={[styles.link, i > 0 && styles.linkLine]} accessibilityLabel={l.label}>
              <MaterialCommunityIcons name={l.icon} size={24} color={groups.pine} />
              <Text style={styles.linkText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                {l.label}
              </Text>
            </PressScale>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  ways: { gap: spacing.sm, marginHorizontal: -spacing.sm },
  apps: { flexDirection: "row", gap: 8 },
  app: { flex: 1, height: 252, borderRadius: 30, overflow: "hidden", padding: spacing.md + 4, justifyContent: "space-between", backgroundColor: groups.pine },
  arrow: { alignSelf: "flex-end", width: 38, height: 38, borderRadius: 19, backgroundColor: explore.glass, borderWidth: 1, borderColor: explore.glassEdge, alignItems: "center", justifyContent: "center" },
  arrowIcon: { transform: [{ rotate: "-45deg" }] },
  appTitle: { color: colors.white, fontFamily: fonts.display, fontSize: 34, lineHeight: 38 },
  appLine: { color: explore.onDarkSoft, fontSize: font.sm, lineHeight: 18 },
  links: { flexDirection: "row", borderRadius: 30, backgroundColor: explore.sheet },
  link: { flex: 1, minHeight: 88, alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 2 },
  linkLine: { borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: explore.line },
  linkText: { color: groups.pine, fontSize: 12.5, fontFamily: fonts.uiMedium },
});
