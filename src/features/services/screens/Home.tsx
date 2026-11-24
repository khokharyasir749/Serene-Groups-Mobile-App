import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { Text } from "@/core/components/Text";
import { CLEARANCE, colors, font, fonts, spacing } from "@/core/constants/theme";
import { useAuthStore } from "@/core/stores/authStore";
import { CareGrid } from "@/features/services/components/CareGrid";
import { CategoryRow } from "@/features/services/components/CategoryRow";
import { FeaturedCarousel } from "@/features/services/components/FeaturedCarousel";
import { FrontDesk } from "@/features/services/components/FrontDesk";
import { Enter } from "@/features/services/components/motion";
import { RoomPicker } from "@/features/services/components/RoomPicker";
import { ServiceRow } from "@/features/services/components/ServiceRow";
import { Canvas, Surface, Heading, SectionTitle, ServicesHeader } from "@/features/services/components/ui";
import { inGroup, searchServices } from "@/features/services/data/catalog";
import { openCategory } from "@/features/services/lib/nav";

const DINING = inGroup("dining");
const WELLNESS = inGroup("wellness");
const COMFORT = inGroup("comfort");
const ISSUES = inGroup("issue");

export default function Home() {
  const name = useAuthStore((s) => s.user?.name);
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;
  const results = searchServices(query);
  const extras = results.filter((r) => r.kind === "extra");
  const care = results.filter((r) => r.kind === "care");

  return (
    <Canvas>
      <StatusBar style="dark" />
      <ServicesHeader />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.pad}>
          <Enter>
            <Text style={styles.over} numberOfLines={1}>
              {name ? `Welcome back, ${name}` : "Your stay at Serene Heights"}
            </Text>
            <Text style={styles.hero}>{"Welcome to\nSerene Services"}</Text>
          </Enter>
          <Enter order={1}>
            <RoomPicker />
          </Enter>
          <Enter order={2}>
          <Surface finish="glass" radius={18} style={styles.search}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="What can we bring you?"
              placeholderTextColor={colors.textDim}
              style={styles.input}
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
              accessibilityLabel="Search services"
            />
            <Pressable onPress={() => (searching ? setQuery("") : undefined)} disabled={!searching} hitSlop={10} accessibilityRole="button" accessibilityLabel="Clear search">
              <Ionicons name={searching ? "close-outline" : "search-outline"} size={20} color={colors.crestSlate} />
            </Pressable>
          </Surface>
          </Enter>
        </View>

        {searching ? (
          <View style={styles.pad}>
            <Heading>{results.length ? `${results.length} found` : "Nothing found"}</Heading>
            {extras.map((r) => (
              <ServiceRow key={r.slug} service={r} />
            ))}
            {care.length ? <CareGrid services={care} /> : null}
            {results.length ? null : <Text style={styles.note}>Message the front desk and we will help.</Text>}
            {results.length ? null : <FrontDesk />}
          </View>
        ) : (
          <>
            <Enter order={3} style={styles.headPad}>
              <FrontDesk />
            </Enter>
            <CategoryRow />

            <View style={styles.block}>
              <View style={styles.pad}>
                <SectionTitle title="Extra Services" label="Billed to your room" />
                <Heading action="View all" onAction={() => openCategory("dining")}>
                  In-Room Dining & Food
                </Heading>
              </View>
              <FeaturedCarousel services={DINING} />
            </View>
            <View style={styles.pad}>
              <Heading>Wellness & Transfers</Heading>
              {WELLNESS.map((r, i) => (
                <Enter key={r.slug} order={i + 4}>
                  <ServiceRow service={r} />
                </Enter>
              ))}
            </View>

            <View style={styles.pad}>
              <SectionTitle free title="Room Care & Assistance" label="Complimentary" />
              <Heading>Housekeeping & Comfort</Heading>
              <CareGrid services={COMFORT} />
              <View style={styles.space} />
              <Heading>Report a Room Issue</Heading>
              <CareGrid services={ISSUES} />
            </View>
          </>
        )}
      </ScrollView>
    </Canvas>
  );
}

const styles = StyleSheet.create({
  space: { height: 2 },
  content: { gap: spacing.xl + 4, paddingTop: spacing.sm, paddingBottom: CLEARANCE },
  pad: { paddingHorizontal: spacing.lg, gap: spacing.md },
  headPad: { paddingHorizontal: spacing.lg },
  block: { gap: spacing.md },
  hero: { color: colors.ink, fontSize: 34, lineHeight: 41, paddingBottom: 3, fontFamily: fonts.display },
  over: { color: colors.goldText, fontSize: font.sm, fontFamily: fonts.uiSemi },
  search: { flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 20 },
  input: { flex: 1, height: 54, color: colors.ink, fontSize: font.md, fontFamily: fonts.ui },
  note: { color: colors.muted, fontSize: font.sm },
});
