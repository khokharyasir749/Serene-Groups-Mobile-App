import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, icon as iconSize, spacing } from "@/core/constants/theme";
import { Button } from "./Button";

type Props = {
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, message, icon = "file-tray-outline", actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <Ionicons name={icon} size={iconSize.xl} color={colors.textDim} />
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button label={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", padding: spacing.xxl, gap: spacing.sm },
  title: { color: colors.text, fontSize: font.lg, fontWeight: "700", textAlign: "center" },
  message: { color: colors.textMuted, fontSize: font.md, textAlign: "center" },
  action: { marginTop: spacing.md, alignSelf: "stretch" },
});
