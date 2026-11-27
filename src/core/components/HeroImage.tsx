import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { gradients, radius, SCRIM_STOPS } from "@/core/constants/theme";

type Props = {
  source: ImageSource;
  height?: number;
  rounded?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

/** Photo with a deep-green scrim at the bottom; children sit over the scrim. */
export function HeroImage({ source, height = 220, rounded = true, children, style }: Props) {
  return (
    <View style={[styles.wrap, { height }, rounded && styles.rounded, style]}>
      <Image cachePolicy="memory-disk" source={source} style={StyleSheet.absoluteFill} contentFit="cover" transition={400} />
      <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", justifyContent: "flex-end" },
  rounded: { borderRadius: radius.lg },
  content: { padding: 16, gap: 6 },
});
