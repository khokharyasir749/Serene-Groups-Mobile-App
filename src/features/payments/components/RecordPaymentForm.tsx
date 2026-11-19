import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Controller } from "react-hook-form";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Input } from "@/core/components/Input";
import { Pill } from "@/core/components/Pill";
import { colors, font, spacing } from "@/core/constants/theme";
import { formatPKR } from "@/core/lib/formatPKR";
import { useRecordPaymentForm } from "../hooks/useRecordPaymentForm";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";

export function RecordPaymentForm({ bookingId }: { bookingId?: string }) {
  const f = useRecordPaymentForm(bookingId);
  const { control, setValue, formState: { errors } } = f.form;
  const selected = f.form.watch("bookingId");

  return (
    <View style={styles.form}>
      {selected && f.booking ? (
        <Card>
          <Text style={styles.name}>{f.booking.customer.name}</Text>
          <Text style={styles.muted}>{f.booking.reference} · Outstanding {formatPKR(f.booking.outstanding)}</Text>
          {f.booking.nextDue ? <Pill label={`Pay next due · ${formatPKR(f.booking.nextDue.amount)}`} tone="gold" onPress={f.payNextDue} /> : null}
          {!bookingId ? <Pill label="Change booking" onPress={f.clearBooking} /> : null}
        </Card>
      ) : (
        <>
          <Input label="Find booking" placeholder="Customer name or reference" value={f.search} onChangeText={f.setSearch} error={errors.bookingId?.message} />
          {f.candidates.map((b) => (
            <Card key={b.id} onPress={() => f.pickBooking(b.id)}>
              <Text style={styles.name}>{b.customer.name}</Text>
              <Text style={styles.muted}>{b.reference} · Outstanding {formatPKR(b.outstanding)}</Text>
            </Card>
          ))}
        </>
      )}

      <Controller control={control} name="amount" render={({ field }) => (
        <Input label="Amount (PKR)" value={field.value} onChangeText={field.onChange} keyboardType="number-pad" error={errors.amount?.message} />
      )} />
      <Text style={styles.label}>Method</Text>
      <View style={styles.chips}>
        {PAYMENT_METHODS.map((m) => (
          <Pill key={m} label={PAYMENT_METHOD_LABEL[m]} selected={f.form.watch("method") === m} onPress={() => setValue("method", m)} />
        ))}
      </View>
      <Controller control={control} name="receiptRef" render={({ field }) => (
        <Input label="Receipt reference" value={field.value} onChangeText={field.onChange} autoCapitalize="characters" error={errors.receiptRef?.message} />
      )} />
      <Controller control={control} name="paidAt" render={({ field }) => (
        <Input label="Date paid" value={field.value} onChangeText={field.onChange} placeholder="YYYY-MM-DD" error={errors.paidAt?.message} />
      )} />
      <Button label="Record payment" onPress={() => void f.submit()} loading={f.isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  name: { color: colors.text, fontSize: font.lg, fontWeight: "700" },
  muted: { color: colors.textMuted, fontSize: font.sm },
  label: { color: colors.textMuted, fontSize: font.sm, fontWeight: "600" },
});
