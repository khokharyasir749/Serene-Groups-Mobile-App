import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, groups, radius, spacing } from "@/core/constants/theme";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /** paper = pure elevated white surface; emerald = deep-forest gradient hero card; night = dark glass card */
  variant?: "paper" | "emerald" | "night";
};

export function Card({ children, onPress, style, variant = "paper" }: Props) {
  const body = (
    <>
      {variant === "emerald" ? <LinearGradient colors={gradients.forest} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} /> : null}
      {children}
    </>
  );
  const base = [styles.card, styles[variant], style];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...base, pressed && styles.pressed]}>
        {body}
      </Pressable>
    );
  }
  return <View style={base}>{body}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: 26, padding: spacing.lg, gap: spacing.sm, overflow: "hidden", borderWidth: 1 },
  paper: { backgroundColor: groups.plate, borderColor: groups.plateEdge, boxShadow: groups.plateShadow },
  emerald: { backgroundColor: groups.pine, borderColor: groups.pineEdge, boxShadow: groups.plateShadow },
  night: { backgroundColor: colors.glassNight, borderColor: colors.lineNight, borderRadius: radius.md },
  pressed: { opacity: 0.94, transform: [{ scale: 0.98 }] },
});
