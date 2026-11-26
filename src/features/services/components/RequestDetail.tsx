import { Alert, Modal, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { ClearGlass, glassText } from "@/features/services/components/ClearGlass";
import { Sheet, useDismiss, whatsappDesk } from "@/features/services/components/DeskSheet";
import { Backdrop } from "@/features/services/components/Backdrop";
import { Enter } from "@/features/services/components/motion";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { ActionButton, RoundButton } from "@/features/services/components/ui";
import { DESK_COVER, GROUP_PHOTO, serviceBySlug } from "@/features/services/data/catalog";
import { openAny } from "@/features/services/lib/nav";
import { slotLabel } from "@/features/services/lib/schedule";
import { describe, isActive, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";

/** A request's own page: its picture behind, the details on dark glass so every line reads, and what can still be done. */
function Detail({ b }: { b: GuestRequest }) {
  const insets = useSafeAreaInsets();
  const dismiss = useDismiss();
  const cancel = useServicesStore((s) => s.cancel);
  const service = serviceBySlug(b.slug);
  const photo = service?.photo ?? (service?.group ? GROUP_PHOTO[service.group] : undefined) ?? DESK_COVER;
  const live = isActive(b);
  const state = b.status === "cancelled" ? "Cancelled" : live ? "Active" : "Completed";
  const rows: [string, string][] = [
    ["When", b.slot ? `${formatDate(b.date)} · ${slotLabel(b.slot)}` : `${formatDate(b.date)} · As soon as possible`],
    ["Room", b.room],
    ...(b.choices.length ? ([["Details", b.choices.join(", ")]] as [string, string][]) : []),
    ...(b.note ? ([["Note", b.note]] as [string, string][]) : []),
    ["Charge", b.kind === "care" ? "Complimentary" : b.kind === "message" ? "Message to the desk" : "Billed to room"],
    ["Reference", b.reference],
  ];
  const ask = () =>
    Alert.alert("Cancel this request?", `${b.name}, ${b.room}`, [
      { text: "Keep", style: "cancel" },
      {
        text: "Cancel request",
        style: "destructive",
        onPress: () => {
          cancel(b.reference);
          dismiss();
        },
      },
    ]);
  return (
    <View style={[styles.page, { paddingTop: insets.top + 34, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      <Backdrop source={photo} />
      <View style={styles.top}>
        <View style={[styles.state, live && styles.stateOn]}>
          <View style={[styles.dot, live && styles.dotOn]} />
          <Text style={styles.stateText}>{state}</Text>
        </View>
        <RoundButton finish="frost" icon="close-outline" label="Close" onPress={dismiss} size={40} />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Enter order={1}>
          <Text style={styles.name}>{b.name}</Text>
        </Enter>
        <Enter order={2} style={styles.stretch}>
          <ClearGlass dark radius={22} style={styles.card}>
            {rows.map(([k, v], i) => (
              <View key={k} style={[styles.row, i > 0 && styles.rowLine]}>
                <Text style={styles.k}>{k}</Text>
                <Text style={styles.v}>{v}</Text>
              </View>
            ))}
          </ClearGlass>
        </Enter>
      </ScrollView>
      <Enter order={3} style={styles.actions}>
        <ActionButton finish="frost" icon="logo-whatsapp" label="Send on WhatsApp" onPress={() => whatsappDesk(b.room, describe(b))} />
        {live ? (
          <ActionButton finish="clear" label="Cancel request" onPress={ask} />
        ) : service ? (
          <ActionButton
            finish="clear"
            label="Request again"
            onPress={() => {
              dismiss();
              openAny(service);
            }}
          />
        ) : null}
      </Enter>
    </View>
  );
}

/** Opens a request full screen, rising on a spring like the request pages do. */
export function RequestDetail({ b, onClose }: { b: GuestRequest | null; onClose: () => void }) {
  return (
    <Modal visible={b !== null} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {b ? (
        <Sheet key={b.reference} onClosed={onClose}>
          <Detail b={b} />
        </Sheet>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: spacing.lg, backgroundColor: tone.pineDeep },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  state: { flexDirection: "row", alignItems: "center", gap: 7, height: 30, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: tone.deskGlassEdge, backgroundColor: "rgba(255, 255, 255, 0.14)" },
  stateOn: { backgroundColor: "rgba(49, 74, 67, 0.75)" },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white, opacity: 0.6 },
  dotOn: { backgroundColor: tone.champagne, opacity: 1 },
  stateText: { ...type.eyebrow, fontSize: 10.5, lineHeight: 14, color: colors.white },
  content: { flexGrow: 1, justifyContent: "center", gap: 22, paddingVertical: spacing.xl },
  name: { ...type.hero, fontSize: 46, lineHeight: 50, color: colors.white, ...glassText },
  stretch: { alignSelf: "stretch" },
  card: { paddingHorizontal: 18, paddingVertical: 4 },
  row: { flexDirection: "row", gap: 16, paddingVertical: 14 },
  rowLine: { borderTopWidth: 1, borderTopColor: "rgba(255, 255, 255, 0.14)" },
  k: { ...type.label, width: 84, fontSize: 13.5, color: tone.onDarkSoft, ...glassText },
  v: { ...type.button, ...glassText, flex: 1, fontSize: 15, lineHeight: 20, color: colors.white, textAlign: "right" },
  actions: { gap: 10 },
});
