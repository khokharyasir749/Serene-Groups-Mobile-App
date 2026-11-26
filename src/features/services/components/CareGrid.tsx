import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@/features/services/components/Text";
import { IconWell } from "@/features/services/components/IconWell";
import { Rise } from "@/features/services/components/scroll";
import type { ServiceIconName } from "@/features/services/components/ServiceIcon";
import { SurfacePress } from "@/features/services/components/surface";
import { tone } from "@/features/services/components/tone";
import type { Service } from "@/features/services/data/catalog";
import { openCare } from "@/features/services/store/useDeskSheet";
import { type } from "@/features/services/components/type";

export type CareTile = { key: string; icon: ServiceIconName; label: string; onPress: () => void };

export const careTile = (s: Service): CareTile => ({ key: s.slug, icon: s.icon, label: s.tile ?? s.name, onPress: () => openCare(s.slug) });

const H = 122;
const GAP = 12;

/** Complimentary requests as even tiles, two to a row: badge and chevron above, name beneath. */
export function CareTiles({ tiles, at = 0 }: { tiles: CareTile[]; at?: number }) {
  return (
    <View style={styles.grid}>
      {tiles.map((t, i) => (
        <Rise key={t.key} at={at + Math.floor(i / 2) * (H + GAP)} order={i % 2} style={styles.cell}>
          <SurfacePress radius={18} onPress={t.onPress} style={styles.tile} accessibilityLabel={`${t.label}. Complimentary`}>
            <View style={styles.top}>
              <IconWell name={t.icon} size={48} />
              <Ionicons name="chevron-forward" size={16} color={tone.soft} />
            </View>
            <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.1}>
              {t.label}
            </Text>
          </SurfacePress>
        </Rise>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: GAP },
  cell: { flexGrow: 1, flexBasis: "44%", maxWidth: "50%" },
  tile: { height: H, padding: 16, justifyContent: "space-between" },
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { ...type.button, fontSize: 15.5, color: tone.ink },
});
