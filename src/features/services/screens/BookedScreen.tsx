import { useEffect } from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "@/core/components/Text";
import { dark, font, fonts, spacing, svc } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { Surface, ActionButton, Press } from "@/features/services/components/ui";
import { Tick } from "@/features/services/components/motion";
import { whatsappDesk } from "@/features/services/components/DeskSheet";
import { toTab } from "@/features/services/lib/nav";
import { slotLabel } from "@/features/services/lib/schedule";
import { describe, useServicesStore } from "@/features/services/store/useServicesStore";

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

  const rows: [string, string][] = b
    ? [
        ["Service", [b.name, ...b.choices].join(" · ")],
        ["When", b.slot ? `${formatDate(b.date)} · ${slotLabel(b.slot)}` : formatDate(b.date)],
        ["Room", b.room],
        ["Charge", "Billed to room, price confirmed by the desk"],
        ["Reference", b.reference],
      ]
    : [];

  return (
    <View style={[styles.page, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.lg }]}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Tick />
        <Text style={styles.title}>{b ? "Request sent" : "Request not found"}</Text>
        <Text style={styles.sub}>{b ? "Desk Notified · saved in Bookings" : "Please check Bookings."}</Text>
        {b ? (
          <Surface finish="dark" style={styles.card}>
            {rows.map(([k, v]) => (
              <View key={k} style={styles.row}>
                <Text style={styles.k}>{k}</Text>
                <Text style={styles.v}>{v}</Text>
              </View>
            ))}
          </Surface>
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
  page: { flex: 1, backgroundColor: svc.panel, paddingHorizontal: spacing.lg },
  content: { flexGrow: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl },
  title: { color: dark.text, fontSize: 34, fontFamily: fonts.display },
  sub: { color: dark.muted, fontSize: font.md },
  card: { alignSelf: "stretch", marginTop: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  row: { flexDirection: "row", justifyContent: "space-between", gap: spacing.lg, paddingVertical: 11 },
  k: { color: dark.muted, fontSize: font.sm },
  v: { flex: 1, color: dark.text, fontSize: font.sm, fontFamily: fonts.uiSemi, textAlign: "right" },
  also: { marginBottom: spacing.md },
  link: { height: 48, alignItems: "center", justifyContent: "center" },
  linkText: { color: dark.text, fontSize: font.md, fontFamily: fonts.uiSemi },
});
