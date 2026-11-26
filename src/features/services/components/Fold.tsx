import { useRef, useState, type ReactNode } from "react";
import { Animated, Easing, LayoutAnimation, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter, isReduced } from "@/features/services/components/motion";
import { Still } from "@/features/services/components/scroll";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { SurfacePress } from "@/features/services/components/surface";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";

type Props = { icon: ServiceIconName; title: string; note: string; children: ReactNode; open?: boolean };

/** A section folded into one row; a tap drops it open beneath, the chevron turning with it. */
export function Fold({ icon, title, note, children, open: initial = false }: Props) {
  const [open, setOpen] = useState(initial);
  const turn = useRef(new Animated.Value(initial ? 1 : 0)).current;
  const toggle = () => {
    const next = !open;
    if (!isReduced()) {
      LayoutAnimation.configureNext(LayoutAnimation.create(320, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity));
      Animated.timing(turn, { toValue: next ? 1 : 0, duration: 320, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
    } else turn.setValue(next ? 1 : 0);
    setOpen(next);
  };
  return (
    <View style={styles.wrap}>
      <SurfacePress radius={20} onPress={toggle} style={styles.row} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${title}. ${note}`}>
        <IconWell name={icon} size={48} />
        <View style={styles.fill}>
          <Text style={styles.title} maxFontSizeMultiplier={1.15}>
            {title}
          </Text>
          <Text style={styles.note} numberOfLines={1}>
            {note}
          </Text>
        </View>
        <Animated.View style={[styles.chev, { transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }]}>
          <Ionicons name="chevron-down" size={18} color={tone.pine} />
        </Animated.View>
      </SurfacePress>
      {open ? (
        <Enter dy={14}>
          <Still>{children}</Still>
        </Enter>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  fill: { flex: 1, gap: 2 },
  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 14, paddingLeft: 14, paddingRight: 16 },
  title: { ...type.onPhoto, fontSize: 19, lineHeight: 24, color: tone.ink },
  note: { ...type.label, color: tone.soft },
  chev: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: tone.badge },
});
