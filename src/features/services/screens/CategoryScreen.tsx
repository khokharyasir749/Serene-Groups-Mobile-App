import { ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, font, fonts, spacing } from "@/core/constants/theme";
import { CareGrid } from "@/features/services/components/CareGrid";
import { Enter } from "@/features/services/components/motion";
import { ServiceRow } from "@/features/services/components/ServiceRow";
import { Canvas, CardPhoto, ServicesHeader } from "@/features/services/components/ui";
import { GROUP_PHOTO, groupBySlug, inGroup } from "@/features/services/data/catalog";

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = groupBySlug(slug);
  const services = category ? inGroup(category.slug) : [];

  return (
    <Canvas>
      <StatusBar style="dark" />
      <ServicesHeader back title={category?.label ?? "Services"} overline={category?.kind === "care" ? "Complimentary" : "Billed to room, on request"} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
        {category?.kind === "extra" ? (
          <View style={styles.hero}>
            {GROUP_PHOTO[category.slug] ? <CardPhoto source={GROUP_PHOTO[category.slug]} /> : null}
            <View>
              <Text style={styles.title}>{category.label}</Text>
              <Text style={styles.line}>{category.line}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.empty}>{category?.line ?? "This category is not available."}</Text>
        )}
        {category?.kind === "care" ? <CareGrid services={services} /> : services.map((s, i) => (
              <Enter key={s.slug} order={i + 1}>
                <ServiceRow service={s} />
              </Enter>
            ))}
      </ScrollView>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: spacing.md + 2, paddingHorizontal: spacing.lg, gap: spacing.md },
  hero: { height: 210, borderRadius: 18, overflow: "hidden", padding: spacing.lg, justifyContent: "flex-end", backgroundColor: colors.stone, marginBottom: spacing.xs },
  title: { color: colors.white, fontSize: 28, lineHeight: 34, fontFamily: fonts.display },
  line: { color: colors.white, fontSize: font.sm },
  empty: { color: colors.muted, fontSize: font.md },
});
