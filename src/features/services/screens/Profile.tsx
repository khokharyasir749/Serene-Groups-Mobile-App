import { Fragment } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CONTACT } from "@/core/constants/serene";
import { CLEARANCE, colors } from "@/core/constants/theme";
import { useAuthStore } from "@/core/stores/authStore";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { Closing } from "@/features/services/components/Closing";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { callDesk } from "@/features/services/components/FrontDesk";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import { Headline } from "@/features/services/components/scroll";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { GroupsBack, Press, Surface } from "@/features/services/components/ui";
import { PROFILE_COVER, type Glyph } from "@/features/services/data/catalog";
import { initialsOf } from "@/features/services/lib/initials";
import { BASE, exitToGroups } from "@/features/services/lib/nav";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";

type Row = { icon: Glyph; label: string; value?: string; onPress: () => void };

/** A titled group of rows on one plate, split by hairlines. */
function Group({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <Reveal style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <Surface radius={20}>
        {rows.map((r, n) => (
          <Fragment key={r.label}>
            {n ? <View style={styles.line} /> : null}
            <Press onPress={r.onPress} accessibilityLabel={r.value ? `${r.label}, ${r.value}` : r.label} style={styles.row}>
              <View style={styles.badge}>
                <Ionicons name={r.icon} size={19} color={tone.pine} />
              </View>
              <Text style={styles.label} numberOfLines={1}>
                {r.label}
              </Text>
              {r.value ? (
                <Text style={styles.value} numberOfLines={1}>
                  {r.value}
                </Text>
              ) : null}
              <Ionicons name="chevron-forward" size={16} color={tone.soft} />
            </Press>
          </Fragment>
        ))}
      </Surface>
    </Reveal>
  );
}

export default function Profile() {
  const { height } = useWindowDimensions();
  const user = useAuthStore((s) => s.user);
  const room = useServicesStore((s) => s.room);
  const requests = useServicesStore((s) => s.requests);
  const active = requests.filter(isActive).length;
  const name = user?.name ?? "Guest";
  const stats: [string, string][] = [
    [String(active), "Active"],
    [String(requests.length - active), "History"],
    [String(requests.length), "All requests"],
  ];

  return (
    <HeroPage
      photo={PROFILE_COVER}
      title={name}
      height={Math.round(Math.min(Math.max(height * 0.42, 320), 400))}
      bottom={CLEARANCE}
      bar={
        <>
          <View style={styles.fill}>
            <BrandLockup sub="SERVICES" onPhoto />
          </View>
          <GroupsBack onPhoto />
        </>
      }
      foot={
        <View>
          <Text style={styles.over}>Welcome</Text>
          <Headline mount text={name} style={styles.name} />
          <Text style={styles.sub} numberOfLines={1}>
            {user?.email ?? "Guest of Serene Heights"}
          </Text>
        </View>
      }
    >
      {/* The room key: the stay at a glance, and the one place to change the room. */}
      <View style={styles.key}>
        <View style={styles.keyTop}>
          <View style={styles.monogram}>
            <Text style={styles.initials}>{initialsOf(name)}</Text>
          </View>
          <View style={styles.fill}>
            <Text style={styles.keyOver}>Room key</Text>
            <Text style={styles.keyRoom} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {room || "Add your room"}
            </Text>
            <Text style={styles.keyPlace}>Serene Heights</Text>
          </View>
          <RoomPicker
            trigger={(open) => (
              <Press onPress={open} hitSlop={8} accessibilityLabel={`Your room: ${room}. Change`} style={styles.change}>
                <Text style={styles.changeText}>Change</Text>
              </Press>
            )}
          />
        </View>
        <View style={styles.keyLine} />
        <View style={styles.stats}>
          {stats.map(([v, k], n) => (
            <Fragment key={k}>
              {n ? <View style={styles.split} /> : null}
              <View style={styles.stat}>
                <Text style={styles.statValue}>{v}</Text>
                <Text style={styles.statKey}>{k}</Text>
              </View>
            </Fragment>
          ))}
        </View>
      </View>

      <Group
        title="Your stay"
        rows={[
          { icon: "receipt-outline", label: "My requests", value: active ? `${active} active` : undefined, onPress: () => router.navigate(`${BASE}/my-bookings`) },
          { icon: "gift-outline", label: "Curated stays", onPress: () => router.navigate(`${BASE}/packages`) },
          { icon: "home-outline", label: "All services", onPress: () => router.navigate(BASE) },
        ]}
      />
      <Group
        title="Front Desk · 24 hours"
        rows={[
          { icon: "call-outline", label: "Call", value: CONTACT.uan, onPress: callDesk },
          { icon: "chatbubble-ellipses-outline", label: "Message in the app", onPress: openMessage },
          { icon: "logo-whatsapp", label: "WhatsApp", value: CONTACT.whatsapp, onPress: () => whatsappDesk(room, "I need some help, please.") },
        ]}
      />
      <Group title="Serene Groups" rows={[{ icon: "arrow-back-outline", label: "Return to Serene Groups", onPress: exitToGroups }]} />
      <Closing />
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  over: { ...type.eyebrow, color: colors.white, marginBottom: 6 },
  name: { ...type.hero, fontSize: 44, lineHeight: 52, color: colors.white },
  sub: { ...type.label, fontSize: 14, color: colors.white, marginTop: 2 },
  key: { borderRadius: 20, padding: 22, gap: 20, backgroundColor: tone.pine, boxShadow: tone.shadow },
  keyTop: { flexDirection: "row", alignItems: "center", gap: 16 },
  monogram: { width: 58, height: 58, borderRadius: 29, borderWidth: 1.5, borderColor: tone.champagne, alignItems: "center", justifyContent: "center" },
  initials: { ...type.title, fontSize: 22, lineHeight: 28, color: colors.white },
  keyOver: { ...type.eyebrow, fontSize: 10.5, color: tone.champagne },
  keyRoom: { ...type.hero, fontSize: 30, lineHeight: 37, letterSpacing: -0.3, color: colors.white },
  keyPlace: { ...type.label, color: colors.white, opacity: 0.8 },
  change: { height: 34, paddingHorizontal: 14, borderRadius: 17, justifyContent: "center", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.4)" },
  changeText: { ...type.label, color: colors.white },
  keyLine: { height: 1, backgroundColor: "rgba(255, 255, 255, 0.16)" },
  stats: { flexDirection: "row" },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statValue: { ...type.title, fontSize: 24, lineHeight: 30, color: colors.white },
  statKey: { ...type.label, fontSize: 12, color: colors.white, opacity: 0.85 },
  split: { width: 1, backgroundColor: "rgba(255, 255, 255, 0.16)" },
  group: { gap: 12 },
  groupTitle: { ...type.eyebrow, color: tone.soft, paddingLeft: 4 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 62, paddingHorizontal: 16 },
  badge: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: tone.badge },
  label: { ...type.button, flex: 1, fontSize: 15, color: tone.ink },
  value: { ...type.label, color: tone.soft, maxWidth: "42%" },
  line: { height: 1, marginLeft: 68, backgroundColor: tone.hair },
});
