import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { PLAN_RULES, WEB } from "@/core/constants/serene";
import { colors, explore, font, fonts, groups, radius, spacing } from "@/core/constants/theme";
import { formatPKR, spokenPKR } from "@/core/lib/formatPKR";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useInvestorCalculator } from "../hooks/useInvestorCalculator";
import { Contours } from "./AltitudeStory";
import { ChapterTitle } from "./ChapterTitle";

/** Serene Investors in one card: pick a published plan and read it like a share certificate. */
/** `onInvest`: already on the Invest page, so no link to it. */
export function SharePlanner({ onInvest }: { onInvest?: boolean }) {
  const c = useInvestorCalculator();
  const [width, setWidth] = useState(0);
  return (
    <View style={styles.wrap}>
      <ChapterTitle title={WEB.investors.title} soft={WEB.investors.soft} />
      <View style={styles.card} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width ? (
          <View pointerEvents="none" renderToHardwareTextureAndroid shouldRasterizeIOS style={styles.art}>
            <Contours width={width} line={explore.contourInk} major={explore.contourInk} />
          </View>
        ) : null}

        <View style={styles.plans} accessibilityRole="radiogroup">
          {c.plans.map((p) => {
            const on = p.id === c.plan.id;
            return (
              <Pressable key={p.id} onPress={() => c.select(p.id)} style={[styles.plan, on && styles.planOn]} accessibilityRole="radio" accessibilityState={{ selected: on }} accessibilityLabel={`${p.kind}, ${p.area} square feet`}>
                <Text style={[styles.planArea, on && styles.planTextOn]} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                  {p.area}
                </Text>
                <Text style={[styles.planUnit, on && styles.planTextOn]} numberOfLines={1} maxFontSizeMultiplier={1.1}>
                  sq ft
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.kindRow}>
          <Text style={styles.kind} numberOfLines={1}>
            {c.plan.kind}
          </Text>
          {c.isSpu ? (
            <View style={styles.stepper}>
              <Pressable onPress={c.fewer} disabled={!c.canFewer} style={[styles.step, !c.canFewer && styles.stepOff]} hitSlop={6} accessibilityRole="button" accessibilityLabel="One unit fewer">
                <Ionicons name="remove" size={18} color={groups.pine} />
              </Pressable>
              <Text style={styles.units} accessibilityLabel={`${c.units} units`}>
                {c.units}
              </Text>
              <Pressable onPress={c.more} disabled={!c.canMore} style={[styles.step, !c.canMore && styles.stepOff]} hitSlop={6} accessibilityRole="button" accessibilityLabel="One unit more">
                <Ionicons name="add" size={18} color={groups.pine} />
              </Pressable>
            </View>
          ) : null}
        </View>

        <View accessible accessibilityLabel={`${formatPKR(c.monthly)} a month for ${PLAN_RULES.months} months`}>
          <Text style={styles.monthly} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
            {formatPKR(c.monthly)}
          </Text>
          <Text style={styles.monthlyNote}>{`a month, for ${PLAN_RULES.months} months`}</Text>
        </View>

        <View style={styles.split}>
          <View style={[styles.splitDown, { flex: PLAN_RULES.downPercent }]} />
          <View style={[styles.splitRest, { flex: 100 - PLAN_RULES.downPercent }]} />
        </View>
        <View style={styles.sums}>
          <View style={styles.sum}>
            <Text style={styles.sumLabel}>{`${PLAN_RULES.downPercent}% down`}</Text>
            <Text style={styles.sumValue} numberOfLines={1} adjustsFontSizeToFit>
              {formatPKR(c.down)}
            </Text>
            <Text style={styles.sumNote}>{spokenPKR(c.down)}</Text>
          </View>
          <View style={[styles.sum, styles.sumEnd]}>
            <Text style={styles.sumLabel}>Full price</Text>
            <Text style={styles.sumValue} numberOfLines={1} adjustsFontSizeToFit>
              {formatPKR(c.total)}
            </Text>
            <Text style={styles.sumNote}>{spokenPKR(c.total)}</Text>
          </View>
        </View>

        <PressScale style={styles.cta} onPress={() => void openWhatsApp(c.message)} accessibilityLabel={WEB.investors.cta}>
          <Ionicons name="logo-whatsapp" size={20} color={colors.white} />
          <Text style={styles.ctaText} numberOfLines={1} maxFontSizeMultiplier={1.1}>
            {WEB.investors.cta}
          </Text>
        </PressScale>
        {onInvest ? null : (
        <PressScale style={styles.link} onPress={() => router.navigate("/payments")} accessibilityLabel="Open Serene Investors">
          <Text style={styles.linkText}>Open Serene Investors</Text>
          <Ionicons name="arrow-forward" size={18} color={groups.pine} />
        </PressScale>
        )}
      </View>
      <Text style={styles.small}>{WEB.investors.note}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xl },
  card: { marginHorizontal: -spacing.sm, borderRadius: 34, overflow: "hidden", backgroundColor: explore.sheet, padding: spacing.lg, gap: spacing.lg, boxShadow: explore.lift },
  art: { position: "absolute", top: 0, left: 0 },
  plans: { flexDirection: "row", gap: 6 },
  plan: { flex: 1, height: 64, borderRadius: 20, backgroundColor: explore.canvas, alignItems: "center", justifyContent: "center" },
  planOn: { backgroundColor: groups.pine },
  planArea: { color: groups.pine, fontSize: 18, lineHeight: 22, fontFamily: fonts.uiBold },
  planUnit: { color: colors.textMuted, fontSize: 12, lineHeight: 15 },
  planTextOn: { color: colors.white },
  kindRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 44, gap: spacing.md },
  kind: { flex: 1, color: groups.pine, fontSize: font.md + 1, fontFamily: fonts.uiSemi },
  stepper: { flexDirection: "row", alignItems: "center", gap: 4 },
  step: { width: 44, height: 44, borderRadius: 22, backgroundColor: explore.canvas, alignItems: "center", justifyContent: "center" },
  stepOff: { opacity: 0.4 },
  units: { minWidth: 34, textAlign: "center", color: groups.pine, fontSize: 18, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  monthly: { color: groups.pine, fontFamily: fonts.display, fontSize: 54, lineHeight: 58, letterSpacing: -1.4, fontVariant: ["lining-nums"] },
  monthlyNote: { color: colors.textMuted, fontSize: font.md },
  split: { flexDirection: "row", gap: 3, height: 8 },
  splitDown: { backgroundColor: explore.goldDeep, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 },
  splitRest: { backgroundColor: groups.pine, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  sums: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, marginTop: -spacing.sm },
  sum: { flex: 1 },
  sumEnd: { alignItems: "flex-end" },
  sumLabel: { color: explore.goldDeep, fontSize: font.sm, fontFamily: fonts.uiSemi },
  sumValue: { color: groups.pine, fontSize: font.lg, lineHeight: 25, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"] },
  sumNote: { color: colors.textMuted, fontSize: font.sm },
  cta: { height: 58, borderRadius: radius.pill, backgroundColor: groups.pine, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  ctaText: { color: colors.white, fontSize: 16, fontFamily: fonts.uiBold },
  link: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 44, marginTop: -spacing.sm },
  linkText: { color: groups.pine, fontSize: font.md, fontFamily: fonts.uiSemi },
  small: { color: colors.textMuted, fontSize: 12, lineHeight: 18, marginTop: -spacing.sm },
});
