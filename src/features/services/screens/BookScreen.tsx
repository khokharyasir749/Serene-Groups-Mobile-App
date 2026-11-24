import { useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { toast } from "@/core/stores/uiStore";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import { Canvas, Surface, ActionButton, SurfacePress, Heading, ServicesHeader } from "@/features/services/components/ui";
import { serviceBySlug } from "@/features/services/data/catalog";
import { nextDays, SLOTS, slotLabel, slotsOn } from "@/features/services/lib/schedule";
import { useServicesStore } from "@/features/services/store/useServicesStore";

export default function BookScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ slug: string }>();
  const service = serviceBySlug(params.slug);
  const days = useMemo(nextDays, []);
  const all = service?.slots ?? SLOTS;
  const [date, setDate] = useState(() => (days.find((d) => slotsOn(d.iso, all).length > 0) ?? days[0]).iso);
  const open = slotsOn(date, all);
  const [picked, setPicked] = useState<string | null>(null);
  const slot = picked && open.includes(picked) ? picked : open[0];
  const [choices, setChoices] = useState<string[]>([]);
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
    <Canvas>
      <StatusBar style="dark" />
      <ServicesHeader back title={service.name} overline={service.line} />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Heading>{service.choiceTitle}</Heading>
          <View style={styles.slots}>
            {service.choices.map(({ label }) => {
              const on = choices.includes(label);
              return (
                <SurfacePress key={label} finish={on ? "pine" : "ivory"} radius={12} onPress={() => setChoices((c) => (on ? c.filter((x) => x !== label) : [...c, label]))} style={styles.slot} accessibilityRole="checkbox" accessibilityState={{ checked: on }}>
                  <Text style={[styles.slotText, on && styles.onText]}>{label}</Text>
                </SurfacePress>
              );
            })}
          </View>
          <Heading>Room or suite</Heading>
          <RoomPicker />
          <Heading>Date</Heading>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.bleed} contentContainerStyle={styles.days}>
            {days.map((d) => {
              const on = d.iso === date;
              return (
                <SurfacePress key={d.iso} finish={on ? "pine" : "ivory"} radius={12} onPress={() => setDate(d.iso)} style={styles.day} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={`${d.day} ${formatDate(d.iso)}`}>
                  <Text style={[styles.dayName, on && styles.onSoft]}>{d.day}</Text>
                  <Text style={[styles.dayNum, on && styles.onText]}>{String(d.date)}</Text>
                </SurfacePress>
              );
            })}
          </ScrollView>
          <Heading>Time</Heading>
          <View style={styles.slots}>
            {open.map((s) => {
              const on = s === slot;
              return (
                <SurfacePress key={s} finish={on ? "pine" : "ivory"} radius={12} onPress={() => setPicked(s)} style={styles.slot} accessibilityRole="radio" accessibilityState={{ checked: on }}>
                  <Text style={[styles.slotText, on && styles.onText]}>{slotLabel(s)}</Text>
                </SurfacePress>
              );
            })}
          </View>
          {open.length ? null : <Text style={styles.when}>No times left today. Please choose another day.</Text>}
          <Heading>Note for the desk</Heading>
          <Surface radius={12}>
            <TextInput value={notes} onChangeText={setNotes} placeholder="Details, dietary needs, number of guests" placeholderTextColor={colors.textDim} multiline maxLength={300} style={styles.notes} accessibilityLabel="Note for the desk" />
          </Surface>
        </ScrollView>
        <Surface radius={20} style={[styles.bar, { marginBottom: insets.bottom + spacing.md }]}>
          <View style={styles.fill}>
            <Text style={styles.when}>{slot ? `${formatDate(date)} · ${slotLabel(slot)}` : formatDate(date)}</Text>
            <Text style={styles.total}>Billed to room</Text>
          </View>
          <ActionButton finish="pineGlass" label={service.verb ?? "Request"} icon="checkmark-outline" onPress={confirm} style={styles.cta} />
        </Surface>
      </KeyboardAvoidingView>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingTop: spacing.md + 2, paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: spacing.xxl },
  bleed: { marginHorizontal: -spacing.lg, flexGrow: 0 },
  days: { paddingHorizontal: spacing.lg, paddingVertical: 4, gap: 10 },
  day: { width: 62, height: 76, alignItems: "center", justifyContent: "center" },
  dayName: { color: colors.muted, fontSize: font.xs },
  dayNum: { color: colors.ink, fontSize: 20, fontFamily: fonts.uiBold },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  slot: { height: 44, paddingHorizontal: 18, justifyContent: "center" },
  slotText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  onText: { color: colors.snow },
  onSoft: { color: colors.goldAccent },
  notes: { minHeight: 96, padding: spacing.lg, textAlignVertical: "top", color: colors.ink, fontSize: font.md, fontFamily: fonts.ui },
  bar: { flexDirection: "row", alignItems: "center", gap: spacing.md, height: 72, marginHorizontal: spacing.lg, marginTop: spacing.sm, paddingLeft: spacing.xl, paddingRight: 9 },
  when: { color: colors.muted, fontSize: 12 },
  total: { color: colors.ink, fontSize: font.md, fontFamily: fonts.uiBold },
  cta: { minWidth: 150 },
});
