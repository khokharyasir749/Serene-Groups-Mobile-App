import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CLEARANCE, spacing } from "@/core/constants/theme";
import { Curtain } from "@/features/services/components/Curtain";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { Enter } from "@/features/services/components/motion";
import { Headline } from "@/features/services/components/scroll";
import { ServiceRows } from "@/features/services/components/ServiceRows";
import { Text } from "@/features/services/components/Text";
import { tone } from "@/features/services/components/tone";
import { type } from "@/features/services/components/type";
import { Canvas, RoundButton, ServicesHeader } from "@/features/services/components/ui";
import { GROUP_PHOTO, PANEL_PHOTO, groupBySlug, inGroup } from "@/features/services/data/catalog";
import { goBack, openService } from "@/features/services/lib/nav";

export default function CategoryScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = groupBySlug(slug);

  if (!category) {
    return (
      <Canvas>
        <StatusBar style="dark" />
        <ServicesHeader back title="Category not available" />
      </Canvas>
    );
  }
  const services = inGroup(category.slug);
  const panels = services.map((x) => ({ key: x.slug, photo: PANEL_PHOTO[x.slug] ?? x.photo, over: x.line, name: x.tile ?? x.name, cta: x.verb ?? "Request", onOpen: () => openService(x.slug) }));

  return (
    <HeroPage
      photo={GROUP_PHOTO[category.slug]}
      title={category.short}
      onBack={goBack}
      height={Math.round(Math.min(Math.max(height * 0.52, 360), 500))}
      bottom={CLEARANCE}
      bar={<RoundButton finish="clear" icon="chevron-back-outline" label="Back" onPress={goBack} />}
      foot={
        <View>
          <Enter order={1}>
            <Text style={styles.over}>{category.kind === "care" ? "Complimentary" : "Billed to your room"}</Text>
          </Enter>
          <Headline mount text={category.label} style={styles.title} />
        </View>
      }
    >
      {category.kind === "care" ? (
        <>
          <Reveal>
            <ServiceRows services={services} />
          </Reveal>
        </>
      ) : (
        <>
          <Text style={styles.line}>{category.line}</Text>
          <Curtain release panels={panels} />
        </>
      )}
    </HeroPage>
  );
}

const styles = StyleSheet.create({
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 6 },
  title: { ...type.hero, fontSize: 38, lineHeight: 46, color: tone.plate },
  line: { ...type.lead, color: tone.ink },
});
