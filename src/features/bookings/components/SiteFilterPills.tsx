import { ScrollView, StyleSheet } from "react-native";
import { Pill } from "@/core/components/Pill";
import { PROJECTS, type ProjectSlug } from "@/core/constants/serene";
import { spacing } from "@/core/constants/theme";

type Props = { value: ProjectSlug | undefined; onChange: (v: ProjectSlug | undefined) => void };

export function SiteFilterPills({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <Pill label="All sites" selected={value === undefined} onPress={() => onChange(undefined)} />
      {PROJECTS.map((p) => (
        <Pill key={p.slug} label={p.name} selected={value === p.slug} onPress={() => onChange(p.slug)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ row: { gap: spacing.sm } });
