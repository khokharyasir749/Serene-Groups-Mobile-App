import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { CONTACT } from "@/core/constants/serene";
import { colors, dark, font, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { toast } from "@/core/stores/uiStore";
import { Pick } from "@/features/services/components/Pick";
import { Surface } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { DriftPhoto, Enter, Tick } from "@/features/services/components/motion";
import { ServiceIcon, type ServiceIconName } from "@/features/services/components/ServiceIcon";
import { ActionButton, Heading, RoundButton } from "@/features/services/components/ui";
import { DESK_COVER, FREE_SENT, serviceBySlug, type Service } from "@/features/services/data/catalog";
import { slotLabel, todayISO, tomorrowISO } from "@/features/services/lib/schedule";
import { closeDesk, useDeskSheet, type DeskSheetState } from "@/features/services/store/useDeskSheet";
import { describe, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";
import { Ready } from "@/features/services/components/Text";

const QUICK = ["Problem in my room", "Call my room", "Late check-out", "Luggage help"];

export function whatsappDesk(room: string, text: string) {
  openWhatsApp(`Serene Services · ${room}\n${text}`).catch(() => toast(`Please message ${CONTACT.whatsapp}`));
}

function Chips({ items, value, onPick }: { items: { key: string; label: string }[]; value: string | null; onPick: (k: string) => void }) {
  return (
    <View style={styles.chips}>
      {items.map((c) => {
        const on = c.key === value;
        return (
          <Pick key={c.key} on={on} radius={21} onPress={() => onPick(c.key)} style={styles.chip}>
            <Text style={[styles.chipText, on && styles.chipOn]}>{c.label}</Text>
          </Pick>
        );
      })}
    </View>
  );
}

function RoomField() {
  const room = useServicesStore((s) => s.room);
  const setRoom = useServicesStore((s) => s.setRoom);
  return (
    <Surface radius={22} style={styles.field}>
      <View style={styles.key}>
        <Ionicons name="key-outline" size={17} color={tone.pine} />
      </View>
      <TextInput value={room} onChangeText={setRoom} placeholder="Room or suite number" placeholderTextColor={colors.muted} maxLength={30} style={styles.input} accessibilityLabel="Room or suite number" />
      <Ionicons name="create-outline" size={17} color={tone.soft} />
    </Surface>
  );
}

function NoteField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Surface radius={22}>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.muted} multiline maxLength={300} style={styles.note} accessibilityLabel={placeholder} />
      <Text style={styles.count}>{value.length}/300</Text>
    </Surface>
  );
}

/** Full-screen page: Pine header that scrolls away, grouped form, pinned actions. */
function Page({ title, line, icon, footer, children }: { title: string; line: string; icon: ServiceIconName; footer: ReactNode; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.page}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.head, { paddingTop: insets.top + spacing.md }]}>
          <DriftPhoto source={DESK_COVER} style={StyleSheet.absoluteFill} />
          <LinearGradient pointerEvents="none" colors={tone.deskHead} style={StyleSheet.absoluteFill} />
          <View style={styles.close}>
            <RoundButton finish="frost" icon="close-outline" label="Close" onPress={closeDesk} size={42} />
          </View>
          <Enter style={styles.headBody}>
            <View style={styles.well}>
              <ServiceIcon name={icon} size={28} color={colors.white} />
            </View>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{line}</Text>
            </View>
          </Enter>
        </View>
        <Enter order={1} style={styles.body}>
          {children}
        </Enter>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>{footer}</View>
    </KeyboardAvoidingView>
  );
}

function Sent({ request }: { request: GuestRequest }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.page, styles.sentPage, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      <View style={styles.sent}>
        <Tick />
        <Enter order={3} style={styles.sentWords}>
          <Text style={styles.sentTitle}>{request.name}</Text>
          <Text style={styles.sentLine}>{request.kind === "care" ? FREE_SENT : "Desk Notified"}</Text>
          <Text style={styles.sentMeta}>{`${request.room} · ${request.reference}`}</Text>
        </Enter>
      </View>
      <Enter order={5} style={styles.actions}>
        <ActionButton finish="frost" label="Done" onPress={closeDesk} />
        <ActionButton finish="dark" icon="logo-whatsapp" label="Also send on WhatsApp" onPress={() => whatsappDesk(request.room, describe(request))} />
      </Enter>
    </View>
  );
}

function CareForm({ service }: { service: Service }) {
  const room = useServicesStore((s) => s.room);
  const add = useServicesStore((s) => s.add);
  const [choice, setChoice] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(service.slots?.[2] ?? null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<GuestRequest | null>(null);
  if (sent) return <Sent request={sent} />;

  const send = () => {
    const picked = service.choices.find((c) => c.label === choice);
    setSent(add({ kind: "care", slug: service.slug, name: service.name, code: picked?.code ?? service.code ?? null, choices: picked ? [picked.label] : [], date: slot ? tomorrowISO() : todayISO(), slot, note }));
  };
  return (
    <Page title={service.name} line="Complimentary" icon={service.icon} footer={<SendButton label="Send to Front Desk" why={room.trim() ? null : "Please add your room number"} onPress={send} />}>
      <View style={styles.block}>
        <Heading small>Room or suite</Heading>
        <RoomField />
      </View>
      <View style={styles.block}>
        <Heading small>{service.choiceTitle}</Heading>
      {service.slots ? (
        <Chips items={service.slots.map((s) => ({ key: s, label: slotLabel(s) }))} value={slot} onPick={setSlot} />
      ) : (
        <Chips items={service.choices.map((c) => ({ key: c.label, label: c.label }))} value={choice} onPick={(k) => setChoice(k === choice ? null : k)} />
      )}
      </View>
      <View style={styles.block}>
        <Heading small>Note</Heading>
        <NoteField value={note} onChange={setNote} placeholder="Optional" />
      </View>
    </Page>
  );
}

function MessageForm() {
  const room = useServicesStore((s) => s.room);
  const add = useServicesStore((s) => s.add);
  const [text, setText] = useState("");
  const [sent, setSent] = useState<GuestRequest | null>(null);
  if (sent) return <Sent request={sent} />;

  const why = !room.trim() ? "Please add your room number" : !text.trim() ? "Please write a message" : null;
  return (
    <Page
      title="Message the Front Desk"
      line="Ask for anything"
      icon="message"
      footer={
        <SendButton label="Send to desk" why={why} onPress={() => setSent(add({ kind: "message", slug: null, name: "Message to desk", code: null, choices: [], date: todayISO(), slot: null, note: text }))}>
          {(guard) => <ActionButton finish="ivory" icon="logo-whatsapp" label="Send on WhatsApp" onPress={() => guard(() => whatsappDesk(room.trim(), text.trim()))} />}
        </SendButton>
      }
    >
      <View style={styles.block}>
        <Heading small>Room or suite</Heading>
        <RoomField />
      </View>
      <View style={styles.block}>
        <Heading small>Message</Heading>
        <NoteField value={text} onChange={setText} placeholder="Write your message" />
        <Chips items={QUICK.map((q) => ({ key: q, label: q }))} value={text} onPick={setText} />
      </View>
    </Page>
  );
}

/** Says what is missing only after a try. Inline, because toasts sit under a modal. */
function SendButton({ label, why, onPress, children }: { label: string; why: string | null; onPress: () => void; children?: (guard: (go: () => void) => void) => ReactNode }) {
  const [tried, setTried] = useState(false);
  const guard = (go: () => void) => (why ? setTried(true) : go());
  return (
    <>
      {tried && why ? <Text style={styles.why}>{why}</Text> : null}
      <ActionButton finish="pine" icon="paper-plane-outline" label={label} onPress={() => guard(onPress)} />
      {children?.(guard)}
    </>
  );
}

function Body({ sheet }: { sheet: DeskSheetState }) {
  if (sheet.type === "message") return <MessageForm />;
  const service = serviceBySlug(sheet.slug);
  return service ? <CareForm service={service} /> : null;
}

/** The one-tap request and quick-message pages; mounted once for the whole module. */
export function DeskSheetHost() {
  const { sheet, id } = useDeskSheet();
  return (
    <Modal visible={sheet !== null} animationType="slide" presentationStyle="fullScreen" onRequestClose={closeDesk} statusBarTranslucent>
      {sheet ? (
        <Ready key={id}>
          <Body sheet={sheet} />
        </Ready>
      ) : <View style={styles.page} />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: tone.page },
  content: { paddingBottom: spacing.xl },
  head: { overflow: "hidden", backgroundColor: tone.pine, paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  close: { alignItems: "flex-end" },
  headBody: { gap: 14, paddingTop: 2 },
  well: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.14)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.4)" },
  title: { ...type.page, color: colors.white },
  tag: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 6, height: 30, paddingHorizontal: 13, borderRadius: 15, backgroundColor: "rgba(255, 255, 255, 0.12)", borderWidth: 1, borderColor: "rgba(255, 255, 255, 0.3)" },
  tagText: { ...type.eyebrow, fontSize: 10.5, color: colors.white },
  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.xl },
  block: { gap: spacing.md },
  field: { flexDirection: "row", alignItems: "center", gap: 12, height: 58, paddingLeft: 10, paddingRight: 18 },
  key: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: tone.badge },
  input: { flex: 1, height: 56, color: colors.ink, fontSize: font.md, fontFamily: sf.uiSemi },
  note: { minHeight: 120, paddingHorizontal: 18, paddingTop: 16, paddingBottom: 30, textAlignVertical: "top", color: colors.ink, fontSize: font.md, fontFamily: sf.ui },
  count: { position: "absolute", right: 16, bottom: 10, color: tone.soft, fontSize: 11.5 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { height: 42, paddingHorizontal: 15, justifyContent: "center" },
  chipText: { color: colors.ink, fontSize: font.sm, fontFamily: sf.uiSemi },
  chipOn: { color: colors.white },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 10, borderTopWidth: 1, borderTopColor: tone.hair, backgroundColor: tone.page },
  why: { color: colors.danger, fontSize: 12, textAlign: "center" },
  sentPage: { backgroundColor: tone.pine, paddingHorizontal: spacing.lg },
  sent: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  sentWords: { alignItems: "center", gap: 6 },
  sentTitle: { color: dark.text, fontSize: 34, lineHeight: 42, fontFamily: sf.display, textAlign: "center" },
  sentLine: { color: colors.goldAccent, fontSize: font.md, fontFamily: sf.uiBold },
  sentMeta: { color: dark.muted, fontSize: font.sm },
  actions: { gap: 10 },
});
