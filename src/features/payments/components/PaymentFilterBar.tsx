import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FilterChip } from "@/core/components/FilterChip";
import { Input } from "@/core/components/Input";
import { PROJECTS } from "@/core/constants/serene";
import { colors, fonts, letter, radius, shadows, spacing, groups } from "@/core/constants/theme";
import type { PaymentFilterState } from "../hooks/usePaymentFilters";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";

// Recessed search field: tinted canvas, hairline border, no shadow.
const flatField = { backgroundColor: colors.paper, borderColor: groups.plateEdge, shadowOpacity: 0, elevation: 0, minHeight: 56 } as const;

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

/** Filter panel: a header with Reset, a recessed search field, and chips arranged in labelled SITE · TYPE · METHOD groups. */
export function PaymentFilterBar({ f }: { f: PaymentFilterState }) {
  const active = Boolean(f.search) || f.project !== undefined || f.kind !== undefined || f.method !== undefined;
  const reset = () => {
    f.setSearch("");
    f.setProject(undefined);
    f.setKind(undefined);
    f.setMethod(undefined);
  };
  return (
    <View style={styles.panel}>
      <View style={styles.head}>
        <View style={styles.titleRow}>
          <Ionicons name="options-outline" size={15} color={colors.pineBrand} />
          <Text style={styles.title}>FILTER RECEIPTS</Text>
        </View>
        {active ? (
          <Pressable onPress={reset} hitSlop={8} style={styles.reset} accessibilityRole="button" accessibilityLabel="Reset filters">
            <Ionicons name="close-circle-outline" size={14} color={colors.pineBrand} />
            <Text style={styles.resetText}>Reset</Text>
          </Pressable>
        ) : null}
      </View>

      <Input style={flatField} icon="search-outline" placeholder="Search name, reference or receipt" value={f.search} onChangeText={f.setSearch} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Group label="SITE">
          <FilterChip label="All" selected={f.project === undefined} onPress={() => f.setProject(undefined)} />
          {PROJECTS.map((p) => (
            <FilterChip key={p.slug} label={p.name} selected={f.project === p.slug} onPress={() => f.setProject(p.slug)} />
          ))}
        </Group>
        <View style={styles.divider} />
        <Group label="TYPE">
          <FilterChip label="All" selected={f.kind === undefined} onPress={() => f.setKind(undefined)} />
          <FilterChip label="Down payment" selected={f.kind === "down"} onPress={() => f.setKind("down")} />
          <FilterChip label="Instalment" selected={f.kind === "installment"} onPress={() => f.setKind("installment")} />
        </Group>
        <View style={styles.divider} />
        <Group label="METHOD">
          <FilterChip label="All" selected={f.method === undefined} onPress={() => f.setMethod(undefined)} />
          {PAYMENT_METHODS.map((m) => (
            <FilterChip key={m} label={PAYMENT_METHOD_LABEL[m]} selected={f.method === m} onPress={() => f.setMethod(m)} />
          ))}
        </Group>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { backgroundColor: groups.plate, borderRadius: 24, borderWidth: 1.2, borderColor: groups.plateEdge, padding: spacing.md + 2, gap: spacing.md, ...shadows.card },
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 22 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { color: colors.pineBrand, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  reset: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3 },
  resetText: { color: colors.pineBrand, fontSize: 11, fontFamily: fonts.uiBold },
  row: { alignItems: "flex-start", gap: spacing.md, paddingRight: spacing.lg },
  group: { gap: 6 },
  groupLabel: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  chips: { flexDirection: "row", gap: spacing.sm },
  divider: { width: 1, alignSelf: "stretch", backgroundColor: colors.line, marginTop: 15 },
});
