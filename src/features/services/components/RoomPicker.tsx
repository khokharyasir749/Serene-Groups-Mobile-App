import { useState } from "react";
import { KeyboardAvoidingView, Modal, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing, svc } from "@/core/constants/theme";
import { Surface, SurfacePress } from "@/features/services/components/surface";
import { ActionButton, RoundButton } from "@/features/services/components/ui";
import { useServicesStore } from "@/features/services/store/useServicesStore";

/** Pill showing the guest's room or suite; tap to change it. */
export function RoomPicker() {
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
      <SurfacePress finish="glass" radius={18} onPress={() => setDraft(room)} style={styles.pill} accessibilityLabel={`Your room: ${room}. Change`}>
        <Surface finish="pine" radius={12} style={styles.well}>
          <Ionicons name="key-outline" size={18} color={colors.white} />
        </Surface>
        <View style={styles.fill}>
          <Text style={styles.over}>Your room</Text>
          <Text style={styles.label} numberOfLines={1}>
            {room ? `Serene Heights · ${room}` : "Add your room or suite"}
          </Text>
        </View>
        <Ionicons name="chevron-down-outline" size={16} color={colors.crestSlate} />
      </SurfacePress>
      <Modal visible={draft !== null} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setDraft(null)} statusBarTranslucent>
        <KeyboardAvoidingView behavior="padding" style={[styles.page, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}>
          <StatusBar style="dark" />
          <View style={styles.top}>
            <Text style={styles.title}>Your room or suite</Text>
            <RoundButton icon="close-outline" label="Close" onPress={() => setDraft(null)} size={40} />
          </View>
          <Text style={styles.over}>As shown on your key card or booking.</Text>
          <Surface radius={14}>
            <TextInput value={draft ?? ""} onChangeText={setDraft} autoFocus placeholder="For example Suite 4B" placeholderTextColor={colors.textDim} maxLength={30} returnKeyType="done" onSubmitEditing={save} style={styles.input} accessibilityLabel="Room or suite number" />
          </Surface>
          <View style={styles.fill} />
          <ActionButton finish="pine" label="Save" onPress={save} />
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pill: { flexDirection: "row", alignItems: "center", gap: spacing.md, height: 54, paddingLeft: 7, paddingRight: 18 },
  well: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  fill: { flex: 1 },
  over: { color: colors.muted, fontSize: 11.5, lineHeight: 16 },
  label: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  page: { flex: 1, backgroundColor: svc.page, paddingHorizontal: spacing.lg, gap: spacing.md },
  top: { flexDirection: "row", alignItems: "center" },
  title: { flex: 1, color: colors.ink, fontSize: 28, lineHeight: 35, fontFamily: fonts.display },
  input: { height: 54, paddingHorizontal: 20, color: colors.ink, fontSize: font.md, fontFamily: fonts.uiSemi },
});
