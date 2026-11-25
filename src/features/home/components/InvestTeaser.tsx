import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { router } from "expo-router";
import { Button } from "@/core/components/Button";
import { PLAN_RULES } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing, groups } from "@/core/constants/theme";

/** The only investor block on Explore: a short teaser. The calculator, payment plans and reasons live in the Invest tab. */
export function InvestTeaser() {
  return (
    <View style={styles.card}>
      <View style={styles.eyebrowRow}>
        <View style={styles.rule} />
        <Text style={styles.eyebrow}>SERENE INVESTORS</Text>
      </View>
      <Text style={styles.title}>Own a share from PKR 2M</Text>
      <Text style={styles.sub}>{`${PLAN_RULES.downPercent}% down, then ${PLAN_RULES.months} monthly instalments.`}</Text>
      <Button variant="secondary" showBadge label="Explore Investments" onPress={() => router.navigate("/payments")} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: groups.plate, borderRadius: radius.xl, borderWidth: 1, borderColor: groups.plateEdge, padding: spacing.lg + 4, gap: spacing.sm, ...shadows.card },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  rule: { width: 22, height: 1.5, backgroundColor: colors.goldAccent },
  eyebrow: { color: colors.goldText, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: colors.ink, fontFamily: fonts.display, fontSize: 30, lineHeight: 34 },
  sub: { color: colors.ink2, fontSize: font.md - 1, lineHeight: 21, marginBottom: spacing.sm },
});
