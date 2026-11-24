import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "@/core/components/Text";
import { CLEARANCE, colors, font, fonts, spacing } from "@/core/constants/theme";
import { formatDate } from "@/core/lib/formatDate";
import { IconWell } from "@/features/services/components/IconWell";
import { Enter } from "@/features/services/components/motion";
import { Canvas, Surface, ActionButton, SurfacePress, ServicesHeader } from "@/features/services/components/ui";
import { FREE_SENT, serviceBySlug } from "@/features/services/data/catalog";
import { BASE, openAny } from "@/features/services/lib/nav";
import { slotLabel } from "@/features/services/lib/schedule";
import { isActive, useServicesStore, type GuestRequest } from "@/features/services/store/useServicesStore";

function RequestCard({ b }: { b: GuestRequest }) {
  const cancel = useServicesStore((s) => s.cancel);
  const service = serviceBySlug(b.slug);
  const live = isActive(b);
  const ask = () =>
    Alert.alert("Cancel this request?", `${b.name}, ${b.room}`, [
      { text: "Keep", style: "cancel" },
      { text: "Cancel request", style: "destructive", onPress: () => cancel(b.reference) },
    ]);
  return (
    <Surface style={styles.card}>
      <View style={styles.row}>
        <IconWell name={service?.icon ?? "message"} size={58} />
        <View style={styles.fill}>
          <Text style={styles.name} numberOfLines={1}>
            {b.name}
          </Text>
          <Text style={styles.meta}>{b.slot ? `${formatDate(b.date)} · ${slotLabel(b.slot)}` : `${formatDate(b.date)} · As soon as possible`}</Text>
          <Text style={styles.meta} numberOfLines={1}>
            {[b.room, ...b.choices, b.note].filter(Boolean).join(" · ")}
          </Text>
        </View>
      </View>
      <View style={styles.foot}>
        <View style={styles.fill}>
          <Text style={styles.price} numberOfLines={1} adjustsFontSizeToFit>
            {b.kind === "care" ? FREE_SENT : b.kind === "message" ? "Desk Notified" : "Billed to room"}
          </Text>
          <Text style={styles.meta}>{b.status === "cancelled" ? `${b.reference} · Cancelled` : b.reference}</Text>
        </View>
        {live ? (
          <ActionButton small finish="ivory" danger label="Cancel" onPress={ask} />
        ) : service ? (
          <ActionButton small label="Request again" onPress={() => openAny(service)} />
        ) : null}
      </View>
    </Surface>
  );
}

export default function MyBookings() {
  const requests = useServicesStore((s) => s.requests);
  const [past, setPast] = useState(false);
  const upcoming = requests.filter(isActive);
  const history = requests.filter((r) => !isActive(r));
  const list = past ? history : upcoming;

  return (
    <Canvas>
      <StatusBar style="dark" />
      <ServicesHeader title="Your Requests" overline={`${upcoming.length} active`} />
      <View style={styles.tabs}>
        {[false, true].map((v) => (
          <SurfacePress key={String(v)} finish={past === v ? "pine" : "ivory"} radius={12} onPress={() => setPast(v)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: past === v }}>
            <Text style={[styles.tabText, past === v && styles.tabTextOn]}>{v ? `History (${history.length})` : `Active (${upcoming.length})`}</Text>
          </SurfacePress>
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {list.map((b, i) => (
          <Enter key={b.reference} order={i}>
            <RequestCard b={b} />
          </Enter>
        ))}
        {list.length === 0 ? (
          <Surface style={styles.empty}>
            <Text style={styles.name}>{past ? "No past requests" : "Nothing requested yet"}</Text>
            <Text style={styles.note}>{past ? "Past and cancelled requests appear here." : "Orders, room requests and messages to the desk appear here."}</Text>
            {past ? null : <ActionButton finish="pineGlass" label="Browse services" onPress={() => router.navigate(BASE)} />}
          </Surface>
        ) : null}
      </ScrollView>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  content: { paddingTop: spacing.md + 2, paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: CLEARANCE },
  tabs: { flexDirection: "row", gap: 10, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  tab: { flex: 1, height: 46, alignItems: "center", justifyContent: "center" },
  tabText: { color: colors.ink, fontSize: font.sm, fontFamily: fonts.uiSemi },
  tabTextOn: { color: colors.snow },
  card: { padding: spacing.md, gap: spacing.md },
  row: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  name: { color: colors.ink, fontSize: font.md + 1, fontFamily: fonts.uiBold },
  meta: { color: colors.muted, fontSize: 12 },
  foot: { flexDirection: "row", alignItems: "center", gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.md },
  price: { color: colors.crestSlate, fontSize: font.sm, fontFamily: fonts.uiBold },
  empty: { padding: spacing.xl, gap: spacing.md },
  note: { color: colors.muted, fontSize: font.sm },
});
