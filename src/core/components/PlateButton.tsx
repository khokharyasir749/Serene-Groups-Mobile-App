import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { colors, explore, groups } from "@/core/constants/theme";
import { PressScale } from "./PressScale";

type Props = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void; size?: number; dot?: boolean; /** Clear glass, for a button over a photo. */ glass?: boolean };

/** Rounded-square ivory button used in every Groups header. */
export function PlateButton({ icon, label, onPress, size = 46, dot, glass }: Props) {
  return (
    <PressScale onPress={onPress} accessibilityLabel={label} hitSlop={6} style={[styles.plate, glass && styles.glass, { width: size, height: size, borderRadius: size * 0.32 }]}>
      <Ionicons name={icon} size={22} color={glass ? colors.white : groups.goldInk} />
      {dot ? <View style={styles.dot} /> : null}
    </PressScale>
  );
}

const styles = StyleSheet.create({
  plate: { backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.plateEdge, alignItems: "center", justifyContent: "center", boxShadow: groups.plateShadow },
  glass: { backgroundColor: explore.glassDark, borderColor: explore.glassEdge, boxShadow: undefined },
  dot: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: groups.champagne },
});
