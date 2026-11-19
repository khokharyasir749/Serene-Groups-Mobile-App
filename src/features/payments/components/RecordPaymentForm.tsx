import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "@/core/components/Button";
import { Input } from "@/core/components/Input";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { formatPKR } from "@/core/lib/formatPKR";
import { useRecordPaymentForm } from "../hooks/useRecordPaymentForm";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABEL } from "../schemas/payment.schema";
import type { PaymentMethod } from "../types";

const METHOD_ICON: Record<PaymentMethod, keyof typeof Ionicons.glyphMap> = {
  bank_transfer: "business-outline",
  cash: "cash-outline",
  cheque: "document-text-outline",
  online: "globe-outline",
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "—";

function Step({ icon, title }: { icon: keyof typeof Ionicons.glyphMap; title: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepNo}>
        <Ionicons name={icon} size={14} color={colors.goldAccent} />
      </View>
      <Text style={styles.stepTitle}>{title}</Text>
      <View style={styles.stepRule} />
    </View>
  );
}

function Client({ name, reference, outstanding }: { name: string; reference: string; outstanding: number }) {
  return (
    <View style={styles.client}>
      <View style={styles.mono}>
        <Text style={styles.monoText}>{initials(name)}</Text>
      </View>
      <View style={styles.flex}>
        <Text style={styles.name} numberOfLines={1}>
          {name || "—"}
        </Text>
        <Text style={styles.muted} numberOfLines={1}>{`${reference} · Outstanding ${formatPKR(outstanding)}`}</Text>
      </View>
    </View>
  );
}

/** Record a payment as three clear steps: booking, amount, then method and reference. */
export function RecordPaymentForm({ bookingId }: { bookingId?: string }) {
  const f = useRecordPaymentForm(bookingId);
  const { control, setValue, formState: { errors } } = f.form;
  const selected = f.form.watch("bookingId");
  const method = f.form.watch("method");
  const amount = Math.round(Number(String(f.form.watch("amount")).replace(/,/g, "")));
  const valid = Number.isFinite(amount) && amount > 0;
  const remaining = f.booking && valid ? f.booking.outstanding - amount : null;

  return (
    <View style={styles.form}>
      <View style={styles.intro}>
        <Text style={styles.eyebrow}>RECEIPT ENTRY</Text>
        <Text style={styles.lede}>Log a payment against a booking. The instalment schedule and the ledger update straight away.</Text>
      </View>

      <Step icon="person-outline" title="BOOKING" />
      {selected && f.booking ? (
        <View style={styles.card}>
          <Client name={f.booking.customer.name} reference={f.booking.reference} outstanding={f.booking.outstanding} />
          <View style={styles.actions}>
            {f.booking.nextDue ? (
              <Pressable onPress={f.payNextDue} style={styles.gold} accessibilityRole="button">
                <Ionicons name="time-outline" size={14} color={colors.pineBrand} />
                <Text style={styles.goldText}>{`Pay next due · ${formatPKR(f.booking.nextDue.amount)}`}</Text>
              </Pressable>
            ) : null}
            {!bookingId ? (
              <Pressable onPress={f.clearBooking} style={styles.ghost} accessibilityRole="button">
                <Ionicons name="swap-horizontal-outline" size={14} color={colors.ink} />
                <Text style={styles.ghostText}>Change</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      ) : (
        <>
          <Input icon="search-outline" label="Find booking" placeholder="Customer name or reference" value={f.search} onChangeText={f.setSearch} error={errors.bookingId?.message} />
          {f.candidates.map((b) => (
            <Pressable key={b.id} onPress={() => f.pickBooking(b.id)} style={({ pressed }) => [styles.card, pressed && styles.pressed]} accessibilityRole="button">
              <Client name={b.customer.name} reference={b.reference} outstanding={b.outstanding} />
            </Pressable>
          ))}
        </>
      )}

      <Step icon="wallet-outline" title="AMOUNT" />
      <Controller control={control} name="amount" render={({ field }) => (
        <Input icon="wallet-outline" label="Amount (PKR)" value={field.value} onChangeText={field.onChange} keyboardType="number-pad" error={errors.amount?.message} />
      )} />
      {f.booking ? (
        <View style={styles.quick}>
          <Pressable onPress={() => setValue("amount", String(f.booking?.outstanding ?? ""))} style={styles.ghost} accessibilityRole="button">
            <Ionicons name="checkmark-done-outline" size={14} color={colors.ink} />
            <Text style={styles.ghostText}>Full balance</Text>
          </Pressable>
          {remaining !== null ? (
            <Text style={[styles.remaining, remaining < 0 && styles.over]}>{remaining < 0 ? "Exceeds the balance" : `Remaining after: ${formatPKR(remaining)}`}</Text>
          ) : null}
        </View>
      ) : null}

      <Step icon="card-outline" title="METHOD & REFERENCE" />
      <View style={styles.methods}>
        {PAYMENT_METHODS.map((m) => {
          const on = method === m;
          return (
            <Pressable key={m} onPress={() => setValue("method", m)} style={[styles.method, on && styles.methodOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <Ionicons name={METHOD_ICON[m]} size={20} color={on ? colors.goldAccent : colors.pineBrand} />
              <Text style={[styles.methodText, on && styles.methodTextOn]} numberOfLines={1}>
                {PAYMENT_METHOD_LABEL[m]}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Controller control={control} name="receiptRef" render={({ field }) => (
        <Input icon="receipt-outline" label="Receipt reference" value={field.value} onChangeText={field.onChange} autoCapitalize="characters" error={errors.receiptRef?.message} />
      )} />
      <Controller control={control} name="paidAt" render={({ field }) => (
        <Input icon="calendar-outline" label="Date paid" value={field.value} onChangeText={field.onChange} placeholder="YYYY-MM-DD" error={errors.paidAt?.message} />
      )} />

      <View style={styles.summary}>
        <View style={styles.flex}>
          <Text style={styles.summaryLabel}>TOTAL TO RECORD</Text>
          <Text style={styles.summaryValue} numberOfLines={1} adjustsFontSizeToFit>
            {valid ? formatPKR(amount) : "PKR —"}
          </Text>
        </View>
        <Text style={styles.summaryMethod}>{PAYMENT_METHOD_LABEL[method]}</Text>
      </View>
      <Button label="Record payment" showBadge onPress={() => void f.submit()} loading={f.isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  intro: { gap: spacing.xs, marginBottom: spacing.xs },
  eyebrow: { color: colors.goldText, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  lede: { color: colors.ink2, fontSize: font.sm + 1, lineHeight: 21 },
  step: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  stepNo: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.pineBrand, alignItems: "center", justifyContent: "center" },
  stepTitle: { color: colors.pineBrand, fontSize: 11, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  stepRule: { flex: 1, height: 1, backgroundColor: colors.line },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, padding: spacing.md + 2, gap: spacing.md, ...shadows.card },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  client: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  mono: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  monoText: { color: colors.white, fontSize: font.sm, fontFamily: fonts.uiBold },
  name: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  muted: { color: colors.muted, fontSize: font.sm },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  gold: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.goldSoft, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 12, height: 34 },
  goldText: { color: colors.pineBrand, fontSize: font.xs + 1, fontFamily: fonts.uiBold },
  ghost: { height: 34, flexDirection: "row", gap: 6, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.lineStrong, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  ghostText: { color: colors.ink, fontSize: font.xs + 1, fontFamily: fonts.uiSemi },
  quick: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  remaining: { flex: 1, textAlign: "right", color: colors.ink2, fontSize: font.xs + 1, fontFamily: fonts.uiMedium },
  over: { color: colors.danger },
  methods: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  method: { width: "48.5%", flexDirection: "row", alignItems: "center", gap: spacing.sm, height: 54, paddingHorizontal: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, ...shadows.card },
  methodOn: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand },
  methodText: { flex: 1, color: colors.ink, fontSize: font.sm + 1, fontFamily: fonts.uiSemi },
  methodTextOn: { color: colors.white },
  summary: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.pineBrand, borderRadius: radius.lg, padding: spacing.md + 4, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.goldAccent },
  summaryLabel: { color: colors.goldAccent, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  summaryValue: { color: colors.white, fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  summaryMethod: { color: colors.goldAccent, fontSize: font.xs + 1, fontFamily: fonts.uiBold, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
});
