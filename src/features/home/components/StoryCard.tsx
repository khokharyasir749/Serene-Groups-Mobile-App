import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "@/core/components/Card";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { WEB } from "@/core/constants/serene";
import { colors, dark, font, fonts, letter, spacing, groups } from "@/core/constants/theme";

const PILLARS = ["Hospitality", "Real Estate", "Asset Management"] as const;

/** Flagship statement card: crest and gold eyebrow, an editorial line, the group's three disciplines, and a full-story toggle. */
export function StoryCard() {
  const [open, setOpen] = useState(false);
  return (
    <Card variant="emerald" style={styles.card}>
      <View style={styles.head}>
        <SereneLogoMark width={30} fill={colors.snow} snow={groups.pine} />
        <Text style={styles.eyebrow}>THE GROUP · DM CONSORTIUM</Text>
      </View>
      <Text style={styles.headline}>{"Planned, built, sold\nand managed by one team."}</Text>
      <View style={styles.rule} />
      <View style={styles.pillars}>
        {PILLARS.map((p, i) => (
          <View key={p} style={styles.pillar}>
            {i > 0 ? <View style={styles.dot} /> : null}
            <Text style={styles.pillarText}>{p}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.p} numberOfLines={open ? undefined : 3}>
        {WEB.about.p1}
      </Text>
      {open ? (
        <>
          <Text style={styles.p}>{WEB.about.p2}</Text>
          <Text style={styles.p}>{WEB.hero.note}</Text>
        </>
      ) : null}
      <Pressable onPress={() => setOpen((v) => !v)} style={({ pressed }) => [styles.toggle, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={open ? "Show less of the group story" : "Read the full group story"} accessibilityState={{ expanded: open }}>
        <Ionicons name={open ? "chevron-up-outline" : "chevron-down-outline"} size={22} color={colors.goldAccent} />
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.xl, gap: spacing.md },
  head: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  eyebrow: { color: colors.goldAccent, fontSize: font.xs, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  headline: { color: dark.text, fontFamily: fonts.display, fontSize: 32, lineHeight: 34 },
  rule: { height: 1, backgroundColor: colors.lineNight },
  pillars: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing.sm },
  pillar: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.goldAccent },
  pillarText: { color: dark.text, fontSize: font.sm, fontFamily: fonts.uiSemi },
  p: { color: dark.muted, fontSize: font.md - 1, lineHeight: 22 },
  toggle: { alignSelf: "center", width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.goldAccent, backgroundColor: colors.white16, alignItems: "center", justifyContent: "center", marginTop: spacing.xs },
  pressed: { opacity: 0.8 },
});
