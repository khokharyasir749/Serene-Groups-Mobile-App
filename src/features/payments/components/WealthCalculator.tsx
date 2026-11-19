import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { Input } from "@/core/components/Input";
import { SectionHeader } from "@/core/components/SectionHeader";
import { COPY, CUSTOM_PLAN_ID, PLANS, SPU_PLAN_ID, WEB } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";
import { spokenPKR } from "@/core/lib/formatPKR";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { usePlanCalculator } from "../hooks/usePlanCalculator";
import { PlanBreakdownCard } from "./PlanBreakdownCard";

/** Serene Investors wealth calculator: 2×2 presets, custom PKR, unit stepper, Lakh/Crore + exact PKR, WhatsApp plan. */
export function WealthCalculator() {
  const c = usePlanCalculator();
  return (
    <View style={styles.stack}>
      <SectionHeader eyebrow={COPY.investorsEyebrow} title="Own a share" soft="of the heights." />
      <Text style={styles.lede}>{WEB.investors.p}</Text>
      <Text style={styles.planHead}>{WEB.investors.planTitle}</Text>
      <Text style={styles.lede}>{WEB.investors.planP}</Text>

      <View style={styles.grid}>
        {PLANS.map((p) => {
          const on = c.planId === p.id;
          return (
            <Pressable key={p.id} onPress={() => c.select(p.id)} style={({ pressed }) => [styles.tile, on && styles.tileOn, pressed && styles.pressed]}>
              <View style={styles.tileTop}>
                <Text style={[styles.tag, on && styles.tagOn]}>{p.id === SPU_PLAN_ID ? "FRACTIONAL" : "FULL SUITE"}</Text>
                <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
              </View>
              <Text style={[styles.area, on && styles.onText]}>{p.area} sq ft</Text>
              <Text style={[styles.kind, on && styles.onMuted]}>{p.id === SPU_PLAN_ID ? "Smart Property" : p.kind}</Text>
              <Text style={[styles.downPill, on && styles.downPillOn]}>{`Down ${spokenPKR(p.down)}`}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={() => c.select(c.isCustom ? PLANS[0].id : CUSTOM_PLAN_ID)} style={[styles.toggle, c.isCustom && styles.toggleOn]}>
        <Text style={[styles.toggleText, c.isCustom && styles.onText]}>{c.isCustom ? "Custom amount · on" : "Use a custom PKR amount"}</Text>
      </Pressable>
      {c.isCustom ? <Input label="Total price (PKR)" value={c.custom} onChangeText={c.setCustom} keyboardType="number-pad" placeholder="e.g. 12500000" /> : null}

      {c.isSpu ? (
        <View style={styles.units}>
          <Text style={styles.unitsLabel}>{WEB.investors.spuLabel}</Text>
          <View style={styles.stepper}>
            <Text onPress={c.fewer} style={[styles.step, !c.canFewer && styles.off]}>−</Text>
            <Text style={styles.n}>{c.units}</Text>
            <Text onPress={c.more} style={[styles.step, !c.canMore && styles.off]}>+</Text>
          </View>
        </View>
      ) : null}

      <PlanBreakdownCard plan={c.plan} />
      <Pressable onPress={() => void openWhatsApp(c.message)} disabled={c.total <= 0} style={({ pressed }) => [styles.banner, c.total <= 0 && styles.off, pressed && styles.pressed]} accessibilityRole="button">
        <View style={styles.crest}>
          <SereneLogoMark width={22} fill={colors.snow} snow={colors.pineBrand} />
        </View>
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Send Plan on WhatsApp</Text>
          <Text style={styles.bannerSub}>Our team replies with your full schedule</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.arrow}>→</Text>
        </View>
      </Pressable>
      <Text style={styles.note}>{WEB.investors.note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.xl },
  planHead: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  lede: { color: colors.muted, fontSize: font.md, lineHeight: 24, marginTop: -spacing.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.md },
  tile: { width: "47.8%", backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md + 2, gap: 4, ...shadows.card },
  tileTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.xs },
  tag: { color: colors.goldText, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1.4 },
  tagOn: { color: colors.goldAccent },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: "center", justifyContent: "center" },
  radioOn: { borderColor: colors.goldAccent },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.goldAccent },
  downPill: { alignSelf: "flex-start", marginTop: spacing.sm, color: colors.pineBrand, backgroundColor: colors.cardUnselected, fontSize: 10, fontFamily: fonts.uiBold, paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill, overflow: "hidden" },
  downPillOn: { color: colors.white, backgroundColor: colors.white16 },
  banner: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.pineBrand, borderWidth: 1, borderColor: colors.goldAccent, borderRadius: radius.pill, padding: 6, ...shadows.cta },
  crest: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.white16, alignItems: "center", justifyContent: "center" },
  bannerText: { flex: 1 },
  bannerTitle: { color: colors.white, fontFamily: fonts.uiBold, fontSize: font.md },
  bannerSub: { color: colors.onNightMuted, fontSize: font.xs },
  badge: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  arrow: { color: colors.pineBrand, fontSize: 18, fontFamily: fonts.uiBold },
  tileOn: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand, ...shadows.cardElevated },
  pressed: { transform: [{ scale: 0.97 }] },
  area: { color: colors.ink, fontFamily: fonts.display, fontSize: 26, letterSpacing: letter.tight },
  kind: { color: colors.muted, fontSize: font.xs, fontFamily: fonts.uiMedium },
  onText: { color: colors.onNight },
  onMuted: { color: colors.onNightMuted },
  toggle: { borderWidth: 1, borderColor: colors.line, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: "center", backgroundColor: colors.card, ...shadows.card },
  toggleOn: { backgroundColor: colors.pineBrand, borderColor: colors.pineBrand },
  toggleText: { color: colors.ink2, fontSize: font.sm, fontFamily: fonts.uiMedium },
  units: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  unitsLabel: { color: colors.ink2, fontSize: font.sm, flex: 1 },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  step: { color: colors.ink, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, width: 38, height: 38, borderRadius: radius.md, textAlign: "center", lineHeight: 35, fontSize: font.xl, overflow: "hidden", ...shadows.card },
  off: { opacity: 0.35 },
  n: { color: colors.ink, fontSize: font.xl, minWidth: 28, textAlign: "center", fontFamily: fonts.display },
  note: { color: colors.muted, fontSize: font.xs, lineHeight: 17 },
});
