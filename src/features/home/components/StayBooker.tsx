import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Text } from "@/core/components/Text";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/core/components/Button";
import { Card } from "@/core/components/Card";
import { colors, dark, font, fonts, letter, radius, spacing } from "@/core/constants/theme";
import { useReserveStore } from "@/features/stays/hooks/useReserveStore";
import { useStayBooker } from "../hooks/useStayBooker";

const GUESTS = [1, 2, 3, 4];

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={styles.date}>
      <Feather name="calendar" size={16} color={colors.pineBrand} />
      <View style={styles.flex}>
        <Text style={styles.micro}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textDim}
          keyboardType="numbers-and-punctuation"
          selectionColor={colors.pineBrand}
          style={styles.dateInput}
        />
      </View>
    </View>
  );
}

/** Boutique-hotel booking widget: dates in a two-column split, guests as one segmented row, then Reserve and WhatsApp. */
export function StayBooker() {
  const b = useStayBooker();
  const openReserve = useReserveStore((st) => st.openReserve);
  return (
    <Card variant="emerald" style={styles.box}>
      <Text style={styles.eyebrow}>CHECK AVAILABILITY · NO SIGN-IN NEEDED</Text>
      <View style={styles.row}>
        <DateField label="CHECK IN" value={b.checkIn} onChange={b.setCheckIn} />
        <DateField label="CHECK OUT" value={b.checkOut} onChange={b.setCheckOut} />
      </View>
      <Text style={styles.label}>GUESTS · ADULTS</Text>
      <View style={styles.segment}>
        {GUESTS.map((n) => {
          const on = b.adults === n;
          return (
            <Pressable key={n} onPress={() => b.setAdults(n)} style={[styles.seg, on && styles.segOn]} accessibilityRole="radio" accessibilityState={{ selected: on }}>
              <Text style={[styles.segText, on && styles.segTextOn]}>{n}</Text>
            </Pressable>
          );
        })}
      </View>
      <Button variant="light" label="Reserve" showBadge onPress={() => openReserve({ checkIn: b.checkIn, checkOut: b.checkOut, adults: b.adults })} />
      <Button variant="onDark" icon="message-circle" label="Enquire on WhatsApp" onPress={b.submit} />
      {b.error ? <Text style={styles.error}>{b.error}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  box: { padding: spacing.lg, gap: spacing.md },
  flex: { flex: 1 },
  eyebrow: { color: colors.goldAccent, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  row: { flexDirection: "row", gap: spacing.sm },
  date: { flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm, backgroundColor: colors.white, borderRadius: radius.lg, paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md },
  micro: { color: colors.muted, fontSize: 9, fontFamily: fonts.uiBold, letterSpacing: 1.2 },
  dateInput: { color: colors.ink, fontSize: font.sm + 1, fontFamily: fonts.uiBold, fontVariant: ["tabular-nums"], paddingVertical: 0, minHeight: 20 },
  label: { color: dark.muted, fontSize: 10, fontFamily: fonts.uiBold, letterSpacing: letter.eyebrow },
  segment: { flexDirection: "row", backgroundColor: colors.white16, borderWidth: 1, borderColor: colors.lineNight, borderRadius: radius.pill, padding: 4 },
  seg: { flex: 1, height: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center" },
  segOn: { backgroundColor: colors.white },
  segText: { color: dark.text, fontFamily: fonts.display, fontSize: 22, lineHeight: 26 },
  segTextOn: { color: colors.ink },
  error: { color: colors.snow, fontSize: font.sm },
});
