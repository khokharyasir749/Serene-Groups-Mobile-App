import { useState } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CLEARANCE, colors, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { RequestDetail } from "@/features/services/components/RequestDetail";
import { Segments } from "@/features/services/components/Pick";
import { Headline } from "@/features/services/components/scroll";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { ActionButton, GroupsBack, SurfacePress } from "@/features/services/components/ui";
import { GROUP_PHOTO, RECEPTION, REQUESTS_COVER, serviceBySlug } from "@/features/services/data/catalog";
import { BASE } from "@/features/services/lib/nav";
import { slotLabel, todayISO, tomorrowISO } from "@/features/services/lib/schedule";
import { isActive, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";


const dayLabel = (iso: string) => (iso === todayISO() ? "Today" : iso === tomorrowISO() ? "Tomorrow" : formatDate(iso));


/** One request, quietly: its picture, its name and when, its state, and a way in. The details open on tap. */
function Ticket({ b, onOpen }: { b: GuestRequest; onOpen: () => void }) {
  const service = serviceBySlug(b.slug);
  const photo = service?.photo ?? (service?.group ? GROUP_PHOTO[service.group] : undefined) ?? RECEPTION;
  const live = isActive(b);
  const state = b.status === "cancelled" ? "Cancelled" : live ? "Desk notified" : "Completed";
  return (
    <SurfacePress radius={20} onPress={onOpen} accessibilityLabel={`${b.name}, ${state}. View request`} style={styles.card}>
      <Image cachePolicy="memory-disk" source={photo} style={styles.thumb} contentFit="cover" transition={120} />
      <View style={styles.fill}>
        <View style={styles.stateRow}>
          <View style={[styles.dot, live ? styles.dotOn : b.status === "cancelled" ? styles.dotOff : null]} />
          <Text style={[styles.state, live && styles.stateOn]} numberOfLines={1}>
            {state}
          </Text>
        </View>
        <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
          {service?.tile ?? b.name}
        </Text>
        <Text style={styles.when} numberOfLines={1}>
          {b.slot ? `${dayLabel(b.date)} · ${slotLabel(b.slot)}` : `${dayLabel(b.date)} · As soon as possible`}
        </Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.viewText}>View</Text>
        <Ionicons name="chevron-forward" size={14} color={tone.pine} />
      </View>
    </SurfacePress>
  );
}

/** Requests in the order they happen, under the day they fall on. */
function Days({ list, onOpen }: { list: GuestRequest[]; onOpen: (b: GuestRequest) => void }) {
  const days: [string, GuestRequest[]][] = [];
  for (const b of [...list].sort((a, z) => (a.date + (a.slot ?? "")).localeCompare(z.date + (z.slot ?? "")))) {
    const last = days[days.length - 1];
    if (last && last[0] === b.date) last[1].push(b);
    else days.push([b.date, [b]]);
  }
  return (
    <>
      {days.map(([day, items]) => (
        <Reveal key={day} style={styles.day}>
          <View style={styles.dayHead}>
            <Text style={styles.dayName}>{dayLabel(day)}</Text>
            <View style={styles.dayLine} />
          </View>
          {items.map((b) => (
            <Ticket key={b.reference} b={b} onOpen={() => onOpen(b)} />
          ))}
        </Reveal>
      ))}
    </>
  );
}

export default function MyBookings() {
  const requests = useServicesStore((s) => s.requests);
  const { height } = useWindowDimensions();
  const [past, setPast] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const opened = requests.find((r) => r.reference === open) ?? null;
  const upcoming = requests.filter(isActive);
  const history = requests.filter((r) => !isActive(r));
  const list = past ? history : upcoming;

  return (
    <HeroPage
      photo={REQUESTS_COVER}
      title="Your Requests"
      height={Math.round(Math.min(Math.max(height * 0.38, 290), 360))}
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
          <Text style={styles.over}>{upcoming.length ? `${upcoming.length} in progress` : "Bookings"}</Text>
          <Headline mount soft={1} softStyle={styles.titleSoft} text="Your Requests" style={styles.title} />
        </View>
      }
    >
      <Segments items={[`Active · ${upcoming.length}`, `History · ${history.length}`]} index={past ? 1 : 0} onChange={(i) => setPast(i === 1)}  />
      {list.length ? (
        <Days key={String(past)} list={list} onOpen={(b) => setOpen(b.reference)} />
      ) : (
        <Enter key={String(past)} style={styles.empty}>
          <IconWell name="calendar" size={72} />
          <Text style={styles.emptyName}>{past ? "No past requests" : "Nothing requested yet"}</Text>
          <Text style={styles.note}>{past ? "Nothing here yet." : "Your requests will appear here."}</Text>
          {past ? null : <ActionButton finish="pine" label="Browse services" onPress={() => router.navigate(BASE)} style={styles.browse} />}
        </Enter>
      )}
      <RequestDetail b={opened} onClose={() => setOpen(null)} />
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 6 },
  titleSoft: { color: tone.champagne },
  title: { ...type.hero, fontSize: 42, lineHeight: 50, color: colors.white },
  day: { gap: 12 },
  dayHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  dayName: { ...type.title, fontSize: 22, lineHeight: 28, color: tone.ink },
  dayLine: { flex: 1, height: 1, backgroundColor: tone.line },
  card: { flexDirection: "row", alignItems: "center", gap: 14, padding: 10, paddingRight: 14 },
  thumb: { width: 64, height: 64, borderRadius: 14, backgroundColor: tone.pine },
  stateRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: tone.soft },
  dotOn: { backgroundColor: tone.champagne },
  dotOff: { backgroundColor: colors.danger },
  state: { ...type.eyebrow, fontSize: 9.5, lineHeight: 13, letterSpacing: 1.2, color: tone.soft },
  stateOn: { color: tone.goldText },
  name: { ...type.title, fontSize: 22, lineHeight: 25, color: tone.ink },
  when: { ...type.label, fontSize: 12.5, color: tone.soft, marginTop: 1 },
  view: { flexDirection: "row", alignItems: "center", gap: 2, height: 30, paddingLeft: 11, paddingRight: 7, borderRadius: 15, backgroundColor: tone.badge },
  viewText: { ...type.label, fontSize: 12.5, color: tone.pine },
  empty: { alignItems: "center", paddingTop: 20, gap: spacing.sm },
  emptyName: { ...type.title, color: tone.ink, textAlign: "center" },
  note: { ...type.body, color: tone.soft, textAlign: "center", marginBottom: 18 },
  browse: { alignSelf: "stretch" },
});
