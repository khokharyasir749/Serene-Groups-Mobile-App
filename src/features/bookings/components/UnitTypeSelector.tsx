import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { unitImage } from "@/core/constants/media";
import { UNIT_OPTIONS, ROOMS, type ProjectSlug } from "@/core/constants/serene";
import { colors, dark, font, gradients, radius, spacing, SCRIM_STOPS } from "@/core/constants/theme";

type Props = { project: ProjectSlug; value: string; onChange: (id: string) => void };

/** Visual unit-type picker: a photo card per room type / unit kind. */
export function UnitTypeSelector({ project, value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroll}>
      {UNIT_OPTIONS[project].map((u) => {
        const on = value === u.id;
        const size = ROOMS.find((r) => r.slug === u.id)?.size;
        return (
          <Pressable key={u.id} onPress={() => onChange(u.id)} style={[styles.card, on && styles.on]} accessibilityState={{ selected: on }}>
            <Image source={unitImage(project, u.id)} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient colors={gradients.heroScrim} locations={[...SCRIM_STOPS]} style={StyleSheet.absoluteFill} />
            <View style={styles.body}>
              <Text style={styles.name} numberOfLines={2}>
                {u.label}
              </Text>
              {size ? <Text style={styles.size}>{size}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -spacing.lg },
  row: { paddingHorizontal: spacing.lg, gap: spacing.md },
  card: { width: 148, height: 118, borderRadius: radius.lg, overflow: "hidden", justifyContent: "flex-end", borderWidth: 1, borderColor: colors.border },
  on: { borderColor: colors.gold, borderWidth: 2 },
  body: { padding: spacing.sm + 2 },
  name: { color: dark.text, fontSize: font.sm, fontWeight: "700" },
  size: { color: colors.gold, fontSize: font.xs },
});
