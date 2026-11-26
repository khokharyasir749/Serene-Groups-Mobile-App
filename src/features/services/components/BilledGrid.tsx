import { StyleSheet, View } from "react-native";
import type { ImageSource } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@/features/services/components/Text";
import { colors } from "@/core/constants/theme";
import { Parallax, Rise } from "@/features/services/components/scroll";
import { Press } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import type { Service } from "@/features/services/data/catalog";
import { openAny } from "@/features/services/lib/nav";
import { type } from "@/features/services/components/type";

export type BilledCard = { key: string; photo?: ImageSource; name: string; line: string; verb: string; onPress: () => void };

export const billedCard = (s: Service): BilledCard => ({ key: s.slug, photo: s.photo, name: s.tile ?? s.name, line: s.line, verb: s.verb ?? "Request", onPress: () => openAny(s) });

const spoken = (c: BilledCard) => `${c.name}. ${c.line}. Billed to your room`;
const GAP = 12;
const H = 226;

/** Even photo cards, two to a row. No amounts; the desk confirms the price. */
export function BilledGrid({ cards, at = 0 }: { cards: BilledCard[]; at?: number }) {
  return (
    <View style={styles.grid}>
      {cards.map((card, i) => (
        <Rise key={card.key} at={at + Math.floor(i / 2) * (H + GAP)} order={i % 2} style={i === cards.length - 1 && i % 2 === 0 ? styles.full : styles.half}>
          <Press onPress={card.onPress} style={styles.lift} accessibilityLabel={spoken(card)}>
            <Parallax source={card.photo} height={H} at={at + Math.floor(i / 2) * (H + GAP)} depth={24} zoom style={styles.tile}>
              <LinearGradient pointerEvents="none" colors={tone.photoFoot} locations={[0.4, 0.7, 1]} style={StyleSheet.absoluteFill} />
              <View style={styles.words}>
                <Text style={styles.name} numberOfLines={2} maxFontSizeMultiplier={1.1}>
                  {card.name}
                </Text>
                <Text style={styles.line} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                  {card.line}
                </Text>
              </View>
            </Parallax>
          </Press>
        </Rise>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  half: { flexGrow: 1, flexBasis: "44%" },
  full: { width: "100%" },
  lift: { borderRadius: 20, boxShadow: tone.shadow },
  tile: { borderRadius: 20 },
  words: { position: "absolute", left: 16, right: 14, bottom: 15, gap: 2 },
  name: { ...type.onPhoto, fontSize: 18.5, lineHeight: 23, color: colors.white },
  line: { ...type.label, color: colors.white },
});
