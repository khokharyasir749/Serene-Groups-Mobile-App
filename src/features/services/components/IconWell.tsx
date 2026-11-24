import { StyleSheet, View } from "react-native";
import { svc } from "@/core/constants/theme";
import { ServiceIcon, type ServiceIconName } from "@/features/services/components/ServiceIcon";

/** Object icon on a warm alabaster tile. */
export function IconWell({ name, size = 64 }: { name: ServiceIconName; size?: number }) {
  return (
    <View style={[styles.well, { width: size, height: size, borderRadius: size * 0.28 }]}>
      <ServiceIcon name={name} size={size * 0.82} />
    </View>
  );
}

const styles = StyleSheet.create({ well: { alignItems: "center", justifyContent: "center", backgroundColor: svc.page } });
