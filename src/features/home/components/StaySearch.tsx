import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { PressScale } from "@/core/components/PressScale";
import { Text } from "@/core/components/Text";
import { colors, explore, fonts, groups } from "@/core/constants/theme";
import { switchTo } from "@/core/stores/switchStore";
import { fmtDay, guestsLabel, nightsBetween, plural } from "@/features/bookings/guest/lib/stay";
import { useBooking } from "@/features/bookings/guest/state/booking";

/** Dates and guests shared with Serene Bookings: change them here, then go straight to the apartments that fit. */
export function StaySearch() {
  const stay = useBooking((s) => s.stay);
  const setStay = useBooking((s) => s.setStay);
  // The picker opens over Explore; its Search button carries on to the apartments, its close button comes back here.
  const pick = (tab: "dates" | "guests") => router.push({ pathname: "/serene-bookings/stay", params: { tab, next: "apartments" } });
  const search = () => {
    setStay(stay);
    switchTo("Serene Bookings", () => router.push("/serene-bookings/apartments"));
  };
  const dates = `${fmtDay(stay.checkIn)} – ${fmtDay(stay.checkOut)}`;
  const guests = guestsLabel(stay.adults, stay.children);
  return (
    <View style={styles.bar}>
      <PressScale style={[styles.field, styles.dates]} onPress={() => pick("dates")} accessibilityLabel={`Dates: ${dates}. Change`}>
        <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.1}>
          {plural(nightsBetween(stay.checkIn, stay.checkOut), "night")}
        </Text>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
          {dates}
        </Text>
      </PressScale>
      <View style={styles.rule} />
      <PressScale style={styles.field} onPress={() => pick("guests")} accessibilityLabel={`Guests: ${guests}. Change`}>
        <Text style={styles.label} numberOfLines={1} maxFontSizeMultiplier={1.1}>
          Guests
        </Text>
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit maxFontSizeMultiplier={1.1}>
          {guests}
        </Text>
      </PressScale>
      <PressScale style={styles.go} onPress={search} accessibilityLabel="Search apartments in Serene Bookings">
        <Ionicons name="search" size={22} color={colors.white} />
      </PressScale>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { maxWidth: 560, height: 76, flexDirection: "row", alignItems: "center", borderRadius: 28, backgroundColor: explore.sheet, paddingLeft: 20, paddingRight: 9, boxShadow: explore.lift },
  field: { flex: 1, height: 76, justifyContent: "center", gap: 2 },
  dates: { flex: 1.45 },
  label: { color: explore.goldDeep, fontSize: 12, lineHeight: 16, fontFamily: fonts.uiMedium },
  value: { color: groups.pine, fontSize: 16, lineHeight: 22, fontFamily: fonts.uiBold },
  rule: { width: 1, height: 34, backgroundColor: explore.line, marginRight: 16 },
  go: { width: 58, height: 58, borderRadius: 21, backgroundColor: groups.pine, alignItems: "center", justifyContent: "center" },
});
