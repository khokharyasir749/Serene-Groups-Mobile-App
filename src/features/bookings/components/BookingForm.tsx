import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Controller } from "react-hook-form";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { Input } from "@/core/components/Input";
import { Pill } from "@/core/components/Pill";
import { CUSTOM_PLAN_ID, PLAN_RULES, PROJECTS, SPU_PLAN_ID, planLabel } from "@/core/constants/serene";
import { colors, dark, font, letter, spacing } from "@/core/constants/theme";
import { formatPKR } from "@/core/lib/formatPKR";
import { plansFor, useCreateBookingForm } from "../hooks/useCreateBookingForm";
import { UnitTypeSelector } from "./UnitTypeSelector";

const Label = ({ children }: { children: string }) => <Text style={styles.section}>{children.toUpperCase()}</Text>;

export function BookingForm() {
  const { form, project, planId, isCustom, preview, isLoading, selectProject, selectPlan, submit } = useCreateBookingForm();
  const { control, setValue, formState } = form;
  const errors = formState.errors;
  const showUnits = planId === SPU_PLAN_ID || isCustom;

  return (
    <View style={styles.form}>
      <Label>Project</Label>
      <View style={styles.chips}>
        {PROJECTS.map((p) => (
          <Pill key={p.slug} label={`Serene Heights ${p.name}`} selected={project === p.slug} onPress={() => selectProject(p.slug)} />
        ))}
      </View>

      <Label>Payment plan</Label>
      <View style={styles.chips}>
        {plansFor(project).map((p) => (
          <Pill key={p.id} label={planLabel(p)} selected={planId === p.id} onPress={() => selectPlan(p.id)} />
        ))}
        <Pill label="Custom amount" selected={isCustom} onPress={() => selectPlan(CUSTOM_PLAN_ID)} />
      </View>

      {isCustom ? (
        <>
          <Label>Unit type</Label>
          <Controller control={control} name="unitType" render={({ field }) => (
            <UnitTypeSelector project={project} value={field.value} onChange={(id) => setValue("unitType", id)} />
          )} />
          <Controller control={control} name="customTotal" render={({ field }) => (
            <Input label="Total price (PKR)" value={field.value} onChangeText={field.onChange} keyboardType="number-pad" error={errors.customTotal?.message} />
          )} />
        </>
      ) : null}

      {showUnits ? (
        <Controller control={control} name="units" render={({ field }) => (
          <Input label={planId === SPU_PLAN_ID ? "Number of units" : "Units"} value={field.value} onChangeText={field.onChange} keyboardType="number-pad" error={errors.units?.message} />
        )} />
      ) : null}

      {preview ? (
        <Card variant="emerald">
          <Text style={styles.eyebrow}>
            {PLAN_RULES.downPercent}% DOWN + {PLAN_RULES.months} INSTALMENTS
          </Text>
          <Text style={styles.total}>{formatPKR(preview.total)}</Text>
          <Text style={styles.muted}>Down payment {formatPKR(preview.down)}</Text>
          <Text style={styles.muted}>
            {preview.months} × {formatPKR(preview.monthly)} (last {formatPKR(preview.lastMonthly)})
          </Text>
        </Card>
      ) : null}

      <Label>Customer</Label>
      <Controller control={control} name="customerName" render={({ field }) => (
        <Input label="Customer name" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} autoCapitalize="words" error={errors.customerName?.message} />
      )} />
      <Controller control={control} name="phone" render={({ field }) => (
        <Input label="Mobile" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} keyboardType="phone-pad" placeholder="0300-1234567" error={errors.phone?.message} />
      )} />
      <Controller control={control} name="cnic" render={({ field }) => (
        <Input label="CNIC" value={field.value} onChangeText={field.onChange} onBlur={field.onBlur} keyboardType="number-pad" placeholder="35202-1234567-1" error={errors.cnic?.message} />
      )} />

      <Button label="Create booking" onPress={() => void submit()} loading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing.lg },
  section: { color: colors.goldText, fontSize: font.xs, fontWeight: "700", letterSpacing: letter.eyebrow },
  eyebrow: { color: colors.gold, fontSize: font.xs, fontWeight: "700", letterSpacing: letter.eyebrow },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  total: { color: dark.text, fontSize: font.display, fontWeight: "500", letterSpacing: letter.display },
  muted: { color: dark.muted, fontSize: font.md },
});
