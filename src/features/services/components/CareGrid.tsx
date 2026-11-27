import { memo } from "react";
import { StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text } from "@/features/services/components/Text";
import { IconWell } from "@/features/services/components/IconWell";
import { Rise } from "@/features/services/components/scroll";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { SurfacePress } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import type { Service } from "@/features/services/data/catalog";
import { openCare } from "@/features/services/store/useDeskSheet";
import { type } from "@/features/services/components/type";

export type CareTile = { key: string; icon: ServiceIconName; label: string; line: string; onPress: () => void };

export const careTile = (s: Service): CareTile => ({ key: s.slug, icon: s.icon, label: s.tile ?? s.name, line: s.line.replace(/\.$/, ""), onPress: () => openCare(s.slug) });

const H = 164;
const GAP = 12;

/**
 * Complimentary requests as small hospitality cards, two to a row: the object in its badge, a quiet "Complimentary" mark, the name
 * in the display face, one line of what happens, and an arrow. The whole card gives under the finger.
 */
export const CareTiles = memo(function CareTiles({ tiles, at = 0 }: { tiles: CareTile[]; at?: number }) {
  return (
    <View style={styles.grid}>
      {tiles.map((t, i) => (
        <Rise key={t.key} at={at + Math.floor(i / 2) * (H + GAP)} order={i % 2} seq={i} style={styles.cell}>
          <SurfacePress radius={20} onPress={t.onPress} style={styles.tile} accessibilityLabel={`${t.label}. ${t.line}. Complimentary`}>
            <View style={styles.top}>
              <IconWell name={t.icon} size={44} />
              <Text style={styles.free} maxFontSizeMultiplier={1.1}>
                Complimentary
              </Text>
            </View>
            <View style={styles.words}>
              <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.1}>
                {t.label}
              </Text>
              <View style={styles.foot}>
                <Text style={styles.line} numberOfLines={2}>
                  {t.line}
                </Text>
                <View style={styles.go}>
                  <Ionicons name="arrow-forward" size={13} color={tone.pine} />
                </View>
              </View>
            </View>
          </SurfacePress>
        </Rise>
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  cell: { flexGrow: 1, flexBasis: "44%", maxWidth: "50%" },
  tile: { height: H, padding: 16, justifyContent: "space-between" },
  top: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  free: { ...type.eyebrow, fontSize: 9, lineHeight: 12, letterSpacing: 1.2, color: tone.goldText, marginTop: 4 },
  words: { gap: 4 },
  label: { ...type.title, fontSize: 23, lineHeight: 26, color: tone.ink },
  foot: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  line: { ...type.label, flex: 1, minHeight: 32, fontSize: 12, lineHeight: 16, color: tone.soft },
  go: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: tone.line },
});
