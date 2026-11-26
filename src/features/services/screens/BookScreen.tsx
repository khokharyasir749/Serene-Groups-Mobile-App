import { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { colors, font, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { toast } from "@/core/stores/uiStore";
import { Enter } from "@/features/services/components/motion";
import { HeroPage } from "@/features/services/components/HeroPage";
import { Pick } from "@/features/services/components/Pick";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import { Canvas, Surface, ActionButton, Heading, RoundButton, ServicesHeader } from "@/features/services/components/ui";
import { goBack } from "@/features/services/lib/nav";
import { Headline } from "@/features/services/components/scroll";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { serviceBySlug } from "@/features/services/data/catalog";
import { nextDays, SLOTS, slotLabel, slotsOn } from "@/features/services/lib/schedule";
import { useServicesStore } from "@/features/services/store/useServicesStore";
import { sf } from "@/features/services/components/fonts";

export default function BookScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const params = useLocalSearchParams<{ slug: string; choice?: string }>();
  const service = serviceBySlug(params.slug);
  const days = useMemo(nextDays, []);
  const all = service?.slots ?? SLOTS;
  const [date, setDate] = useState(() => (days.find((d) => slotsOn(d.iso, all).length > 0) ?? days[0]).iso);
  const open = slotsOn(date, all);
  const [picked, setPicked] = useState<string | null>(null);
  const slot = picked && open.includes(picked) ? picked : open[0];
  const [choices, setChoices] = useState<string[]>(() => (service?.choices.some((c) => c.label === params.choice) ? [params.choice!] : []));
  const [notes, setNotes] = useState("");
  const room = useServicesStore((s) => s.room);
  const add = useServicesStore((s) => s.add);
  const sent = useRef(false);

  if (!service) {
    return (
      <Canvas>
        <StatusBar style="dark" />
        <ServicesHeader back title="Service not found" />
      </Canvas>
    );
  }

  const confirm = () => {
    if (sent.current) return;
    if (!room.trim() || !slot) return toast(slot ? "Please add your room number" : "Please choose another day", "warning");
    sent.current = true;
    const made = add({ kind: "extra", slug: service.slug, name: service.name, code: service.code ?? null, choices, date, slot, note: notes });
    router.replace({ pathname: "/serene-services/booked/[ref]", params: { ref: made.reference } });
  };

  return (
      <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <HeroPage
          photo={service.photo}
          title={service.name}
          onBack={goBack}
          height={Math.round(Math.min(Math.max(height * 0.38, 270), 360))}
          bottom={spacing.xxl}
          bar={<RoundButton finish="clear" icon="chevron-back-outline" label="Back" onPress={goBack} />}
          foot={
            <Headline mount text={service.name} style={styles.title} />
          }
        >
          <View style={styles.sheet}>
          <Enter order={0} style={styles.block}>
          <Heading small>{service.choiceTitle}</Heading>
          <View style={styles.slots}>
            {service.choices.map(({ label }) => {
              const on = choices.includes(label);
              return (
                <Pick key={label} on={on} role="checkbox" onPress={() => setChoices((c) => (on ? c.filter((x) => x !== label) : [...c, label]))} style={styles.slot}>
                  <Text style={[styles.slotText, on && styles.onText]}>{label}</Text>
                </Pick>
              );
            })}
          </View>
          </Enter>
          <Enter order={1} style={styles.block}>
          <Heading small>Room or suite</Heading>
          <RoomPicker />
          </Enter>
          <Enter order={2} style={styles.block}>
          <Heading small>Date</Heading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.days}>
            {days.map((d) => {
              const on = d.iso === date;
              return (
                <Pick key={d.iso} on={on} onPress={() => setDate(d.iso)} style={styles.day} label={`${d.day} ${formatDate(d.iso)}`}>
                  <Text style={[styles.dayName, on && styles.onSoft]}>{d.day}</Text>
                  <Text style={[styles.dayNum, on && styles.onText]}>{String(d.date)}</Text>
                </Pick>
              );
            })}
          </ScrollView>
          </Enter>
          <Enter order={3} style={styles.block}>
          <Heading small>Time</Heading>
          <View style={styles.slots}>
            {open.map((s) => {
              const on = s === slot;
              return (
                <Pick key={s} on={on} onPress={() => setPicked(s)} style={styles.slot}>
                  <Text style={[styles.slotText, on && styles.onText]}>{slotLabel(s)}</Text>
                </Pick>
              );
            })}
          </View>
          {open.length ? null : <Text style={styles.when}>No times left today.</Text>}
          </Enter>
          <Enter order={4} style={styles.block}>
          <Heading small>Note for the desk</Heading>
          <Surface radius={22}>
            <TextInput value={notes} onChangeText={setNotes} placeholder="Details, dietary needs, number of guests" placeholderTextColor={colors.muted} multiline maxLength={300} style={styles.notes} accessibilityLabel="Note for the desk" />
          </Surface>
          </Enter>
          </View>
        </HeroPage>
        <Surface radius={34} style={[styles.bar, { marginBottom: insets.bottom + spacing.md }]}>
          <View style={styles.fill}>
            <Text style={styles.when}>{slot ? `${formatDate(date)} · ${slotLabel(slot)}` : formatDate(date)}</Text>
            <Text style={styles.total}>Billed to room</Text>
          </View>
          <ActionButton finish="pine" label={service.verb ?? "Request"} icon="checkmark-outline" onPress={confirm} style={styles.cta} />
        </Surface>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flex: 1, backgroundColor: tone.page },
  title: { ...type.hero, fontSize: 38, lineHeight: 46, color: colors.white },
  sheet: { gap: spacing.xxl },
  block: { gap: spacing.md },
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  days: { paddingHorizontal: spacing.lg, paddingTop: 4, paddingBottom: 16, gap: 10 },
  day: { width: 62, height: 76, alignItems: "center", justifyContent: "center" },
  dayName: { color: colors.muted, fontSize: font.xs },
  dayNum: { color: colors.ink, fontSize: 20, fontFamily: sf.uiBold },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  slotText: { color: colors.ink, fontSize: 14, fontFamily: sf.uiMedium },
  onText: { color: colors.snow },
  onSoft: { color: tone.champagne },
  notes: { minHeight: 96, padding: spacing.lg, textAlignVertical: "top", color: colors.ink, fontSize: font.md, fontFamily: sf.ui },
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md, height: 72, marginHorizontal: spacing.lg, marginTop: spacing.sm, paddingLeft: spacing.xl, paddingRight: 9 },
  when: { color: colors.muted, fontSize: 12 },
  total: { color: colors.ink, fontSize: font.md, fontFamily: sf.uiBold },
  cta: { minWidth: 150 },
});
