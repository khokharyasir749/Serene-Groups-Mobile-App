import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { LAHORE_URL, NATHIA_GALI_URL } from "@/core/constants/serene";
import { colors, dark, explore, font, fonts, groups, letter, menuScrim, spacing } from "@/core/constants/theme";
import { openSite } from "@/core/lib/openSite";
import { switchTo } from "@/core/stores/switchStore";
import { PlateButton } from "./PlateButton";
import { openWhatsApp } from "@/core/lib/whatsappShare";

type Item = { label: string; go: () => void; badge?: string; quiet?: boolean; external?: boolean };

const PHOTO = require("../../../assets/bookings/photos/resort/aerial-pool-portrait.jpg") as ImageSource;

const ITEMS: Item[] = [
  { label: "Serene Bookings", badge: "BOOK NOW", go: () => switchTo("Serene Bookings", () => router.push("/serene-bookings")) },
  { label: "Serene Services", badge: "NEW", quiet: true, go: () => switchTo("Serene Services", () => router.push("/serene-services")) },
  { label: "Explore", go: () => router.navigate("/") },
  { label: "Stay", go: () => router.navigate("/bookings") },
  { label: "Invest", go: () => router.navigate("/payments") },
  { label: "Profile", go: () => router.navigate("/profile") },
  { label: "Nathia Gali", external: true, go: () => void openSite(NATHIA_GALI_URL) },
  { label: "Lahore", external: true, go: () => void openSite(LAHORE_URL) },
  { label: "Concierge", external: true, go: () => void openWhatsApp() },
];

/** Hamburger button plus the full-screen Pine menu it opens: numbered destinations, Serene Bookings first. */
export function GroupsMenu({ glass }: { glass?: boolean }) {
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const p = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!open) return;
    p.setValue(0);
    Animated.timing(p, { toValue: 1, duration: 520, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [open, p]);

  const pick = (item: Item) => {
    setOpen(false);
    item.go();
  };

  return (
    <>
      <PlateButton glass={glass} icon="menu-outline" label="Open menu" onPress={() => setOpen(true)} />
      <Modal visible={open} animationType="fade" onRequestClose={() => setOpen(false)} statusBarTranslucent presentationStyle="fullScreen">
        <View style={[styles.page, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
          <Image cachePolicy="memory-disk" source={PHOTO} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient pointerEvents="none" colors={menuScrim.colors} locations={menuScrim.stops} style={StyleSheet.absoluteFill} />
          <View style={styles.top}>
            <View style={styles.brand}>
              <SereneLogoMark width={40} fill={colors.snow} snow={groups.pine} />
              <View style={styles.words}>
                <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                  SERENE GROUP
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  BY DM CONSORTIUM
                </Text>
              </View>
            </View>
            <Pressable onPress={() => setOpen(false)} hitSlop={10} style={styles.close} accessibilityRole="button" accessibilityLabel="Close menu">
              <Ionicons name="close-outline" size={22} color={colors.snow} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
            {ITEMS.map((item, i) => {
              const from = Math.min(0.5, i * 0.07);
              const rise = {
                opacity: p.interpolate({ inputRange: [from, from + 0.5], outputRange: [0, 1], extrapolate: "clamp" }),
                transform: [{ translateY: p.interpolate({ inputRange: [from, from + 0.5], outputRange: [18, 0], extrapolate: "clamp" }) }],
              };
              return (
                <Animated.View key={item.label} style={rise}>
                  <Pressable onPress={() => pick(item)} style={({ pressed }) => [styles.item, pressed && styles.itemOn]} accessibilityRole="link" accessibilityLabel={item.label}>
                    <Text style={styles.num}>{`0${i + 1}`}</Text>
                    <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit>
                      {item.label.toUpperCase()}
                    </Text>
                    {item.badge ? <Text style={[styles.badge, item.quiet && styles.badgeQuiet]}>{item.badge}</Text> : null}
                    {item.badge || item.external ? <Ionicons name={item.badge ? "arrow-forward-outline" : "open-outline"} size={17} color={colors.goldAccent} /> : null}
                  </Pressable>
                </Animated.View>
              );
            })}
          </ScrollView>
          <Text style={styles.foot}>Serene Heights Group · DM Consortium · since 2017</Text>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: groups.pine, paddingHorizontal: spacing.lg },
  top: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingBottom: spacing.lg, borderBottomWidth: 1, borderBottomColor: colors.lineNight },
  brand: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  words: { flex: 1, gap: 1 },
  name: { color: colors.white, fontFamily: fonts.display, fontSize: 20, lineHeight: 26, letterSpacing: 1.4 },
  sub: { color: explore.gold, fontSize: 10.5, lineHeight: 14, letterSpacing: 0.9, fontFamily: fonts.uiMedium },
  close: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.goldAccent, backgroundColor: colors.white16, alignItems: "center", justifyContent: "center" },
  list: { paddingVertical: spacing.md },
  item: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.lg - 2, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.lineNight },
  itemOn: { backgroundColor: colors.white16 },
  num: { width: 26, color: colors.goldAccent, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow, fontVariant: ["tabular-nums"] },
  label: { flex: 1, color: dark.text, fontFamily: fonts.display, fontSize: 31, lineHeight: 35, letterSpacing: 0.6 },
  badge: { color: colors.pineBrand, backgroundColor: colors.goldAccent, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999, overflow: "hidden" },
  badgeQuiet: { color: colors.goldAccent, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldLine },
  foot: { color: dark.muted, fontSize: font.xs, textAlign: "center" },
});
