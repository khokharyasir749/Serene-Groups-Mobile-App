import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/core/components/Text";
import { colors, fonts, groups } from "@/core/constants/theme";
import { PressScale } from "./PressScale";

type Props = { primary: string; onPrimary: () => void; secondary: string; onSecondary: () => void };

/** The page's two actions in one ivory tray: Pine with a champagne arrow, and an outline. */
export function ActionTray({ primary, onPrimary, secondary, onSecondary }: Props) {
  return (
    <View style={styles.tray}>
      <PressScale onPress={onPrimary} style={styles.primary} accessibilityLabel={primary}>
        <Text style={styles.primaryText} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
          {primary}
        </Text>
        <View style={styles.arrow}>
          <Ionicons name="arrow-forward" size={18} color={groups.pine} />
        </View>
      </PressScale>
      <PressScale onPress={onSecondary} style={styles.secondary} accessibilityLabel={secondary}>
        <Text style={styles.secondaryText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
          {secondary}
        </Text>
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: { alignSelf: "center", maxWidth: "100%", flexDirection: "row", gap: 8, padding: 5, borderRadius: 32, backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge, boxShadow: groups.plateShadow },
  primary: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: 12, height: 50, borderRadius: 25, paddingLeft: 20, paddingRight: 7, backgroundColor: groups.pine },
  primaryText: { flexShrink: 1, color: colors.white, fontSize: 15, fontFamily: fonts.uiSemi },
  arrow: { width: 37, height: 37, borderRadius: 19, backgroundColor: groups.champagne, alignItems: "center", justifyContent: "center" },
  secondary: { height: 50, borderRadius: 25, paddingHorizontal: 18, justifyContent: "center", borderWidth: 1.2, borderColor: groups.pine },
  secondaryText: { color: groups.pine, fontSize: 15, fontFamily: fonts.uiMedium },
});
