import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Modal, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { CONTACT } from "@/core/constants/serene";
import { colors, dark, font, fonts, spacing, svc } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { toast } from "@/core/stores/uiStore";
import { Surface, SurfacePress } from "@/features/services/components/surface";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter, Tick } from "@/features/services/components/motion";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { ActionButton, RoundButton } from "@/features/services/components/ui";
import { FREE_SENT, serviceBySlug, type Service } from "@/features/services/data/catalog";
import { slotLabel, todayISO, tomorrowISO } from "@/features/services/lib/schedule";
import { closeDesk, useDeskSheet, type DeskSheetState } from "@/features/services/store/useDeskSheet";
import { describe, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";

const QUICK = ["Something is wrong in my room", "Please call my room", "Late check-out, please", "Luggage help, please"];

export function whatsappDesk(room: string, text: string) {
  openWhatsApp(`Serene Services · ${room}\n${text}`).catch(() => toast(`Please message ${CONTACT.whatsapp}`));
}

function Chips({ items, value, onPick }: { items: { key: string; label: string }[]; value: string | null; onPick: (k: string) => void }) {
  return (
    <View style={styles.chips}>
      {items.map((c) => {
        const on = c.key === value;
        return (
          <SurfacePress key={c.key} finish={on ? "pine" : "ivory"} radius={10} onPress={() => onPick(c.key)} style={styles.chip} accessibilityRole="radio" accessibilityState={{ checked: on }}>
            <Text style={[styles.chipText, on && styles.chipOn]}>{c.label}</Text>
          </SurfacePress>
        );
      })}
    </View>
  );
}

function RoomField() {
  const room = useServicesStore((s) => s.room);
  const setRoom = useServicesStore((s) => s.setRoom);
  return (
    <Surface radius={14} style={styles.field}>
      <Ionicons name="key-outline" size={18} color={colors.crestSlate} />
      <TextInput value={room} onChangeText={setRoom} placeholder="Room or suite number" placeholderTextColor={colors.textDim} maxLength={30} style={styles.input} accessibilityLabel="Room or suite number" />
    </Surface>
  );
}

function NoteField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <Surface radius={14}>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor={colors.textDim} multiline maxLength={300} style={styles.note} accessibilityLabel={placeholder} />
    </Surface>
  );
}

/** Full-screen page: bar, photo, scrolling form, pinned actions. */
function Page({ title, line, icon, footer, children }: { title: string; line: string; icon: ServiceIconName; footer: ReactNode; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView behavior="padding" style={[styles.page, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.barTop}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <RoundButton icon="close-outline" label="Close" onPress={closeDesk} size={40} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Enter style={styles.lead}>
          <IconWell name={icon} size={64} />
          <Text style={styles.line}>{line}</Text>
        </Enter>
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
    <Page title={service.name} line={`Complimentary. ${service.description}`} icon={service.icon} footer={<SendButton label="Send to Front Desk" why={room.trim() ? null : "Please add your room number"} onPress={send} />}>
      <Text style={styles.label}>Room or suite</Text>
      <RoomField />
      <Text style={styles.label}>{service.choiceTitle}</Text>
      {service.slots ? (
        <Chips items={service.slots.map((s) => ({ key: s, label: slotLabel(s) }))} value={slot} onPick={setSlot} />
      ) : (
        <Chips items={service.choices.map((c) => ({ key: c.label, label: c.label }))} value={choice} onPick={(k) => setChoice(k === choice ? null : k)} />
      )}
      <Text style={styles.label}>Note</Text>
      <NoteField value={note} onChange={setNote} placeholder="Optional" />
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
      line="Report a problem or ask for anything."
      icon="message"
      footer={
        <SendButton label="Send to desk" why={why} onPress={() => setSent(add({ kind: "message", slug: null, name: "Message to desk", code: null, choices: [], date: todayISO(), slot: null, note: text }))}>
          {(guard) => <ActionButton finish="ivory" icon="logo-whatsapp" label="Send on WhatsApp" onPress={() => guard(() => whatsappDesk(room.trim(), text.trim()))} />}
        </SendButton>
      }
    >
      <Text style={styles.label}>Room or suite</Text>
      <RoomField />
      <Text style={styles.label}>Message</Text>
      <NoteField value={text} onChange={setText} placeholder="Write your message" />
      <Chips items={QUICK.map((q) => ({ key: q, label: q }))} value={text} onPick={setText} />
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
      <ActionButton finish="pine" label={label} onPress={() => guard(onPress)} />
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
      {sheet ? <Body key={id} sheet={sheet} /> : <View style={styles.page} />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: svc.page },
  barTop: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { flex: 1, color: colors.ink, fontSize: 28, lineHeight: 35, fontFamily: fonts.display },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  lead: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  line: { flex: 1, color: colors.muted, fontSize: font.sm + 1 },
  body: { gap: spacing.md },
  label: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiBold, marginTop: 4 },
  field: { flexDirection: "row", alignItems: "center", gap: 10, height: 52, paddingHorizontal: 16 },
  input: { flex: 1, height: 52, color: colors.ink, fontSize: font.md, fontFamily: fonts.uiSemi },
  note: { minHeight: 104, padding: 16, textAlignVertical: "top", color: colors.ink, fontSize: font.md, fontFamily: fonts.ui },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  chip: { height: 42, paddingHorizontal: 15, justifyContent: "center" },
  chipText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  chipOn: { color: colors.white },
  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 10, borderTopWidth: 1, borderTopColor: svc.surfaceEdge },
  why: { color: colors.danger, fontSize: 12, textAlign: "center" },
  sentPage: { backgroundColor: svc.panel, paddingHorizontal: spacing.lg },
  sent: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  sentWords: { alignItems: "center", gap: 6 },
  sentTitle: { color: dark.text, fontSize: 34, lineHeight: 42, fontFamily: fonts.display, textAlign: "center" },
  sentLine: { color: colors.goldAccent, fontSize: font.md, fontFamily: fonts.uiBold },
  sentMeta: { color: dark.muted, fontSize: font.sm },
  actions: { gap: 10 },
});
