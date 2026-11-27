import { StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
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
import { sf } from "@/features/services/components/fonts";
import { type } from "@/features/services/components/type";
import { GroupsBack, Press } from "@/features/services/components/ui";
import { PROFILE_COVER, type Glyph } from "@/features/services/data/catalog";
import { BASE, exitToGroups } from "@/features/services/lib/nav";
import { openMessage } from "@/features/services/store/useDeskSheet";
import { isActive, useServicesStore } from "@/features/services/store/useServicesStore";

type Row = { icon: Glyph; label: string; value?: string; onPress: () => void };

/** A short titled list, set on the page with hairlines rather than in a box. */
function Group({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <Reveal style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.list}>
        {rows.map((r) => (
          <Press key={r.label} onPress={r.onPress} accessibilityLabel={r.value ? `${r.label}, ${r.value}` : r.label} style={styles.row}>
            <Ionicons name={r.icon} size={20} color={tone.pine} />
            <Text style={styles.label} numberOfLines={1}>
              {r.label}
            </Text>
            {r.value ? (
              <Text style={styles.value} numberOfLines={1}>
                {r.value}
              </Text>
            ) : null}
            <Ionicons name="chevron-forward" size={15} color={tone.soft} />
          </Press>
        ))}
      </View>
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
    [String(requests.length), "All"],
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
      <LinearGradient colors={[tone.pineDeep, tone.pine]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.key}>
        <View style={styles.keyTop}>
          <Text style={styles.keyOver}>Room key</Text>
          <RoomPicker
            trigger={(open) => (
              <Press onPress={open} hitSlop={10} accessibilityLabel={`Your room: ${room}. Change`} style={styles.change}>
                <Text style={styles.changeText}>Change</Text>
                <Ionicons name="chevron-forward" size={13} color={tone.champagne} />
              </Press>
            )}
          />
        </View>
        <View>
          <Text style={styles.keyRoom} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {room || "Add your room"}
          </Text>
          <Text style={styles.keyPlace}>Serene Heights</Text>
        </View>
        <View style={styles.keyLine} />
        <View style={styles.stats}>
          {stats.map(([v, k]) => (
            <View key={k} style={styles.stat}>
              <Text style={styles.statValue}>{v}</Text>
              <Text style={styles.statKey}>{k}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <Group
        title="Your stay"
        rows={[
          { icon: "receipt-outline", label: "My requests", value: active ? `${active} active` : undefined, onPress: () => router.navigate(`${BASE}/my-bookings`) },
          { icon: "gift-outline", label: "Curated stays", onPress: () => router.navigate(`${BASE}/packages`) },
        ]}
      />
      <Group
        title="Front Desk"
        rows={[
          { icon: "call-outline", label: "Call", value: CONTACT.uan, onPress: callDesk },
          { icon: "logo-whatsapp", label: "WhatsApp", value: CONTACT.whatsapp, onPress: () => whatsappDesk(room, "I need some help, please.") },
          { icon: "chatbubble-ellipses-outline", label: "Message in the app", onPress: openMessage },
        ]}
      />
      <Press onPress={exitToGroups} accessibilityLabel="Return to Serene Groups" style={styles.back}>
        <Ionicons name="arrow-back" size={15} color={tone.goldText} />
        <Text style={styles.backText}>Return to Serene Groups</Text>
      </Press>
      <Closing compact />
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 6 },
  name: { ...type.hero, fontSize: 46, lineHeight: 50, color: colors.white },
  sub: { ...type.label, fontSize: 14, color: tone.onDarkSoft, marginTop: 4 },
  key: { borderRadius: 22, padding: 22, gap: 16, borderWidth: 1, borderColor: "rgba(224, 190, 134, 0.35)", boxShadow: tone.shadow },
  keyTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  keyOver: { ...type.eyebrow, fontSize: 10.5, color: tone.champagne },
  change: { flexDirection: "row", alignItems: "center", gap: 3 },
  changeText: { ...type.label, color: tone.champagne },
  keyRoom: { ...type.hero, fontSize: 50, lineHeight: 52, color: tone.onDark },
  keyPlace: { fontFamily: sf.displayItalic, fontSize: 20, lineHeight: 24, color: tone.champagne },
  keyLine: { height: 1, backgroundColor: "rgba(224, 190, 134, 0.25)" },
  stats: { flexDirection: "row" },
  stat: { flex: 1, gap: 1 },
  statValue: { ...type.title, fontSize: 28, lineHeight: 32, color: tone.onDark },
  statKey: { ...type.label, fontSize: 12, color: tone.onDarkSoft },
  group: { gap: 6 },
  groupTitle: { ...type.title, fontSize: 24, lineHeight: 30, color: tone.ink },
  list: { borderTopWidth: 1, borderTopColor: tone.line },
  row: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 60, borderBottomWidth: 1, borderBottomColor: tone.line },
  label: { ...type.button, flex: 1, fontSize: 15.5, color: tone.ink },
  value: { ...type.label, color: tone.soft, maxWidth: "45%" },
  back: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 44 },
  backText: { ...type.label, fontSize: 14, color: tone.goldText },
});
