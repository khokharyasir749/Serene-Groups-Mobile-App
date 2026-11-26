import type { ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Image, type ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/features/services/components/Text";
import { colors, fonts } from "@/core/constants/theme";
import { DriftPhoto } from "@/features/services/components/motion";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";

type Props = { photo?: ImageSource; title: string; line?: string; children?: ReactNode; style?: StyleProp<ViewStyle>; /** Slides the photo inside the card. */ shift?: Animated.AnimatedInterpolation<number> };

/** A clear photo with its name at the foot. */
export function PhotoHero({ photo, title, line, children, style, shift }: Props) {
  return (
    <View style={[styles.hero, style]}>
      {photo && shift ? (
        <Animated.View style={[styles.bleed, { transform: [{ translateX: shift }] }]}>
          <Image source={photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={120} />
        </Animated.View>
      ) : photo ? (
        <DriftPhoto source={photo} style={styles.photo} />
      ) : null}
      <LinearGradient pointerEvents="none" colors={tone.photoFoot} locations={[0.25, 0.62, 1]} style={StyleSheet.absoluteFill} />
      <Text style={styles.title} numberOfLines={2}>
        {title}
      </Text>
      {line ? <Text style={styles.line}>{line}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { overflow: "hidden", justifyContent: "flex-end", padding: 18, backgroundColor: tone.pine },
  photo: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: tone.pine },
  bleed: { position: "absolute", top: 0, bottom: 0, left: -28, right: -28 },
  title: { ...type.onPhoto, fontSize: 27, lineHeight: 33, letterSpacing: -0.3, color: colors.white },
  line: { ...type.label, fontSize: 13.5, color: colors.white },
});
