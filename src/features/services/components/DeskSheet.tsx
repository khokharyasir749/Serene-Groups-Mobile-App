import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, KeyboardAvoidingView, Modal, PanResponder, Pressable, ScrollView, StyleSheet, TextInput, View, useWindowDimensions } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { CONTACT } from "@/core/constants/serene";
import { colors, dark, font, spacing } from "@/core/constants/theme";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { toast } from "@/core/stores/uiStore";
import { Backdrop } from "@/features/services/components/Backdrop";
import { ClearGlass, glassText } from "@/features/services/components/ClearGlass";
import { Pick } from "@/features/services/components/Pick";
import { Surface } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { DriftPhoto, Enter, Tick } from "@/features/services/components/motion";
import { ServiceIcon, type ServiceIconName } from "@/features/services/components/ServiceIcon";
import { ActionButton, Heading, RoundButton } from "@/features/services/components/ui";
import { DESK_COVER, FREE_SENT, GROUP_PHOTO, serviceBySlug, type Service } from "@/features/services/data/catalog";
import { slotLabel, todayISO, tomorrowISO } from "@/features/services/lib/schedule";
import { closeDesk, useDeskSheet, type DeskSheetState } from "@/features/services/store/useDeskSheet";
import { describe, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";
import { Ready } from "@/features/services/components/Text";

/** Closes the sheet the same way it came: down, unhurried. */
const Dismiss = createContext<() => void>(closeDesk);
export const useDismiss = () => useContext(Dismiss);

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
  const dismiss = useDismiss();
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.page}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.head, { paddingTop: insets.top + GRIP }]}>
          <DriftPhoto source={DESK_COVER} style={StyleSheet.absoluteFill} />
          <LinearGradient pointerEvents="none" colors={tone.deskHead} style={StyleSheet.absoluteFill} />
          <View style={styles.close}>
            <RoundButton finish="frost" icon="close-outline" label="Close" onPress={dismiss} size={42} />
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
  const service = serviceBySlug(request.slug);
  const photo = (service?.group ? GROUP_PHOTO[service.group] : undefined) ?? DESK_COVER;
  const dismiss = useDismiss();
  return (
    <View style={[styles.page, styles.sentPage, { paddingTop: insets.top + GRIP, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      <Backdrop source={photo} />
      <View style={styles.sent}>
        <Enter order={1} style={styles.sentStretch}>
          <ClearGlass dark style={styles.sentCard}>
            <Tick />
            <View style={styles.sentWords}>
              <Text style={styles.sentTitle}>{request.name}</Text>
              <Text style={styles.sentLine}>{request.kind === "care" ? FREE_SENT : "Desk Notified"}</Text>
              <View style={styles.sentRule} />
              <Text style={styles.sentMeta}>{`${request.room}  ·  ${request.reference}`}</Text>
            </View>
          </ClearGlass>
        </Enter>
      </View>
      <Enter order={4} style={styles.actions}>
        <ActionButton finish="frost" label="Done" onPress={dismiss} />
        <ActionButton finish="clear" icon="logo-whatsapp" label="Also send on WhatsApp" onPress={() => whatsappDesk(request.room, describe(request))} />
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

const GRIP = 26; // the handle's strip at the top of the sheet

/**
 * The sheet itself: it rises on a soft spring over a dimming page, can be drawn down by its handle, and sinks away on close. The
 * page beneath stays in place, so a request feels like a card laid on the table rather than a new screen.
 */
export function Sheet({ children, onClosed = closeDesk, handle = "light" }: { children: ReactNode; /** Runs once the sheet has gone. */ onClosed?: () => void; /** "dark" for a light page under the handle. */ handle?: "light" | "dark" }) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const travel = height;
  const y = useRef(new Animated.Value(travel)).current;
  const leaving = useRef(false);
  const dismiss = () => {
    if (leaving.current) return;
    leaving.current = true;
    Animated.timing(y, { toValue: travel, duration: 280, easing: Easing.in(Easing.cubic), useNativeDriver: true }).start(() => onClosed());
  };
  useEffect(() => {
    Animated.spring(y, { toValue: 0, damping: 26, stiffness: 210, mass: 1, useNativeDriver: true }).start();
  }, [y]);
  const live = useRef({ dismiss });
  live.current = { dismiss };
  const drag = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 4,
      onPanResponderMove: (_, g) => y.setValue(Math.max(0, g.dy)),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120 || g.vy > 1.1) live.current.dismiss();
        else Animated.spring(y, { toValue: 0, damping: 24, stiffness: 260, mass: 0.9, useNativeDriver: true }).start();
      },
    }),
  ).current;
  return (
    <Dismiss.Provider value={dismiss}>
      <View style={styles.stage}>
        <Animated.View style={[StyleSheet.absoluteFill, styles.dim, { opacity: y.interpolate({ inputRange: [0, travel], outputRange: [1, 0], extrapolate: "clamp" }) }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Close" />
        </Animated.View>
        <Animated.View style={[styles.sheet, { transform: [{ translateY: y }] }]}>
          {children}
          <View {...drag.panHandlers} style={[styles.grip, { top: insets.top }]} accessibilityLabel="Drag down to close">
            <View style={[styles.handle, handle === "dark" && styles.handleDark]} />
          </View>
        </Animated.View>
      </View>
    </Dismiss.Provider>
  );
}

/** The one-tap request and quick-message pages; mounted once for the whole module. */
export function DeskSheetHost() {
  const { sheet, id } = useDeskSheet();
  return (
    <Modal visible={sheet !== null} transparent animationType="none" onRequestClose={closeDesk} statusBarTranslucent>
      {sheet ? (
        <Sheet key={id}>
          <Ready>
            <Body sheet={sheet} />
          </Ready>
        </Sheet>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  stage: { flex: 1 },
  dim: { backgroundColor: "rgba(10, 18, 15, 0.5)" },
  sheet: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", backgroundColor: tone.page },
  grip: { position: "absolute", left: 0, right: 0, height: GRIP + 14, alignItems: "center", paddingTop: 8 },
  handle: { width: 40, height: 5, borderRadius: 3, backgroundColor: "rgba(255, 255, 255, 0.7)" },
  handleDark: { backgroundColor: tone.line },
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
  sentPage: { backgroundColor: tone.pineDeep, paddingHorizontal: spacing.lg },
  onGlass: { color: "rgba(255, 255, 255, 0.92)", textShadowColor: "rgba(0, 0, 0, 0.35)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 6 },
  sentStretch: { alignSelf: "stretch" },
  sentCard: { alignItems: "center", paddingTop: 8, paddingBottom: 28, paddingHorizontal: 22 },
  sentRule: { width: 32, height: 1, marginVertical: 8, backgroundColor: "rgba(255, 255, 255, 0.4)" },
  sent: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.lg },
  sentWords: { alignItems: "center", gap: 6 },
  sentTitle: { ...type.hero, ...glassText, fontSize: 40, lineHeight: 44, color: colors.white, textAlign: "center" },
  sentLine: { color: tone.champagne, fontSize: font.md, fontFamily: sf.uiBold },
  sentMeta: { ...type.figure, ...glassText, fontSize: 13, lineHeight: 18, color: colors.white },
  actions: { gap: 10 },
});
