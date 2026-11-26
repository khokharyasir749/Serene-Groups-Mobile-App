import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ServiceIcon, type ServiceIconName } from "@/features/services/components/ServiceIcon";
import { tone } from "@/features/services/components/tone";

/** Fine Pine outline on a soft disc washed with champagne, ringed by a hairline. */
export function IconWell({ name, size = 48 }: { name: ServiceIconName; size?: number }) {
  const round = { width: size, height: size, borderRadius: size / 2 };
  return (
    <View style={[styles.well, round]}>
      <LinearGradient pointerEvents="none" colors={tone.badgeWash} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={[StyleSheet.absoluteFill, round]} />
      <ServiceIcon name={name} size={Math.round(size * 0.46)} />
    </View>
  );
}

const styles = StyleSheet.create({ well: { alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: tone.badgeEdge } });
