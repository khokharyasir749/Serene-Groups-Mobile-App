import { useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font, radius, spacing, toneColors } from "@/core/constants/theme";
import { useUiStore, type Toast as ToastItem } from "@/core/stores/uiStore";

const TOAST_MS = 3500;

function ToastRow({ item }: { item: ToastItem }) {
  const dismiss = useUiStore((s) => s.dismissToast);
  useEffect(() => {
    const t = setTimeout(() => dismiss(item.id), TOAST_MS);
    return () => clearTimeout(t);
  }, [item.id, dismiss]);
  return (
    <Pressable onPress={() => dismiss(item.id)} style={[styles.toast, { borderColor: toneColors[item.tone].fg }]}>
      <Text style={styles.text}>{item.message}</Text>
    </Pressable>
  );
}

/** Toasts + offline banner. Mounted once in the root layout. */
export function ToastHost() {
  const toasts = useUiStore((s) => s.toasts);
  const offline = useUiStore((s) => s.offline);
  const insets = useSafeAreaInsets();
  return (
    <View pointerEvents="box-none" style={[styles.host, { top: insets.top + spacing.sm }]}>
      {offline ? (
        <View style={styles.offline}>
          <Text style={styles.offlineText}>You're offline — showing the last loaded data.</Text>
        </View>
      ) : null}
      {toasts.map((t) => (
        <ToastRow key={t.id} item={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { position: "absolute", left: spacing.lg, right: spacing.lg, gap: spacing.sm, zIndex: 100 },
  toast: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  text: { color: colors.text, fontSize: font.md },
  offline: { backgroundColor: colors.warningSoft, borderRadius: radius.md, padding: spacing.sm },
  offlineText: { color: colors.warning, fontSize: font.sm, textAlign: "center", fontWeight: "600" },
});
