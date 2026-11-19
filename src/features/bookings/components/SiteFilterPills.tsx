import { ScrollView, StyleSheet } from "react-native";
import { FilterChip } from "@/core/components/FilterChip";
import { PROJECTS, type ProjectSlug } from "@/core/constants/serene";
import { spacing } from "@/core/constants/theme";

type Props = { value: ProjectSlug | undefined; onChange: (v: ProjectSlug | undefined) => void };

export function SiteFilterPills({ value, onChange }: Props) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      <FilterChip label="All sites" selected={value === undefined} onPress={() => onChange(undefined)} />
      {PROJECTS.map((p) => (
        <FilterChip key={p.slug} label={p.name} selected={value === p.slug} onPress={() => onChange(p.slug)} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({ row: { gap: spacing.sm } });
