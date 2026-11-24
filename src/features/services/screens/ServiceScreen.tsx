import { ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { colors, dark, font, fonts, spacing, svc } from "@/core/constants/theme";
import { Canvas, Surface, ActionButton, PhotoBadge, RoundButton, ServicesHeader } from "@/features/services/components/ui";
import { serviceBySlug } from "@/features/services/data/catalog";
import { goBack, openBook, toTab } from "@/features/services/lib/nav";

const OVERLAP = 34;
const BAR = 72;

export default function ServiceScreen() {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
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

  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ paddingBottom: BAR + insets.bottom + spacing.xxl + spacing.lg }}>
        <View style={{ height: Math.round(height * 0.46) }}>
          <Image source={service.photo} style={StyleSheet.absoluteFill} contentFit="cover" transition={250} />
          <View style={styles.badge}>
            <PhotoBadge label="Billed to room" />
          </View>
        </View>
        <View style={styles.panel}>
          <View style={styles.row}>
            <View style={styles.fill}>
              <Text style={styles.name}>{service.name}</Text>
              <Text style={styles.metaText}>{service.line}</Text>
            </View>
          </View>
          <Text style={styles.body}>{service.description}</Text>
          <Surface finish="dark" style={styles.section}>
            <Text style={styles.h}>{service.choiceTitle}</Text>
            <View style={styles.chips}>
              {service.choices.map((x) => (
                <Surface key={x.label} finish="dark" radius={9} style={styles.chip}>
                  <Text style={styles.chipText}>{x.label}</Text>
                </Surface>
              ))}
            </View>
          </Surface>
          <Surface finish="dark" style={styles.section}>
            <Text style={styles.h}>Good to know</Text>
            {(service.includes ?? []).map((x) => (
              <View key={x} style={styles.inc}>
                <Ionicons name="checkmark-outline" size={17} color={colors.goldAccent} />
                <Text style={[styles.body, styles.fill]}>{x}</Text>
              </View>
            ))}
          </Surface>
        </View>
      </ScrollView>

      <View style={[styles.top, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
        <RoundButton finish="clear" icon="chevron-back-outline" label="Back" onPress={goBack} />
        <RoundButton finish="clear" icon="calendar-outline" label="My bookings" onPress={() => toTab("/my-bookings")} />
      </View>

      <Surface finish="dark" radius={20} style={[styles.dock, { bottom: insets.bottom + spacing.md }]}>
        <View style={styles.fill}>
          <Text style={styles.dockTier}>Billed to room</Text>
          <Text style={styles.dockPrice}>On request</Text>
        </View>
        <ActionButton finish="frost" label={service.verb ?? "Request"} icon="arrow-forward-outline" onPress={() => openBook(service.slug)} style={styles.cta} />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: svc.panel },
  fill: { flex: 1 },
  badge: { position: "absolute", left: spacing.lg, bottom: OVERLAP + spacing.md },
  panel: { marginTop: -OVERLAP, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: svc.panel, padding: spacing.lg, paddingTop: spacing.xl, gap: spacing.lg },
  row: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  name: { color: dark.text, fontSize: 30, fontFamily: fonts.display },
  metaText: { color: dark.muted, fontSize: font.sm },
  section: { gap: spacing.sm, padding: spacing.lg },
  h: { color: dark.text, fontSize: font.md, fontFamily: fonts.uiBold },
  body: { color: dark.muted, fontSize: font.sm + 1 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { height: 34, paddingHorizontal: 14, justifyContent: "center" },
  chipText: { color: dark.text, fontSize: font.sm },
  inc: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  top: { position: "absolute", left: spacing.lg, right: spacing.lg, flexDirection: "row", justifyContent: "space-between" },
  dock: { position: "absolute", left: spacing.lg, right: spacing.lg, height: BAR, flexDirection: "row", alignItems: "center", gap: spacing.md, paddingLeft: spacing.xl, paddingRight: 9, backgroundColor: svc.panel },
  dockTier: { color: dark.muted, fontSize: font.xs },
  dockPrice: { color: dark.text, fontSize: font.lg, fontFamily: fonts.uiBold },
  cta: { minWidth: 164 },
});
