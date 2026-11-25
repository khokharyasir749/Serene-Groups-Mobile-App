import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { fonts, groups } from "@/core/constants/theme";

export type Stat = { value: string; unit?: string; label: string; art?: ReactNode };

/** Two-column figure plates: big serif number, quiet caption. */
export function StatGrid({ stats, short }: { stats: Stat[]; short?: boolean }) {
  return (
    <View style={styles.grid}>
      {stats.map((s) => (
        <View key={s.label} style={[styles.cell, short && styles.short]}>
          <View style={styles.dot} />
          <Text style={styles.num} numberOfLines={1} adjustsFontSizeToFit>
            {s.value}
            {s.unit ? <Text style={styles.unit}>{s.unit}</Text> : null}
          </Text>
          <Text style={styles.label}>{s.label}</Text>
          {s.art}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cell: { flexGrow: 1, flexBasis: "46%", minHeight: 172, gap: 2, backgroundColor: groups.plate, borderWidth: 1.2, borderColor: groups.plateEdge, borderRadius: 24, padding: 18, overflow: "hidden" },
  short: { minHeight: 0 },
  dot: { position: "absolute", top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: groups.champagne },
  num: { color: groups.pine, fontFamily: fonts.displayBold, fontSize: 34, lineHeight: 41, letterSpacing: -0.3 },
  unit: { color: groups.pine, fontFamily: fonts.display, fontSize: 19 },
  label: { color: groups.pine, fontSize: 13.5, lineHeight: 18 },
});
