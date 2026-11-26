import { useState } from "react";
import { Alert, StyleSheet, View, useWindowDimensions } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CLEARANCE, colors, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import BrandLockup from "@/features/bookings/guest/components/BrandLockup";
import { Closing } from "@/features/services/components/Closing";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { Segments } from "@/features/services/components/Pick";
import { Headline } from "@/features/services/components/scroll";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { ActionButton, GroupsBack, Press, Surface } from "@/features/services/components/ui";
import { REQUESTS_COVER, serviceBySlug, type Glyph } from "@/features/services/data/catalog";
import { BASE, openAny } from "@/features/services/lib/nav";
import { slotLabel, todayISO, tomorrowISO } from "@/features/services/lib/schedule";
import { describe, isActive, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";
import { openMessage } from "@/features/services/store/useDeskSheet";


const dayLabel = (iso: string) => (iso === todayISO() ? "Today" : iso === tomorrowISO() ? "Tomorrow" : formatDate(iso));

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Fact({ icon, children }: { icon: Glyph; children: string }) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={15} color={tone.soft} />
      <Text style={styles.factText} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

/** A request as an entry in a hotel itinerary: the date on the left, the service and its details on the right, actions beneath. */
function Ticket({ b }: { b: GuestRequest }) {
  const cancel = useServicesStore((s) => s.cancel);
  const service = serviceBySlug(b.slug);
  const live = isActive(b);
  const state = b.status === "cancelled" ? "Cancelled" : live ? "Active" : "Completed";
  const d = new Date(`${b.date}T00:00:00`);
  const ask = () =>
    Alert.alert("Cancel this request?", `${b.name}, ${b.room}`, [
      { text: "Keep", style: "cancel" },
      { text: "Cancel request", style: "destructive", onPress: () => cancel(b.reference) },
    ]);
  return (
    <Surface radius={20} style={styles.card}>
      <View style={styles.top}>
        <View style={styles.date}>
          <Text style={styles.dateDay}>{DAYS[d.getDay()]}</Text>
          <Text style={styles.dateNum}>{String(d.getDate())}</Text>
          <Text style={styles.dateMonth}>{MONTHS[d.getMonth()]}</Text>
        </View>
        <View style={styles.main}>
          <View style={styles.titleRow}>
            <IconWell name={service?.icon ?? "message"} size={38} />
            <View style={[styles.chip, live ? styles.chipOn : b.status === "cancelled" ? styles.chipOff : null]}>
              <View style={[styles.chipDot, live ? styles.chipDotOn : b.status === "cancelled" ? styles.chipDotOff : null]} />
              <Text style={[styles.chipText, live ? styles.chipTextOn : null]} maxFontSizeMultiplier={1.1}>
                {state}
              </Text>
            </View>
          </View>
          <Text style={styles.name} numberOfLines={2}>
            {b.name}
          </Text>
          <View style={styles.facts}>
            <Fact icon="time-outline">{b.slot ? slotLabel(b.slot) : "As soon as possible"}</Fact>
            <Fact icon="key-outline">{b.room}</Fact>
            {b.choices.length || b.note ? <Fact icon="reader-outline">{[...b.choices, b.note].filter(Boolean).join(" · ")}</Fact> : null}
          </View>
        </View>
      </View>
      <View style={styles.foot}>
        <View style={styles.fill}>
          <Text style={styles.charge} numberOfLines={1}>
            {b.kind === "care" ? "Complimentary" : b.kind === "message" ? "Message to the desk" : "Billed to room"}
          </Text>
          <Text style={styles.ref}>{b.reference}</Text>
        </View>
        {live ? (
          <>
            <Press onPress={() => whatsappDesk(b.room, describe(b))} hitSlop={6} accessibilityLabel={`Send ${b.name} on WhatsApp`} style={styles.action}>
              <Ionicons name="logo-whatsapp" size={16} color={tone.pine} />
              <Text style={styles.actionText}>WhatsApp</Text>
            </Press>
            <Press onPress={ask} hitSlop={6} accessibilityLabel={`Cancel ${b.name}`} style={[styles.action, styles.actionOff]}>
              <Text style={[styles.actionText, styles.actionTextOff]}>Cancel</Text>
            </Press>
          </>
        ) : service ? (
          <Press onPress={() => openAny(service)} hitSlop={6} accessibilityLabel={`Request ${b.name} again`} style={styles.action}>
            <Ionicons name="refresh-outline" size={16} color={tone.pine} />
            <Text style={styles.actionText}>Request again</Text>
          </Press>
        ) : null}
      </View>
    </Surface>
  );
}

/** Requests in the order they happen, under the day they fall on. */
function Days({ list }: { list: GuestRequest[] }) {
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
            <Text style={styles.dayCount}>{items.length === 1 ? "1 request" : `${items.length} requests`}</Text>
          </View>
          {items.map((b) => (
            <Ticket key={b.reference} b={b} />
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
          <Headline mount text="Your Requests" style={styles.title} />
        </View>
      }
    >
      <Segments items={[`Active · ${upcoming.length}`, `History · ${history.length}`]} index={past ? 1 : 0} onChange={(i) => setPast(i === 1)} style={styles.tabs} />
      {list.length ? (
        <Days key={String(past)} list={list} />
      ) : (
        <Enter key={String(past)} style={styles.empty}>
          <IconWell name="calendar" size={72} />
          <Text style={styles.emptyName}>{past ? "No past requests" : "Nothing requested yet"}</Text>
          <Text style={styles.note}>{past ? "Completed and cancelled requests appear here." : "Order, book or ask the desk; it will appear here."}</Text>
          {past ? null : <ActionButton finish="pine" label="Browse services" onPress={() => router.navigate(BASE)} style={styles.browse} />}
        </Enter>
      )}
      <Reveal>
        <Press onPress={openMessage} accessibilityLabel="Ask the Front Desk" style={styles.help}>
          <IconWell name="message" size={46} />
          <View style={styles.fill}>
            <Text style={styles.helpName}>Need to change something?</Text>
            <Text style={styles.helpLine}>Message the Front Desk</Text>
          </View>
          <Ionicons name="chevron-forward" size={17} color={tone.soft} />
        </Press>
      </Reveal>
      <Closing />
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  over: { ...type.eyebrow, color: colors.white, marginBottom: 6 },
  title: { ...type.hero, fontSize: 42, lineHeight: 50, color: colors.white },
  tabs: { marginBottom: -12 },
  day: { gap: 14 },
  dayHead: { flexDirection: "row", alignItems: "center", gap: 12 },
  dayName: { ...type.title, fontSize: 22, lineHeight: 28, color: tone.ink },
  dayLine: { flex: 1, height: 1, backgroundColor: tone.line },
  dayCount: { ...type.label, color: tone.soft },
  card: { overflow: "hidden" },
  top: { flexDirection: "row" },
  // The date, set apart like the stub of a ticket.
  date: { width: 74, alignItems: "center", justifyContent: "center", paddingVertical: 18, borderRightWidth: 1, borderRightColor: tone.line, backgroundColor: tone.page },
  dateDay: { ...type.eyebrow, fontSize: 10.5, lineHeight: 14, color: tone.soft },
  dateNum: { ...type.hero, fontSize: 34, lineHeight: 40, color: tone.ink },
  dateMonth: { ...type.label, fontSize: 12.5, color: tone.soft },
  main: { flex: 1, padding: 16, gap: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, height: 26, paddingHorizontal: 10, borderRadius: 13, backgroundColor: tone.badge },
  chipOn: { backgroundColor: tone.pine },
  chipOff: { backgroundColor: "rgba(160, 60, 50, 0.08)" },
  chipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: tone.soft },
  chipDotOn: { backgroundColor: tone.champagne },
  chipDotOff: { backgroundColor: colors.danger },
  chipText: { ...type.eyebrow, fontSize: 10, lineHeight: 14, letterSpacing: 1.2, color: tone.ink },
  chipTextOn: { color: colors.white },
  name: { ...type.onPhoto, fontSize: 21, lineHeight: 26, color: tone.ink },
  facts: { gap: 6 },
  fact: { flexDirection: "row", alignItems: "center", gap: 9 },
  factText: { ...type.label, fontSize: 13.5, lineHeight: 18, color: tone.ink, flexShrink: 1 },
  foot: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12, paddingLeft: 16, paddingRight: 12, borderTopWidth: 1, borderTopColor: tone.line },
  charge: { ...type.button, fontSize: 13.5, lineHeight: 18, color: tone.ink },
  ref: { ...type.figure, fontSize: 12, lineHeight: 16, color: tone.soft },
  action: { flexDirection: "row", alignItems: "center", gap: 6, height: 38, paddingHorizontal: 13, borderRadius: 19, backgroundColor: tone.badge },
  actionOff: { backgroundColor: "rgba(160, 60, 50, 0.08)" },
  actionText: { ...type.label, fontSize: 13, color: tone.pine },
  actionTextOff: { color: colors.danger },
  empty: { alignItems: "center", paddingTop: 20, gap: spacing.sm },
  emptyName: { ...type.title, color: tone.ink, textAlign: "center" },
  note: { ...type.body, color: tone.soft, textAlign: "center", marginBottom: 18 },
  browse: { alignSelf: "stretch" },
  help: { flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 20, borderWidth: 1, borderColor: tone.line },
  helpName: { ...type.button, color: tone.ink },
  helpLine: { ...type.label, color: tone.soft },
});
