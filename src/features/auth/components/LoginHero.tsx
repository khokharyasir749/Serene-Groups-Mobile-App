import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { MEDIA } from "@/core/constants/media";
import { colors, fonts, gradients, radius, SCRIM_STOPS, spacing } from "@/core/constants/theme";

/** Architectural photo with a light neutral edge fade: brand lockup top-left, gold kicker + glass pill, arched edge into the Sand canvas. */
export function LoginHero() {
  return (
    <View style={styles.hero}>
      <Image source={MEDIA.loginHero} style={StyleSheet.absoluteFill} contentFit="cover" />
      <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={[colors.scrim, colors.clear]} style={styles.topScrim} />

      <View style={styles.lockup}>
        <View style={styles.tile}>
          <SereneLogoMark width={24} fill={colors.snow} snow={colors.pineBrand} />
        </View>
        <View style={styles.words}>
          <Text style={styles.name}>SERENE HEIGHTS</Text>
          <View style={styles.subRow}>
            <View style={styles.rule} />
            <Text style={styles.sub}>GROUP</Text>
          </View>
        </View>
      </View>

      <View style={styles.callout}>
        <Text style={styles.kicker}>STAFF & INVESTOR ACCESS</Text>
        <View style={styles.pill}>
          <Ionicons name="shield-checkmark-outline" size={13} color={colors.goldAccent} />
          <Text style={styles.pillText}>Serene Heights Group · Management & Investors</Text>
        </View>
      </View>

      <Svg width="100%" height={56} viewBox="0 0 390 56" preserveAspectRatio="none" style={styles.curve}>
        <Path d="M0,0 Q195,56 390,0 L390,56 L0,56 Z" fill={colors.paper} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { height: 340, backgroundColor: colors.stone, overflow: "hidden", justifyContent: "space-between", paddingTop: spacing.hero },
  topScrim: { position: "absolute", top: 0, left: 0, right: 0, height: 150 },
  lockup: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  tile: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.white16, borderWidth: 1, borderColor: colors.lineNight, alignItems: "center", justifyContent: "center" },
  words: { gap: 3 },
  name: { color: colors.white, fontSize: 17, fontFamily: fonts.display, letterSpacing: 3.2 },
  subRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  sub: { color: colors.goldAccent, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 3.4 },
  callout: { alignItems: "center", paddingBottom: 64, gap: spacing.sm },
  kicker: { color: colors.goldAccent, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: 2.4 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: colors.photoGlass, borderWidth: 1, borderColor: colors.photoGlassBorder },
  pillText: { color: colors.white, fontSize: 12, fontFamily: fonts.uiSemi },
  curve: { position: "absolute", bottom: -1, left: 0, right: 0 },
});
