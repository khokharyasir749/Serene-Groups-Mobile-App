import { ScrollView, StyleSheet, View } from "react-native";
import { FilterChip } from "@/core/components/FilterChip";
import { Input } from "@/core/components/Input";
import { PROJECTS } from "@/core/constants/serene";
import { colors, spacing } from "@/core/constants/theme";
import type { PaymentFilterState } from "../hooks/usePaymentFilters";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";

const Divider = () => <View style={styles.divider} />;

/** Search plus one slim scrolling row of chips: site, type and method, grouped by hairline dividers. */
export function PaymentFilterBar({ f }: { f: PaymentFilterState }) {
  return (
    <>
      <Input icon="search-outline" placeholder="Search name, reference or receipt" value={f.search} onChangeText={f.setSearch} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <FilterChip label="All sites" selected={f.project === undefined} onPress={() => f.setProject(undefined)} />
        {PROJECTS.map((p) => (
          <FilterChip key={p.slug} label={p.name} selected={f.project === p.slug} onPress={() => f.setProject(p.slug)} />
        ))}
        <Divider />
        <FilterChip label="Any type" selected={f.kind === undefined} onPress={() => f.setKind(undefined)} />
        <FilterChip label="Down" selected={f.kind === "down"} onPress={() => f.setKind("down")} />
        <FilterChip label="Instalments" selected={f.kind === "installment"} onPress={() => f.setKind("installment")} />
        <Divider />
        <FilterChip label="Any method" selected={f.method === undefined} onPress={() => f.setMethod(undefined)} />
        {PAYMENT_METHODS.map((m) => (
          <FilterChip key={m} label={PAYMENT_METHOD_LABEL[m]} selected={f.method === m} onPress={() => f.setMethod(m)} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  row: { gap: spacing.sm, alignItems: "center", paddingRight: spacing.lg },
  divider: { width: 1, height: 20, backgroundColor: colors.lineStrong, marginHorizontal: 2 },
});
