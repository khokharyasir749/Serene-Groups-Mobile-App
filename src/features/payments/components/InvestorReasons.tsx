import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Expandable } from "@/core/components/Expandable";
import { WEB } from "@/core/constants/serene";
import { colors, font, fonts, letter, radius, shadows, spacing } from "@/core/constants/theme";

const PREVIEW = 2;
// One short category per reason, in the web's order.
const TAGS = ["IN-HOUSE OPERATIONS", "QUARTERLY YIELD", "ACCESSIBLE ENTRY", "OWNER PRIVILEGES", "LDA APPROVED", "100% HALAL STRUCTURE"];

function Reason({ i }: { i: number }) {
  const r = WEB.investors.reasons[i];
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Text style={styles.idx}>{`0${i + 1}`}</Text>
        <View style={styles.rule} />
        <Text style={styles.tag}>{TAGS[i] ?? ""}</Text>
      </View>
      <Text style={styles.title}>{r.t}</Text>
      <Text style={styles.text}>{r.d}</Text>
    </View>
  );
}

/** The six numbered investor reasons from the web as editorial tiles; the first two up front, the rest on a pill toggle. */
export function InvestorReasons() {
  const all = WEB.investors.reasons.map((_, i) => i);
  return (
    <Expandable moreLabel={`View all ${all.length} reasons`} lessLabel="Show fewer reasons" more={<View style={styles.list}>{all.slice(PREVIEW).map((i) => <Reason key={i} i={i} />)}</View>}>
      <View style={styles.list}>{all.slice(0, PREVIEW).map((i) => <Reason key={i} i={i} />)}</View>
    </Expandable>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md },
  card: { gap: spacing.sm, backgroundColor: colors.white, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, ...shadows.card },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xs },
  idx: { color: colors.goldAccent, fontFamily: fonts.displayBold, fontSize: 30, lineHeight: 32 },
  rule: { flex: 1, height: 1, backgroundColor: colors.goldAccent, opacity: 0.55 },
  tag: { color: colors.pineBrand, backgroundColor: colors.cardUnselected, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, overflow: "hidden" },
  title: { color: colors.ink, fontSize: font.lg, fontFamily: fonts.uiBold },
  text: { color: colors.ink2, fontSize: font.md - 1, lineHeight: 22 },
});
