import { ScrollView, StyleSheet } from "react-native";
import { Input } from "@/core/components/Input";
import { Pill } from "@/core/components/Pill";
import { spacing } from "@/core/constants/theme";
import { SiteFilterPills } from "@/features/bookings/components/SiteFilterPills";
import type { PaymentFilterState } from "../hooks/usePaymentFilters";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";

export function PaymentFilterBar({ f }: { f: PaymentFilterState }) {
  return (
    <>
      <Input icon="search" placeholder="Search name, reference or receipt" value={f.search} onChangeText={f.setSearch} />
      <SiteFilterPills value={f.project} onChange={f.setProject} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pill label="Any type" selected={f.kind === undefined} onPress={() => f.setKind(undefined)} />
        <Pill label="Down payments" selected={f.kind === "down"} onPress={() => f.setKind("down")} />
        <Pill label="Instalments" selected={f.kind === "installment"} onPress={() => f.setKind("installment")} />
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Pill label="Any method" selected={f.method === undefined} onPress={() => f.setMethod(undefined)} />
        {PAYMENT_METHODS.map((m) => (
          <Pill key={m} label={PAYMENT_METHOD_LABEL[m]} selected={f.method === m} onPress={() => f.setMethod(m)} />
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({ row: { gap: spacing.sm } });
