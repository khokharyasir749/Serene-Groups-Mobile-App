import { StyleSheet, View } from "react-native";
import type { ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/features/services/components/Text";
import { colors } from "@/core/constants/theme";
import { CareTiles, type CareTile } from "@/features/services/components/CareGrid";
import { Parallax, Rise } from "@/features/services/components/scroll";
import { Press } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";

const H = 214;
const GAP = 12;

type Props = { photo: ImageSource; title: string; onOpen: () => void; tiles: CareTile[]; at?: number; position?: "center" | "top" | "bottom" };

/** A photograph across the column, its one-tap requests in an even grid beneath. */
export function CareFeature({ photo, title, onOpen, tiles, at = 0, position }: Props) {
  return (
    <View style={styles.stack}>
      <Rise at={at}>
        <Press onPress={onOpen} accessibilityLabel={`${title}. View all`} style={styles.lift}>
          <Parallax source={photo} height={H} at={at} depth={32} zoom position={position} style={styles.clip}>
            <LinearGradient pointerEvents="none" colors={tone.photoFoot} locations={[0.35, 0.68, 1]} style={StyleSheet.absoluteFill} />
            <View style={styles.words}>
              <Text style={styles.title} maxFontSizeMultiplier={1.1}>
                {title}
              </Text>
              <Ionicons name="arrow-forward-outline" size={20} color={colors.white} />
            </View>
          </Parallax>
        </Press>
      </Rise>
      <CareTiles tiles={tiles} at={at + H + GAP} />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: GAP },
  lift: { borderRadius: 20, boxShadow: tone.shadow },
  clip: { borderRadius: 20 },
  words: { position: "absolute", left: 20, right: 20, bottom: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { ...type.onPhoto, fontSize: 26, lineHeight: 32, letterSpacing: -0.3, color: colors.white },
});
