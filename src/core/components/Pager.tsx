import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { colors, font, spacing } from "@/core/constants/theme";
import { Button } from "./Button";

type Props = { page: number; totalPages: number; total: number; onChange: (page: number) => void };

export function Pager({ page, totalPages, total, onChange }: Props) {
  if (totalPages <= 1) return <Text style={styles.count}>{total} result{total === 1 ? "" : "s"}</Text>;
  return (
    <View style={styles.row}>
      <View style={styles.btn}>
        <Button label="Previous" variant="secondary" disabled={page <= 1} onPress={() => onChange(page - 1)} />
      </View>
      <Text style={styles.count}>
        {page} / {totalPages}
      </Text>
      <View style={styles.btn}>
        <Button label="Next" variant="secondary" disabled={page >= totalPages} onPress={() => onChange(page + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  btn: { flex: 1 },
  count: { color: colors.textMuted, fontSize: font.sm, textAlign: "center" },
});
