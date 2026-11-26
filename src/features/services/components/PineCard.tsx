import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/features/services/components/Text";
import { colors } from "@/core/constants/theme";
import { DriftPhoto } from "@/features/services/components/motion";
import { tone } from "@/features/services/components/tone";
import { sf } from "@/features/services/components/fonts";

type Props = { photo?: ImageSource; title: string; line?: string; children?: ReactNode; style?: StyleProp<ViewStyle> };

/** A photo that dissolves into Pine on the left, where the words sit. */
export function PineCard({ photo, title, line, children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {photo ? <DriftPhoto source={photo} style={styles.photo} /> : null}
      <LinearGradient pointerEvents="none" colors={tone.pineSide} locations={[0, 0.34, 0.66, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={StyleSheet.absoluteFill} />
      <LinearGradient pointerEvents="none" colors={tone.pineFoot} start={{ x: 0, y: 0.35 }} end={{ x: 0, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.words}>
        <Text style={styles.title}>{title}</Text>
        {line ? <Text style={styles.line}>{line}</Text> : null}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 172, borderRadius: 22, overflow: "hidden", backgroundColor: tone.pine, padding: 20, justifyContent: "space-between", gap: 18 },
  photo: { position: "absolute", top: 0, bottom: 0, right: 0, left: "30%", backgroundColor: tone.pine },
  words: { gap: 6, maxWidth: "88%" },
  title: { color: colors.white, fontSize: 26, lineHeight: 31, fontFamily: sf.uiSemi, letterSpacing: -0.3 },
  line: { color: colors.white, fontSize: 14.5, lineHeight: 20 },
});
