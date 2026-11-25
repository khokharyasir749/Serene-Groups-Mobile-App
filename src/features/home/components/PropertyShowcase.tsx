import { Linking, Pressable, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { GlassPill } from "@/core/components/GlassPill";
import { SectionHeader } from "@/core/components/SectionHeader";
import { SegmentedTabs } from "@/core/components/SegmentedTabs";
import { MEDIA, WEB_MEDIA } from "@/core/constants/media";
import { CONTACT, FARMS, PROJECTS, PROJECT_GEO, PROJECT_URL, WEB, type ProjectSlug } from "@/core/constants/serene";
import { colors, dark, font, fonts, gradients, letter, radius, SCRIM_STOPS, spacing, groups } from "@/core/constants/theme";
import { openSite } from "@/core/lib/openSite";
import { openWhatsApp } from "@/core/lib/whatsappShare";
import { useShowcaseStore, type ShowcaseTab } from "./showcaseStore";

const TABS = [
  { id: "nathia-gali", label: "Nathia Gali" },
  { id: "lahore", label: "Lahore" },
  { id: "more", label: "Serene Farms" },
] as const;

// Photos exactly as the web pairs them: tower-forest-mist → Nathia Gali, lhr/tower → Lahore.
const PHOTO = { "nathia-gali": MEDIA.nathiaGali, lahore: MEDIA.lahoreTower } as const;
const mapsFor = (slug: ProjectSlug) => `https://www.google.com/maps/search/?api=1&query=${PROJECT_GEO[slug].lat},${PROJECT_GEO[slug].lon}`;

type Action = { icon: keyof typeof Ionicons.glyphMap; label: string; onPress: () => void };

/** Three equal luxury pills: Directions · Call · Email. */
function QuickActions({ actions }: { actions: Action[] }) {
  return (
    <View style={styles.actions}>
      {actions.map((a) => (
        <Pressable key={a.label} onPress={a.onPress} style={({ pressed }) => [styles.action, pressed && styles.actionPressed]} accessibilityRole="button" accessibilityLabel={a.label}>
          <Ionicons name={a.icon} size={16} color={colors.pineBrand} />
          <Text style={styles.actionText} numberOfLines={1}>
            {a.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Project({ slug }: { slug: ProjectSlug }) {
  const p = PROJECTS.find((x) => x.slug === slug)!;
  return (
    <>
      <View style={styles.photo}>
        <Image source={PHOTO[slug]} style={styles.fill} contentFit="cover" transition={300} />
        <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
        <LinearGradient colors={[colors.clear, colors.scrim]} style={styles.bottomFade} />
        <View style={styles.meta}>
          {[p.since, p.kind].map((m) => (
            <GlassPill key={m} label={m} />
          ))}
        </View>
        <View style={styles.photoBody}>
          <Text style={[styles.status, styles.statusOnPhoto]}>{p.status.toUpperCase()}</Text>
          <Text style={styles.title}>Serene Heights {p.name}</Text>
          <Text style={styles.place}>{p.place}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.summary}>{p.summary}</Text>
        <View style={styles.facts}>
          {p.facts.map((f) => (
            <Text key={f} style={styles.fact}>
              {f}
            </Text>
          ))}
        </View>
        <Button label={`Visit Official ${p.name} Website`} onPress={() => void openSite(PROJECT_URL[slug])} />
        <QuickActions
          actions={[
            { icon: "navigate-outline", label: "Directions", onPress: () => void Linking.openURL(mapsFor(slug)) },
            { icon: "call-outline", label: "Call", onPress: () => void Linking.openURL(`tel:${p.phone.replace(/[^\d+]/g, "")}`) },
            { icon: "mail-outline", label: "Email", onPress: () => void Linking.openURL(`mailto:${p.email}`) },
          ]}
        />
      </View>
    </>
  );
}

function More() {
  const u = WEB.upcoming;
  const images = [WEB_MEDIA.upClouds, WEB_MEDIA.upSnow];
  return (
    <>
      <View style={styles.photo}>
        <Image source={MEDIA.farms} style={styles.fill} contentFit="cover" transition={300} />
        <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
        <View style={styles.meta}>
          <GlassPill label={FARMS.status} gold />
          <GlassPill label={FARMS.kind} />
        </View>
        <View style={styles.photoBody}>
          <Text style={styles.place}>{FARMS.place}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.summary}>{FARMS.summary}</Text>
        <View style={styles.facts}>
          {FARMS.facts.map((f) => (
            <Text key={f} style={styles.fact}>
              {f}
            </Text>
          ))}
        </View>
        <Button label="Register interest" onPress={() => void openWhatsApp(FARMS.interest)} />
        <QuickActions
          actions={[
            { icon: "navigate-outline", label: "Directions", onPress: () => void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Serene Farms, Barki Road")}`) },
            { icon: "call-outline", label: "Call", onPress: () => void Linking.openURL(CONTACT.uanHref) },
            { icon: "mail-outline", label: "Email", onPress: () => void Linking.openURL(`mailto:${PROJECTS[0].email}`) },
          ]}
        />

        <View style={styles.upNext}>
          <Text style={styles.status}>UP NEXT</Text>
          {u.teasers.map((t, i) => (
            <View key={t.n} style={styles.row}>
              <Image source={images[i]} style={styles.thumb} contentFit="cover" />
              <View style={styles.flex}>
                <Text style={styles.rowKicker}>{`PROJECT ${t.n} · COMING SOON`}</Text>
                <Text style={styles.rowTitle}>{t.title}</Text>
                <Text style={styles.rowNote}>{t.note}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.summary}>{u.p}</Text>
        </View>
        <Button label={`${u.cta.title} ${u.cta.button}`} onPress={() => void openWhatsApp(u.interest)} />
      </View>
    </>
  );
}

/** One refined showcase for every project: a segmented switcher over Nathia Gali, Lahore, and Farms & Upcoming. */
export function PropertyShowcase() {
  const { tab, setTab } = useShowcaseStore();
  return (
    <View style={styles.wrap}>
      <SectionHeader eyebrow="Pillars 03 · 04 — ongoing projects" title={WEB.projects.title} soft={WEB.projects.soft} />
      <SegmentedTabs tabs={TABS} value={tab} onChange={(t: ShowcaseTab) => setTab(t)} />
      <Card style={styles.card}>{tab === "more" ? <More /> : <Project slug={tab} />}</Card>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  card: { padding: 0, gap: 0 },
  fill: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  photo: { height: 230, justifyContent: "flex-end", backgroundColor: colors.stone, overflow: "hidden" },
  meta: { position: "absolute", top: spacing.md, left: spacing.md, right: spacing.md, flexDirection: "row", flexWrap: "wrap", gap: 6 },
  photoBody: { padding: spacing.lg, gap: 2 },
  status: { color: colors.goldText, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  title: { color: dark.text, fontFamily: fonts.display, fontSize: 31, lineHeight: 34 },
  place: { color: dark.muted, fontSize: font.sm },
  body: { padding: spacing.lg, gap: spacing.md },
  summary: { color: colors.ink2, fontSize: font.md - 1, lineHeight: 21 },
  facts: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  fact: { color: colors.ink, fontSize: font.xs + 1, fontFamily: fonts.uiMedium, backgroundColor: colors.cardUnselected, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill, overflow: "hidden" },
  actions: { flexDirection: "row", gap: 8 },
  action: { flex: 1, height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, backgroundColor: groups.plate, borderWidth: 1, borderColor: groups.champagne, borderRadius: radius.pill },
  actionPressed: { opacity: 0.78 },
  actionText: { color: colors.pineBrand, fontSize: font.sm, fontFamily: fonts.uiSemi },
  bottomFade: { position: "absolute", left: 0, right: 0, bottom: 0, height: 150 },
  statusOnPhoto: { color: colors.white },
  upNext: { gap: spacing.md, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: spacing.md },
  rowKicker: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  row: { flexDirection: "row", gap: spacing.md, alignItems: "center" },
  flex: { flex: 1, gap: 2 },
  thumb: { width: 78, height: 78, borderRadius: radius.md },
  rowTitle: { color: colors.ink, fontFamily: fonts.display, fontSize: 22, lineHeight: 24 },
  rowNote: { color: colors.muted, fontSize: font.xs + 1, lineHeight: 16 },
});
