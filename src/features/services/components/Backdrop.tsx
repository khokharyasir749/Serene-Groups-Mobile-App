import { StyleSheet, View } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { tone } from "@/features/services/components/tone";

/** A photograph filling the page behind glass: held still (no zoom or drift), with a soft veil so white words read on it. */
export function Backdrop({ source }: { source?: ImageSource }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image cachePolicy="memory-disk" source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={150} />
      <LinearGradient colors={tone.glassVeil} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
    </View>
  );
}
