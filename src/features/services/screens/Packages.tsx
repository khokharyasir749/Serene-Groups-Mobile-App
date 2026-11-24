import { ScrollView, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Text } from "@/core/components/Text";
import { CLEARANCE, colors, font, fonts, spacing, svc } from "@/core/constants/theme";
import { DriftPhoto, Enter } from "@/features/services/components/motion";
import { Canvas, ActionButton, Press, Surface, ServicesHeader } from "@/features/services/components/ui";
import { PACKAGES } from "@/features/services/data/catalog";
import { openBook, openService } from "@/features/services/lib/nav";

export default function Packages() {
  return (
    <Canvas>
      <StatusBar style="dark" />
      <ServicesHeader title="Packages" overline="Extras arranged together for your stay" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {PACKAGES.map((s, i) => {
          return (
            <Enter key={s.slug} order={i}>
            <Press onPress={() => openService(s.slug)} style={styles.card} accessibilityLabel={`${s.name}. ${s.line}`}>
              {s.photo ? <DriftPhoto source={s.photo} style={StyleSheet.absoluteFill} /> : null}
              <LinearGradient colors={svc.photoFade} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />
              <Surface finish="clear" radius={18} style={styles.foot}>
                <View style={styles.fill}>
                  <Text style={styles.name}>{s.name}</Text>
                  <Text style={styles.line} numberOfLines={1}>
                    {s.line}
                  </Text>
                </View>
                <ActionButton small finish="frost" label="Request" accessibilityLabel={`Request ${s.name}`} onPress={() => openBook(s.slug)} />
              </Surface>
            </Press>
            </Enter>
          );
        })}
      </ScrollView>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingTop: spacing.md + 2, paddingHorizontal: spacing.lg, gap: spacing.md + 2, paddingBottom: CLEARANCE },
  card: { height: 264, borderRadius: 24, overflow: "hidden", padding: 10, justifyContent: "flex-end", backgroundColor: colors.stone },
  foot: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingVertical: spacing.md, paddingLeft: 16, paddingRight: spacing.md },
  name: { color: colors.white, fontSize: 23, lineHeight: 29, fontFamily: fonts.display },
  line: { color: colors.white, fontSize: font.sm },
});
