import { Fragment } from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/features/services/components/Text";
import { fonts } from "@/core/constants/theme";
import { ServiceIcon } from "@/features/services/components/ServiceIcon";
import { Press, Surface } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import type { Service } from "@/features/services/data/catalog";
import { openAny } from "@/features/services/lib/nav";
import { type } from "@/features/services/components/type";

/** One card of services, each with a line of explanation. */
export function ServiceRows({ services }: { services: Service[] }) {
  return (
    <Surface radius={18}>
      {services.map((s, i) => (
        <Fragment key={s.slug}>
          {i ? <View style={styles.line} /> : null}
          <Press onPress={() => openAny(s)} accessibilityLabel={`${s.name}. ${s.line}`} style={styles.row}>
            <ServiceIcon name={s.icon} size={24} />
            <View style={styles.fill}>
              <Text style={styles.name} numberOfLines={1}>
                {s.name}
              </Text>
              <Text style={styles.note} numberOfLines={1}>
                {s.line}
              </Text>
            </View>
            <Ionicons name="arrow-forward-outline" size={17} color={tone.pine} />
          </Press>
        </Fragment>
      ))}
    </Surface>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, gap: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 18, paddingVertical: 18, paddingLeft: 20, paddingRight: 16 },
  line: { height: 1, marginLeft: 62, backgroundColor: tone.hair },
  name: { ...type.onPhoto, fontSize: 18.5, lineHeight: 24, color: tone.ink },
  note: { ...type.label, color: tone.soft },
});
