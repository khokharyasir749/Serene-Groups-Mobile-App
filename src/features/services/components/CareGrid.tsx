import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, fonts, spacing } from "@/core/constants/theme";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { SurfacePress } from "@/features/services/components/surface";
import type { Service } from "@/features/services/data/catalog";
import { openCare } from "@/features/services/store/useDeskSheet";

/** Complimentary requests, two to a row. Each opens the one-tap page. */
export function CareGrid({ services }: { services: Service[] }) {
  return (
    <View style={styles.grid}>
      {services.map((s, i) => (
        <Enter key={s.slug} order={i} style={styles.cell}>
          <SurfacePress radius={18} onPress={() => openCare(s.slug)} style={styles.tile} accessibilityLabel={`${s.name}. ${s.line} Complimentary`}>
            <IconWell name={s.icon} />
            <View>
              <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85} maxFontSizeMultiplier={1.15}>
                {s.name}
              </Text>
              <Text style={styles.line} numberOfLines={1}>
                {s.line}
              </Text>
            </View>
          </SurfacePress>
        </Enter>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  cell: { flexGrow: 1, flexBasis: "45%" },
  tile: { padding: spacing.md + 2, gap: spacing.md },
  name: { color: colors.ink, fontSize: 14, fontFamily: fonts.uiBold },
  line: { color: colors.muted, fontSize: 11.5 },
});
