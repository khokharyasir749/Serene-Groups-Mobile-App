import { useEffect, useRef } from "react";
import { Animated, Easing, Linking, StyleSheet, View } from "react-native";
import { useIsFocused } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/features/services/components/Text";
import { CONTACT } from "@/core/constants/serene";
import { colors, fonts } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { toast } from "@/core/stores/uiStore";
import { isReduced } from "@/features/services/components/motion";
import { Parallax } from "@/features/services/components/scroll";
import { Press } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { RECEPTION, type Glyph } from "@/features/services/data/catalog";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { useServicesStore } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";

export const callDesk = () => void Linking.openURL(CONTACT.uanHref).catch(() => toast(`Please call ${CONTACT.uan}`));

// Keeps white words readable on the bright marble.
const SHADOW = { textShadowColor: "rgba(0, 0, 0, 0.5)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 8 } as const;
const CARD = 244;
const LIVE = "rgb(126, 214, 164)";

/** Small glass tag with a softly pulsing dot. */
function Open() {
  const p = useRef(new Animated.Value(0)).current;
  const focused = useIsFocused();
  useEffect(() => {
    if (isReduced() || !focused) return;
    const loop = Animated.loop(Animated.timing(p, { toValue: 1, duration: 2000, easing: Easing.out(Easing.quad), useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [p, focused]);
  return (
    <View style={styles.open}>
      <GlassFill />
      <View style={styles.dotBox}>
        <Animated.View style={[styles.ring, { opacity: p.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }), transform: [{ scale: p.interpolate({ inputRange: [0, 1], outputRange: [1, 2.8] }) }] }]} />
        <View style={styles.dot} />
      </View>
      <Text style={styles.openText} maxFontSizeMultiplier={1.05}>
        Open 24/7
      </Text>
    </View>
  );
}

/** Frosted glass over the photo: a white tint, light caught along the top, a bright edge. */
function GlassFill({ strong }: { strong?: boolean }) {
  return (
    <>
      <LinearGradient pointerEvents="none" colors={strong ? tone.deskGlassStrong : tone.deskGlass} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={tone.deskGlassSheen} style={styles.sheen} />
    </>
  );
}

function Round({ icon, hint, onPress }: { icon: Glyph; hint: string; onPress: () => void }) {
  return (
    <Press onPress={onPress} accessibilityLabel={hint} style={styles.round}>
      <GlassFill />
      <Ionicons name={icon} size={22} color={colors.white} />
    </Press>
  );
}

/** The concierge card: call first, or write in the app, or WhatsApp with the room already filled in. */
export function FrontDesk() {
  const room = useServicesStore((s) => s.room);
  const whatsapp = () => openWhatsApp(`Serene Services · ${room}\nI need some help, please.`).catch(() => toast(`Please message ${CONTACT.whatsapp}`));
  return (
    <View style={styles.card}>
      <Parallax source={RECEPTION} height={CARD} depth={16} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={tone.deskShade} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.3 }} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={tone.deskFoot} locations={[0.3, 1]} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.edge} />
      <Open />
      <View style={styles.words}>
        <Text style={styles.title}>Front Desk</Text>
        <Text style={styles.number}>{CONTACT.uan}</Text>
      </View>
      <View style={styles.row}>
        <Press onPress={callDesk} accessibilityLabel="Call Front Desk" style={styles.call}>
          <GlassFill strong />
          <Ionicons name="call-outline" size={19} color={colors.white} />
          <Text style={styles.callText}>Call</Text>
        </Press>
        <Round icon="chatbubble-ellipses-outline" hint="Quick Message to Desk" onPress={openMessage} />
        <Round icon="logo-whatsapp" hint="WhatsApp the Front Desk" onPress={() => void whatsapp()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: CARD, borderRadius: 18, overflow: "hidden", backgroundColor: "rgb(34, 34, 34)", padding: 18, justifyContent: "space-between", gap: 16 },
  // A thin light line round the card, like the edge of glass.
  edge: { ...StyleSheet.absoluteFill, borderRadius: 18, borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.18)" },
  open: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 8, height: 30, paddingHorizontal: 13, borderRadius: 15, overflow: "hidden", borderWidth: 1, borderColor: tone.deskGlassEdge },
  sheen: { position: "absolute", top: 0, left: 0, right: 0, height: "55%" },
  dotBox: { width: 8, height: 8, alignItems: "center", justifyContent: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: LIVE },
  ring: { position: "absolute", width: 8, height: 8, borderRadius: 4, backgroundColor: LIVE },
  openText: { ...type.eyebrow, fontSize: 11, color: colors.white },
  words: { gap: 2 },
  title: { ...type.page, fontSize: 34, lineHeight: 42, color: colors.white, ...SHADOW },
  number: { ...type.figure, color: colors.white, ...SHADOW },
  row: { flexDirection: "row", gap: 10 },
  call: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, height: 54, borderRadius: 27, overflow: "hidden", borderWidth: 1, borderColor: tone.deskGlassEdge },
  callText: { ...type.button, fontSize: 16, color: colors.white },
  round: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", overflow: "hidden", borderWidth: 1, borderColor: tone.deskGlassEdge },
});
