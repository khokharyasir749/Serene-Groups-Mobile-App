import { StyleSheet, View } from "react-native";
import { Text } from "@/core/components/Text";
import { AccountButton } from "@/core/components/AccountButton";
import { SereneLogoMark } from "@/core/components/SereneLogoMark";
import { SUPER_APP } from "@/core/constants/serene";
import { colors, fonts, spacing } from "@/core/constants/theme";

/** Alabaster top bar: a 46px crest and the SERENE GROUP wordmark on the left, the account / portal button on the right. */
export function ExploreTopBar() {
  return (
    <View style={styles.row}>
      <View style={styles.crest}>
        <SereneLogoMark width={26} fill={colors.snow} snow={colors.pineBrand} />
      </View>
      <Text style={styles.brand} numberOfLines={1}>
        {SUPER_APP.wordmark}
      </Text>
      <AccountButton compact />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  crest: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.pineBrand, borderWidth: 1.5, borderColor: colors.goldAccent, alignItems: "center", justifyContent: "center" },
  brand: { flex: 1, color: colors.ink, fontFamily: fonts.display, fontSize: 22, letterSpacing: 2.4 },
});
