import { useState, type ReactNode } from "react";
import { KeyboardAvoidingView, Modal, StyleSheet, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { ROOM_COVER } from "@/features/services/data/catalog";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { colors, font, spacing } from "@/core/constants/theme";
import { Surface, SurfacePress } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { ActionButton, RoundButton } from "@/features/services/components/ui";
import { useServicesStore } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";

/** Pill showing the guest's room or suite; tap to change it. */
export function RoomPicker({ compact, onPhoto, trigger }: { compact?: boolean; onPhoto?: boolean; /** Draws its own control; gets the function that opens the picker. */ trigger?: (open: () => void) => ReactNode }) {
  const insets = useSafeAreaInsets();
  const room = useServicesStore((s) => s.room);
  const setRoom = useServicesStore((s) => s.setRoom);
  const [draft, setDraft] = useState<string | null>(null);
  const save = () => {
    if (draft?.trim()) setRoom(draft.trim());
    setDraft(null);
  };
  return (
    <>
      {trigger ? (
        trigger(() => setDraft(room))
      ) : compact ? (
        <SurfacePress finish={onPhoto ? "clear" : "glass"} radius={22} onPress={() => setDraft(room)} style={styles.compact} accessibilityLabel={`Your room: ${room}. Change`}>
          <Text style={[styles.compactText, onPhoto && styles.white]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8} maxFontSizeMultiplier={1}>
            {room ? `Serene Heights · ${room.replace(/^(suite|room)\s+/i, "")}` : "Add your room"}
          </Text>
          <Ionicons name="chevron-down" size={15} color={onPhoto ? colors.white : tone.ink} />
        </SurfacePress>
      ) : (
        <SurfacePress finish="glass" radius={18} onPress={() => setDraft(room)} style={styles.pill} accessibilityLabel={`Your room: ${room}. Change`}>
          <View style={styles.well}>
            <Ionicons name="key-outline" size={20} color={tone.pine} />
          </View>
          <View style={styles.fill}>
            <Text style={styles.over}>Your room</Text>
            <Text style={styles.label} numberOfLines={1}>
              {room ? `Serene Heights · ${room}` : "Add your room or suite"}
            </Text>
          </View>
          <Ionicons name="chevron-down-outline" size={16} color={colors.crestSlate} />
        </SurfacePress>
      )}
      <Modal visible={draft !== null} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setDraft(null)} statusBarTranslucent>
        <KeyboardAvoidingView behavior="padding" style={styles.page}>
          <StatusBar style="light" />
          <View style={styles.photo}>
            <Image cachePolicy="memory-disk" source={ROOM_COVER} style={StyleSheet.absoluteFill} contentFit="cover" transition={150} />
            <LinearGradient pointerEvents="none" colors={tone.heroFade} locations={[0, 0.3, 0.55, 1]} style={StyleSheet.absoluteFill} />
            <View style={[styles.close, { top: insets.top + spacing.sm }]}>
              <RoundButton finish="frost" icon="close-outline" label="Close" onPress={() => setDraft(null)} size={40} />
            </View>
            <View style={styles.photoWords}>
              <Text style={styles.eyebrow}>Serene Heights</Text>
              <Text style={styles.title}>
                Your room <Text style={styles.titleSoft}>or suite</Text>
              </Text>
            </View>
          </View>
          <View style={[styles.form, { paddingBottom: insets.bottom + spacing.lg }]}>
            <Text style={styles.hint}>We send every request to this room.</Text>
            <Surface radius={18} style={styles.field}>
              <View style={styles.well}>
                <Ionicons name="key-outline" size={19} color={tone.pine} />
              </View>
              <TextInput value={draft ?? ""} onChangeText={setDraft} autoFocus placeholder="For example Suite 4B" placeholderTextColor={colors.textDim} maxLength={30} returnKeyType="done" onSubmitEditing={save} style={styles.input} accessibilityLabel="Room or suite number" />
            </Surface>
            <View style={styles.fill} />
            <ActionButton finish="pine" label="Save" onPress={save} />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  compact: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 4, height: 44, paddingLeft: 14, paddingRight: 10 },
  compactText: { ...type.label, flexShrink: 1, fontSize: 13, color: tone.ink },
  white: { color: colors.white },
  pill: { flexDirection: "row", alignItems: "center", gap: spacing.md, height: 54, paddingLeft: 7, paddingRight: 18 },
  well: { width: 40, height: 40, borderRadius: 20, backgroundColor: tone.badge, alignItems: "center", justifyContent: "center" },
  fill: { flex: 1 },
  over: { color: colors.muted, fontSize: 11.5, lineHeight: 16 },
  label: { color: colors.ink, fontSize: font.sm, fontFamily: sf.uiSemi },
  page: { flex: 1, backgroundColor: tone.page },
  photo: { height: "42%", minHeight: 260, justifyContent: "flex-end", backgroundColor: tone.pine },
  close: { position: "absolute", right: spacing.lg },
  photoWords: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: 4 },
  eyebrow: { ...type.eyebrow, color: tone.champagne },
  title: { ...type.hero, fontSize: 44, lineHeight: 48, color: colors.white },
  titleSoft: { fontFamily: sf.displayItalic, color: tone.champagne },
  form: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, gap: spacing.md },
  hint: { ...type.label, color: tone.soft },
  field: { flexDirection: "row", alignItems: "center", gap: 12, height: 62, paddingLeft: 10, paddingRight: 18 },
  input: { flex: 1, height: 60, color: colors.ink, fontSize: font.md, fontFamily: sf.uiSemi },
});
