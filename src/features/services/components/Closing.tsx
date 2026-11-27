import { memo } from "react";
import { Linking, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { CONTACT, GROUP } from "@/core/constants/serene";
import { CLEARANCE, explore, spacing } from "@/core/constants/theme";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { callDesk } from "@/features/services/components/FrontDesk";
import { Parallax, Reveal } from "@/features/services/components/scroll";
import { Press } from "@/features/services/components/surface";
import { Text } from "@/features/services/components/Text";
import { type } from "@/features/services/components/type";
import { CLOSING_PHOTO, type Glyph } from "@/features/services/data/catalog";
import { BASE } from "@/features/services/lib/nav";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { useServicesStore } from "@/features/services/store/useServicesStore";

const PHOTO = 340;

function Row({ icon, label, value, onPress }: { icon: Glyph; label: string; value: string; onPress: () => void }) {
  return (
    <Press onPress={onPress} accessibilityLabel={`${label}: ${value}`} style={styles.row}>
      <Ionicons name={icon} size={19} color={explore.gold} />
      <View style={styles.rowWords}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <Ionicons name="arrow-forward" size={18} color={explore.gold} />
    </Press>
  );
}

/**
 * The foot of every Services page, in the manner of the Serene Group finale: a quiet photograph that drifts as it comes up, the two
 * quickest ways to reach the desk, then the rest. Runs to the end of the page.
 */
export const Closing = memo(function Closing({ compact }: { /** A tight block for Profile: one line, two small buttons and the signature. */ compact?: boolean }) {
  const room = useServicesStore((s) => s.room);
  const whatsapp = () => whatsappDesk(room, "I need some help, please.");
  if (compact) {
    return (
      <View style={styles.mini}>
        <Text style={styles.miniLine}>
          At your service, <Text style={styles.miniSoft}>day and night.</Text>
        </Text>
        <View style={styles.actions}>
          <Press onPress={whatsapp} accessibilityLabel="WhatsApp the Front Desk" style={[styles.primary, styles.small44]}>
            <Ionicons name="logo-whatsapp" size={17} color={explore.deep} />
            <Text style={[styles.primaryText, styles.miniText]} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              WhatsApp
            </Text>
          </Press>
          <Press onPress={callDesk} accessibilityLabel={`Call ${CONTACT.uan}`} style={[styles.secondary, styles.small44]}>
            <Ionicons name="call-outline" size={16} color={explore.onDark} />
            <Text style={[styles.secondaryText, styles.miniText]} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              Call the desk
            </Text>
          </Press>
        </View>
        <Text style={styles.miniSign} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>{`Serene Services · ${GROUP.short} — ${GROUP.developer}`}</Text>
      </View>
    );
  }
  return (
    <Reveal plain style={styles.wrap}>
      <Parallax source={CLOSING_PHOTO} height={PHOTO} depth={40} zoom style={styles.photo}>
        <LinearGradient pointerEvents="none" colors={explore.finaleFade} style={StyleSheet.absoluteFill} />
      </Parallax>
      <View style={styles.body}>
        <View>
          <Text style={styles.title}>At your service</Text>
          <Text style={styles.soft}>day and night.</Text>
        </View>
        <Text style={styles.copy}>The Front Desk is open 24 hours. Call, write in the app, or send a WhatsApp, and we come to your room.</Text>
        <View style={styles.actions}>
          <Press onPress={whatsapp} accessibilityLabel="WhatsApp the Front Desk" style={styles.primary}>
            <Ionicons name="logo-whatsapp" size={20} color={explore.deep} />
            <Text style={styles.primaryText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              WhatsApp
            </Text>
          </Press>
          <Press onPress={callDesk} accessibilityLabel={`Call ${CONTACT.uan}`} style={styles.secondary}>
            <Ionicons name="call-outline" size={19} color={explore.onDark} />
            <Text style={styles.secondaryText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
              Call the desk
            </Text>
          </Press>
        </View>

        <View style={styles.list}>
          <Row icon="call-outline" label="Front Desk, 24 hours" value={CONTACT.uan} onPress={callDesk} />
          <Row icon="logo-whatsapp" label="WhatsApp" value={CONTACT.whatsapp} onPress={whatsapp} />
          <Row icon="chatbubble-ellipses-outline" label="Message in the app" value="Write to the desk" onPress={openMessage} />
          <Row icon="receipt-outline" label="Your requests" value={room ? `${room} · Bookings` : "Bookings"} onPress={() => router.navigate(`${BASE}/my-bookings`)} />
        </View>

        <View style={styles.sign}>
          <SereneLogoMark width={34} fill={explore.onDark} snow={explore.deep} />
          <Text style={styles.small}>{`Serene Services\n${GROUP.short} · ${GROUP.developer}`}</Text>
          <Press onPress={() => void Linking.openURL(CONTACT.uanHref)} hitSlop={10} accessibilityLabel={`Call ${CONTACT.uan}`}>
            <Text style={styles.uan}>{CONTACT.uan}</Text>
          </Press>
        </View>
      </View>
    </Reveal>
  );
});

const styles = StyleSheet.create({
  // Full width, to the very end of the page: the page's own bottom space is taken in here.
  wrap: { marginHorizontal: -spacing.lg, marginBottom: -CLEARANCE, backgroundColor: explore.deep, borderTopLeftRadius: 34, borderTopRightRadius: 34, overflow: "hidden" },
  // Profile's version: a small dark block, nothing repeated from the page above it.
  mini: { marginHorizontal: -spacing.lg, marginBottom: -CLEARANCE, paddingHorizontal: spacing.lg, paddingTop: 22, paddingBottom: CLEARANCE, gap: 14, backgroundColor: explore.deep, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  miniLine: { ...type.title, fontSize: 24, lineHeight: 28, color: explore.onDark },
  miniSoft: { color: explore.gold },
  small44: { height: 44, borderRadius: 22 },
  miniText: { fontSize: 14 },
  miniSign: { ...type.label, fontSize: 11.5, color: explore.onDarkSoft },
  photo: { backgroundColor: explore.deep },
  body: { paddingHorizontal: spacing.lg, paddingBottom: CLEARANCE, marginTop: -96, gap: spacing.lg },
  title: { ...type.hero, fontSize: 54, lineHeight: 54, letterSpacing: -1.2, color: explore.onDark },
  soft: { ...type.page, fontSize: 52, lineHeight: 54, color: explore.gold },
  copy: { ...type.body, fontSize: 15.5, lineHeight: 24, color: explore.onDarkSoft },
  actions: { flexDirection: "row", gap: 10 },
  primary: { flex: 1, height: 56, borderRadius: 28, backgroundColor: explore.gold, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  primaryText: { ...type.button, fontSize: 16, color: explore.deep },
  secondary: { flex: 1, height: 56, borderRadius: 28, borderWidth: 1, borderColor: explore.glassEdge, backgroundColor: explore.glass, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9 },
  secondaryText: { ...type.button, fontSize: 16, color: explore.onDark },
  list: { marginTop: spacing.sm, borderBottomWidth: 1, borderBottomColor: explore.lineDark },
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 68, borderTopWidth: 1, borderTopColor: explore.lineDark },
  rowWords: { flex: 1, gap: 1 },
  rowLabel: { ...type.label, color: explore.onDarkSoft },
  rowValue: { ...type.button, fontSize: 15.5, color: explore.onDark },
  sign: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.sm },
  small: { ...type.label, flex: 1, fontSize: 12, lineHeight: 18, color: explore.onDarkSoft },
  uan: { ...type.figure, fontSize: 12.5, lineHeight: 18, color: explore.gold },
});
