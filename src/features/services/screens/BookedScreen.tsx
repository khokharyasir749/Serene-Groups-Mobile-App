import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/features/services/components/Text";
import { dark, font, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { Surface, ActionButton, Press } from "@/features/services/components/ui";
import { tone } from "@/features/services/components/tone";
import { serviceBySlug } from "@/features/services/data/catalog";
import { LinearGradient } from "expo-linear-gradient";
import { DriftPhoto, Enter, Tick } from "@/features/services/components/motion";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { toTab } from "@/features/services/lib/nav";
import { slotLabel } from "@/features/services/lib/schedule";
import { describe, useServicesStore } from "@/features/services/store/useServicesStore";
import { type } from "@/features/services/components/type";
import { sf } from "@/features/services/components/fonts";
import { useServiceFonts } from "@/features/services/components/fonts";

export default function BookedScreen() {
  const insets = useSafeAreaInsets();
  const { ref } = useLocalSearchParams<{ ref: string }>();
  const b = useServicesStore((s) => s.requests.find((x) => x.reference === ref));

  useEffect(() => {
    // Back goes to Services, not to the page the finished booking started from.
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      toTab("");
      return true;
    });
    return () => sub.remove();
  }, []);

  const photo = serviceBySlug(b?.slug)?.photo;
  const rows: [string, string][] = b
    ? [
        ["Service", [b.name, ...b.choices].join(" · ")],
        ["When", b.slot ? `${formatDate(b.date)} · ${slotLabel(b.slot)}` : formatDate(b.date)],
        ["Room", b.room],
        ["Charge", "Billed to room"],
        ["Reference", b.reference],
      ]
    : [];

  if (!useServiceFonts()) return <View style={styles.page} />;

  return (
    <View style={[styles.page, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      {photo ? <DriftPhoto source={photo} style={styles.photo} /> : null}
      <LinearGradient pointerEvents="none" colors={tone.sentVeil} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Tick />
        <Enter order={3}>
        <Text style={styles.title}>{b ? "Request sent" : "Request not found"}</Text>
        </Enter>
        <Enter order={4}>
        <Text style={styles.sub}>{b ? "Desk Notified · saved in Bookings" : "Please check Bookings."}</Text>
        </Enter>
        {b ? (
          <Enter order={5} style={styles.stretch}>
          <Surface finish="dark" style={styles.card}>
            {rows.map(([k, v], i) => (
              <Enter key={k} order={6 + i} dy={10} style={styles.row}>
                <Text style={styles.k}>{k}</Text>
                <Text style={styles.v}>{v}</Text>
              </Enter>
            ))}
          </Surface>
          </Enter>
        ) : null}
      </ScrollView>
      {b ? <ActionButton finish="dark" icon="logo-whatsapp" label="Also send on WhatsApp" onPress={() => whatsappDesk(b.room, describe(b))} style={styles.also} /> : null}
      <ActionButton finish="frost" label="View Bookings" onPress={() => toTab("/my-bookings")} />
      <Press onPress={() => toTab("")} style={styles.link}>
        <Text style={styles.linkText}>Back to Services</Text>
      </Press>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: tone.pine, paddingHorizontal: spacing.lg },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl },
  photo: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  title: { ...type.hero, color: dark.text },
  sub: { color: dark.muted, fontSize: font.md },
  stretch: { alignSelf: "stretch" },
  card: { alignSelf: "stretch", marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.lg, paddingVertical: 11 },
  k: { color: dark.muted, fontSize: font.sm },
  v: { flex: 1, color: dark.text, fontSize: font.sm, fontFamily: sf.uiSemi, textAlign: "right" },
  also: { marginBottom: spacing.md },
  link: { height: 48, alignItems: "center", justifyContent: "center" },
  linkText: { color: dark.text, fontSize: font.md, fontFamily: sf.uiSemi },
});
