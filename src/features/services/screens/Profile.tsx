import { Fragment, useCallback, useRef, useState } from "react";
import { Animated, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { CLEARANCE, colors, font, fonts, spacing, svc } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { useAuthStore } from "@/core/stores/authStore";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { callDesk } from "@/features/services/components/FrontDesk";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import { GroupsBack, Heading, Press, Surface, SurfacePress } from "@/features/services/components/ui";
import { PROFILE_COVER, serviceBySlug, type Glyph } from "@/features/services/data/catalog";
import { BASE, exitToGroups } from "@/features/services/lib/nav";
import { slotLabel } from "@/features/services/lib/schedule";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";

type Item = { icon: Glyph; label: string; value?: string; onPress: () => void };
const OVERLAP = 30;
const toRequests = () => router.navigate(`${BASE}/my-bookings`);

/** One white card, rows split by hairlines. */
function List({ items }: { items: Item[] }) {
  return (
    <Surface radius={18}>
      {items.map((i, n) => (
        <Fragment key={i.label}>
          {n ? <View style={styles.line} /> : null}
          <Press onPress={i.onPress} accessibilityLabel={i.label} style={styles.row}>
            <View style={styles.well}>
              <Ionicons name={i.icon} size={19} color={colors.crestSlate} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
              {i.label}
            </Text>
            {i.value ? <Text style={styles.value}>{i.value}</Text> : null}
            <Ionicons name="chevron-forward-outline" size={16} color={colors.muted} />
          </Press>
        </Fragment>
      ))}
    </Surface>
  );
}

function Contact({ icon, label, onPress }: { icon: Glyph; label: string; onPress: () => void }) {
  return (
    <SurfacePress radius={18} onPress={onPress} accessibilityLabel={label} style={styles.contact}>
      <View style={styles.contactWell}>
        <Ionicons name={icon} size={20} color={colors.goldAccent} />
      </View>
      <Text style={styles.contactText}>{label}</Text>
    </SurfacePress>
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const heroH = Math.round(Math.min(Math.max(height * 0.56, 400), 560));
  const user = useAuthStore((s) => s.user);
  const room = useServicesStore((s) => s.room);
  const requests = useServicesStore((s) => s.requests);
  const active = requests.filter(isActive);
  const latest = active[0];
  const name = user?.name ?? "Guest";
  const initials = name.split(" ").map((w) => w[0]).filter((c) => /[A-Za-z]/.test(c ?? "")).slice(0, 2).join("").toUpperCase();

  // Tabs stay mounted, so this page only owns the status bar while it is in front.
  const [focused, setFocused] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  const [overHero, setOverHero] = useState(true);
  const y = useRef(new Animated.Value(0)).current;
  const drift = y.interpolate({ inputRange: [-200, 0, heroH], outputRange: [-100, 0, heroH * 0.35], extrapolate: "clamp" });
  const stretch = y.interpolate({ inputRange: [-200, 0], outputRange: [1.4, 1], extrapolate: "clamp" });
  const fade = y.interpolate({ inputRange: [0, heroH * 0.55], outputRange: [1, 0], extrapolate: "clamp" });

  const stats: [string, string][] = [
    [String(active.length), "Active"],
    [String(requests.length - active.length), "History"],
    [room || "Not set", "Room"],
  ];

  return (
    <View style={styles.page}>
      {focused ? <StatusBar style={overHero ? "light" : "dark"} /> : null}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: CLEARANCE }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
          useNativeDriver: true,
          listener: (e: { nativeEvent: { contentOffset: { y: number } } }) => setOverHero(e.nativeEvent.contentOffset.y < heroH - OVERLAP - insets.top),
        })}
      >
        <View style={[styles.hero, { height: heroH }]}>
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: drift }, { scale: stretch }] }]}>
            <Image source={PROFILE_COVER} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={250} />
          </Animated.View>
          <LinearGradient pointerEvents="none" colors={svc.heroFade} locations={[0, 0.28, 0.55, 1]} style={StyleSheet.absoluteFill} />
          <View style={[styles.bar, { paddingTop: insets.top + 10 }]}>
            <View style={styles.fill}>
              <BrandLockup sub="SERVICES" onPhoto />
            </View>
            <GroupsBack onPhoto />
          </View>
          <Animated.View style={[styles.heroFoot, { opacity: fade }]}>
            <Enter>
              <Surface finish="clear" radius={24} style={styles.who}>
                <View style={styles.whoTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.initials}>{initials || "G"}</Text>
                  </View>
                  <View style={styles.fill}>
                    <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit>
                      {name}
                    </Text>
                    <Text style={styles.sub} numberOfLines={1}>
                      {user?.email ?? "Guest of Serene Heights"}
                    </Text>
                  </View>
                </View>
                <View style={styles.glassLine} />
                <View style={styles.stats}>
                  {stats.map(([v, k], n) => (
                    <Fragment key={k}>
                      {n ? <View style={styles.split} /> : null}
                      <View style={styles.stat}>
                        <Text style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
                          {v}
                        </Text>
                        <Text style={styles.statKey}>{k}</Text>
                      </View>
                    </Fragment>
                  ))}
                </View>
              </Surface>
            </Enter>
          </Animated.View>
        </View>

        <View style={styles.sheet}>
          <Enter order={1} style={styles.block}>
            <Heading>My stay</Heading>
            <RoomPicker />
          </Enter>

          <Enter order={2} style={styles.block}>
            <Heading action={requests.length ? "View all" : undefined} onAction={toRequests}>
              Latest request
            </Heading>
            <SurfacePress radius={18} onPress={latest ? toRequests : openMessage} style={styles.latest} accessibilityLabel={latest ? `${latest.name}. View requests` : "Message the front desk"}>
              <IconWell name={latest ? (serviceBySlug(latest.slug)?.icon ?? "message") : "room-service"} size={58} />
              <View style={styles.fill}>
                <Text style={styles.latestName} numberOfLines={1}>
                  {latest ? latest.name : "Nothing requested yet"}
                </Text>
                <Text style={styles.latestLine} numberOfLines={1}>
                  {latest ? `${formatDate(latest.date)} · ${latest.slot ? slotLabel(latest.slot) : "As soon as possible"}` : "Tell us what you need."}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={16} color={colors.muted} />
            </SurfacePress>
          </Enter>

          <Enter order={3} style={styles.block}>
            <Heading>Front desk</Heading>
            <View style={styles.contacts}>
              <Contact icon="call-outline" label="Call" onPress={callDesk} />
              <Contact icon="chatbubble-ellipses-outline" label="Message" onPress={openMessage} />
              <Contact icon="logo-whatsapp" label="WhatsApp" onPress={() => whatsappDesk(room, "I need some help, please.")} />
            </View>
          </Enter>

          <Enter order={4}>
            <List
              items={[
                { icon: "receipt-outline", label: "My requests", value: active.length ? `${active.length} active` : undefined, onPress: toRequests },
                { icon: "layers-outline", label: "Stay packages", onPress: () => router.navigate(`${BASE}/packages`) },
                { icon: "arrow-back-outline", label: "Return to Serene Groups", onPress: exitToGroups },
              ]}
            />
          </Enter>
        </View>
      </Animated.ScrollView>
      {overHero ? null : <View pointerEvents="none" style={[styles.strip, { height: insets.top }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: svc.page },
  fill: { flex: 1 },
  hero: { overflow: "hidden", backgroundColor: colors.crestSlate, justifyContent: "space-between" },
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg },
  heroFoot: { paddingHorizontal: spacing.lg - 4, paddingBottom: OVERLAP + spacing.lg - 4 },
  who: { padding: spacing.lg - 4, gap: spacing.md },
  whoTop: { flexDirection: "row", alignItems: "center", gap: spacing.md + 2 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.white, borderWidth: 2, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  initials: { color: colors.crestSlate, fontSize: 21, fontFamily: fonts.uiBold },
  name: { color: colors.white, fontSize: 30, lineHeight: 37, fontFamily: fonts.display },
  sub: { color: colors.white, fontSize: font.sm },
  glassLine: { height: 1, backgroundColor: colors.photoGlassBorder },
  stats: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  statValue: { color: colors.white, fontSize: font.lg, fontFamily: fonts.uiBold },
  statKey: { color: colors.white, fontSize: 11.5 },
  split: { width: 1, backgroundColor: colors.photoGlassBorder },
  sheet: { marginTop: -OVERLAP, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: svc.page, paddingTop: spacing.xl, paddingHorizontal: spacing.lg, gap: spacing.xl },
  block: { gap: spacing.md },
  latest: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md },
  latestName: { color: colors.ink, fontSize: font.md, fontFamily: fonts.uiBold },
  latestLine: { color: colors.muted, fontSize: 12 },
  contacts: { flexDirection: "row", gap: 10 },
  contact: { flex: 1, alignItems: "center", gap: 8, paddingVertical: spacing.md + 2 },
  contactWell: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.crestSlate, alignItems: "center", justifyContent: "center" },
  contactText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  line: { height: 1, marginLeft: 64, backgroundColor: svc.surfaceEdge },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md, minHeight: 60, paddingHorizontal: spacing.md + 2 },
  well: { width: 38, height: 38, borderRadius: 12, backgroundColor: svc.page, alignItems: "center", justifyContent: "center" },
  label: { flex: 1, color: colors.ink, fontSize: font.md, fontFamily: fonts.uiSemi },
  value: { color: colors.muted, fontSize: font.sm },
  strip: { position: "absolute", top: 0, left: 0, right: 0, backgroundColor: svc.page },
});
