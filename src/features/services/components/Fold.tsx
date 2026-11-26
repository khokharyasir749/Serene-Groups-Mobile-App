import { useRef, useState, type ReactNode } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { spacing } from "@/core/constants/theme";
import { IconWell } from "@/features/services/components/IconWell";
import { isReduced } from "@/features/services/components/motion";
import { Still, Unfolding } from "@/features/services/components/scroll";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { Press } from "@/features/services/components/surface";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";

type Props = { icon: ServiceIconName; title: string; note: string; children: ReactNode; open?: boolean; /** Draws the hairline above the first row of a list. */ first?: boolean };

const OPEN = { damping: 24, stiffness: 170, mass: 1 } as const;

/**
 * One row of an editorial index. A tap lets the section down on a spring: its height and opacity open together, the chevron turns,
 * the row takes on a plate, and the items inside arrive one after another. Closing runs the same way back.
 */
export function Fold({ icon, title, note, children, open: initial = false, first }: Props) {
  const [open, setOpen] = useState(initial);
  const [shown, setShown] = useState(initial);
  const [h, setH] = useState(0);
  // Height can only move on the JS side; the chevron and the row's plate ride a native value alongside it.
  const grow = useRef(new Animated.Value(initial ? 1 : 0)).current;
  const turn = useRef(new Animated.Value(initial ? 1 : 0)).current;
  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) setShown(true);
    if (isReduced()) {
      grow.setValue(next ? 1 : 0);
      turn.setValue(next ? 1 : 0);
      if (!next) setShown(false);
      return;
    }
    Animated.spring(grow, { toValue: next ? 1 : 0, ...OPEN, overshootClamping: !next, useNativeDriver: false }).start(({ finished }) => {
      if (finished && !next) setShown(false);
    });
    Animated.timing(turn, { toValue: next ? 1 : 0, duration: 380, easing: Easing.bezier(0.22, 1, 0.36, 1), useNativeDriver: true }).start();
  };
  return (
    <View style={[styles.wrap, first && styles.first]}>
      <Press onPress={toggle} accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={`${title}. ${note}`} style={styles.row}>
        <Animated.View pointerEvents="none" style={[styles.plate, { opacity: turn }]} />
        <IconWell name={icon} size={46} />
        <View style={styles.words}>
          <Text style={styles.title} maxFontSizeMultiplier={1.15}>
            {title}
          </Text>
          <Text style={styles.note} numberOfLines={1}>
            {note}
          </Text>
        </View>
        <Animated.View style={[styles.chev, { transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }]}>
          <Ionicons name="chevron-down" size={17} color={tone.pine} />
        </Animated.View>
      </Press>
      {shown ? (
        <Animated.View style={[styles.clip, { height: h ? grow.interpolate({ inputRange: [0, 1], outputRange: [0, h] }) : undefined, opacity: grow.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0.6, 1] }) }]}>
          <Animated.View onLayout={(e) => setH(e.nativeEvent.layout.height)} style={[styles.inner, { transform: [{ translateY: grow.interpolate({ inputRange: [0, 1], outputRange: [-18, 0] }) }] }]}>
            <Unfolding.Provider value>
              <Still>{children}</Still>
            </Unfolding.Provider>
          </Animated.View>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { borderBottomWidth: 1, borderBottomColor: tone.line },
  first: { borderTopWidth: 1, borderTopColor: tone.line },
  row: { flexDirection: "row", alignItems: "center", gap: 16, minHeight: 84, paddingVertical: 14 },
  // The open row's plate runs to the screen's edges, under the hairlines.
  plate: { position: "absolute", top: 0, bottom: 0, left: -spacing.lg, right: -spacing.lg, backgroundColor: tone.plate },
  words: { flex: 1, gap: 2 },
  title: { ...type.title, fontSize: 25, lineHeight: 28, color: tone.ink },
  note: { ...type.label, color: tone.soft },
  chev: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: tone.line, backgroundColor: tone.plate },
  // Clips the opening section; it reaches the screen's edges, so full-width pictures inside are not cut at the margin.
  clip: { overflow: "hidden", marginHorizontal: -spacing.lg },
  inner: { position: "absolute", top: 0, left: spacing.lg, right: spacing.lg, paddingTop: 6, paddingBottom: 26 },
});
