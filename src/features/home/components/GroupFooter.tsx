import { useMemo, useState } from "react";
import { Animated, Linking, Pressable, StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PressScale } from "@/core/components/PressScale";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { Text } from "@/core/components/Text";
import { CONTACT, GROUP, PROJECTS, WEB } from "@/core/constants/serene";
import { CLEARANCE, colors, explore, font, fonts, radius, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { ChapterTitle } from "./ChapterTitle";
import { usePage } from "./pageScroll";

const PHOTO = require("../../../../assets/bookings/photos/resort/rooftop-sunset.jpg") as ImageSource;
const OFFICE_MAP = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.office)}`;
const HEIGHT = 430;

const SOCIAL_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Instagram: "logo-instagram",
  Facebook: "logo-facebook",
  LinkedIn: "logo-linkedin",
  YouTube: "logo-youtube",
};

function Row({ label, value, onPress }: { label: string; value: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]} accessibilityRole="link" accessibilityLabel={`${label}: ${value}`}>
      <View style={styles.rowWords}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      <Ionicons name="arrow-forward" size={18} color={explore.gold} />
    </Pressable>
  );
}

/** Finale: the rooftop at sunset, the two ways to talk to someone, then every contact. Runs to the end of the page. */
export function GroupFooter() {
  const { y, view, still } = usePage();
  const [at, setAt] = useState<number | null>(null);
  const drift = useMemo(
    () => (still || at === null ? 0 : y.interpolate({ inputRange: [at - view, at + HEIGHT], outputRange: [-40, 40], extrapolate: "clamp" })),
    [y, at, view, still],
  );
  return (
    <View style={styles.wrap} onLayout={(e) => setAt(e.nativeEvent.layout.y)}>
      <View style={styles.photo}>
        <Animated.View renderToHardwareTextureAndroid style={[StyleSheet.absoluteFill, { transform: [{ translateY: drift }, { scale: 1.22 }] }]}>
          <Image cachePolicy="memory-disk" source={PHOTO} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition={{ left: "72%", top: "50%" }} transition={300} />
        </Animated.View>
        <LinearGradient pointerEvents="none" colors={explore.finaleFade} style={StyleSheet.absoluteFill} />
      </View>
      <View style={styles.body}>
        <ChapterTitle dark title={WEB.finale.title} soft={`${WEB.finale.soft}.`} style={styles.title} />
        <Text style={styles.copy}>{WEB.finale.p}</Text>
        <View style={styles.actions}>
          <PressScale style={styles.primary} onPress={() => void openWhatsApp()} accessibilityLabel="Enquire on WhatsApp">
            <Ionicons name="logo-whatsapp" size={20} color={explore.deep} />
            <Text style={styles.primaryText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              WhatsApp
            </Text>
          </PressScale>
          <PressScale style={styles.secondary} onPress={() => void Linking.openURL(CONTACT.uanHref)} accessibilityLabel={`Call ${CONTACT.uan}`}>
            <Ionicons name="call-outline" size={19} color={colors.white} />
            <Text style={styles.secondaryText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              Call us
            </Text>
          </PressScale>
        </View>

        <View style={styles.list}>
          <Row label="Phone" value={CONTACT.uan} onPress={() => void Linking.openURL(CONTACT.uanHref)} />
          <Row label="Head office" value={CONTACT.office} onPress={() => void Linking.openURL(OFFICE_MAP)} />
          {PROJECTS.map((p) => (
            <Row key={p.email} label={`Serene Heights ${p.name}`} value={p.email} onPress={() => void Linking.openURL(`mailto:${p.email}`)} />
          ))}
        </View>

        <View style={styles.social}>
          {CONTACT.social.map((s) => (
            <PressScale key={s.label} onPress={() => void Linking.openURL(s.href)} style={styles.socialButton} accessibilityRole="link" accessibilityLabel={s.label}>
              <Ionicons name={SOCIAL_ICON[s.label] ?? "link-outline"} size={21} color={explore.onDark} />
            </PressScale>
          ))}
        </View>

        <View style={styles.sign}>
          <SereneLogoMark width={34} fill={explore.onDark} snow={explore.deep} />
          <Text style={styles.small}>{`© ${new Date().getFullYear()} ${GROUP.name}\n${GROUP.developer}, since ${GROUP.founded}`}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginHorizontal: -spacing.lg, backgroundColor: explore.deep, borderTopLeftRadius: 38, borderTopRightRadius: 38, overflow: "hidden" },
  photo: { height: HEIGHT, overflow: "hidden" },
  body: { paddingHorizontal: spacing.lg, paddingBottom: CLEARANCE, marginTop: -110, gap: spacing.lg },
  title: { fontSize: 54, lineHeight: 54 },
  copy: { color: explore.onDarkSoft, fontSize: font.md + 1, lineHeight: 25 },
  actions: { flexDirection: "row", gap: 10 },
  primary: { flex: 1.2, height: 58, borderRadius: radius.pill, backgroundColor: explore.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  primaryText: { color: explore.deep, fontSize: 16, fontFamily: fonts.uiBold },
  secondary: { flex: 1, height: 58, borderRadius: radius.pill, borderWidth: 1, borderColor: explore.glassEdge, backgroundColor: explore.glass, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  secondaryText: { color: colors.white, fontSize: 16, fontFamily: fonts.uiSemi },
  list: { marginTop: spacing.md, borderBottomWidth: 1, borderBottomColor: explore.lineDark },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 72, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: explore.lineDark },
  pressed: { opacity: 0.7 },
  rowWords: { flex: 1, gap: 1 },
  rowLabel: { color: explore.onDarkSoft, fontSize: font.sm },
  rowValue: { color: explore.onDark, fontSize: font.md, lineHeight: 21, fontFamily: fonts.uiMedium },
  social: { flexDirection: "row", gap: 10 },
  socialButton: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: explore.lineDark, alignItems: "center", justifyContent: "center" },
  sign: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md },
  small: { flex: 1, color: explore.onDarkSoft, fontSize: 12, lineHeight: 18 },
});
