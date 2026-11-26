import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { colors, fonts, spacing } from "@/core/constants/theme";
import { BilledGrid, billedCard } from "@/features/services/components/BilledGrid";
import { Enter } from "@/features/services/components/motion";
import { HeroPage, Reveal } from "@/features/services/components/HeroPage";
import { Headline, Parallax } from "@/features/services/components/scroll";
import { tone } from "@/features/services/components/tone";
import { Canvas, Press, Surface, ActionButton, Heading, RoundButton, ServicesHeader } from "@/features/services/components/ui";
import { DETAIL, PANEL_PHOTO, SERVICES, groupBySlug, serviceBySlug } from "@/features/services/data/catalog";
import { goBack, openBook } from "@/features/services/lib/nav";
import { type } from "@/features/services/components/type";
import { Ready } from "@/features/services/components/Text";

const BAR = 68;

export default function ServiceScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = serviceBySlug(slug);

  if (!service) {
    return (
      <Canvas>
        <StatusBar style="dark" />
        <ServicesHeader back title="Service not found" />
      </Canvas>
    );
  }

  // Two neighbours from the same side of the concierge.
  const related = SERVICES.filter((x) => x.kind === "extra" && x.group === service.group && x.slug !== service.slug).slice(0, 2);

  return (
    <View style={styles.page}>
      <Ready>
      <HeroPage
        photo={PANEL_PHOTO[service.slug] ?? service.photo}
        title={service.name}
        onBack={goBack}
        height={Math.round(Math.min(Math.max(height * 0.56, 400), 520))}
        bottom={BAR + insets.bottom + spacing.xxl + spacing.lg}
        bar={<RoundButton finish="clear" icon="chevron-back-outline" label="Back" onPress={goBack} />}
        foot={
          <View>
            <Enter order={1}>
              <Text style={styles.over}>{service.group ? groupBySlug(service.group)?.short : "Stay package"}</Text>
            </Enter>
            <Headline mount text={service.name} style={styles.title} />
            <Enter order={5}>
              <Text style={styles.sub}>{service.line}</Text>
            </Enter>
          </View>
        }
      >
        <View style={styles.panel}>
          <Text style={styles.about}>{service.description}</Text>
          <View>
            <Text style={styles.pick}>{service.choiceTitle}</Text>
            {service.choices.map((x) => (
              <Press key={x.label} onPress={() => openBook(service.slug, x.label)} style={styles.choice} accessibilityLabel={`${service.verb ?? "Request"} ${x.label}`}>
                <Text style={styles.choiceText}>{x.label}</Text>
                <Ionicons name="add" size={19} color={tone.pine} />
              </Press>
            ))}
          </View>
        </View>
        {DETAIL[service.slug] ? (
          <Reveal>
            <Parallax source={PANEL_PHOTO[service.slug] === DETAIL[service.slug] ? service.photo : DETAIL[service.slug]} height={Math.round(Math.min(height * 0.46, 400))} depth={38} zoom style={styles.detail} />
          </Reveal>
        ) : null}
        {service.includes?.length ? (
          <Reveal style={styles.block}>
            <Heading>Good to know</Heading>
            <View>
              {service.includes.map((x) => (
                <View key={x} style={styles.inc}>
                  <Ionicons name="checkmark" size={18} color={tone.pine} />
                  <Text style={[styles.body, styles.fill]}>{x}</Text>
                </View>
              ))}
            </View>
          </Reveal>
        ) : null}
        {related.length ? (
          <Reveal plain style={styles.block}>
            <Heading>You may also like</Heading>
            <BilledGrid cards={related.map(billedCard)} at={67} />
          </Reveal>
        ) : null}
      </HeroPage>
      <Enter order={6} dy={90} style={[styles.dockWrap, { bottom: insets.bottom + spacing.md }]}>
      <Surface finish="glass" radius={BAR / 2} style={styles.dock}>
        <View style={styles.fill}>
          <Text style={styles.dockTier}>Billed to room</Text>
          <Text style={styles.dockPrice}>On request</Text>
        </View>
        <ActionButton finish="pine" label={service.verb ?? "Request"} icon="arrow-forward-outline" onPress={() => openBook(service.slug)} style={styles.cta} />
      </Surface>
      </Enter>
      </Ready>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  page: { flex: 1, backgroundColor: tone.page },
  over: { ...type.eyebrow, color: tone.champagne, marginBottom: 6 },
  title: { ...type.hero, fontSize: 42, lineHeight: 50, color: colors.white },
  sub: { ...type.label, fontSize: 14, color: colors.white, marginTop: 4 },
  about: { ...type.lead, color: tone.ink },
  block: { gap: 20 },
  body: { ...type.body, fontSize: 14.5, color: tone.ink },
  panel: { gap: 26 },
  pick: { ...type.eyebrow, color: tone.pine, paddingBottom: 6 },
  choice: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", minHeight: 58, borderTopWidth: 1, borderTopColor: tone.hair },
  choiceText: { ...type.button, fontSize: 16, lineHeight: 22, color: tone.ink },
  detail: { borderRadius: 20 },
  inc: { flexDirection: "row", alignItems: "center", gap: 14, minHeight: 54, borderTopWidth: 1, borderTopColor: tone.hair },
  dockWrap: { position: "absolute", left: spacing.lg, right: spacing.lg },
  dock: { height: BAR, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingLeft: spacing.xl, paddingRight: 8 },
  dockTier: { ...type.eyebrow, fontSize: 10.5, color: tone.soft },
  dockPrice: { ...type.button, fontSize: 17, color: tone.ink },
  cta: { minWidth: 158 },
});
