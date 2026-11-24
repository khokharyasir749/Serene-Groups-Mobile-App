import { Linking, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/core/components/Text";
import { CONTACT } from "@/core/constants/serene";
import { colors, font, fonts, spacing, svc } from "@/core/constants/theme";
import { toast } from "@/core/stores/uiStore";
import { DriftPhoto } from "@/features/services/components/motion";
import { ActionButton, Surface } from "@/features/services/components/ui";
import { RECEPTION } from "@/features/services/data/catalog";
import { openMessage } from "@/features/services/store/useDeskSheet";

export const callDesk = () => void Linking.openURL(CONTACT.uanHref).catch(() => toast(`Please call ${CONTACT.uan}`));

/** The concierge card: our reception, one tap to call, one tap to message. */
export function FrontDesk() {
  return (
    <View style={styles.card}>
      <DriftPhoto source={RECEPTION} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={svc.photoFade} locations={[0, 0.3, 1]} style={StyleSheet.absoluteFill} />
      <Surface finish="clear" radius={20} style={styles.body}>
        <View>
          <Text style={styles.title}>Front Desk</Text>
          <Text style={styles.line}>Report a problem or ask for anything.</Text>
        </View>
        <View style={styles.row}>
          <ActionButton finish="frost" icon="call-outline" label="Call" accessibilityLabel="Call Front Desk" onPress={callDesk} style={styles.fill} />
          <ActionButton finish="clear" icon="chatbubble-outline" label="Message" accessibilityLabel="Quick Message to Desk" onPress={openMessage} style={styles.fill} />
        </View>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: 262, borderRadius: 26, overflow: "hidden", justifyContent: "flex-end", padding: 10, backgroundColor: colors.stone },
  body: { padding: spacing.lg - 6, gap: spacing.md },
  title: { color: colors.white, fontSize: font.lg, fontFamily: fonts.uiBold },
  line: { color: colors.white, fontSize: font.sm },
  row: { flexDirection: "row", gap: 10 },
  fill: { flex: 1 },
});
